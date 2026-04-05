// Initialize Lucide Icons
lucide.createIcons();

// State Management
let currentSearchTerm = '';
let currentSortCriteria = 'alpha_az';
let currentCategory = 'all';

// Sorting & Gallery Update Engine
function updateGallery() {
    const grid = document.querySelector('.assets-grid');
    let cards = Array.from(document.querySelectorAll('.asset-card'));
    
    // If no cards exist yet, render them from PROJECT_ASSETS
    if (cards.length === 0 && window.PROJECT_ASSETS) {
        renderAssets(window.PROJECT_ASSETS);
        cards = Array.from(document.querySelectorAll('.asset-card'));
    }

    if (!grid) return;
    
    // 1. Filter Logic (Search & Category)
    cards.forEach(card => {
        const cardName = card.querySelector('h3').textContent.toLowerCase();
        const cardType = card.getAttribute('data-type');
        
        const matchesSearch = cardName.includes(currentSearchTerm.toLowerCase());
        const matchesCategory = (currentCategory === 'all' || cardType === currentCategory);
        
        card.style.display = (matchesSearch && matchesCategory) ? 'flex' : 'none';
    });

    // 2. Sort Logic (Real-time)
    const visibleCards = cards.filter(c => c.style.display !== 'none');
    
    visibleCards.sort((a, b) => {
        const valA = getSortValue(a, currentSortCriteria);
        const valB = getSortValue(b, currentSortCriteria);

        // Numeric or String Comparison
        if (typeof valA === 'number' && typeof valB === 'number') {
            return isDescending(currentSortCriteria) ? valB - valA : valA - valB;
        }
        
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return isDescending(currentSortCriteria) ? strB.localeCompare(strA) : strA.localeCompare(strB);
    });

    // 3. DOM Re-insertion
    visibleCards.forEach(card => grid.appendChild(card));
}

function getSortValue(card, criteria) {
    if (criteria.includes('alpha') || criteria === 'contributor') {
        return card.querySelector('h3').textContent;
    }
    if (criteria.includes('risk') || criteria === 'criticality' || criteria === 'maintenance') {
        return parseInt(card.getAttribute('data-risk') || 0);
    }
    if (criteria.includes('size')) {
        return parseInt(card.getAttribute('data-size-bytes') || 0);
    }
    if (criteria.includes('commit') || criteria.includes('modified') || criteria.includes('audited') || criteria.includes('access') || criteria === 'version') {
        return card.getAttribute('data-commit-date') || '';
    }
    if (criteria.includes('compliance') || criteria.includes('status') || criteria.includes('build') || criteria.includes('pending')) {
        return parseInt(card.getAttribute('data-compliance') || 0);
    }
    if (criteria === 'vulnerability' || criteria === 'dependency') {
        return parseInt(card.getAttribute('data-vulnerability') || 0);
    }
    if (criteria.includes('perf') || criteria === 'exec_fast' || criteria.includes('usage') || criteria === 'coverage' || criteria === 'score_low') {
        return parseInt(card.getAttribute('data-perf-score') || 0);
    }
    return 0;
}

function isDescending(criteria) {
    const descKeywords = ['high', 'recent', 'large', 'most', 'fail', 'za', 'score_low', 'pending', 'vulnerability', 'dependency', 'status_active', 'modified_recent'];
    return descKeywords.some(key => criteria.includes(key));
}

// Mock Interaction Logic
let currentAssetFileName = '';

function showDetails(name, type, category, size, realPath) {
    // Keep the real path for downloading/copying
    currentAssetFileName = realPath || name;
    
    const panel = document.getElementById('details-panel');
    const nameEl = document.getElementById('detail-name');
    const typeEl = document.getElementById('detail-type');
    const categoryEl = document.getElementById('detail-category');
    const sizeEl = document.getElementById('detail-size');
    const iconEl = document.getElementById('detail-icon');

    nameEl.textContent = name;
    typeEl.textContent = type;
    categoryEl.textContent = category;
    sizeEl.textContent = size;

    panel.style.display = 'block';
    updateHeaderMode(true);

    let iconName = 'image';
    if (type === 'Voice') iconName = 'mic';
    if (type === 'Audio') iconName = 'volume-2';
    if (type === 'Visual') iconName = 'image';
    if (type === 'Icon') iconName = 'box';
    if (type === 'Document') iconName = 'file-text';
    if (type === 'Data') iconName = 'code';
    if (type === 'Log') iconName = 'shield-alert';

    iconEl.setAttribute('data-lucide', iconName);
    lucide.createIcons();

    document.querySelectorAll('.asset-card').forEach(card => card.classList.remove('active-pulse'));
    const cards = document.querySelectorAll('.asset-card');
    cards.forEach(card => {
        if (card.querySelector('h3').textContent === name) {
            card.classList.add('active-pulse');
        }
    });
}

function hideDetails(shouldResetUI = true) {
    const panel = document.getElementById('details-panel');
    if (panel) panel.style.display = 'none';
    
    if (shouldResetUI) {
        updateHeaderMode(false);
    }
    
    document.querySelectorAll('.asset-card').forEach(card => card.classList.remove('active-pulse'));
}

function updateHeaderMode(isCompact) {
    const header = document.querySelector('.repo-header');
    const sidebar = document.getElementById('sidebar');
    
    if (header) {
        if (isCompact) {
            header.classList.add('compact-mode');
        } else {
            header.classList.remove('compact-mode');
        }
    }

    if (sidebar) {
        if (isCompact) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    }
}

