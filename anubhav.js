
// ============ CALCULATOR 1: Weight → Price ============
const boxInput = document.getElementById('boxWeight');
const totalInput = document.getElementById('totalWeight');
const typeSelect = document.getElementById('sarsoType');
const rateText = document.getElementById('rateText');
const result = document.getElementById('result');
const totalPriceEl = document.getElementById('totalPrice');
const oilWeightEl = document.getElementById('oilWeight');
const rateDisplayEl = document.getElementById('rateDisplay');
const errorMsg = document.getElementById('errorMsg');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const quickChips = document.getElementById('quickChips');

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add('show');
    result.classList.remove('show');
}
function hideError() { errorMsg.classList.remove('show'); }

function animateNumber(el, target, decimals = 2, duration = 700) {
    const start = parseFloat(el.textContent.replace(/,/g, '')) || 0;
    const startTime = performance.now();
    function tick(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = start + (target - start) * eased;
        el.textContent = val.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function launchConfetti() {
    const colors = ['#f5b82e', '#ff8a00', '#2d5a3d', '#ffd86b', '#e63946', '#fff4c2'];
    for (let i = 0; i < 40; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.left = (50 + (Math.random() - 0.5) * 30) + '%';
        c.style.top = '50%';
        c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        c.style.width = (6 + Math.random() * 8) + 'px';
        c.style.height = c.style.width;
        document.body.appendChild(c);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 300;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity - 200;
        const rot = Math.random() * 720;

        c.animate([
            { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy + 600}px) rotate(${rot}deg)`, opacity: 0 }
        ], {
            duration: 1400 + Math.random() * 600,
            easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)'
        }).onfinish = () => c.remove();
    }
}

function fmt(n, d = 3) {
    return n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function fmtPrice(n) {
    return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

let lastTotal = -1;
function calculate() {
    const box = parseFloat(boxInput.value);
    const total = parseFloat(totalInput.value);
    const rate = parseFloat(typeSelect.value);
    const sarsoName = typeSelect.options[typeSelect.selectedIndex].text.split('—')[0].trim();

    rateText.textContent = `Rate: ₹${rate} per kg`;

    if (boxInput.value === '' && totalInput.value === '') {
        result.classList.remove('show');
        hideError();
        return;
    }

    if (isNaN(box) || isNaN(total)) {
        result.classList.remove('show');
        return;
    }

    if (box < 0 || total < 0) {
        showError('⚠️ Weights cannot be negative');
        return;
    }
    if (total <= box) {
        showError('⚠️ Total weight must be greater than box weight');
        return;
    }

    hideError();
    const oilWeight = total - box;
    const price = oilWeight * rate;

    oilWeightEl.textContent = fmt(oilWeight);
    rateDisplayEl.textContent = rate;
    animateNumber(totalPriceEl, price, 2, 700);

    step1.innerHTML = `<span class="num">${fmt(total)}</span><span class="unit-s">kg</span> <span class="op">−</span> <span class="num">${fmt(box)}</span><span class="unit-s">kg</span> <span class="op">=</span> <span class="num">${fmt(oilWeight)}</span><span class="unit-s">kg (oil)</span>`;
    step2.innerHTML = `<span class="num">${fmt(oilWeight)}</span><span class="unit-s">kg</span> <span class="op">×</span> <span class="num">₹${rate}</span><span class="unit-s">/kg</span> <span class="op">=</span> ...`;
    step3.innerHTML = `💰 Total = <span class="num">₹${fmtPrice(price)}</span> <span class="unit-s">(${sarsoName})</span>`;

    result.classList.add('show');

    if (Math.abs(price - lastTotal) > 0.01) {
        launchConfetti();
        lastTotal = price;
    }
}

quickChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    boxInput.value = chip.dataset.val;
    chip.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0.9)' },
        { transform: 'scale(1.08)' },
        { transform: 'scale(1)' }
    ], { duration: 300, easing: 'ease-out' });
    calculate();
});

boxInput.addEventListener('input', calculate);
totalInput.addEventListener('input', calculate);
typeSelect.addEventListener('change', calculate);
rateText.textContent = `Rate: ₹${typeSelect.value} per kg`;

// ============ CALCULATOR 2: Price → Weight (NEW) ============
const budgetInput = document.getElementById('budgetPrice');
const budgetChips = document.getElementById('budgetChips');
const budgetResult = document.getElementById('budgetResult');
const budgetHint = document.getElementById('budgetHint');

const blackKg = document.getElementById('blackKg');
const blackG = document.getElementById('blackG');
const blackCalc = document.getElementById('blackCalc');

const yellowKg = document.getElementById('yellowKg');
const yellowG = document.getElementById('yellowG');
const yellowCalc = document.getElementById('yellowCalc');

const BLACK_RATE = 220;
const YELLOW_RATE = 240;

function animateBudget(el, target, decimals = 3, duration = 700) {
    const start = parseFloat(el.textContent.replace(/,/g, '')) || 0;
    const startTime = performance.now();
    function tick(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = start + (target - start) * eased;
        el.textContent = val.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function calculateBudget() {
    const price = parseFloat(budgetInput.value);

    if (budgetInput.value === '' || isNaN(price) || price <= 0) {
        budgetResult.classList.remove('show');
        budgetHint.style.display = 'block';
        return;
    }

    budgetHint.style.display = 'none';

    const blackWeightKg = price / BLACK_RATE;
    const blackWeightG = blackWeightKg * 1000;

    const yellowWeightKg = price / YELLOW_RATE;
    const yellowWeightG = yellowWeightKg * 1000;

    animateBudget(blackKg, blackWeightKg, 3, 700);
    animateBudget(yellowKg, yellowWeightKg, 3, 700);
    blackG.textContent = blackWeightG.toLocaleString('en-IN', { maximumFractionDigits: 1 });
    yellowG.textContent = yellowWeightG.toLocaleString('en-IN', { maximumFractionDigits: 1 });

    blackCalc.innerHTML = `<span class="num">₹${price.toLocaleString('en-IN')}</span> <span class="op">÷</span> <span class="num">₹${BLACK_RATE}</span><span class="op">=</span> <span class="num">${blackWeightKg.toFixed(3)} kg</span>`;
    yellowCalc.innerHTML = `<span class="num">₹${price.toLocaleString('en-IN')}</span> <span class="op">÷</span> <span class="num">₹${YELLOW_RATE}</span><span class="op">=</span> <span class="num">${yellowWeightKg.toFixed(3)} kg</span>`;

    budgetResult.classList.add('show');

    // little confetti burst
    launchConfetti();
}

budgetChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    budgetInput.value = chip.dataset.val;
    chip.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0.9)' },
        { transform: 'scale(1.08)' },
        { transform: 'scale(1)' }
    ], { duration: 300, easing: 'ease-out' });
    calculateBudget();
});

budgetInput.addEventListener('input', calculateBudget);
