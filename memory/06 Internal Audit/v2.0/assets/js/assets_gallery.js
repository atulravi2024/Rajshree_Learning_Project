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
        if (asset.type === 'animation') lucideIcon = 'sparkles';
        if (asset.type === 'video') lucideIcon = 'play-circle';

        card.onclick = () => showDetails(asset.name, asset.type, asset.category, asset.size, asset.path, asset.sizeBytes);

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

function createAutomatedLoadingState(path, type, ext, name, sizeBytes) {
    const wrapper = document.createElement('div');
    wrapper.className = 'heavy-loading-state';
    
    const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);
    
    wrapper.innerHTML = `
        <div class="loading-metadata">
            <span class="meta-tag">HEAVY ASSET</span>
            <span class="meta-tag size">${sizeMB} MB</span>
        </div>
        <div class="progress-container">
            <div class="progress-label">INITIALIZING NEURAL DATA... <span class="percent">0%</span></div>
            <div class="progress-track">
                <div class="progress-bar-fill"></div>
            </div>
        </div>
        <div class="status-feed">AUTHENTICATING SYSTEM ACCESS...</div>
    `;

    // Start Simulation & Real Handoff
    let progress = 0;
    const bar = wrapper.querySelector('.progress-bar-fill');
    const percent = wrapper.querySelector('.percent');
    const status = wrapper.querySelector('.status-feed');

    const interval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress > 95) progress = 95; // Wait for real load
        
        bar.style.width = `${progress}%`;
        percent.textContent = `${Math.floor(progress)}%`;

        if (progress > 30) status.textContent = 'DECRYPTING BUFFER...';
        if (progress > 70) status.textContent = 'MAPPING GEOMETRY...';
    }, 150);

    // Trigger Real Load in Background
    setTimeout(() => {
        const previewEl = getPreviewElement(path, type, name, 0); // Bypass threshold
        
        let finalized = false;
        const finalize = () => {
            if (finalized) return;
            finalized = true;

            clearInterval(interval);
            bar.style.width = '100%';
            percent.textContent = '100%';
            status.textContent = 'INITIALIZATION COMPLETE';
            
            setTimeout(() => {
                if (wrapper.parentElement) {
                    const container = wrapper.parentElement;
                    container.innerHTML = '';
                    container.appendChild(previewEl);
                    lucide.createIcons();
                }
            }, 300);
        };

        // Listen for arrival
        if (previewEl.tagName === 'IFRAME') {
            previewEl.onload = finalize;
            // Safety timeout for local files (3.5s)
            setTimeout(finalize, 3500);
        } else {
            // It's the fetch container, it will update itself, but we should swap it
            finalize();
        }
    }, 500); // Slight delay for dramatic effect

    return wrapper;
}
