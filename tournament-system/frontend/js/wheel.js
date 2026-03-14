/* =====================================================
   wheel.js — Canvas Spin Wheel
   ===================================================== */

let isSpinning = false;
let currentAngle = 0;
let wheelAnimId = null;
let wheelPlayers = [];  // {id, name, color}

const WHEEL_COLORS = [
    '#00ffff','#a855f7','#ff006e','#00ff88','#ffd700',
    '#ff8800','#3a86ff','#ff4365','#06ffb4','#9b5de5',
    '#e71d36','#2ec4b6','#ff1b6b','#cbff8c','#7c3aed'
];

function updateWheel() {
    wheelPlayers = players.filter(p => !usedPlayerIds.has(p.id));
    drawWheel();
    updateWheelStatus();
}

function updateWheelStatus() {
    const countEl = document.getElementById('wheelCount');
    if (countEl) countEl.textContent = wheelPlayers.length;
}

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 12;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (wheelPlayers.length === 0) {
        // Empty state
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(22,33,62,0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#555';
        ctx.font = '16px Tahoma';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('لا يوجد لاعبون', cx, cy);
        ctx.restore();
        drawPointer(cx, cy, r);
        return;
    }

    const sliceAngle = (2 * Math.PI) / wheelPlayers.length;

    // Outer glow ring
    const ringGradient = ctx.createRadialGradient(cx, cy, r - 2, cx, cy, r + 8);
    ringGradient.addColorStop(0, 'rgba(0,255,255,0.3)');
    ringGradient.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, 2 * Math.PI);
    ctx.fillStyle = ringGradient;
    ctx.fill();

    // Draw slices
    wheelPlayers.forEach((player, i) => {
        const start = currentAngle + i * sliceAngle;
        const end = start + sliceAngle;
        const color = WHEEL_COLORS[i % WHEEL_COLORS.length];

        // Slice
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, end);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Darker inner edge
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r * 0.3, start, end);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fill();

        // Player name
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + sliceAngle / 2);

        const textR = r * 0.65;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const fontSize = Math.max(9, Math.min(15, Math.floor(240 / wheelPlayers.length)));
        ctx.font = `bold ${fontSize}px Tahoma, Arial`;

        // Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 5;

        // Outline
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 3;
        ctx.strokeText(player.name, textR, 0);

        // Fill
        ctx.fillStyle = '#ffffff';
        ctx.fillText(player.name, textR, 0);

        ctx.shadowBlur = 0;
        ctx.restore();
    });

    // Center hub
    const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
    hubGrad.addColorStop(0, '#ffffff');
    hubGrad.addColorStop(1, '#aaaaaa');
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hub inner
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0a0f';
    ctx.fill();

    drawPointer(cx, cy, r);
}

function drawPointer(cx, cy, r) {
    const ctx = document.getElementById('wheelCanvas').getContext('2d');
    const py = cy - r - 4;
    const size = 18;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, py + size);
    ctx.lineTo(cx - size / 2, py - size / 2);
    ctx.lineTo(cx + size / 2, py - size / 2);
    ctx.closePath();
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
}

function spinWheel() {
    if (isSpinning || wheelPlayers.length === 0) {
        if (wheelPlayers.length === 0) showToast('لا يوجد لاعبون متاحون', 'error');
        return;
    }

    isSpinning = true;
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) { spinBtn.disabled = true; spinBtn.textContent = '🌀 يدور...'; }

    const totalSpin = (5 + Math.random() * 5) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 3000 + Math.random() * 2000;
    const startTime = performance.now();
    const startAngle = currentAngle;

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 4);
        currentAngle = startAngle + totalSpin * eased;
        drawWheel();

        if (progress < 1) {
            wheelAnimId = requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            if (spinBtn) { spinBtn.disabled = false; spinBtn.textContent = '🎡 تدوير'; }
            onSpinComplete();
        }
    }

    wheelAnimId = requestAnimationFrame(animate);
}

function onSpinComplete() {
    if (wheelPlayers.length === 0) return;

    // Find selected: pointer is at top (270° from right = -Math.PI/2)
    // Normalize angle so 0 = top
    const sliceAngle = (2 * Math.PI) / wheelPlayers.length;
    const normalizedAngle = ((-currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const idx = Math.floor(normalizedAngle / sliceAngle) % wheelPlayers.length;
    const selected = wheelPlayers[idx];

    onPlayerSelected(selected);
}

// Override per page
function onPlayerSelected(player) {
    showToast(`تم اختيار: ${player.name}`, 'success');
}
