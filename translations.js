// Translation strings for the EN/Hindi language toggle.
// Units and numbers (kg, gram, ₹) are intentionally kept in English/Roman
// script in both languages, matching how they're commonly read in Indian retail.
const TRANSLATIONS = {
    en: {
        headerPart1: 'Good & Pure',
        headerHighlight: 'Cold Pressed',
        headerPart2: 'Sarso Oil',
        taglinePart1: 'Pure goodness, made with',
        taglinePart2: 'for your family',

        card1Title: 'Calculate Price from Weight',
        card2Title: 'Calculate Weight from Budget',
        resetBtn: 'Reset',
        resetBtnTitle: 'Clear this calculator',

        boxWeightLabel: 'Empty Box Weight',
        boxWeightPlaceholder: 'Enter in kg (e.g. 0.5)',
        boxWeightHint: '💡 Tip: 1000 gram = 1 kg. Enter in kg (e.g. 500g → 0.5 kg)',

        totalWeightLabel: 'Total Weight (Box + Oil)',
        totalWeightHint: '💡 Tip: a typical bottle/pouch total is around 100–1500 g (0.1–1.5 kg). Click the unit button to switch between kg and grams.',
        totalUnitToggleTitle: 'Click to switch between kg and grams',
        eg: 'e.g.',

        sarsoTypeLabel: 'Select Sarso Type',
        optionBlack: 'Black Sarso — ₹220 / kg',
        optionYellow: 'Yellow Sarso — ₹240 / kg',
        rateTextPrefix: 'Rate:',
        perKg: 'per kg',

        weightHintDefault: '✨ Enter both weights above to see your price!',
        errNegative: '⚠️ Weights cannot be negative',
        errTotalLessThanBox: '⚠️ Total weight must be greater than box weight',
        warnGrams: '🤔 That total looks large for kg — did you mean grams? Try the unit button next to the field.',

        totalPriceLabel: 'Total Price',
        oilWeightLabel: 'Oil Weight',
        rateLabel: 'Rate',
        per100gLabel: 'Per 100g',
        stepByStepTitle: '📐 Step-by-Step Calculation',
        totalWord: 'Total',
        oilSuffix: '(oil)',

        budgetLabel: 'How much oil do you want to buy?',
        budgetPricePlaceholder: 'Enter amount (e.g. 200)',
        budgetHintTip: "💡 Enter your budget — we'll tell you how much oil you'll get for both Black & Yellow Sarso",
        budgetHintDefault: "✨ Enter any amount above to see how much oil you'll get!",
        blackSarsoLabel: 'Black Sarso',
        yellowSarsoLabel: 'Yellow Sarso',

        footerText: '100% Natural • Cold Pressed • No Preservatives',
        langToggleTitle: 'Switch to Hindi'
    },
    hi: {
        headerPart1: 'बढ़िया और शुद्ध',
        headerHighlight: 'कोल्ड प्रेस्ड',
        headerPart2: 'सरसों तेल',
        taglinePart1: 'शुद्धता, बनाई गई',
        taglinePart2: 'आपके परिवार के लिए',

        card1Title: 'वज़न से कीमत निकालें',
        card2Title: 'बजट से वज़न निकालें',
        resetBtn: 'रीसेट',
        resetBtnTitle: 'इस कैलकुलेटर को साफ़ करें',

        boxWeightLabel: 'खाली डिब्बे का वज़न',
        boxWeightPlaceholder: 'kg में डालें (उदा. 0.5)',
        boxWeightHint: '💡 सुझाव: 1000 gram = 1 kg. kg में डालें (जैसे 500g → 0.5 kg)',

        totalWeightLabel: 'कुल वज़न (डिब्बा + तेल)',
        totalWeightHint: '💡 सुझाव: एक सामान्य बोतल/पाउच का कुल वज़न लगभग 100–1500 g (0.1–1.5 kg) होता है। kg और grams के बीच बदलने के लिए यूनिट बटन दबाएं।',
        totalUnitToggleTitle: 'kg और grams के बीच बदलने के लिए क्लिक करें',
        eg: 'उदा.',

        sarsoTypeLabel: 'सरसों का प्रकार चुनें',
        optionBlack: 'काली सरसों — ₹220 / kg',
        optionYellow: 'पीली सरसों — ₹240 / kg',
        rateTextPrefix: 'दर:',
        perKg: 'प्रति kg',

        weightHintDefault: '✨ अपनी कीमत देखने के लिए ऊपर दोनों वज़न डालें!',
        errNegative: '⚠️ वज़न नकारात्मक नहीं हो सकता',
        errTotalLessThanBox: '⚠️ कुल वज़न, डिब्बे के वज़न से ज़्यादा होना चाहिए',
        warnGrams: '🤔 kg के लिए यह मात्रा ज़्यादा लग रही है — क्या आपका मतलब grams से था? फ़ील्ड के बगल वाला यूनिट बटन आज़माएं।',

        totalPriceLabel: 'कुल कीमत',
        oilWeightLabel: 'तेल का वज़न',
        rateLabel: 'दर',
        per100gLabel: 'प्रति 100g',
        stepByStepTitle: '📐 चरण-दर-चरण गणना',
        totalWord: 'कुल',
        oilSuffix: '(तेल)',

        budgetLabel: 'आप कितना तेल खरीदना चाहते हैं?',
        budgetPricePlaceholder: 'राशि डालें (उदा. 200)',
        budgetHintTip: '💡 अपना बजट डालें — हम बताएंगे कि आपको काली और पीली सरसों दोनों में कितना तेल मिलेगा',
        budgetHintDefault: '✨ कितना तेल मिलेगा यह देखने के लिए ऊपर कोई भी राशि डालें!',
        blackSarsoLabel: 'काली सरसों',
        yellowSarsoLabel: 'पीली सरसों',

        footerText: '100% प्राकृतिक • कोल्ड प्रेस्ड • बिना परिरक्षक',
        langToggleTitle: 'अंग्रेज़ी में बदलें'
    }
};
