# Sarso Oil Calculator — Review & Improvement Plan

> ✅ **Status: All items below have been implemented and verified** (`index.html`, `anubhav.js`, `anubhav.css`) — including the "nice-to-have" usability list. Verified with an automated headless-browser pass: all 8 scripted checks passed (correct pricing, unit toggle round-trip, sanity warning firing, stale-error-clears-on-edit, reset button, label→focus accessibility, single-source rate display, and confetti debounced to one burst per settled value) with zero console errors. This document is kept as a record of what was found and fixed.

## Confirmed Bugs (Priority Order)

### 1. Wrong / weird price shown ⚠️ Must-fix
- **Root cause:** `index.html:71` — the "Total Weight" placeholder is `"e.g. 15.0"`, but the box-weight quick chips (`index.html:59-64`) run 0.015–1 kg. A real oil pouch/bottle total should be roughly 0.1–1.5 kg, not 15. The placeholder implies the wrong scale, so a user naturally types the total in grams (or just a bigger number than intended) and gets a wildly wrong price with no warning.
- **Fix:** Change the placeholder to a realistic example (e.g. `"e.g. 0.515"`), add a unit-scale hint under the field matching the box field's existing hint (`index.html:57`), and add a soft sanity-check warning in `calculate()` (e.g. when `total > 50 && box < 2`) suggesting "did you mean kg, not grams?".

### 2. Confetti feels laggy / spammy ⚠️ Must-fix
- **Root cause:** `anubhav.js:220` runs `calculateBudget()` on every keystroke, and `calculateBudget()` unconditionally calls `launchConfetti()` (`anubhav.js:204`) every single time — 40 animated DOM nodes per call. Calculator 1 avoids this with a `lastTotal` change-detection guard (`anubhav.js:76, 119-122`), but calculator 2 has no equivalent, so typing a 3-digit budget fires 3 stacked 40-particle bursts back-to-back.
- **Fix:** Add a `lastBudgetPrice` guard around `anubhav.js:204`, mirroring calculator 1's pattern, so confetti only fires when the computed value actually changes.

### 3. Error message gets stuck ⚠️ Must-fix
- **Root cause:** `anubhav.js:91-94` — when exactly one of box/total is filled, `isNaN(box) || isNaN(total)` is true, and the code does `result.classList.remove('show'); return;` **without** calling `hideError()`. If an error was already showing (e.g. "Total weight must be greater than box weight"), it stays on screen even after the user starts fixing the input.
- **Fix:** Call `hideError()` immediately before that `return`.

### 4. Duplicate rate source of truth — Should-fix
- **Root cause:** The prices ₹220/₹240 are hardcoded twice: once in `index.html:79-80` (`<select>` option values, used by calculator 1) and again in `anubhav.js:157-158` (`BLACK_RATE`/`YELLOW_RATE` constants, used by calculator 2). If a price ever changes and only one spot is updated, the two calculators will silently disagree.
- **Fix:** Single source of truth — have calculator 2 read its rates from the `<select>` options (or introduce one shared `RATES` object both calculators reference).

### 5. Accessibility / mobile input gaps — Should-fix
- **Root cause:** No `<label for>` / `id` association anywhere in `index.html` (labels at lines 52, 69, 77, 121), so tapping label text doesn't focus the field and screen readers may not announce them together. None of the numeric inputs (lines 54, 71, 124) have `inputmode="decimal"`, which can suppress the decimal-point key on mobile numeric keypads — a real problem here since users must type decimals like `0.015`.
- **Fix:** Add matching `id`/`for` pairs on all label/input pairs, and add `inputmode="decimal"` to all three `<input type="number">` fields.

### 6. No empty/partial-state hint in calculator 1 — Should-fix
- **Root cause:** Calculator 2 shows a friendly `budgetHint` (`index.html:166`) when empty. Calculator 1 has no equivalent — a user who's filled in only one of the two required fields sees nothing at all, which can read as "broken."
- **Fix:** Add a hint element under calculator 1's fields, shown whenever the calculation isn't yet possible, mirroring `budgetHint`'s behavior.

### 7. Small tap targets on quick-select chips — Nice-to-have
- **Root cause:** `.quick-chips .chip` (`anubhav.css:403-414`) uses `padding: 6px 12px` at `font-size: 0.78rem`, likely smaller than the ~44px recommended touch target — relevant since this app is mainly used one-handed on a phone at a shop counter.
- **Fix:** Increase padding/font-size slightly for the chip buttons on mobile breakpoints.

## Usability Improvements (Nice-to-Have)

| # | Suggestion | Why it helps |
|---|---|---|
| 1 | **Clear/Reset button** for calculator 1 | Shop staff reuse this page all day for different customers; currently both fields must be cleared by hand. |
| 2 | **Remember last-used Sarso type + box weight** (`localStorage`) | The same bottle/pouch is typically reused repeatedly in one sitting — no need to re-pick it every time. |
| 3 | **Show price-per-100g** alongside the total price | Lets a customer compare Black vs. Yellow value at a glance without doing mental math. |
| 4 | **Gram-entry toggle** for Total Weight (kg ⇄ g switch) | Removes the unit-confusion risk at the input level rather than relying on copy alone — directly related to Bug #1. |
| 5 | **Larger tap targets for chips** on mobile | Same motivation as Bug #7 — faster, more reliable taps at a shop counter. |

## Recommended Implementation Order

1. **Must-fix** (these directly explain what you're seeing today): #1 placeholder/scale fix, #2 confetti throttle, #3 stuck error message.
2. **Should-fix** (correctness & accessibility risk, not urgent but real): #4 duplicate rates, #5 labels/inputmode, #6 empty-state hint.
3. **Nice-to-have** (polish, tackle after the above are approved and shipped): #7 tap targets, plus the 5 usability suggestions above.

---
*Status: all bugs (#1–#7) and all usability suggestions (#1–#5) above have been implemented in `index.html`, `anubhav.js`, and `anubhav.css`, and verified end-to-end with an automated browser test (see top of document).*
