/* admin_panel/desktop/js/desktop.js */

const REPO_OWNER = 'atulravi2024'; 
const REPO_NAME = 'Rajshree_Learning_Project'; 

let state = {
    db: null, SQL: null, fileSha: '', currentTable: '', columns: [], isDemoMode: false, editRowId: null
};

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
    document.getElementById('loadBtn').addEventListener('click', connectDatabase);
    document.getElementById('pushBtn').addEventListener('click', saveToGithub);
    document.getElementById('addNewBtn').addEventListener('click', () => openModal(null));
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('saveRecordBtn').addEventListener('click', saveRecord);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
});

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

function switchToTable(tableName) {
    state.currentTable = tableName;
    document.getElementById('currentTableName').textContent = `टेबल: ${tableName.toUpperCase()}`;
    document.getElementById('emptyState').classList.add('hidden'); document.getElementById('dataTable').classList.remove('hidden'); document.getElementById('tableActions').classList.remove('hidden'); document.getElementById('recordCount').classList.remove('hidden');

    const schemaRes = state.db.exec(`PRAGMA table_info('${tableName}')`);
    state.columns = schemaRes[0].values.map(row => ({ name: row[1], type: row[2], isPk: row[5] === 1 }));

    const thead = document.getElementById('tableHead');
    thead.innerHTML = `<tr>${state.columns.map(c => `<th>${c.name}</th>`).join('')}<th style="width:140px;">एक्शन</td></tr>`;
    renderDataRows();
}

function renderDataRows(searchTerm = '') {
    const tbody = document.getElementById('tableBody'); tbody.innerHTML = '';
    let count = 0;
    try {
        const stmt = state.db.prepare(`SELECT * FROM ${state.currentTable}`);
        while (stmt.step()) {
            const rowObj = stmt.getAsObject();
            if (searchTerm && !Object.values(rowObj).join(' ').toLowerCase().includes(searchTerm.toLowerCase())) continue;
            count++;
            const tr = document.createElement('tr');
            let pkValue = null;
            state.columns.forEach(col => {
                if(col.isPk) pkValue = rowObj[col.name];
                tr.innerHTML += `<td>${rowObj[col.name] !== null ? rowObj[col.name] : '-'}</td>`;
            });
            tr.innerHTML += `<td><button class="btn-edit" onclick="openModal('${pkValue}')">✏</button> <button class="btn-danger" onclick="deleteRow('${pkValue}')">🗑</button></td>`;
            tbody.appendChild(tr);
        }
        stmt.free();
        document.getElementById('recordCount').textContent = `${count} रिकॉर्ड्स`;
    } catch(e) {}
}

function handleSearch(e) { renderDataRows(e.target.value); }

function openModal(id = null) {
    if (!state.currentTable) return;
    state.editRowId = id; document.getElementById('modalTitle').textContent = id ? '✏️ अपडेट करें' : '➕ नया जोड़ें';
    const form = document.getElementById('dynamicForm'); form.innerHTML = '';
    let exData = {};
    if (id) {
        const pkCol = state.columns.find(c => c.isPk).name;
        exData = state.db.exec(`SELECT * FROM ${state.currentTable} WHERE ${pkCol} = '${id}'`)[0].values[0];
    }
    state.columns.forEach((col, idx) => {
        const val = id && exData[idx] !== null ? exData[idx] : '';
        const readonly = (col.isPk && id) ? 'readonly' : '';
        form.innerHTML += `<div class="input-group" style="margin-bottom:15px;"><label>${col.name}</label><input type="text" class="custom-input" name="${col.name}" value="${val}" ${readonly}></div>`;
    });
    document.getElementById('formModal').classList.remove('hidden');
}

function closeModal() { document.getElementById('formModal').classList.add('hidden'); }

function saveRecord() {
    const formData = new FormData(document.getElementById('dynamicForm'));
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
        closeModal(); renderDataRows(document.getElementById('searchInput').value); loadTableList();
        showToast('सफलतापूर्वक सेव हुआ!', 'success');
    } catch(e) { showToast(`एरर: ${e.message}`, 'error'); }
}

window.deleteRow = function(id) {
    if(!confirm('क्‍या आप सच में डिलीट करना चाहते हैं?')) return;
    const pkColName = state.columns.find(c => c.isPk).name;
    state.db.run(`DELETE FROM ${state.currentTable} WHERE ${pkColName} = ?`, [id]);
    renderDataRows(); loadTableList(); showToast('डिलीट हुआ!', 'success');
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
        showToast('डेटाबेस GitHub पर सेव हो गया!', 'success');
    } catch (err) { showToast(`पुश विफल: ${err.message}`, 'error'); } finally { document.getElementById('pushBtn').disabled = false; }
}

function createDemoDatabase() {
    state.fileSha = 'demo'; state.db = new state.SQL.Database();
    state.db.run("CREATE TABLE swar (id INTEGER PRIMARY KEY, letter TEXT, word TEXT);");
    state.db.run("INSERT INTO swar (letter, word) VALUES ('अ', 'अनार'), ('आ', 'आम');");
}
