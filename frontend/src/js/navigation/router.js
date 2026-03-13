/**
 * Navigation & Category Logic
 * Handles menu transitions, category switching, and intro audio.
 */

function showMainCategory(titleCat) {
    if (window.isSlideshowActive) return;
    const nav = document.getElementById('main-nav');
    if (nav) nav.classList.add('hidden');
    const lZone = document.getElementById('learning-zone');
    if (lZone) lZone.classList.add('hidden');
    const overlay = document.getElementById('overlay');
    if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }

    window.selectedTitle = titleCat;
    ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'].forEach(s => { const el = document.getElementById(s); if (el) el.classList.add('hidden'); });
    const step3 = document.getElementById('step-3');
    if (step3) step3.classList.remove('hidden');

    document.querySelectorAll('.nav-menu .nav-link').forEach(link => link.classList.remove('active-menu-icon'));
    const activeLink = document.getElementById('nav-' + titleCat);
    if (activeLink) {
        activeLink.classList.add('active-menu-icon');
        const iconSpan = activeLink.querySelector('.hi');
        const mainIcons = { 'varnamala': '📖', 'sankhya': '🧮', 'names': '🌎', 'samay': '🕐' };
        if (iconSpan && mainIcons[titleCat]) iconSpan.innerText = mainIcons[titleCat];
    }

    const introFiles = {
        'varnamala': 'system/intros/intro_varnamala.mp3',
        'sankhya': 'system/intros/intro_ganit.mp3',
        'names': 'system/intros/intro_names.mp3',
        'samay': 'system/intros/intro_samay.mp3'
    };
    if (introFiles[titleCat]) {
        stopCurrentAudio();
        window.currentAudio = new Audio(window.AUDIO_BASE_PATH + introFiles[titleCat]);
        window.currentAudio.volume = window.globalVolume;
        window.currentAudio.play();
    }

    const container = document.getElementById('step3-container');
    const title = document.getElementById('step3-title');
    if (!container || !title) return;
    container.innerHTML = '';

    if (titleCat === 'varnamala') {
        title.innerText = 'वर्णमाला के भाग';
        container.innerHTML = createChoiceCard('अ', 'स्वर (Swar)', 'swar') + createChoiceCard('क', 'व्यंजन (Vyanjan)', 'vyanjan') + createChoiceCard('🔗', 'संयुक्त अक्षर (Samyukt Akshar)', 'samyukt') + createChoiceCard('✍️', 'मात्रा ज्ञान', 'matra');
    } else if (titleCat === 'sankhya') {
        title.innerText = 'गणित (Math)';
        container.innerHTML = createChoiceCard('🧮', 'गिनती (Ginti)', 'numbers_main') + createChoiceCard('📚', 'पहाड़े (Pahade)', 'tables_main') + createChoiceCard('📐', 'आकार और तुलना', 'shapes_fun');
    } else if (titleCat === 'names') {
        title.innerText = 'मेरा संसार';
        container.innerHTML = createChoiceCard('👨‍👩‍👧‍👦', 'मेरा परिवार', 'family_main') + createChoiceCard('🦁', 'पशु-पक्षी', 'animals_main') + createChoiceCard('🥦', 'फल-सब्जियाँ', 'fruits_main') + createChoiceCard('🌟', 'अच्छी आदतें', 'habits_main') + createChoiceCard('📦', 'अन्य चीजें (More)', 'misc_main');
    } else if (titleCat === 'samay') {
        title.innerText = 'समय और रंग';
        container.innerHTML = createChoiceCard('🗓️', 'दिन और महीने', 'time_main') + createChoiceCard('🌈', 'रंगों का संसार', 'colors_main') + createChoiceCard('⛅', 'मौसम', 'nature_final') + createChoiceCard('🧭', 'दिशाएं', 'directions_main');
    }
}

