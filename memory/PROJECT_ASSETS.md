# 🔊 RAJSHREE LEARNING — ASSETS & FILES MAP (v14.0)

> *Audio library inventory, file trees, naming conventions, and backups. Load when managing assets.*

---

## Audio Library (369 total files)

| Folder | Sub-folders | File Count | Content |
|:---|:---|:---:|:---|
| `assets/audio/varnamala/` | `matra/` | **52** | Swar (vowels), Vyanjan (consonants), Samyukt akshar, Matra pronunciations |
| `assets/audio/ganit/` | `numbers/`, `shapes/`, `shapes_comparisons/`, `tables/`, `comparisons/` | **145** | Number pronunciations (1-100), Shape names, Comparison terms, Pahada (tables) |
| `assets/audio/mera_sansar/` | `animals/`, `body_parts/`, `family/`, `fruits_vegetables/`, `nature_habits/` | **21** | Family member names, Body parts, Animals, Fruits/Vegetables, Nature/Habits |
| `assets/audio/rangon_ka_sansar/` | `primary/`, `secondary/`, `natural/`, `pink_red/`, `blue_green/`, `brown_beige/`, `metallic/`, `special/` | **68** | All color category audio files (8 sub-groups) |
| `assets/audio/samay_prakriti/` | `din_maheene/`, `dishayen/`, `mausam/` | **23** | Days of week, Months, Directions, Weather/Seasons |
| `assets/audio/system/` | `intros/`, `effects/`, `quiz/` | **60** | Welcome audio, Category intros, Quiz sounds, Reward effects |

### System Audio Details
- **`system/intros/`** (50 files):
    - `final_*.mp3` — 25 category intro narrations (e.g., `final_swar.mp3`, `final_numbers_100.mp3`)
    - `intro_*.mp3` — 4 main category intros: `intro_varnamala.mp3`, `intro_ganit.mp3`, `intro_names.mp3`, `intro_samay.mp3`
    - `sub_*.mp3` — 21 sub-category narrations (e.g., `sub_animals.mp3`, `sub_blue_green.mp3`, `sub_tables.mp3`)
- **`system/effects/`** (3 files): `reward_excellent.mp3`, `reward_keep_going.mp3`, `reward_well_done.mp3`
- **`system/quiz/`** (5 files): `quiz_correct.mp3`, `quiz_wrong.mp3`, `quiz_start.mp3`, `quiz_find_mango.mp3`, `quiz_find_red.mp3`
- **`system/`** (1 file): `welcome_short.mp3`

### Audio Naming Convention
| Pattern | Example | Used For |
|:---|:---|:---|
| `v_<letter>_<word>.mp3` | `v_a_anar.mp3` | Varnamala (alphabet) audio |
| `num_<number>.mp3` | `num_42.mp3` | Number pronunciations |
| `shape_<name>.mp3` | `shape_circle.mp3` | Shape names |
| `comp_<name>.mp3` | `comp_greater.mp3` | Comparisons |
| `method_<num>.mp3` | `method_1_table_2.mp3` | Pahada (tables) |
| `final_<category>.mp3` | `final_swar.mp3` | Category intro narration |
| `sub_<subcategory>.mp3` | `sub_animals.mp3` | Sub-category narration |
| `intro_<main>.mp3` | `intro_ganit.mp3` | Main category intro |

---

## Backup Files
| File | Location | Status |
|:---|:---|:---|
| `style_backup_full.bak` | `css/` | ❌ Inactive (original CSS monolith, 19KB) |
| `data.js.bak` | `js/` | ❌ Inactive (original data monolith) |
| `script.js.bak` | `js/` | ❌ Inactive (original script monolith) |

---

## Complete Project File Tree
```
Rajshree Learning Project/
├── index.html
├── PROJECT_MEMORY.md          ← 🔴 Core memory (always load)
├── memory/
│   ├── PROJECT_CSS.md         ← 🟡 CSS details
│   ├── PROJECT_JS.md          ← 🟡 JS details
│   ├── PROJECT_ASSETS.md      ← 🟡 This file
│   └── PROJECT_CHANGELOG.md   ← 🟢 Version history
├── css/
│   ├── main.css               ← Master loader
│   ├── style_backup_full.bak  ← Inactive backup
│   ├── base/
│   │   ├── base.css           ← Variables, fonts, body
│   │   └── animations.css     ← All @keyframes
│   ├── layout/
│   │   ├── navbar.css         ← Navbar & dropdowns
│   │   ├── overlay.css        ← Welcome screen & orb
│   │   └── cards.css          ← Flashcard layouts
│   ├── features/
│   │   ├── navigation.css     ← Arrows, progress bar
│   │   └── counting.css       ← Number/category rules
│   ├── themes/
│   │   └── kids.css           ← Choice cards & gradients
│   └── lang/                  ← (empty — ready)
├── js/
│   ├── data.js.bak            ← Inactive backup
│   ├── script.js.bak          ← Inactive backup
│   ├── core/                  ← main.js, init.js
│   ├── ui/                    ← display.js
│   ├── navigation/            ← router.js
│   ├── slideshow/             ← controller.js
│   ├── utils/                 ← helpers.js
│   └── data/
│       ├── varnamala/         ← 4 files (swar, vyanjan, samyukt, matra)
│       ├── ganit/             ← 6 files (numbers, tables, shapes, comparisons)
│       ├── mera_sansar/       ← 7 files (family, body, animals, fruits, veg, habits)
│       ├── rangon_ka_sansar/  ← 8 files (8 color groups)
│       ├── samay_prakriti/    ← 4 files (days, months, directions, nature)
│       └── samay_rang/        ← (empty — reserved)
└── assets/audio/
    ├── varnamala/             ← 52 files + matra/
    ├── ganit/                 ← 145 files (numbers, shapes, tables, comparisons)
    ├── mera_sansar/           ← 21 files (animals, body, family, fruits, nature)
    ├── rangon_ka_sansar/      ← 68 files (8 color sub-groups)
    ├── samay_prakriti/        ← 23 files (din, disha, mausam)
    └── system/                ← 60 files (intros, effects, quiz, welcome)
```

---
*Last Updated: 2026-02-24 | v14.0 — Hybrid Memory Split*
