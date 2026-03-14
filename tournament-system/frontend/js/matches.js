/* =====================================================
   matches.js — Match Pair Building
   ===================================================== */

let matchPairs = [];          // [{team1: {name}, team2: {name}}]
let usedPlayerIds = new Set(); // IDs already picked by wheel
let pendingPick = null;        // First picked player waiting for second

function onPlayerSelected(player) {
    if (usedPlayerIds.has(player.id)) {
        showToast('هذا اللاعب تم اختياره بالفعل', 'warning');
        updateWheel();
        return;
    }

    if (!pendingPick) {
        pendingPick = player;
        usedPlayerIds.add(player.id);
        showToast(`🎯 ${player.name} — دور العجلة مرة ثانية لاختيار الخصم`, 'info');
        updateWheel();

        // Highlight pending
        const pendingEl = document.getElementById('pendingPick');
        if (pendingEl) {
            pendingEl.innerHTML = `
                <div class="player-chip" style="border-color:${player.color}80; animation: chipIn 0.3s ease;">
                    <span style="width:8px;height:8px;border-radius:50%;background:${player.color};box-shadow:0 0 6px ${player.color};"></span>
                    <span>${player.name}</span>
                    <span style="color:var(--neon-gold)">⚡</span>
                </div>`;
        }
    } else {
        const team1 = pendingPick;
        const team2 = player;
        usedPlayerIds.add(player.id);
        pendingPick = null;

        matchPairs.push({ team1, team2 });
        renderMatches();
        updateWheel();

        const pendingEl = document.getElementById('pendingPick');
        if (pendingEl) pendingEl.innerHTML = '';

        showToast(`مباراة: ${team1.name} VS ${team2.name}`, 'success');
        checkBracketReady();
    }
}

function renderMatches() {
    const container = document.getElementById('matchesList');
    if (!container) return;

    if (matchPairs.length === 0) {
        container.innerHTML = `<div class="empty-state"><span>⚔️</span>المباريات ستظهر هنا</div>`;
        return;
    }

    container.innerHTML = matchPairs.map((m, i) => `
        <div class="match-card">
            <div class="match-label">مباراة ${i + 1}</div>
            <div class="match-teams">
                <div class="team-name" style="color: ${m.team1.color || 'var(--neon-cyan)'}">${m.team1.name}</div>
                <div class="vs-badge">VS</div>
                <div class="team-name" style="color: ${m.team2.color || 'var(--neon-pink)'}">${m.team2.name}</div>
            </div>
        </div>
    `).join('');
}

function checkBracketReady() {
    const total = players.length;
    const matched = usedPlayerIds.size;
    const bracketBtn = document.getElementById('bracketBtn');
    const statusEl = document.getElementById('matchStatus');

    if (statusEl) {
        if (total < 2) {
            statusEl.textContent = 'أضف لاعبين أولاً';
        } else if (pendingPick) {
            statusEl.textContent = `اختر الخصم لـ ${pendingPick.name}`;
        } else if (matched < total) {
            statusEl.textContent = `${matched}/${total} لاعبين جُمعوا`;
        } else {
            statusEl.textContent = 'اكتمل الإعداد! ابدأ البطولة ↑';
        }
    }

    if (bracketBtn) {
        const ready = matchPairs.length >= 2 && !pendingPick;
        bracketBtn.disabled = !ready;
        bracketBtn.style.opacity = ready ? '1' : '0.5';
    }
}

function resetMatches() {
    matchPairs = [];
    usedPlayerIds = new Set();
    pendingPick = null;
    renderMatches();
    checkBracketReady();
    const pendingEl = document.getElementById('pendingPick');
    if (pendingEl) pendingEl.innerHTML = '';
    if (typeof updateWheel === 'function') updateWheel();
}