function showSubCategory(mainCat) {
    if (window.isSlideshowActive) return;
    const subIntroFiles = {
        'swar': 'system/intros/sub_swar.mp3', 'vyanjan': 'system/intros/sub_vyanjan.mp3', 'samyukt': 'system/intros/sub_samyukt.mp3', 'matra': 'system/intros/sub_matra.mp3',
        'numbers_main': 'system/intros/sub_numbers.mp3', 'tables_main': 'system/intros/sub_tables.mp3', 'shapes_fun': 'system/intros/sub_shapes.mp3',
        'family_main': 'system/intros/sub_family.mp3', 'animals_main': 'system/intros/sub_animals.mp3', 'fruits_main': 'system/intros/sub_fruits.mp3', 'habits_main': 'system/intros/sub_habits.mp3',
        'time_main': 'system/intros/sub_time.mp3', 'colors_main': 'system/intros/sub_colors.mp3', 'nature_final': 'system/intros/sub_nature.mp3', 'directions_main': 'system/intros/sub_directions.mp3'
    };
    if (subIntroFiles[mainCat]) {
        stopCurrentAudio();
        window.currentAudio = new Audio(window.AUDIO_BASE_PATH + subIntroFiles[mainCat]);
        window.currentAudio.volume = window.globalVolume;
        window.currentAudio.play();
    }
    // Update nav icon to reflect the chosen subcategory
    const subIconMap = {
        'swar': 'अ', 'vyanjan': 'क', 'samyukt': '🔗', 'matra': '✍️',
        'numbers_main': '🧮', 'tables_main': '📚', 'shapes_fun': '📐',
        'family_main': '👨‍👩‍👧‍👦', 'animals_main': '🦁', 'fruits_main': '🥦', 'habits_main': '🌟', 'misc_main': '📦',
        'time_main': '🗓️', 'colors_main': '🌈', 'nature_final': '⛅', 'directions_main': '🧭'
    };
    const navLink = document.getElementById('nav-' + window.selectedTitle);
    if (navLink && subIconMap[mainCat]) {
        const iconSpan = navLink.querySelector('.hi');
        if (iconSpan) iconSpan.innerText = subIconMap[mainCat];
    }

    if (['swar', 'vyanjan', 'samyukt', 'matra', 'nature_final', 'directions_main'].includes(mainCat)) {
        const map = { 'nature_final': 'nature', 'directions_main': 'directions' };
        finishSetup(map[mainCat] || mainCat);
        return;
    }
    window.selectedMain = mainCat;
    const step3 = document.getElementById('step-3'); if (step3) step3.classList.add('hidden');
    const step4 = document.getElementById('step-4'); if (step4) step4.classList.remove('hidden');
    const container = document.getElementById('step4-container');
    const title = document.getElementById('step4-title');
    if (!container || !title) return;
    container.innerHTML = '';

    if (mainCat === 'numbers_main') {
        title.innerText = 'गिनती (Numbers)';
        container.innerHTML = createChoiceCardFinal('🧮', 'गिनती १ - १०', 'numbers_10', 'swar') + createChoiceCardFinal('💯', 'गिनती १ - १००', 'numbers_100', 'vyanjan');
    } else if (mainCat === 'tables_main') {
        title.innerText = 'पहाड़े (Tables)';
        container.innerHTML = createChoiceCardFinal('📝', 'पद्धति १ (Standard)', 'tables_10_m1', 'samyukt') + createChoiceCardFinal('🎵', 'पद्धति २ (Rhythmic)', 'tables_10_m2', 'magic');
    } else if (mainCat === 'shapes_fun') {
        title.innerText = 'आकार और तुलना';
        container.innerHTML = createChoiceCardFinal('📐', 'आकार (Shapes)', 'shapes', 'magic') + createChoiceCardFinal('⚖️', 'तुलना (Comparison)', 'comparisons', 'vyanjan');
    } else if (mainCat === 'family_main') {
        title.innerText = 'मेरा परिवार और मैं';
        container.innerHTML = createChoiceCardFinal('👨‍👩‍👧', 'रिश्ते (Relations)', 'family', 'swar') + createChoiceCardFinal('👃', 'शरीर के अंग', 'body_parts', 'magic');
    } else if (mainCat === 'animals_main') {
        title.innerText = 'पशु-पक्षी';
        container.innerHTML = createChoiceCardFinal('🐄', 'पालतू (Domestic)', 'animals_domestic', 'samyukt') + createChoiceCardFinal('🦁', 'जंगली (Wild)', 'animals_wild', 'vyanjan');
    } else if (mainCat === 'fruits_main') {
        title.innerText = 'फल और सब्जियाँ';
        container.innerHTML = createChoiceCardFinal('🍎', 'फल (Fruits)', 'fruits', 'swar') + createChoiceCardFinal('🥦', 'सब्जियाँ', 'vegetables', 'samyukt');
    } else if (mainCat === 'habits_main') {
        title.innerText = 'अच्छी आदतें';
        container.innerHTML = createChoiceCardFinal('🌟', 'अच्छी आदतें', 'habits', 'magic');
    } else if (mainCat === 'misc_main') {
        title.innerText = 'अन्य चीजें (More)';
        container.innerHTML = createChoiceCardFinal('🚌', 'यातायात', 'vehicles', 'swar') + createChoiceCardFinal('🤩', 'भावनाएं', 'emotions', 'vyanjan') + createChoiceCardFinal('👗', 'कपड़े', 'clothes', 'magic') + createChoiceCardFinal('🤸', 'क्रियाएँ', 'actions', 'samyukt') + createChoiceCardFinal('👨‍🚒', 'सहायक', 'helpers', 'swar');
    } else if (mainCat === 'time_main') {
        title.innerText = 'दिन and महीने';
        container.innerHTML = createChoiceCardFinal('📅', 'सप्ताह के दिन', 'days_week', 'vyanjan') + createChoiceCardFinal('🗓️', 'साल के महीने', 'months_year', 'swar');
    } else if (mainCat === 'colors_main') {
        title.innerText = 'रंगों के नाम';
        container.innerHTML = createChoiceCardFinal('❤️', 'प्राथमिक रंग (Primary)', 'colors_primary', 'swar') + createChoiceCardFinal('💚', 'द्वितीयक रंग (Secondary)', 'colors_secondary', 'vyanjan') + createChoiceCardFinal('🌿', 'प्राकृतिक रंग (Natural)', 'colors_natural', 'samyukt') + createChoiceCardDeep('🌈', 'रंगों का संसार', 'colors_world_main');
    }
}

