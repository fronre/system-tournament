/* =====================================================
   bracket.js — Tournament Bracket Tree
   ===================================================== */

let bracketRounds = [];   // Array of rounds, each round = array of matches
// Each match: { id, team1: {name, color}, team2: {name, color}, winner: null | teamObj }

function buildBracket(teams) {
    // teams: [{name, color, ...}]
    if (teams.length < 2) { showToast('مطلوب على الأقل فريقان', 'error'); return; }

    // Shuffle
    const shuffled = [...teams].sort(() => Math.random() - 0.5);

    // Pad to next power of 2 with "BYE" slots
    let size = 1;
    while (size < shuffled.length) size *= 2;
    while (shuffled.length < size) shuffled.push(null); // null = BYE

    bracketRounds = [];

    // First round
    const firstRound = [];
    for (let i = 0; i < shuffled.length; i += 2) {
        const match = {
            id: `r0m${i / 2}`,
            team1: shuffled[i],
            team2: shuffled[i + 1],
            winner: null
        };
        // Auto-advance byes
        if (!match.team1) match.winner = match.team2;
        else if (!match.team2) match.winner = match.team1;
        firstRound.push(match);
    }
    bracketRounds.push(firstRound);

    // Build subsequent rounds (placeholders)
    let numMatches = firstRound.length / 2;
    while (numMatches >= 1) {
        const round = [];
        for (let i = 0; i < numMatches; i++) {
            round.push({ id: `r${bracketRounds.length}m${i}`, team1: null, team2: null, winner: null });
        }
        bracketRounds.push(round);
        numMatches = Math.floor(numMatches / 2);
        if (numMatches === 0) break;
    }

    // Process first-round byes
    firstRound.forEach((match, idx) => {
        if (match.winner) advanceWinner(0, idx, match.winner, false);
    });

    renderBracket();
    openModal('bracketModal');
}

function setMatchWinner(roundIdx, matchIdx, winner) {
    const match = bracketRounds[roundIdx][matchIdx];
    match.winner = winner;
    advanceWinner(roundIdx, matchIdx, winner, true);
    renderBracket();

    // Save to API (best-effort)
    // API.setMatchWinner(match.id, winner.id).catch(() => {});
}

function advanceWinner(roundIdx, matchIdx, winner, render = true) {
    const nextRoundIdx = roundIdx + 1;
    if (nextRoundIdx >= bracketRounds.length) {
        // This was the final!
        showChampion(winner.name);
        return;
    }

    const nextMatchIdx = Math.floor(matchIdx / 2);
    const isLeftSlot = matchIdx % 2 === 0;
    const nextMatch = bracketRounds[nextRoundIdx][nextMatchIdx];

    if (isLeftSlot) {
        nextMatch.team1 = winner;
    } else {
        nextMatch.team2 = winner;
    }

    // Auto-advance if both slots filled by byes
    if (nextMatch.team1 && nextMatch.team2 && render) {
        renderBracket();
    }
}

function getRoundName(roundIdx, totalRounds) {
    const stepsFromEnd = totalRounds - 1 - roundIdx;
    if (stepsFromEnd === 0) return '🏆 النهائي';
    if (stepsFromEnd === 1) return 'نصف النهائي';
    if (stepsFromEnd === 2) return 'ربع النهائي';
    if (stepsFromEnd === 3) return 'دور الـ 16';
    return `الجولة ${roundIdx + 1}`;
}

function getTeamLabel(team) {
    if (!team) return '---';
    return team.name || 'فريق غير معروف';
}

function renderBracket() {
    const container = document.getElementById('bracketContainer');
    if (!container) return;

    container.innerHTML = '';

    bracketRounds.forEach((round, rIdx) => {
        const isFinal = rIdx === bracketRounds.length - 1;
        const roundEl = document.createElement('div');
        roundEl.className = `bracket-round ${isFinal ? 'final-round' : ''}`;

        // Round title
        const titleEl = document.createElement('div');
        titleEl.className = 'round-title';
        titleEl.textContent = getRoundName(rIdx, bracketRounds.length);
        roundEl.appendChild(titleEl);

        // Matches
        round.forEach((match, mIdx) => {
            const matchEl = document.createElement('div');
            matchEl.className = `bracket-match ${match.winner ? 'completed' : ''}`;

            const t1 = match.team1;
            const t2 = match.team2;
            const w = match.winner;

            const t1Label = getTeamLabel(t1);
            const t2Label = getTeamLabel(t2);
            const t1Color = t1?.color || 'var(--neon-cyan)';
            const t2Color = t2?.color || 'var(--neon-pink)';

            const isWaiting = !t1 || !t2;
            const canPick = !w && t1 && t2;

            matchEl.innerHTML = `
                <div class="match-header-label">
                    مباراة ${mIdx + 1}
                </div>
                <div class="match-team-row ${!t1 ? 'waiting' : ''} ${w === t1 ? 'winner-team' : ''} ${w && w !== t1 ? 'loser-team' : ''}">
                    <span class="team-dot" style="background:${t1Color};color:${t1Color}"></span>
                    <span>${t1 ? t1Label : 'في الانتظار...'}</span>
                    ${w === t1 ? '<span style="margin-right:auto">👑</span>' : ''}
                </div>
                <div class="bracket-vs">VS</div>
                <div class="match-team-row ${!t2 ? 'waiting' : ''} ${w === t2 ? 'winner-team' : ''} ${w && w !== t2 ? 'loser-team' : ''}">
                    <span class="team-dot" style="background:${t2Color};color:${t2Color}"></span>
                    <span>${t2 ? t2Label : 'في الانتظار...'}</span>
                    ${w === t2 ? '<span style="margin-right:auto">👑</span>' : ''}
                </div>
                ${canPick ? `
                    <div class="bracket-win-btns">
                        <button class="bracket-win-btn team1" onclick="setMatchWinner(${rIdx}, ${mIdx}, bracketRounds[${rIdx}][${mIdx}].team1)">
                            ${t1Label} فاز ✓
                        </button>
                        <button class="bracket-win-btn team2" onclick="setMatchWinner(${rIdx}, ${mIdx}, bracketRounds[${rIdx}][${mIdx}].team2)">
                            ${t2Label} فاز ✓
                        </button>
                    </div>` : ''}
                ${w && !canPick ? `
                    <div class="winner-badge">
                        🏆 ${getTeamLabel(w)}
                    </div>` : ''}
            `;

            roundEl.appendChild(matchEl);
        });

        container.appendChild(roundEl);
    });
}

function openBracket() {
    if (matchPairs.length < 2) {
        showToast('مطلوب مبارتان على الأقل لإنشاء الشجرة', 'error');
        return;
    }

    // Build team list from matchPairs (1v1) or from teams array (2v2/3v3)
    const teamsForBracket = typeof getTeamsForBracket === 'function'
        ? getTeamsForBracket()
        : matchPairs.flatMap(m => [m.team1, m.team2]);

    buildBracket(teamsForBracket);
}
