/* =====================================================
   players.js — Player Management
   ===================================================== */

let players = [];  // { id, name, color }

const PLAYER_COLORS = [
    '#00ffff','#a855f7','#ff006e','#00ff88','#ffd700',
    '#ff8800','#3a86ff','#06ffb4','#ff4365','#ff1b6b',
    '#7353ba','#2ec4b6','#e71d36','#cbff8c','#9b5de5'
];

function getPlayerColor(index) {
    return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

async function loadPlayers() {
    try {
        players = await API.getPlayers();
        players = players.map((p, i) => ({ ...p, color: getPlayerColor(i) }));
        renderPlayers();
        onPlayersChanged();
    } catch (e) {
        showToast('الخادم غير متصل — تعمل في وضع غير متصل', 'warning');
    }
}

async function addPlayer() {
    const input = document.getElementById('playerNameInput');
    const name = input.value.trim();

    if (!name) { showToast('أدخل اسم اللاعب', 'error'); return; }
    if (name.length > 20) { showToast('الاسم طويل جداً (20 حرف كحد أقصى)', 'error'); return; }
    if (players.some(p => p.name === name)) { showToast('هذا الاسم موجود بالفعل', 'error'); return; }

    setLoading('addPlayerBtn', true);
    try {
        const created = await API.addPlayer(name);
        const colorized = { ...created, color: getPlayerColor(players.length) };
        players.push(colorized);
        input.value = '';
        renderPlayers();
        onPlayersChanged();
        showToast(`تم إضافة ${name} ✓`, 'success');
    } catch (e) {
        // Offline fallback: add locally
        const local = { id: Date.now(), name, color: getPlayerColor(players.length) };
        players.push(local);
        input.value = '';
        renderPlayers();
        onPlayersChanged();
        showToast(`${name} أُضيف (غير متصل)`, 'info');
    } finally {
        setLoading('addPlayerBtn', false, 'إضافة');
    }
}

async function removePlayer(id) {
    setLoading('addPlayerBtn', true);
    try {
        await API.deletePlayer(id);
    } catch (_) { /* ignore if offline */ }

    players = players.filter(p => p.id !== id);
    // Re-assign colors
    players = players.map((p, i) => ({ ...p, color: getPlayerColor(i) }));
    renderPlayers();
    onPlayersChanged();
    showToast('تم حذف اللاعب', 'info');
    setLoading('addPlayerBtn', false, 'إضافة');
}

function renderPlayers() {
    const container = document.getElementById('playersGrid');
    if (!container) return;

    if (players.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span>👤</span>
                أضف لاعبين للبدء
            </div>`;
        return;
    }

    container.innerHTML = players.map(p => `
        <div class="player-chip" style="border-color: ${p.color}40; box-shadow: 0 0 8px ${p.color}20;">
            <span class="chip-dot" style="width:8px;height:8px;border-radius:50%;background:${p.color};box-shadow:0 0 6px ${p.color};flex-shrink:0;"></span>
            <span class="chip-name" title="${p.name}">${p.name}</span>
            <button class="chip-delete" onclick="removePlayer(${p.id})" title="حذف">×</button>
        </div>
    `).join('');
}

// Override in specific page
function onPlayersChanged() {
    updatePlayersCount();
    if (typeof updateWheel === 'function') updateWheel();
}

function updatePlayersCount() {
    const el = document.getElementById('playersCount');
    if (el) el.textContent = players.length;
}

// Enter key support
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('playerNameInput');
    if (input) {
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') addPlayer();
        });
    }
});