function showDeepCategory(deepCat) {
    if (window.isSlideshowActive) return;
    const deepIntroFiles = { 'colors_world_main': 'system/intros/sub_colors.mp3' };
    if (deepIntroFiles[deepCat]) {
        stopCurrentAudio();
        window.currentAudio = new Audio(window.AUDIO_BASE_PATH + deepIntroFiles[deepCat]);
        window.currentAudio.volume = window.globalVolume;
        window.currentAudio.play();
    }
    const step4 = document.getElementById('step-4'); if (step4) step4.classList.add('hidden');
    const step5 = document.getElementById('step-5'); if (step5) step5.classList.remove('hidden');
    const container = document.getElementById('step5-container');
    const title = document.getElementById('step5-title');
    if (!container || !title) return;
    container.innerHTML = '';
    if (deepCat === 'colors_world_main') {
        title.innerText = 'रंगों का संसार';
        container.innerHTML = createChoiceCardFinalDeep('🌸', 'गुलाबी और लाल', 'colors_pink_red') + createChoiceCardFinalDeep('🌊', 'नीले और हरे', 'colors_blue_green') + createChoiceCardFinalDeep('🟫', 'भूरे और बादामी', 'colors_brown_beige') + createChoiceCardFinalDeep('✨', 'चमकीले और धातु', 'colors_metallic') + createChoiceCardFinalDeep('🔮', 'अन्य विशेष रंग', 'colors_special');
        // Update nav icon
        const navLink = document.getElementById('nav-' + window.selectedTitle);
        if (navLink) { const iconSpan = navLink.querySelector('.hi'); if (iconSpan) iconSpan.innerText = '🌈'; }
    }
}

function createChoiceCard(icon, label, category) {
    return `<div class="kid-choice-card vyanjan" onclick="showSubCategory('${category}')"><div class="choice-icon">${icon}</div><div class="choice-label-hi" style="font-size:2rem">${label}</div></div>`;
}
function createChoiceCardFinal(icon, label, category, colorClass = 'swar') {
    return `<div class="kid-choice-card ${colorClass}" onclick="finishSetup('${category}')"><div class="choice-icon">${icon}</div><div class="choice-label-hi" style="font-size:2rem">${label}</div></div>`;
}
function createChoiceCardDeep(icon, label, category) {
    return `<div class="kid-choice-card magic" onclick="showDeepCategory('${category}')"><div class="choice-icon">${icon}</div><div class="choice-label-hi" style="font-size:2rem">${label}</div></div>`;
}
function createChoiceCardFinalDeep(icon, label, category) {
    return `<div class="kid-choice-card swar" onclick="finishSetup('${category}')"><div class="choice-icon">${icon}</div><div class="choice-label-hi" style="font-size:2rem">${label}</div></div>`;
}

