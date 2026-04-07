/* admin_panel/mobile/js/mobile.js */

const REPO_OWNER = 'atulravi2024'; 
const REPO_NAME = 'Rajshree_Learning_Project'; 

let state = {
    db: null, SQL: null, fileSha: '', currentTable: '', columns: [], isDemoMode: false, editRowId: null
};

function initTheme() {
    const savedTheme = localStorage.getItem('rajshree_mobile_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.getElementById('themeToggleBtn');
    btn.innerHTML = savedTheme === 'dark' ? '☀️ लाइट' : '🌙 डार्क';
    
    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('rajshree_mobile_theme', next);
        btn.innerHTML = next === 'dark' ? '☀️ लाइट' : '🌙 डार्क';
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
    document.getElementById('mobileTableSelector').addEventListener('change', (e) => {
        if(e.target.value) switchToTable(e.target.value);
    });
    document.getElementById('showConfigBtn').addEventListener('click', () => {
        document.getElementById('configPanel').classList.remove('hidden');
        document.getElementById('showConfigBtn').classList.add('hidden');
    });
});

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
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
                 state.isDemoMode = true; createDemoDatabase(); hideConfig(); loadTableList(); return;
            }
            throw new Error(`GitHub Error: ${response.status}`);
        }

        const data = await response.json();
        state.fileSha = data.sha; state.isDemoMode = false;
        
        const cleanBase64 = data.content.replace(/\n/g, ''); 
        state.db = new state.SQL.Database(base64ToUint8Array(cleanBase64));
        showToast('सफलतापूर्वक कनेक्टेड! ✅', 'success');
        
        hideConfig(); loadTableList();
    } catch (err) {
        showToast(`त्रुटि: ${err.message}`, 'error');
    } finally { btn.disabled = false; }
}

function hideConfig() {
    document.getElementById('configPanel').classList.add('hidden');
    document.getElementById('showConfigBtn').classList.remove('hidden');
    document.getElementById('dashboardArea').classList.remove('hidden');
}

function loadTableList() {
    const select = document.getElementById('mobileTableSelector'); 
    select.innerHTML = '<option value="" disabled selected>टेबल चुनें...</option>';

    const res = state.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    if (res.length === 0) return;
    
    res[0].values.map(r => r[0]).forEach(table => {
        let count = 0;
        try { count = state.db.exec(`SELECT count(*) FROM ${table}`)[0].values[0][0]; } catch(e){}
        const opt = document.createElement('option');
        opt.value = table;
        opt.textContent = `${table.toUpperCase()} (${count})`;
        select.appendChild(opt);
    });
}

function switchToTable(tableName) {
    state.currentTable = tableName;
    document.getElementById('emptyState').classList.add('hidden'); 
    document.getElementById('searchInput').classList.remove('hidden');
    document.getElementById('bottomActions').classList.remove('hidden');
    document.getElementById('addNewBtn').classList.remove('hidden');

    const schemaRes = state.db.exec(`PRAGMA table_info('${tableName}')`);
    state.columns = schemaRes[0].values.map(row => ({ name: row[1], type: row[2], isPk: row[5] === 1 }));
    renderDataCards();
}

// Generate Cards instead of Rows
function renderDataCards(searchTerm = '') {
    const container = document.getElementById('cardContainer'); container.innerHTML = '';
    let count = 0;
    try {
        const stmt = state.db.prepare(`SELECT * FROM ${state.currentTable}`);
        while (stmt.step()) {
            const rowObj = stmt.getAsObject();
            if (searchTerm && !Object.values(rowObj).join(' ').toLowerCase().includes(searchTerm.toLowerCase())) continue;
            count++;
            
            let pkValue = null;
            let rowsHtml = '';
            
            state.columns.forEach(col => {
                if(col.isPk) pkValue = rowObj[col.name];
                rowsHtml += `<div class="card-row"><span class="card-label">${col.name}</span> <span class="card-value">${rowObj[col.name] !== null ? rowObj[col.name] : '-'}</span></div>`;
            });

            const card = document.createElement('div');
            card.className = 'data-card';
            card.innerHTML = `
                ${rowsHtml}
                <div class="card-actions">
                    <button class="card-btn c-edit" onclick="openModal('${pkValue}')">✏️ एडिट</button>
                    <button class="card-btn c-delete" onclick="deleteRow('${pkValue}')">🗑️ मिटाएं</button>
                </div>
            `;
            container.appendChild(card);
        }
        stmt.free();
        document.getElementById('recordCount').innerHTML = `${count} <br><small>रिकॉर्ड्स</small>`;
    } catch(e) {
        console.error("renderDataCards err:", e);
    }
}

function handleSearch(e) { renderDataCards(e.target.value); }

function openModal(id = null) {
    if (!state.currentTable) return;
    state.editRowId = id; document.getElementById('modalTitle').textContent = id ? '✏️ डोटा अपडेट करें' : '➕ नया रिकॉर्ड जोड़ें';
    const form = document.getElementById('dynamicForm'); form.innerHTML = '';
    let exData = {};
    if (id) {
        const pkCol = state.columns.find(c => c.isPk).name;
        exData = state.db.exec(`SELECT * FROM ${state.currentTable} WHERE ${pkCol} = '${id}'`)[0].values[0];
    }
    state.columns.forEach((col, idx) => {
        const val = id && exData[idx] !== null ? exData[idx] : '';
        const readonly = (col.isPk && id) ? 'readonly' : '';
        form.innerHTML += `<div class="input-group"><label>${col.name}</label><input type="text" class="custom-input" name="${col.name}" value="${val}" ${readonly}></div>`;
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
        closeModal(); renderDataCards(document.getElementById('searchInput').value); loadTableList();
        showToast('सफलतापूर्वक सेव हुआ!', 'success');
    } catch(e) { showToast(`एरर: ${e.message}`, 'error'); }
}

window.deleteRow = function(id) {
    if(!confirm('क्‍या आप सच में डिलीट करना चाहते हैं?')) return;
    const pkColName = state.columns.find(c => c.isPk).name;
    state.db.run(`DELETE FROM ${state.currentTable} WHERE ${pkColName} = ?`, [id]);
    renderDataCards(); loadTableList(); showToast('डिलीट हुआ!', 'success');
}

async function saveToGithub() {
    const token = document.getElementById('githubToken').value;
    if (state.isDemoMode) return showToast('डेमो मोड: बदलाव सेव नहीं होंगे।', 'success');
    if (!token) { document.getElementById('configPanel').classList.remove('hidden'); return showToast('GitHub Token आवश्यक है!', 'error'); }
    const dbPath = document.getElementById('dbSelector').value;
    document.getElementById('pushBtn').disabled = true;
    try {
        const base64Content = uint8ArrayToBase64(state.db.export());
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${dbPath}`, {
            method: 'PUT', headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `admin: updated via mobile panel`, content: base64Content, sha: state.fileSha })
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
