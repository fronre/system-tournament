/* =====================================================
   groups.js — Group Stage Logic
   ===================================================== */

let groups = [];   // [{group, name, players:[{id,name,points,wins,draws,losses}], matches:[]}]

async function generateGroups() {
    if (players.length < 4) {
        showToast('يجب إضافة 4 لاعبين على الأقل للمجموعات', 'error');
        return;
    }

    const groupSize = parseInt(document.getElementById('groupSizeSelect')?.value || '4');

    setLoading('generateGroupsBtn', true);
    try {
        // Try API first
        groups = await API.generateGroups(groupSize);
    } catch (_) {
        // Offline fallback: generate locally
        groups = generateGroupsLocally(players, groupSize);
    }
    setLoading('generateGroupsBtn', false, 'إنشاء المجموعات');
    renderGroups();
    showToast('تم إنشاء المجموعات بنجاح!', 'success');
}

function generateGroupsLocally(playerList, groupSize) {
    const shuffled = [...playerList].sort(() => Math.random() - 0.5);
    const result = [];
    const groupCount = Math.ceil(shuffled.length / groupSize);

    for (let g = 0; g < groupCount; g++) {
        const groupPlayers = shuffled.slice(g * groupSize, (g + 1) * groupSize);
        const matches = [];
        for (let i = 0; i < groupPlayers.length; i++) {
            for (let j = i + 1; j < groupPlayers.length; j++) {
                matches.push({
                    player1: groupPlayers[i].name,
                    player2: groupPlayers[j].name,
                    result: null   // null | 'player1' | 'draw' | 'player2'
                });
            }
        }
        result.push({
            group: g + 1,
            name: `المجموعة ${g + 1}`,
            players: groupPlayers.map(p => ({
                id: p.id,
                name: p.name,
                color: p.color || '#00ffff',
                points: 0, wins: 0, draws: 0, losses: 0
            })),
            matches
        });
    }
    return result;
}

function setMatchResult(groupIdx, matchIdx, result) {
    // result: 'player1' | 'draw' | 'player2'
    const group = groups[groupIdx];
    const match = group.matches[matchIdx];
    const prev = match.result;

    // Undo previous result if any
    if (prev) undoResult(group, match, prev);

    match.result = result;

    const p1 = group.players.find(p => p.name === match.player1);
    const p2 = group.players.find(p => p.name === match.player2);
    if (!p1 || !p2) return;

    if (result === 'player1') {
        p1.wins++; p1.points += 3;
        p2.losses++;
    } else if (result === 'player2') {
        p2.wins++; p2.points += 3;
        p1.losses++;
    } else if (result === 'draw') {
        p1.draws++; p1.points++;
        p2.draws++; p2.points++;
    }

    // Sort by points desc
    group.players.sort((a, b) => b.points - a.points);
    renderGroups();
}

function undoResult(group, match, prev) {
    const p1 = group.players.find(p => p.name === match.player1);
    const p2 = group.players.find(p => p.name === match.player2);
    if (!p1 || !p2) return;

    if (prev === 'player1') {
        p1.wins--; p1.points -= 3;
        p2.losses--;
    } else if (prev === 'player2') {
        p2.wins--; p2.points -= 3;
        p1.losses--;
    } else if (prev === 'draw') {
        p1.draws--; p1.points--;
        p2.draws--; p2.points--;
    }
}

function renderGroups() {
    const container = document.getElementById('groupsContainer');
    if (!container) return;

    if (groups.length === 0) {
        container.innerHTML = `<div class="empty-state"><span>🏟️</span>أضف لاعبين ثم اضغط "إنشاء المجموعات"</div>`;
        return;
    }

    container.innerHTML = groups.map((group, gIdx) => `
        <div class="group-card">
            <div class="group-header">
                <h3 class="group-title">${group.name}</h3>
                <span class="status-badge badge-active">${group.players.length} لاعبين</span>
            </div>

            <!-- Points Table -->
            <div class="points-table-wrap">
                <table class="points-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>اللاعب</th>
                            <th>ف</th>
                            <th>ت</th>
                            <th>خ</th>
                            <th>ن</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${group.players.map((p, rank) => `
                            <tr class="${rank === 0 ? 'rank-first' : rank === 1 ? 'rank-second' : ''}">
                                <td>${rank + 1}</td>
                                <td>
                                    <span class="player-dot" style="background:${p.color || '#00ffff'}"></span>
                                    ${p.name}
                                </td>
                                <td>${p.wins}</td>
                                <td>${p.draws}</td>
                                <td>${p.losses}</td>
                                <td class="points-cell">${p.points}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Matches -->
            <div class="group-matches">
                <div class="matches-subtitle">المباريات</div>
                ${group.matches.map((m, mIdx) => `
                    <div class="group-match ${m.result ? 'done' : ''}">
                        <span class="gm-player">${m.player1}</span>
                        <div class="gm-controls">
                            <button class="gm-btn ${m.result === 'player1' ? 'active-btn' : ''}"
                                onclick="setMatchResult(${gIdx}, ${mIdx}, 'player1')">فوز</button>
                            <button class="gm-btn draw-btn ${m.result === 'draw' ? 'active-btn' : ''}"
                                onclick="setMatchResult(${gIdx}, ${mIdx}, 'draw')">ت</button>
                            <button class="gm-btn ${m.result === 'player2' ? 'active-btn' : ''}"
                                onclick="setMatchResult(${gIdx}, ${mIdx}, 'player2')">فوز</button>
                        </div>
                        <span class="gm-player">${m.player2}</span>
                    </div>`).join('')}
            </div>
        </div>
    `).join('');
}
