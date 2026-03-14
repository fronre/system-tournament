/* =====================================================
   ui.js — Shared UI Utilities
   ===================================================== */

// ---- Toast Notifications ----
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ---- Modals ----
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking backdrop
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// ---- Champion Overlay ----
function showChampion(name) {
    const overlay = document.getElementById('championOverlay');
    const nameEl = document.getElementById('championName');
    if (overlay && nameEl) {
        nameEl.textContent = name;
        overlay.classList.remove('hidden');
        launchConfetti();
    }
}

function hideChampion() {
    const overlay = document.getElementById('championOverlay');
    if (overlay) overlay.classList.add('hidden');
}

// ---- Confetti ----
function launchConfetti() {
    const colors = ['#00ffff','#ff006e','#a855f7','#00ff88','#ffd700','#ff8800'];
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'confetti-particle';
            el.style.cssText = `
                left: ${Math.random() * 100}vw;
                top: -10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                transform: rotate(${Math.random() * 360}deg);
                animation-duration: ${2 + Math.random() * 3}s;
                animation-delay: ${Math.random() * 0.5}s;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                width: ${6 + Math.random() * 8}px;
                height: ${6 + Math.random() * 8}px;
            `;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 5000);
        }, i * 30);
    }
}

// ---- Loading helpers ----
function setLoading(btnId, loading, text = '') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
        btn.dataset.origText = btn.textContent;
        btn.textContent = '⏳ ...';
    } else {
        btn.textContent = text || btn.dataset.origText || btn.textContent;
    }
}

// ---- Number format ----
function pad(n) { return String(n).padStart(2, '0'); }
