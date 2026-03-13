/**
 * UI Rendering & Component Logic
 * Handles card creation, grid updates, and display modes.
 */

function renderCards() {
    const master = document.getElementById('master-container');
    if (!master) return;
    master.innerHTML = '';
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    window.activeCardsData.forEach((data, index) => {
        const card = document.createElement('div');
        const isHundred = data.value === '100';
        card.className = `card ${window.selectedCategory}-card ${isHundred ? 'special-hundred' : ''} hidden`;
        card.onclick = () => flipCard(card, data.audio);
        
        let backContent = '';
        if (data.image) backContent = `<img class="flash-image" src="${data.image}" alt="${data.word}">`;
        else if (data.content) backContent = `<div style="font-size:6vh; padding:20px;">${data.content}</div>`;
        else if (data.value) backContent = `<div style="font-size:15vh; font-weight:700;">${data.value}</div>`;
        else if (data.color) backContent = `<div style="background:${data.color} !important; width:100%; height:100%;"></div>`;
        else if (data.type === 'circle') backContent = `<div style="width:250px; height:250px; background:${data.color}; border-radius:50%; border:10px solid white;"></div>`;
        else if (data.type === 'square') backContent = `<div style="width:250px; height:250px; background:${data.color}; border:10px solid white;"></div>`;
        else if (data.type === 'triangle') backContent = `<div style="width:0; height:0; border-left:125px solid transparent; border-right:125px solid transparent; border-bottom:216px solid ${data.color};"></div>`;
        else if (data.type === 'star') backContent = `<span style="font-size:15rem; color:${data.color};">⭐</span>`;
        else if (data.type === 'big-small') backContent = `<div style="display:flex; align-items:flex-end; gap:30px;"><div style="width:200px; height:200px; background:#9C27B0; border-radius:20px;"></div><div style="width:80px; height:80px; background:#E91E63; border-radius:10px;"></div></div>`;
        else if (data.type === 'tall-short') backContent = `<div style="display:flex; align-items:flex-end; gap:30px;"><div style="width:60px; height:300px; background:#795548; border-radius:10px;"></div><div style="width:60px; height:100px; background:#FFC107; border-radius:10px;"></div></div>`;
        else backContent = `<div style="display:flex; align-items:center; justify-content:center; height:100%; font-size:10vh; font-weight:700; color:#4B0082;">${data.letter}</div>`;

        let frontContent = '';
        const emojis = [...segmenter.segment(data.emoji || '')].map(s => s.segment);
        const emojiCount = emojis.length;
        const isImage = (data.emoji || '').toLowerCase().endsWith('.png') || (data.emoji || '').toLowerCase().endsWith('.jpg') || (data.emoji || '').toLowerCase().includes('assets/');
        const isRedCircle = data.type === 'red-circle';
        
        let emojiHtml = '';
        if (isRedCircle) {
            emojiHtml = `<div class="khali-circle" style="width: var(--dynamic-emoji-size, 15vh); height: var(--dynamic-emoji-size, 15vh); border: 1vh solid #F44336; border-radius: 50%; box-shadow: 0 0 20px rgba(244, 67, 54, 0.3); position: relative;">
                <div style="position: absolute; top: 10%; left: 10%; right: 10%; bottom: 10%; border: 0.5vh dashed #333; border-radius: 50%;"></div>
            </div>`;
        } else if (isImage) {
            emojiHtml = `<img src="${data.emoji}" class="emoji-img" alt="${data.word}" style="width: var(--dynamic-emoji-size, 15vh); height: auto;">`;
        } else {
            emojiHtml = emojis.map(e => `<span>${e}</span>`).join('');
        }
        
        const isCounting = window.selectedCategory === 'numbers_10' || window.selectedCategory === 'numbers_100';
        const emojiClass = isCounting ? 'emoji emoji-animate flex-wrap-counting' : 'emoji emoji-animate';

        let dynamicEmojiSize = 'var(--emoji-size)';
        let dynamicTextScale = '1';

        if (isCounting) {
            if (emojiCount === 1) dynamicEmojiSize = 'var(--emoji-size)';
            else if (emojiCount === 2) dynamicEmojiSize = 'calc(var(--emoji-size) * 0.9)'; 
            else if (emojiCount <= 5) dynamicEmojiSize = 'calc(var(--emoji-size) * 0.45)';
            else if (emojiCount <= 10) dynamicEmojiSize = 'calc(var(--emoji-size) * 0.4)';
            else dynamicEmojiSize = 'calc(var(--emoji-size) * 0.3)';
        }
        if (emojiCount >= 10) dynamicEmojiSize = 'calc(var(--emoji-size) * 0.35)';

        frontContent = `
            <div class="${emojiClass}" style="--dynamic-emoji-size: ${dynamicEmojiSize}">
                ${emojiHtml}
            </div>
            <div class="text-group" style="--text-scale: ${dynamicTextScale}">
                <span class="letter">${data.letter}</span>
                <span class="word">${data.word}</span>
            </div>`;
        card.innerHTML = `<div class="card-inner"><div class="card-front">${frontContent}</div><div class="card-back">${backContent}</div></div><div class="progress-container"><div class="progress-bar"></div></div>`;
        master.appendChild(card);
    });
}

