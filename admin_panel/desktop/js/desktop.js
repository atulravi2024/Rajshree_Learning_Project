/* admin_panel/desktop/js/desktop.js */

const REPO_OWNER = 'atulravi2024'; 
const REPO_NAME = 'Rajshree_Learning_Project'; 

let state = {
    db: null, SQL: null, fileSha: '', currentTable: '', columns: [], isDemoMode: false, editRowId: null,
    currentPage: 1, rowsPerPage: 50, currentSearchTerm: '', filteredData: [],
    sortCol: null, sortAsc: true, selectedRows: new Set(),
    isDirty: false
};

window.addEventListener('beforeunload', function (e) {
    if (state.isDirty) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('rajshree_admin_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.getElementById('themeToggleBtn');
    btn.innerHTML = savedTheme === 'dark' ? '☀️ लाइट मोड' : '🌙 डार्क मोड';
    
    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('rajshree_admin_theme', next);
        btn.innerHTML = next === 'dark' ? '☀️ लाइट मोड' : '🌙 डार्क मोड';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAuth();
    
    document.getElementById('loadBtn').addEventListener('click', connectDatabase);
    document.getElementById('pushBtn').addEventListener('click', saveToGithub);
    document.getElementById('addNewBtn').addEventListener('click', () => openModal(null));
    document.getElementById('bulkDeleteBtn').addEventListener('click', bulkDelete);
    document.getElementById('exportCsvBtn').addEventListener('click', exportCSV);
    document.getElementById('backupBtn').addEventListener('click', localBackup);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('saveRecordBtn').addEventListener('click', saveRecord);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Pagination listeners
    document.getElementById('prevPageBtn').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPageBtn').addEventListener('click', () => changePage(1));
    document.getElementById('rowsPerPage').addEventListener('change', (e) => {
        state.rowsPerPage = parseInt(e.target.value);
        state.currentPage = 1;
        renderDataRows(state.currentSearchTerm);
    });
});

function initAuth() {
    const tokenInput = document.getElementById('githubToken');
    const clearBtn = document.getElementById('clearTokenBtn');
    const savedToken = localStorage.getItem('rajshree_github_token');
    
    if (savedToken) {
        tokenInput.value = savedToken;
        clearBtn.classList.remove('hidden');
    }

    tokenInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
            localStorage.setItem('rajshree_github_token', val);
            clearBtn.classList.remove('hidden');
        } else {
            localStorage.removeItem('rajshree_github_token');
            clearBtn.classList.add('hidden');
        }
    });

    clearBtn.addEventListener('click', () => {
        tokenInput.value = '';
        localStorage.removeItem('rajshree_github_token');
        clearBtn.classList.add('hidden');
    });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function base64ToUint8Array(base64) {
    const raw = atob(base64); const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) { uint8Array[i] = raw.charCodeAt(i); }
    return uint8Array;
}
function uint8ArrayToBase64(buffer) {
    let binary = ''; const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) { binary += String.fromCharCode(bytes[i]); }
    return btoa(binary);
}

async function initSql() {
    if (!state.SQL) {
        state.SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
    }
}