// Sidebar Category Switching
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Update State & Gallery
        currentCategory = item.getAttribute('data-filter');
        updateGallery();

        // Filter change should NOT force expansion (Persistent Icon View)
        hideDetails(false);
    });
});

// Search Logic
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        updateGallery();
    });
}

// --- MULTI-DROPDOWN LOGIC ---

// Toggle specific menu and close others
function toggleMenu(menuId) {
    const menus = ['audit-menu', 'dev-menu', 'life-menu'];
    menus.forEach(id => {
        const menu = document.getElementById(id);
        if (id === menuId) {
            const isVisible = menu.style.display === 'block';
            menu.style.display = isVisible ? 'none' : 'block';
        } else {
            menu.style.display = 'none';
        }
    });
}

// Handle Sort Option Selection
document.querySelectorAll('.sort-option').forEach(option => {
    option.addEventListener('click', (e) => {
        const menu = option.closest('.sort-menu');
        const dropdownWrap = option.closest('.sort-dropdown-wrap');
        const btnText = dropdownWrap.querySelector('.btn-text');
        
        // Update Active State in this menu
        menu.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        // Update State
        currentSortCriteria = option.getAttribute('data-sort');
        
        // Update Button Label
        btnText.textContent = option.textContent;
        
        // Close Menu
        menu.style.display = 'none';
        
        // Professional "Processing" Feedback
        const grid = document.querySelector('.assets-grid');
        grid.style.opacity = '0.3';
        grid.style.filter = 'blur(4px)';
        
        setTimeout(() => {
            grid.style.opacity = '1';
            grid.style.filter = 'none';
            updateGallery();
        }, 300);
    });
});

// Global click to close menus
window.addEventListener('click', (e) => {
    if (!e.target.closest('.sort-dropdown-wrap')) {
        document.querySelectorAll('.sort-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// Sidebar Toggle Logic
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        
        // Professional feedback: briefly hide and show icons if needed, 
        // or just let CSS handles the smooth transition.
    }
}

// Asset Actions Logic
function downloadAsset() {
    if (!currentAssetFileName) return;
    
    // UI Feedback
    const btn = document.querySelector('.btn-mockup.primary');
    const originalText = btn.textContent;
    btn.textContent = 'DOWNLOADING...';
    btn.disabled = true;

    const fileName = currentAssetFileName.split('/').pop();

    // Priority: Server Fetch (Works on GitHub / Local Server)
    if (window.location.protocol !== 'file:') {
        fetch(currentAssetFileName)
            .then(res => {
                if (!res.ok) throw new Error('Fetch failed');
                return res.blob();
            })
            .then(blob => {
                const downloadUrl = URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(downloadUrl);
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 250);
            })
            .catch(err => {
                console.error('Server download failed:', err);
                fallback();
            });
    } else {
        fallback();
    }

    // Fallback: Direct Link (Works locally for viewing in new tab)
    function fallback() {
        const a = document.createElement('a');
        a.href = currentAssetFileName;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            btn.textContent = originalText;
            btn.disabled = false;
        }, 300);
    }
}

function copyAssetPath() {
    if (!currentAssetFileName) return;
    
    // Resolve the full absolute location of the actual file
    // Since currentAssetFileName might now be a relative path like ../../../../../AGENTS.md
    // We can just append it to this directory string, but for UI precision let's just make it clearly point to the root.
    const cleanRelativePath = currentAssetFileName.replace(/(\.\.\/)+/g, ''); 
    const mockPath = `C:\\Users\\Atul Verma\\.openclaw\\workspace\\RajShree_Project\\Rajshree Learning Project\\${cleanRelativePath}`;
    
    navigator.clipboard.writeText(mockPath).then(() => {
        const btn = document.querySelector('.details-footer-actions .btn-mockup.secondary');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'PATH COPIED!';
            // Use the correct CSS variable for the theme accent so it doesn't blank out
            btn.style.backgroundColor = 'var(--theme-accent)';
            btn.style.color = '#000';
            btn.style.transition = 'all 0.2s ease';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1000);
        }
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function renderAssets(assets) {
    const grid = document.querySelector('.assets-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear existing

    assets.forEach(asset => {
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.setAttribute('data-type', asset.type);
        card.setAttribute('data-risk', asset.risk);
        card.setAttribute('data-size-bytes', asset.sizeBytes);
        card.setAttribute('data-commit-date', asset.date);
        card.setAttribute('data-compliance', asset.compliance);
        card.setAttribute('data-perf-score', asset.perf);
        
        const extension = asset.name.split('.').pop().toUpperCase();
        let lucideIcon = 'file-text';
        if (asset.type === 'audio') lucideIcon = 'volume-2';
        if (asset.type === 'data') lucideIcon = 'database';
        if (asset.type === 'doc') lucideIcon = 'file-text';
        if (asset.type === 'visual') lucideIcon = 'image';

        card.onclick = () => showDetails(asset.name, asset.type, asset.category, asset.size, asset.path);

        card.innerHTML = `
            <div class="asset-preview">
                <i data-lucide="${lucideIcon}"></i>
                <span class="asset-type-badge">${extension}</span>
            </div>
            <div class="asset-info">
                <h3>${asset.name}</h3>
                <p>${asset.category}</p>
            </div>
        `;
        grid.appendChild(card);
    });

    lucide.createIcons();
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (window.PROJECT_ASSETS) {
        renderAssets(window.PROJECT_ASSETS);
    }
    updateGallery();
});