function finishSetup(category) {
    if (window.isSlideshowActive) return;
    window.selectedCategory = category;
    stopCurrentAudio();

    // 1. Instantly hide overlay and show Learning Zone
    const overlay = document.getElementById('overlay');
    const nav = document.getElementById('main-nav');
    const lZone = document.getElementById('learning-zone');

    if (overlay) {
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
    }
    if (nav) nav.classList.remove('hidden');
    if (lZone) {
        lZone.classList.remove('hidden');
        // 2. Instantly apply selection and render
        applySelection();
    }

    // 3. Trigger Intro Audio in the background
    const finalIntroFiles = {
        'swar': 'system/intros/final_swar.mp3', 'vyanjan': 'system/intros/final_vyanjan.mp3', 'samyukt': 'system/intros/final_samyukt.mp3', 'matra': 'system/intros/final_matra.mp3',
        'numbers_10': 'system/intros/final_numbers_10.mp3', 'numbers_100': 'system/intros/final_numbers_100.mp3',
        'tables_10_m1': 'system/intros/final_tables_m1.mp3', 'tables_10_m2': 'system/intros/final_tables_m2.mp3',
        'shapes': 'system/intros/final_shapes.mp3', 'comparisons': 'system/intros/final_comparisons.mp3',
        'family': 'system/intros/final_family.mp3', 'body_parts': 'system/intros/final_body_parts.mp3',
        'animals_domestic': 'system/intros/final_animals_domestic.mp3', 'animals_wild': 'system/intros/final_animals_wild.mp3',
        'fruits': 'system/intros/final_fruits.mp3', 'vegetables': 'system/intros/final_vegetables.mp3',
        'habits': 'system/intros/final_habits.mp3', 'days_week': 'system/intros/final_days_week.mp3', 'months_year': 'system/intros/final_months_year.mp3',
        'nature': 'system/intros/final_nature.mp3', 'directions': 'system/intros/final_directions.mp3',
        'colors_primary': 'system/intros/final_colors_primary.mp3', 'colors_secondary': 'system/intros/final_colors_secondary.mp3', 'colors_natural': 'system/intros/final_colors_natural.mp3',
        'colors_pink_red': 'system/intros/sub_pink_red.mp3', 'colors_blue_green': 'system/intros/sub_blue_green.mp3', 'colors_brown_beige': 'system/intros/sub_brown_beige.mp3', 'colors_metallic': 'system/intros/sub_metallic.mp3', 'colors_special': 'system/intros/sub_special.mp3'
    };

    if (finalIntroFiles[category]) {
        window.currentAudio = new Audio(window.AUDIO_BASE_PATH + finalIntroFiles[category]);
        window.currentAudio.volume = window.globalVolume;
        window.currentAudio.play();
    }

    // Update Icons
    const iconMap = {
        'swar': 'अ', 'vyanjan': 'क', 'samyukt': '🔗', 'matra': '✍️', 'numbers_10': '🧮', 'numbers_100': '💯', 'tables_10_m1': '📝', 'tables_10_m2': '🎵', 'shapes': '📐', 'comparisons': '⚖️',
        'family': '👨‍👩‍👧', 'body_parts': '👃', 'animals_domestic': '🐄', 'animals_wild': '🦁', 'nature': '⛅', 'fruits': '🍎', 'vegetables': '🥦', 'habits': '🌟', 'days_week': '📅', 'months_year': '🗓️', 'directions': '🧭',
        'colors_primary': '❤️', 'colors_secondary': '💚', 'colors_natural': '🌿', 'colors_pink_red': '🌸', 'colors_blue_green': '🌊', 'colors_brown_beige': '🟫', 'colors_metallic': '✨', 'colors_special': '🔮',
        'vehicles': '🚌', 'emotions': '🤩', 'clothes': '👗', 'actions': '🤸', 'helpers': '👨‍🚒'
    };
    const activeIcon = iconMap[category] || '📖';
    const activeLink = document.getElementById('nav-' + window.selectedTitle);
    if (activeLink) {
        const iconSpan = activeLink.querySelector('.hi');
        if (iconSpan) iconSpan.innerText = activeIcon;
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => link.classList.remove('active-menu-icon'));
        activeLink.classList.add('active-menu-icon');
    }
}
