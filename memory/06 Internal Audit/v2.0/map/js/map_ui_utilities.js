/**
 * Initializes 'Clear' buttons for search fields.
 */
function initClearButtons(from, via, to) {
    const fields = [
        { input: from, btn: document.querySelector('.from-field .clear-input-btn') },
        { input: via,  btn: document.querySelector('.via-field .clear-input-btn') },
        { input: to,   btn: document.querySelector('.to-field .clear-input-btn') }
    ];

    fields.forEach(f => {
        if (!f.input || !f.btn) return;

        const updateVisibility = () => {
            if (f.btn) f.btn.classList.toggle('visible', f.input.value.length > 0);
        };

        f.input.addEventListener('input', updateVisibility);
        
        f.btn.onclick = (e) => {
            e.stopPropagation();
            f.input.value = '';
            f.input.focus();
            updateVisibility();
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        };

        updateVisibility();
    });
}

/**
 * Initializes 'Swap' functionality between search inputs.
 */
function initSwapHandlers(from, via, to) {
    const btnFromVia = document.getElementById('btn-swap-from-via');
    const btnViaTo = document.getElementById('btn-swap-via-to');

    if (btnFromVia) {
        btnFromVia.onclick = (e) => {
            e.stopPropagation();

            if (!window.VIA_MODE_ACTIVE) {
                // Swapping START and DESTINATION when VIA is disabled
                const temp = from.value;
                from.value = to.value;
                to.value = temp;
                animateSwap(from, to);
            } else {
                // Normal START & VIA swap
                const temp = from.value;
                from.value = via.value;
                via.value = temp;
                animateSwap(from, via);
            }

            if (window.playSound) window.playSound('UI_CLICK');

            // Re-run search
            const runBtn = document.getElementById('btn-run-search');
            if (runBtn) runBtn.click();
        };
    }

    if (btnViaTo) {
        btnViaTo.onclick = (e) => {
            e.stopPropagation();
            if (window.SEARCH_MODE !== 'via') return;

            const temp = via.value;
            via.value = to.value;
            to.value = temp;

            animateSwap(via, to);
            if (window.playSound) window.playSound('UI_CLICK');

            const runBtn = document.getElementById('btn-run-search');
            if (runBtn) runBtn.click();
        };
    }
}

function animateSwap(el1, el2) {
    if (!el1 || !el2) return;
    [el1, el2].forEach(el => {
        el.style.transition = 'none';
        el.style.opacity = '0.3';
        el.style.transform = 'translateY(5px)';
        setTimeout(() => {
            el.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 10);
    });

    // Sync clear button visibility manually since 'input' event won't fire on value change
    const fromBtn = document.querySelector('.from-field .clear-input-btn');
    const viaBtn = document.querySelector('.via-field .clear-input-btn');
    const toBtn = document.querySelector('.to-field .clear-input-btn');
    
    if (fromBtn) fromBtn.classList.toggle('visible', document.getElementById('map-search-from').value.length > 0);
    if (viaBtn) viaBtn.classList.toggle('visible', document.getElementById('map-search-via').value.length > 0);
    if (toBtn) toBtn.classList.toggle('visible', document.getElementById('map-search-to').value.length > 0);
}

window.showErrorShake = function() {
    const container = document.getElementById('global-search-container');
    if (!container) return;
    container.classList.add('error-shake');
    setTimeout(() => container.classList.remove('error-shake'), 400);
    if (window.playSound) window.playSound('UI_ERROR');
}