async function connectDatabase() {
    const token = document.getElementById('githubToken').value;
    const dbPath = document.getElementById('dbSelector').value;
    const btn = document.getElementById('loadBtn');
    
    showToast('फाइल डाउनलोड हो रही है... ⏳');
    btn.disabled = true;

    try {
        await initSql();
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${dbPath}`;
        const headers = { 'Accept': 'application/vnd.github.v3+json' };
        if (token) headers['Authorization'] = `token ${token}`;

        const response = await fetch(url, { headers });

        if (!response.ok) {
            if (response.status === 404 || response.status === 401 || response.status === 403) {
                 showToast('डेमो मोड एक्टिवेट किया गया', 'info');
                 state.isDemoMode = true; createDemoDatabase(); hideUI(false); return;
            }
            throw new Error(`GitHub Error: ${response.status}`);
        }

        const data = await response.json();
        state.fileSha = data.sha; state.isDemoMode = false;
        
        const cleanBase64 = data.content.replace(/\n/g, ''); 
        state.db = new state.SQL.Database(base64ToUint8Array(cleanBase64));
        showToast('सफलतापूर्वक कनेक्टेड! ✅', 'success');
        
        hideUI(false);
    } catch (err) {
        showToast(`त्रुटि: ${err.message}`, 'error');
    } finally { btn.disabled = false; }
}

function hideUI(isHidden) {
    if(isHidden) {
        document.getElementById('tablesSection').classList.add('hidden');
        document.getElementById('saveSection').classList.add('hidden');
    } else {
        document.getElementById('tablesSection').classList.remove('hidden');
        document.getElementById('saveSection').classList.remove('hidden');
        loadTableList();
    }
}

function loadTableList() {
    buildDashboard();
    
    const list = document.getElementById('tableList'); list.innerHTML = '';
    const res = state.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    if (res.length === 0) return;
    res[0].values.map(r => r[0]).forEach(table => {
        const li = document.createElement('li');
        try {
            const countRow = state.db.exec(`SELECT count(*) FROM ${table}`)[0];
            li.innerHTML = `${table.toUpperCase()} <span style="font-size:0.8rem; background:var(--sidebar-hover); padding:2px 8px; border-radius:12px;">${countRow.values[0][0]}</span>`;
        } catch(e) {}
        li.onclick = () => {
            document.querySelectorAll('#tableList li').forEach(el => el.classList.remove('active'));
            li.classList.add('active'); switchToTable(table);
        };
        list.appendChild(li);
    });
}

function buildDashboard() {
    const dash = document.getElementById('dashboardMetrics');
    dash.innerHTML = '';
    let totalRecords = 0;
    
    const res = state.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    if (res.length > 0) {
        res[0].values.forEach(r => {
             const tb = r[0];
             try {
                const count = state.db.exec(`SELECT count(*) FROM ${tb}`)[0].values[0][0];
                totalRecords += count;
                 dash.innerHTML += `<div style="background:var(--glass-bg); box-shadow:var(--shadow-soft); padding:20px; border-radius:15px; text-align:center; min-width:140px; border:1px solid var(--border-color);">
                    <div style="font-size:2.5rem; font-weight:700; color:var(--primary-color);">${count}</div>
                    <div style="color:var(--text-muted); text-transform:uppercase; font-size:0.85rem; font-weight:600; margin-top:5px;">${tb}</div>
                 </div>`;
             } catch(e) {}
        });
    }
    const welcome = document.getElementById('welcomeMessage');
    if (welcome) welcome.classList.add('hidden');
    dash.classList.remove('hidden');
}

function switchToTable(tableName) {
    state.currentTable = tableName;
    document.getElementById('currentTableName').textContent = `टेबल: ${tableName.toUpperCase()}`;
    document.getElementById('emptyState').classList.add('hidden'); document.getElementById('dataTable').classList.remove('hidden'); document.getElementById('tableActions').classList.remove('hidden'); document.getElementById('recordCount').classList.remove('hidden');

    const schemaRes = state.db.exec(`PRAGMA table_info('${tableName}')`);
    state.columns = schemaRes[0].values.map(row => ({ name: row[1], type: row[2].toUpperCase(), isPk: row[5] === 1, notNull: row[3] === 1 }));

    const thead = document.getElementById('tableHead');
    thead.innerHTML = `<tr>
        <th style="width:50px;"><input type="checkbox" id="selectAllBtn" onclick="toggleSelectAll(this)"></th>
        ${state.columns.map(c => `<th style="cursor:pointer;" onclick="sortTable('${c.name}')">${c.name} <span id="sortIcon_${c.name}" style="font-size:0.8rem; margin-left:5px; color:var(--primary-color);"></span></th>`).join('')}
        <th style="width:140px;">एक्शन</td>
    </tr>`;
    
    state.currentPage = 1;
    state.currentSearchTerm = '';
    state.sortCol = null;
    state.selectedRows.clear();
    updateBulkDeleteBtn();
    document.getElementById('searchInput').value = '';
    document.getElementById('paginationControls').classList.remove('hidden');
    
    fetchTableData();
}

function fetchTableData() {
    state.filteredData = [];
    try {
        const stmt = state.db.prepare(`SELECT * FROM ${state.currentTable}`);
        while (stmt.step()) {
            state.filteredData.push(stmt.getAsObject());
        }
        stmt.free();
    } catch(e) {
        console.error(e);
    }
    renderDataRows(state.currentSearchTerm);
}

function renderDataRows(searchTerm = '') {
    state.currentSearchTerm = searchTerm;
    const tbody = document.getElementById('tableBody'); 
    tbody.innerHTML = '';
    
    let displayData = state.filteredData;
    if (searchTerm) {
        displayData = displayData.filter(rowObj => 
            Object.values(rowObj).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (state.sortCol) {
        displayData.sort((a, b) => {
            let valA = a[state.sortCol]; let valB = b[state.sortCol];
            if (valA === null) valA = ''; if (valB === null) valB = '';
            if (!isNaN(valA) && !isNaN(valB) && valA !== '' && valB !== '') {
                return state.sortAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
            }
            return state.sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
        });
        
        // update sort icons
        state.columns.forEach(col => {
            const iconEl = document.getElementById(`sortIcon_${col.name}`);
            if(iconEl) iconEl.innerHTML = '';
        });
        const activeIconEl = document.getElementById(`sortIcon_${state.sortCol}`);
        if(activeIconEl) activeIconEl.innerHTML = state.sortAsc ? '▲' : '▼';
    }

    document.getElementById('recordCount').textContent = `${displayData.length} रिकॉर्ड्स`;
    
    const totalPages = Math.ceil(displayData.length / state.rowsPerPage) || 1;
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    
    // Update Pagination UI
    document.getElementById('pageInfo').textContent = `पेज ${state.currentPage} / ${totalPages}`;
    document.getElementById('prevPageBtn').disabled = state.currentPage === 1;
    document.getElementById('nextPageBtn').disabled = state.currentPage >= totalPages;

    const startIdx = (state.currentPage - 1) * state.rowsPerPage;
    const endIdx = startIdx + state.rowsPerPage;
    const pageData = displayData.slice(startIdx, endIdx);

    pageData.forEach(rowObj => {
        const tr = document.createElement('tr');
        let pkValue = null;
        state.columns.forEach(col => { if(col.isPk) pkValue = rowObj[col.name]; });
        
        const isChecked = state.selectedRows.has(String(pkValue)) ? 'checked' : '';
        let rowHtml = `<td><input type="checkbox" class="rowCheckbox" value="${pkValue}" onchange="toggleRowSelection(this, '${pkValue}')" ${isChecked}></td>`;
        
        state.columns.forEach(col => {
            let cellVal = rowObj[col.name] !== null ? rowObj[col.name] : '-';
            if (typeof cellVal === 'string' && (cellVal.endsWith('.mp3') || cellVal.endsWith('.png') || cellVal.endsWith('.jpg'))) {
                 let iconClass = cellVal.endsWith('.mp3') ? 'ph-file-audio' : 'ph-image';
                 cellVal = `<span style="background:var(--sidebar-hover); color:var(--primary-color); padding: 4px 8px; border-radius: 12px; font-size: 0.85rem; font-weight:600;"><i class="ph ${iconClass}"></i> ${cellVal}</span>`;
            }
            rowHtml += `<td>${cellVal}</td>`;
        });
        rowHtml += `<td><button class="btn-edit" onclick="openModal('${pkValue}')"><i class="ph ph-pencil-simple"></i></button> <button class="btn-danger" onclick="deleteRow('${pkValue}')"><i class="ph ph-trash"></i></button></td>`;
        tr.innerHTML = rowHtml;
        tbody.appendChild(tr);
    });
    
    const selectAllBtn = document.getElementById('selectAllBtn');
    if(selectAllBtn) selectAllBtn.checked = pageData.length > 0 && Array.from(document.querySelectorAll('.rowCheckbox')).every(box => box.checked);
}

window.sortTable = function(colName) {
    if (state.sortCol === colName) {
        state.sortAsc = !state.sortAsc;
    } else {
        state.sortCol = colName;
        state.sortAsc = true;
    }
    renderDataRows(state.currentSearchTerm);
}

window.toggleRowSelection = function(checkbox, id) {
    if (checkbox.checked) state.selectedRows.add(String(id));
    else state.selectedRows.delete(String(id));
    updateBulkDeleteBtn();
    
    const selectAllBtn = document.getElementById('selectAllBtn');
    if(selectAllBtn) selectAllBtn.checked = Array.from(document.querySelectorAll('.rowCheckbox')).every(box => box.checked);
}

window.toggleSelectAll = function(checkbox) {
    const boxes = document.querySelectorAll('.rowCheckbox');
    boxes.forEach(box => {
        box.checked = checkbox.checked;
        if (checkbox.checked) state.selectedRows.add(box.value);
        else state.selectedRows.delete(box.value);
    });
    updateBulkDeleteBtn();
}

function updateBulkDeleteBtn() {
    const btn = document.getElementById('bulkDeleteBtn');
    if (state.selectedRows.size > 0) {
        btn.classList.remove('hidden');
        btn.innerHTML = `<i class="ph ph-trash"></i> चुनी हुई (${state.selectedRows.size}) डिलीट करें`;
    } else {
        btn.classList.add('hidden');
    }
}

window.bulkDelete = function() {
    if(state.selectedRows.size === 0) return;
    if(!confirm(`क्‍या आप सच में ${state.selectedRows.size} रिकॉर्ड्स डिलीट करना चाहते हैं?`)) return;
    
    const pkColName = state.columns.find(c => c.isPk).name;
    const idsToDelete = Array.from(state.selectedRows);
    
    try {
        const placeholders = idsToDelete.map(() => '?').join(',');
        state.db.run(`DELETE FROM ${state.currentTable} WHERE ${pkColName} IN (${placeholders})`, idsToDelete);
        state.selectedRows.clear();
        state.isDirty = true;
        updateBulkDeleteBtn();
        fetchTableData(); loadTableList(); 
        showToast('सफलतापूर्वक डिलीट किये गये!', 'success');
    } catch(err) {
        showToast(`डिलीट विफल: ${err.message}`, 'error');
    }
}

function changePage(delta) {
    state.currentPage += delta;
    renderDataRows(state.currentSearchTerm);
}

function handleSearch(e) { 
    state.currentPage = 1;
    renderDataRows(e.target.value); 
}

function openModal(id = null) {
    if (!state.currentTable) return;
    state.editRowId = id; document.getElementById('modalTitle').innerHTML = id ? '<i class="ph ph-pencil-simple"></i> अपडेट करें' : '<i class="ph ph-plus-circle"></i> नया जोड़ें';
    const form = document.getElementById('dynamicForm'); form.innerHTML = '';
    let exData = {};
    if (id) {
        const pkCol = state.columns.find(c => c.isPk).name;
        exData = state.db.exec(`SELECT * FROM ${state.currentTable} WHERE ${pkCol} = '${id}'`)[0].values[0];
    }
    state.columns.forEach((col, idx) => {
        const val = id && exData[idx] !== null ? exData[idx] : '';
        const readonly = (col.isPk && id) ? 'readonly' : '';
        
        let minMaxStep = '';
        let inputType = 'text';
        if (col.type.includes('INT') || col.type.includes('REAL') || col.type.includes('NUM')) {
            inputType = 'number';
            if (col.type.includes('REAL')) minMaxStep = 'step="any"';
        }
        
        const requiredAttr = (col.notNull && !col.isPk) ? 'required' : '';
        const requiredLabel = (col.notNull && !col.isPk) ? '<span style="color:var(--danger-color);">*</span>' : '';
        
        form.innerHTML += `<div class="input-group"><label>${col.name} ${requiredLabel}</label><input type="${inputType}" class="custom-input" name="${col.name}" value="${val}" ${readonly} ${requiredAttr} ${minMaxStep}></div>`;
    });
    document.getElementById('formModal').classList.remove('hidden');
}

function closeModal() { document.getElementById('formModal').classList.add('hidden'); }

function saveRecord() {
    const formEl = document.getElementById('dynamicForm');
    if (!formEl.reportValidity()) return;
    
    const formData = new FormData(formEl);
    const cols = [], vals = [], holes = []; let pkCol;
    state.columns.forEach(col => {
        if(col.isPk) pkCol = col.name;
        const val = formData.get(col.name);
        cols.push(col.name); vals.push(val); holes.push('?');
    });
    try {
        if (state.editRowId) {
            vals.push(state.editRowId);
            state.db.run(`UPDATE ${state.currentTable} SET ${cols.map(c=>`${c}=?`).join(', ')} WHERE ${pkCol}=?`, vals);
        } else {
            state.db.run(`INSERT INTO ${state.currentTable} (${cols.join(',')}) VALUES (${holes.join(',')})`, vals);
        }
        closeModal(); 
        fetchTableData(); // re-fetch data into filteredData
        loadTableList(); // refresh counts
        state.isDirty = true;

        showToast('सफलतापूर्वक सेव हुआ!', 'success');
    } catch(e) { showToast(`एरर: ${e.message}`, 'error'); }
}

window.deleteRow = function(id) {
    if(!confirm('क्‍या आप सच में डिलीट करना चाहते हैं?')) return;
    const pkColName = state.columns.find(c => c.isPk).name;
    state.db.run(`DELETE FROM ${state.currentTable} WHERE ${pkColName} = ?`, [id]);
    state.isDirty = true;
    fetchTableData(); loadTableList(); showToast('डिलीट हुआ!', 'success');
}

async function saveToGithub() {
    const token = document.getElementById('githubToken').value;
    if (state.isDemoMode) return showToast('डेमो मोड: बदलाव सेव नहीं होंगे।', 'success');
    if (!token) return showToast('GitHub Token आवश्यक है!', 'error');
    const dbPath = document.getElementById('dbSelector').value;
    document.getElementById('pushBtn').disabled = true;
    try {
        const base64Content = uint8ArrayToBase64(state.db.export());
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${dbPath}`, {
            method: 'PUT', headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `admin: updated via desktop panel`, content: base64Content, sha: state.fileSha })
        });
        if (!response.ok) throw new Error('API Failed');
        state.fileSha = (await response.json()).content.sha; 
        state.isDirty = false;
        showToast('डेटाबेस GitHub पर सेव हो गया!', 'success');
    } catch (err) { showToast(`पुश विफल: ${err.message}`, 'error'); } finally { document.getElementById('pushBtn').disabled = false; }
}

window.exportCSV = function() {
    if(!state.currentTable || state.filteredData.length === 0) return;
    const headers = state.columns.map(c => `"${c.name}"`).join(',');
    const rows = state.filteredData.map(row => {
        return state.columns.map(c => {
             let val = row[c.name] !== null ? row[c.name] : '';
             val = String(val).replace(/"/g, '""');
             return `"${val}"`;
        }).join(',');
    });
    const csvContent = headers + '\\n' + rows.join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${state.currentTable}_export.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.localBackup = function() {
    if(!state.db) return;
    const data = state.db.export();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `backup_${Date.now()}.sqlite3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('बैकअप डाउनलोड हो गया!', 'success');
}

function createDemoDatabase() {
    state.fileSha = 'demo'; state.db = new state.SQL.Database();
    state.db.run("CREATE TABLE swar (id INTEGER PRIMARY KEY, letter TEXT, word TEXT);");
    state.db.run("INSERT INTO swar (letter, word) VALUES ('अ', 'अनार'), ('आ', 'आम');");
}
