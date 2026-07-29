
// ============ CALCULATOR 1: Weight → Price ============
const boxInput = document.getElementById('boxWeight');
const totalInput = document.getElementById('totalWeight');
const totalUnitToggle = document.getElementById('totalUnitToggle');
const typeSelect = document.getElementById('sarsoType');
const rateText = document.getElementById('rateText');
const result = document.getElementById('result');
const totalPriceEl = document.getElementById('totalPrice');
const oilWeightEl = document.getElementById('oilWeight');
const rateDisplayEl = document.getElementById('rateDisplay');
const per100gEl = document.getElementById('per100g');
const errorMsg = document.getElementById('errorMsg');
const sanityWarning = document.getElementById('sanityWarning');
const weightHint = document.getElementById('weightHint');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const quickChips = document.getElementById('quickChips');
const resetBtn = document.getElementById('resetBtn');
const langToggle = document.getElementById('langToggle');

const BOX_STORAGE_KEY = 'sarso_boxWeight';
const TYPE_STORAGE_KEY = 'sarso_type';
const LANG_STORAGE_KEY = 'sarso_lang';

let totalUnit = 'kg'; // 'kg' or 'g' — which unit the Total Weight field is currently showing
let currentLang = 'en';

function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
        || TRANSLATIONS.en[key] || key;
}

function updateTotalPlaceholder() {
    totalInput.placeholder = `${t('eg')} ${totalUnit === 'g' ? '515' : '0.515'}`;
}

function restoreLang() {
    try {
        const saved = localStorage.getItem(LANG_STORAGE_KEY);
        if (saved && TRANSLATIONS[saved]) currentLang = saved;
    } catch (e) { /* ignore */ }
}

function applyLanguage(lang) {
    currentLang = TRANSLATIONS[lang] ? lang : 'en';
    try { localStorage.setItem(LANG_STORAGE_KEY, currentLang); } catch (e) { /* ignore */ }

    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    document.querySelectorAll('.lang-btn').forEach(btn => { btn.classList.toggle('active', btn.dataset.lang === currentLang); });
    document.documentElement.lang = currentLang;

    updateTotalPlaceholder();
    calculate();
    calculateBudget();
}

langToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    applyLanguage(btn.dataset.lang);
});

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add('show');
    result.classList.remove('show');
    weightHint.style.display = 'none';
}
function hideError() { errorMsg.classList.remove('show'); }

function showWarning(msg) {
    sanityWarning.textContent = msg;
    sanityWarning.classList.add('show');
}
function hideWarning() { sanityWarning.classList.remove('show'); }

function updateWeightHint(show) {
    weightHint.style.display = show ? 'block' : 'none';
}

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

function getTotalInKg() {
    const raw = parseFloat(totalInput.value);
    if (isNaN(raw)) return NaN;
    return totalUnit === 'g' ? raw / 1000 : raw;
}

function saveLastValues() {
    try {
        if (boxInput.value !== '') localStorage.setItem(BOX_STORAGE_KEY, boxInput.value);
        localStorage.setItem(TYPE_STORAGE_KEY, typeSelect.value);
    } catch (e) { /* localStorage unavailable (e.g. private browsing) — ignore */ }
}

function restoreLastValues() {
    try {
        const savedBox = localStorage.getItem(BOX_STORAGE_KEY);
        const savedType = localStorage.getItem(TYPE_STORAGE_KEY);
        if (savedBox !== null) boxInput.value = savedBox;
        if (savedType !== null && Array.from(typeSelect.options).some(o => o.value === savedType)) {
            typeSelect.value = savedType;
        }
    } catch (e) { /* ignore */ }
}

totalUnitToggle.addEventListener('click', () => {
    const raw = parseFloat(totalInput.value);
    if (totalUnit === 'kg') {
        totalUnit = 'g';
        totalUnitToggle.textContent = 'G';
        totalInput.step = '1';
        if (!isNaN(raw)) totalInput.value = +(raw * 1000).toFixed(3);
    } else {
        totalUnit = 'kg';
        totalUnitToggle.textContent = 'KG';
        totalInput.step = '0.001';
        if (!isNaN(raw)) totalInput.value = +(raw / 1000).toFixed(3);
    }
    updateTotalPlaceholder();
    calculate();
});