function updateDisplay() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const master = document.getElementById('master-container');
    if (!master) return;
    
    // SVG Icons (from original script logic)
    if (prevBtn) prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:60%; height:60%;"><path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (nextBtn) nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:60%; height:60%;"><path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const cards = Array.from(master.children);
    master.classList.remove('grid-1', 'grid-3', 'vertical-scroll', 'fit-screen');
    prevBtn?.classList.remove('large-arrows'); 
    nextBtn?.classList.remove('large-arrows');
    master.style.gridTemplateColumns = ''; 
    master.style.gridTemplateRows = '';
    master.style.gridAutoRows = '';
    document.body.style.overflow = 'hidden';
    
    if (window.currentLayout === 'all') {
        master.classList.add('vertical-scroll'); prevBtn?.classList.add('hidden'); nextBtn?.classList.add('hidden');
        cards.forEach(card => card.classList.remove('hidden', 'is-flipped'));
        document.body.style.overflow = 'auto';
    } else if (window.currentLayout === 'fit') {
        master.classList.add('fit-screen'); prevBtn?.classList.add('hidden'); nextBtn?.classList.add('hidden');
        const count = cards.length;
        const isCounting100 = window.selectedCategory === 'numbers_100';
        let cols = 4;
        if (isCounting100) cols = 10;
        else if (count > 36) cols = 9;
        else if (count > 25) cols = 8;
        else if (count > 16) cols = 6;
        else if (count > 9) cols = 5;
        else if (count > 4) cols = 4;
        else cols = count;
        const rows = Math.ceil(count / cols);
        master.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        master.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        cards.forEach(card => {
            card.classList.remove('hidden', 'is-flipped');
            if (isCounting100) card.classList.add('icon-only-layout');
        });
    } else {
        prevBtn?.classList.remove('hidden'); nextBtn?.classList.remove('hidden');
        if (window.currentLayout === '3') master.classList.add('grid-3');
        if (window.currentLayout === '1') {
            master.classList.add('grid-1');
            prevBtn?.classList.add('large-arrows');
            nextBtn?.classList.add('large-arrows');
        }
        let step = (window.currentLayout === '3') ? 3 : 1;
        cards.forEach((card, index) => {
            card.classList.add('hidden'); card.classList.remove('is-flipped');
            if (window.currentLayout === '3') { if (index >= window.currentIndex && index < window.currentIndex + 3) card.classList.remove('hidden'); }
            else { if (index === window.currentIndex) card.classList.remove('hidden'); }
        });
        if (window.isSlideshowActive) {
            prevBtn?.classList.add('disabled'); nextBtn?.classList.add('disabled');
        } else {
            if (window.currentIndex === 0) prevBtn?.classList.add('disabled'); else prevBtn?.classList.remove('disabled');
            if (window.currentIndex + step >= cards.length) nextBtn?.classList.add('disabled'); else nextBtn?.classList.remove('disabled');
        }
    }
}

function applySelection() {
    window.activeCardsData = RAJSHREE_DATA[window.selectedCategory] || [];
    window.currentIndex = 0;
    renderCards();
    updateDisplay();
}

function updateLayout(layout) { 
    if (window.isSlideshowActive) return;
    window.currentLayout = layout; 
    window.currentIndex = 0; 
    const layoutIcon = document.querySelector('#nav-layout .hi');
    if (layoutIcon) {
        let icon = '📐';
        if (layout === '1') icon = '🌟';
        else if (layout === '3') icon = '🔳';
        else if (layout === 'all') icon = '📑';
        else if (layout === 'fit') icon = '📺';
        layoutIcon.innerText = icon;
    }
    updateDisplay(); 
}

function next(force = false) {
    if (window.isSlideshowActive && !force) return;
    let step = (window.currentLayout === '3') ? 3 : 1;
    if (window.currentIndex + step < window.activeCardsData.length) { window.currentIndex += step; updateDisplay(); }
}
function prev(force = false) {
    if (window.isSlideshowActive && !force) return; 
    let step = (window.currentLayout === '3') ? 3 : 1;
    if (window.currentIndex - step >= 0) { window.currentIndex -= step; updateDisplay(); }
}
