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

// ── FULL PREVIEW MODAL LOGIC ──

function openFullPreview() {
    const modal = document.getElementById('preview-modal');
    const modalContent = document.getElementById('modal-preview-content');
    const modalTitle = document.getElementById('modal-title');
    
    if (!modal || !modalContent) return;

    // Clear previous
    modalContent.innerHTML = '';
    
    // Get the current asset data
    const name = document.getElementById('detail-name').textContent;
    const type = document.getElementById('detail-type').textContent;
    const size = document.getElementById('detail-size').textContent;
    
    modalTitle.textContent = `PREVIEW // ${name.toUpperCase()}`;

    // Clone the existing preview or re-generate it for higher fidelity
    const path = currentAssetFileName;
    const previewEl = getPreviewElement(path, type.toLowerCase(), name, 0); // Bypass heavy threshold for full view
    
    modalContent.appendChild(previewEl);
    modal.style.display = 'flex';
    
    // Re-init lucide if we injected an icon
    lucide.createIcons();

    // Disable body scroll
    document.body.style.overflow = 'hidden';
}

function closeFullPreview() {
    const modal = document.getElementById('preview-modal');
    const modalContent = document.getElementById('modal-preview-content');
    
    if (modal) modal.style.display = 'none';
    if (modalContent) modalContent.innerHTML = '';

    // Re-enable body scroll
    document.body.style.overflow = '';
}

// Close on ESC
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('preview-modal');
        if (modal && modal.style.display === 'flex') {
            closeFullPreview();
        } else {
            hideDetails();
        }
    }
});