let lastTotal = -1;
function calculate() {
    const box = parseFloat(boxInput.value);
    const total = getTotalInKg();
    const rate = parseFloat(typeSelect.value);
    const sarsoName = typeSelect.options[typeSelect.selectedIndex].text.split('—')[0].trim();

    rateText.textContent = `${t('rateTextPrefix')} ₹${rate} ${t('perKg')}`;
    saveLastValues();

    if (boxInput.value === '' && totalInput.value === '') {
        result.classList.remove('show');
        hideError();
        hideWarning();
        updateWeightHint(true);
        return;
    }

    if (isNaN(box) || isNaN(total)) {
        result.classList.remove('show');
        hideError();
        hideWarning();
        updateWeightHint(true);
        return;
    }

    if (box < 0 || total < 0) {
        showError(t('errNegative'));
        hideWarning();
        return;
    }
    if (total <= box) {
        showError(t('errTotalLessThanBox'));
        hideWarning();
        return;
    }

    hideError();
    updateWeightHint(false);

    // Soft sanity check: a "kg" value this large next to a tiny box is probably grams
    if (totalUnit === 'kg' && total > 50 && box < 2) {
        showWarning(t('warnGrams'));
    } else {
        hideWarning();
    }

    const oilWeight = total - box;
    const price = oilWeight * rate;
    const per100g = rate / 10;

    oilWeightEl.textContent = fmt(oilWeight);
    rateDisplayEl.textContent = rate;
    per100gEl.textContent = fmtPrice(per100g);
    animateNumber(totalPriceEl, price, 2, 700);

    step1.innerHTML = `<span class="num">${fmt(total)}</span><span class="unit-s">kg</span> <span class="op">−</span> <span class="num">${fmt(box)}</span><span class="unit-s">kg</span> <span class="op">=</span> <span class="num">${fmt(oilWeight)}</span><span class="unit-s">kg ${t('oilSuffix')}</span>`;
    step2.innerHTML = `<span class="num">${fmt(oilWeight)}</span><span class="unit-s">kg</span> <span class="op">×</span> <span class="num">₹${rate}</span><span class="unit-s">/kg</span> <span class="op">=</span> ...`;
    step3.innerHTML = `💰 ${t('totalWord')} = <span class="num">₹${fmtPrice(price)}</span> <span class="unit-s">(${sarsoName})</span>`;

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

resetBtn.addEventListener('click', () => {
    boxInput.value = '';
    totalInput.value = '';
    if (totalUnit === 'g') {
        totalUnit = 'kg';
        totalUnitToggle.textContent = 'KG';
        totalInput.step = '0.001';
    }
    updateTotalPlaceholder();
    lastTotal = -1;
    hideWarning();
    calculate();
});

boxInput.addEventListener('input', calculate);
totalInput.addEventListener('input', calculate);
typeSelect.addEventListener('change', calculate);

restoreLastValues();

// ============ CALCULATOR 2: Price → Weight (NEW) ============
const budgetInput = document.getElementById('budgetPrice');
const budgetChips = document.getElementById('budgetChips');
const budgetResult = document.getElementById('budgetResult');
const budgetHint = document.getElementById('budgetHint');

const blackKg = document.getElementById('blackKg');
const blackG = document.getElementById('blackG');
const blackCalc = document.getElementById('blackCalc');
const blackRateDisplay = document.getElementById('blackRateDisplay');

const yellowKg = document.getElementById('yellowKg');
const yellowG = document.getElementById('yellowG');
const yellowCalc = document.getElementById('yellowCalc');
const yellowRateDisplay = document.getElementById('yellowRateDisplay');

// Single source of truth: read rates from the <select> in Calculator 1 instead of duplicating them here.
// Matched by option order (not text), so this keeps working regardless of the active language.
const BLACK_RATE = parseFloat(typeSelect.options[0].value);
const YELLOW_RATE = parseFloat(typeSelect.options[1].value);
blackRateDisplay.textContent = `₹${BLACK_RATE}/kg`;
yellowRateDisplay.textContent = `₹${YELLOW_RATE}/kg`;

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

let lastBudgetPrice = -1;
let budgetConfettiTimer = null;

function calculateBudget() {
    const price = parseFloat(budgetInput.value);

    if (budgetInput.value === '' || isNaN(price) || price <= 0) {
        budgetResult.classList.remove('show');
        budgetHint.style.display = 'block';
        lastBudgetPrice = -1;
        clearTimeout(budgetConfettiTimer);
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

    // Debounced + change-guarded so rapid typing doesn't stack up bursts of confetti
    if (Math.abs(price - lastBudgetPrice) > 0.01) {
        lastBudgetPrice = price;
        clearTimeout(budgetConfettiTimer);
        budgetConfettiTimer = setTimeout(() => launchConfetti(), 300);
    }
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

// ============ INIT (after both calculators are wired) ============
restoreLang();
applyLanguage(currentLang);
