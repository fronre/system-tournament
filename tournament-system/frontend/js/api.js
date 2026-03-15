/* =====================================================
   api.js — All API calls to FastAPI backend
   ===================================================== */

const API_BASE = ''; // Uses relative paths since FastAPI serves the frontend directly

const API = {
    // ---- Players ----
    async getPlayers() {
        const r = await fetch(`${API_BASE}/players/`);
        if (!r.ok) throw new Error('Failed to fetch players');
        return r.json();
    },

    async addPlayer(name) {
        const r = await fetch(`${API_BASE}/players/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (!r.ok) {
            const err = await r.json();
            throw new Error(err.detail || 'Failed to add player');
        }
        return r.json();
    },

    async deletePlayer(id) {
        const r = await fetch(`${API_BASE}/players/${id}`, { method: 'DELETE' });
        if (!r.ok) throw new Error('Failed to delete player');
        return r.json();
    },

    // ---- Teams ----
    async addTeam(player1, player2 = null, player3 = null, tournament_id = null) {
        const r = await fetch(`${API_BASE}/teams/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player1, player2, player3, tournament_id })
        });
        if (!r.ok) throw new Error('Failed to create team');
        return r.json();
    },

    async getTeams() {
        const r = await fetch(`${API_BASE}/teams/`);
        if (!r.ok) throw new Error('Failed to fetch teams');
        return r.json();
    },

    // ---- Matches ----
    async addMatch(team1_id, team2_id, round, tournament_id = null) {
        const r = await fetch(`${API_BASE}/matches/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ team1_id, team2_id, round, tournament_id })
        });
        if (!r.ok) throw new Error('Failed to create match');
        return r.json();
    },

    async setMatchWinner(match_id, winner_id) {
        const r = await fetch(`${API_BASE}/matches/${match_id}/winner`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ winner_id })
        });
        if (!r.ok) throw new Error('Failed to set winner');
        return r.json();
    },

    // ---- Tournaments ----
    async createTournament(type) {
        const r = await fetch(`${API_BASE}/tournament/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type })
        });
        if (!r.ok) throw new Error('Failed to create tournament');
        return r.json();
    },

    async getBracket(tournament_id) {
        const r = await fetch(`${API_BASE}/tournament/${tournament_id}/bracket`);
        if (!r.ok) throw new Error('Failed to fetch bracket');
        return r.json();
    },

    async spinWheel() {
        const r = await fetch(`${API_BASE}/tournament/spin/wheel`);
        if (!r.ok) throw new Error('Failed to spin');
        return r.json();
    },

    async generateGroups(group_size = 4) {
        const r = await fetch(`${API_BASE}/tournament/groups/generate?group_size=${group_size}`);
        if (!r.ok) throw new Error('Failed to generate groups');
        return r.json();
    }
};
