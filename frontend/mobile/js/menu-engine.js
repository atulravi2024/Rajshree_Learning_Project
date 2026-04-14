/**
 * Rajshree Learning - Mobile Menu Engine
 * Centralized logic for multi-step navigation and menu styling.
 */

const menuState = {
    currentStep: 1,
    history: []
};

const MenuEngine = {
    init: function() {
        console.log("📂 Menu Engine Initialized");
        this.applyStyle();
        
        // Listen for storage changes to update style if changed in settings
        window.addEventListener('storage', (e) => {
            if (e.key === 'mobile_menu_style') {
                this.applyStyle();
            }
        });
    },

    applyStyle: function() {
        const style = localStorage.getItem('mobile_menu_style') || 'classic';
        const overlay = document.getElementById('menu-overlay');
        if (overlay) {
            overlay.setAttribute('data-menu-style', style);
        }
    },

    open: function() {
        if (typeof window.playInteractionSFX === 'function') window.playInteractionSFX();
        const menu = document.getElementById('menu-overlay');
        const welcome = document.getElementById('welcome-screen');
        
        if (menu) menu.classList.remove('hidden');
        if (welcome) welcome.classList.add('hidden');
        
        menuState.currentStep = 1;
        menuState.history = [];
        this.updateUI();

        const profile = localStorage.getItem('rajshree_active_profile') || 'rajshree';
        const welcomePath = `system/welcome/welcome_${profile}.mp3`;
        
        if (typeof window.playSound === 'function') {
            window.playSound(welcomePath).catch(() => {
                window.playSound('system/welcome/welcome_generic.mp3').catch(() => {
                    window.playSound('system/welcome_short.mp3');
                });
            });
        }
    },

    close: function() {
        if (typeof window.playInteractionSFX === 'function') window.playInteractionSFX();
        const menu = document.getElementById('menu-overlay');
        if (menu) menu.classList.add('hidden');
        if (typeof window.goHome === 'function') window.goHome();
    },

    back: function() {
        if (menuState.history.length > 0) {
            if (typeof window.playInteractionSFX === 'function') window.playInteractionSFX();
            const prevStep = menuState.history.pop();
            menuState.currentStep = prevStep.step;
            this.updateUI();
        } else {
            this.close();
        }
    },

    updateUI: function() {
        const steps = ['menu-step-1', 'menu-step-2', 'menu-step-3'];
        steps.forEach((s, i) => {
            const el = document.getElementById(s);
            if (el) el.classList.toggle('hidden', (i + 1) !== menuState.currentStep);
        });

        const backBtn = document.getElementById('menu-back');
        if (backBtn) {
            if (menuState.currentStep === 1) {
                backBtn.style.visibility = 'hidden';
            } else {
                backBtn.style.visibility = 'visible';
            }
        }

        const title = document.getElementById('menu-title');
        if (title && menuState.currentStep === 1) {
            title.innerText = 'विषय चुनें';
        }
    },

    showCategory: function(titleCat) {
        if (typeof window.playInteractionSFX === 'function') window.playInteractionSFX();
        menuState.history.push({ step: 1 });
        menuState.currentStep = 2;
        this.updateUI();

        const title = document.getElementById('menu-title');
        const container = document.getElementById('menu-step2-container');
        if (!container) return;
        container.innerHTML = '';

        const introFiles = {
            'varnamala': 'system/intros/intro_varnamala.mp3',
            'sankhya': 'system/intros/intro_ganit.mp3',
            'names': 'system/intros/intro_names.mp3',
            'games': 'system/intros/intro_games.mp3'
        };
        if (introFiles[titleCat] && typeof window.playSound === 'function') {
            window.playSound(introFiles[titleCat]);
        }

        if (titleCat === 'varnamala') {
            if (title) title.innerText = 'वर्णमाला के भाग';
            container.innerHTML = 
                this.createCard('अ', 'स्वर (Swar)', "MenuEngine.showSubCategory('swar')", 'vyanjan') +
                this.createCard('क', 'व्यंजन (Vyanjan)', "MenuEngine.showSubCategory('vyanjan')", 'swar') +
                this.createCard('🔗', 'संयुक्त अक्षर', "MenuEngine.showSubCategory('samyukt')", 'samyukt') +
                this.createCard('✍️', 'मात्रा ज्ञान', "MenuEngine.showSubCategory('matra')", 'magic');
        } else if (titleCat === 'sankhya') {
            if (title) title.innerText = 'गणित (Math)';
            container.innerHTML = 
                this.createCard('🧮', 'गिनती (Ginti)', "MenuEngine.showSubCategory('numbers_main')", 'swar') +
                this.createCard('📚', 'पहाड़े (Pahade)', "MenuEngine.showSubCategory('tables_main')", 'vyanjan') +
                this.createCard('📐', 'आकार-तुलना', "MenuEngine.showSubCategory('shapes_fun')", 'samyukt');
        } else if (titleCat === 'names') {
            if (title) title.innerText = 'मेरा संसार';
            container.innerHTML = 
                this.createCard('👨‍👩‍👧‍👦', 'हम और शरीर', "MenuEngine.showSubCategory('family_body')", 'swar') + 
                this.createCard('🦁', 'पशु और पक्षी', "MenuEngine.showSubCategory('animals_birds')", 'vyanjan') + 
                this.createCard('🍎', 'खान-पान', "MenuEngine.showSubCategory('food_drinks')", 'samyukt') + 
                this.createCard('🏡', 'आस-पास', "MenuEngine.showSubCategory('around_us')", 'magic') + 
                this.createCard('🌍', 'प्रकृति-समय', "MenuEngine.showSubCategory('nature_time')", 'swar') + 
                this.createCard('🎨', 'रंग और मज़ा', "MenuEngine.showSubCategory('colors_fun')", 'vyanjan');
        } else if (titleCat === 'games') {
            if (title) title.innerText = 'खेल-कूद (Games)';
            container.innerHTML = 
                this.createCard('🕵️', 'पहचानो कौन', "MenuEngine.selectCategory('games_identify')", 'vyanjan') + 
                this.createCard('🧩', 'सही मिलान', "MenuEngine.selectCategory('games_match')", 'swar') + 
                this.createCard('❓', 'पहेलियाँ', "MenuEngine.selectCategory('games_quiz')", 'magic') + 
                this.createCard('🃏', 'मेमोरी गेम', "MenuEngine.selectCategory('games_memory')", 'samyukt');
        }
    },

    showSubCategory: function(mainCat) {
        const directCats = ['swar', 'vyanjan', 'samyukt', 'matra', 'nature_final', 'directions_main', 'space_main', 'festivals_main'];
        if (directCats.includes(mainCat)) {
            this.selectCategory(mainCat);
            return;
        }

        if (typeof window.playInteractionSFX === 'function') window.playInteractionSFX();
        menuState.history.push({ step: 2 });
        menuState.currentStep = 3;
        this.updateUI();

        const title = document.getElementById('menu-title');
        const container = document.getElementById('menu-step3-container');
        if (!container) return;
        container.innerHTML = '';

        if (mainCat === 'numbers_main') {
            if (title) title.innerText = 'गिनती (Numbers)';
            container.innerHTML = 
                this.createCard('🧮', '१ - १०', "MenuEngine.selectCategory('numbers_10')", 'swar') + 
                this.createCard('💯', '१ - १००', "MenuEngine.selectCategory('numbers_100')", 'vyanjan');
        } else if (mainCat === 'tables_main') {
            if (title) title.innerText = 'पहाड़े (Tables)';
            container.innerHTML = 
                this.createCard('📝', 'पद्धति १', "MenuEngine.selectCategory('tables_10_m1')", 'samyukt') + 
                this.createCard('🎵', 'पद्धति २', "MenuEngine.selectCategory('tables_10_m2')", 'magic');
        } else if (mainCat === 'shapes_fun') {
            if (title) title.innerText = 'आकार और तुलना';
            container.innerHTML = 
                this.createCard('📐', 'आकार (Shapes)', "MenuEngine.selectCategory('shapes')", 'magic') + 
                this.createCard('⚖️', 'तुलना', "MenuEngine.selectCategory('comparisons')", 'vyanjan');
        } else if (mainCat === 'family_body') {
            if (title) title.innerText = 'हम और शरीर';
            container.innerHTML = 
                this.createCard('👨‍👩‍👧', 'रिश्ते', "MenuEngine.selectCategory('family')", 'swar') + 
                this.createCard('👃', 'शरीर के अंग', "MenuEngine.selectCategory('body_parts')", 'magic') + 
                this.createCard('🌟', 'अच्छी आदतें', "MenuEngine.selectCategory('habits')", 'vyanjan') + 
                this.createCard('🤩', 'भावनाएं', "MenuEngine.selectCategory('emotions')", 'samyukt') + 
                this.createCard('🤸', 'क्रियाएँ', "MenuEngine.selectCategory('actions')", 'swar');
        } else if (mainCat === 'animals_birds') {
            if (title) title.innerText = 'पशु और पक्षी';
            container.innerHTML = 
                this.createCard('🐄', 'पालतू', "MenuEngine.selectCategory('animals_domestic')", 'samyukt') + 
                this.createCard('🦁', 'जंगली', "MenuEngine.selectCategory('animals_wild')", 'vyanjan') + 
                this.createCard('🦎', 'छोटे जीव', "MenuEngine.selectCategory('animals_smaller')", 'magic') + 
                this.createCard('🦜', 'पक्षी', "MenuEngine.selectCategory('birds')", 'swar') + 
                this.createCard('🦋', 'कीड़े-मकोड़े', "MenuEngine.selectCategory('insects')", 'magic');
        } else if (mainCat === 'food_drinks') {
            if (title) title.innerText = 'खान-पान';
            container.innerHTML = 
                this.createCard('🍎', 'फल (Fruits)', "MenuEngine.selectCategory('fruits')", 'swar') + 
                this.createCard('🥦', 'सब्जियाँ', "MenuEngine.selectCategory('vegetables')", 'samyukt') + 
                this.createCard('😋', 'खाना-पीना', "MenuEngine.selectCategory('food')", 'magic');
        } else if (mainCat === 'around_us') {
            if (title) title.innerText = 'हमारा आस-पास';
            container.innerHTML = 
                this.createCard('🏠', 'घर का सामान', "MenuEngine.selectCategory('objects')", 'swar') + 
                this.createCard('👗', 'कपड़े', "MenuEngine.selectCategory('clothes')", 'vyanjan') + 
                this.createCard('🧸', 'खिलौने', "MenuEngine.selectCategory('toys')", 'magic') + 
                this.createCard('🚌', 'यातायात', "MenuEngine.selectCategory('vehicles')", 'samyukt') + 
                this.createCard('🏫', 'जगहें', "MenuEngine.selectCategory('places')", 'swar') + 
                this.createCard('👨‍🚒', 'सहायक', "MenuEngine.selectCategory('helpers')", 'vyanjan');
        } else if (mainCat === 'nature_time') {
            if (title) title.innerText = 'प्रकृति और समय';
            container.innerHTML = 
                this.createCard('⛅', 'मौसम', "MenuEngine.selectCategory('nature')", 'swar') + 
                this.createCard('🚀', 'अंतरिक्ष', "MenuEngine.selectCategory('space')", 'vyanjan') + 
                this.createCard('📅', 'दिन', "MenuEngine.selectCategory('days_week')", 'magic') + 
                this.createCard('🗓️', 'महीने', "MenuEngine.selectCategory('months_year')", 'samyukt') + 
                this.createCard('🧭', 'दिशाएं', "MenuEngine.selectCategory('directions')", 'swar') + 
                this.createCard('🌿', 'प्राकृतिक रंग', "MenuEngine.selectCategory('colors_natural')", 'vyanjan');
        } else if (mainCat === 'colors_fun') {
            if (title) title.innerText = 'रंग और मज़ा';
            container.innerHTML = 
                this.createCard('🌈', 'रंगों का संसार', "MenuEngine.showSubCategory('colors_main')", 'magic') + 
                this.createCard('⚽', 'खेल', "MenuEngine.selectCategory('games')", 'swar') + 
                this.createCard('🥁', 'वाद्य यंत्र', "MenuEngine.selectCategory('instruments')", 'vyanjan') + 
                this.createCard('🔔', 'आवाज़ें', "MenuEngine.selectCategory('sounds')", 'magic') + 
                this.createCard('🪔', 'त्योहार', "MenuEngine.selectCategory('festivals')", 'samyukt') + 
                this.createCard('🧚‍♀️', 'जादुई दुनिया', "MenuEngine.selectCategory('magic')", 'swar') + 
                this.createCard('💭', 'कल्पना', "MenuEngine.selectCategory('imagination')", 'vyanjan');
        } else if (mainCat === 'colors_main') {
            if (title) title.innerText = 'रंगों का संसार';
            container.innerHTML = 
                this.createCard('❤️', 'प्राथमिक (Primary)', "MenuEngine.selectCategory('colors_primary')", 'swar') + 
                this.createCard('💚', 'द्वितीयक (Secondary)', "MenuEngine.selectCategory('colors_secondary')", 'vyanjan') + 
                this.createCard('🌿', 'प्राकृतिक (Natural)', "MenuEngine.selectCategory('colors_natural')", 'samyukt') + 
                this.createCard('🌈', 'रंगों का सागर', "MenuEngine.showSubCategory('colors_world_main')", 'magic');
        } else if (mainCat === 'colors_world_main') {
            if (title) title.innerText = 'रंगों का सागर';
            container.innerHTML = 
                this.createCard('🌸', 'गुलाबी और लाल', "MenuEngine.selectCategory('colors_pink_red')", 'swar') + 
                this.createCard('🌊', 'नीले और हरे', "MenuEngine.selectCategory('colors_blue_green')", 'vyanjan') + 
                this.createCard('🟫', 'भूरे और बादामी', "MenuEngine.selectCategory('colors_brown_beige')", 'samyukt') + 
                this.createCard('✨', 'चमकीले और धातु', "MenuEngine.selectCategory('colors_metallic')", 'vyanjan') + 
                this.createCard('🔮', 'अन्य विशेष रंग', "MenuEngine.selectCategory('colors_special')", 'swar');
        }
    },

    selectCategory: function(category) {
        if (typeof window.stopCurrentAudio === 'function') window.stopCurrentAudio();
        if (typeof window.playInteractionSFX === 'function') window.playInteractionSFX();
        
        const menu = document.getElementById('menu-overlay');
        if (menu) menu.classList.add('hidden');

        if (window.state) {
            window.state.currentCategoryName = category;
            window.state.currentIndex = 0;
            localStorage.setItem('mobile_currentCategory', category);
            localStorage.setItem('mobile_currentIndex', 0);
        }
        
        if (typeof window.loadData === 'function') window.loadData();
        if (typeof window.startApp === 'function') window.startApp(true);

        const finalIntroFiles = {
            'swar': 'system/intros/final_swar.mp3', 'vyanjan': 'system/intros/final_vyanjan.mp3', 'samyukt': 'system/intros/final_samyukt.mp3', 'matra': 'system/intros/final_matra.mp3',
            'numbers_10': 'system/intros/final_numbers_10.mp3', 'numbers_100': 'system/intros/final_numbers_100.mp3',
            'tables_10_m1': 'system/intros/final_tables_m1.mp3', 'tables_10_m2': 'system/intros/final_tables_m2.mp3',
            'shapes': 'system/intros/final_shapes.mp3', 'comparisons': 'system/intros/final_comparisons.mp3',
            'family': 'system/intros/final_family.mp3', 'body_parts': 'system/intros/final_body_parts.mp3',
            'animals_domestic': 'system/intros/final_animals_domestic.mp3', 'animals_wild': 'system/intros/final_animals_wild.mp3',
            'fruits': 'system/intros/final_fruits.mp3', 'vegetables': 'system/intros/final_vegetables.mp3',
            'habits': 'system/intros/final_habits.mp3', 'days_week': 'system/intros/final_days_week.mp3', 'months_year': 'system/intros/final_months_year.mp3',
            'nature': 'system/intros/final_nature.mp3', 'directions': 'system/intros/final_directions.mp3', 'space': 'system/intros/final_nature.mp3', 'festivals': 'system/intros/final_nature.mp3',
            'colors_primary': 'system/intros/final_colors_primary.mp3', 'colors_secondary': 'system/intros/final_colors_secondary.mp3', 'colors_natural': 'system/intros/final_colors_natural.mp3',
            'colors_pink_red': 'system/intros/sub_pink_red.mp3', 'colors_blue_green': 'system/intros/sub_blue_green.mp3', 'colors_brown_beige': 'system/intros/sub_brown_beige.mp3', 'colors_metallic': 'system/intros/sub_metallic.mp3', 'colors_special': 'system/intros/sub_special.mp3'
        };

        if (finalIntroFiles[category] && typeof window.playSound === 'function') {
            setTimeout(() => window.playSound(finalIntroFiles[category]), 300);
        }
    },

    createCard: function(icon, label, onClick, colorClass = '') {
        return `<div class="menu-card ${colorClass}" onclick="${onClick}">
                    <div class="menu-card-icon">${icon}</div>
                    <div class="menu-card-label">${label}</div>
                </div>`;
    }
};

// Global Exposure
window.openMenu = () => MenuEngine.open();
window.closeMenu = () => MenuEngine.close();
window.backMenu = () => MenuEngine.back();
window.showMobileCategory = (cat) => MenuEngine.showCategory(cat);
window.showMobileSubCategory = (cat) => MenuEngine.showSubCategory(cat);
window.selectMobileCategory = (cat) => MenuEngine.selectCategory(cat);

document.addEventListener('DOMContentLoaded', () => MenuEngine.init());
