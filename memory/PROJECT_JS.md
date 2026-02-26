# ⚙️ RAJSHREE LEARNING — JS DETAIL MAP (v14.0)

> *JavaScript module architecture and data file map. Load when editing JS.*

---

## JS — Modular Script Architecture

### Core Modules
| Folder | Files | Purpose |
|:---|:---|:---|
| `js/core/` | `main.js`, `init.js` | App core logic and initialization |
| `js/ui/` | `display.js` | Card rendering and display logic |
| `js/navigation/` | `router.js` | Category navigation and step routing |
| `js/slideshow/` | `controller.js` | Slideshow automation, lockdown, and timing |
| `js/utils/` | `helpers.js` | Utility/helper functions |

### Data Modules (29 files)
| Folder | Files | Purpose |
|:---|:---|:---|
| `js/data/varnamala/` | `swar.js`, `vyanjan.js`, `samyukt.js`, `matra.js` | Hindi alphabet data (4 files) |
| `js/data/ganit/` | `numbers_10.js`, `numbers_100.js`, `tables_m1.js`, `tables_m2.js`, `shapes.js`, `comparisons.js` | Math/counting data (6 files) |
| `js/data/mera_sansar/` | `family.js`, `body_parts.js`, `animals_wild.js`, `animals_domestic.js`, `fruits.js`, `vegetables.js`, `habits.js` | World knowledge data (7 files) |
| `js/data/rangon_ka_sansar/` | `colors_primary.js`, `colors_secondary.js`, `colors_natural.js`, `colors_pink_red.js`, `colors_blue_green.js`, `colors_brown_beige.js`, `colors_metallic.js`, `colors_special.js` | Color category data (8 files) |
| `js/data/samay_prakriti/` | `days_week.js`, `months_year.js`, `directions.js`, `nature.js` | Time & Nature data (4 files) |
| `js/data/samay_rang/` | *(empty folder)* | Reserved/unused |

### HTML Script Loading Order (from `index.html`)
```
1. js/data/varnamala/swar.js
2. js/data/varnamala/vyanjan.js
3. js/data/varnamala/samyukt.js
4. js/data/varnamala/matra.js
5. js/data/ganit/numbers_10.js
6. js/data/ganit/numbers_100.js
7. js/data/ganit/tables_m1.js
8. js/data/ganit/tables_m2.js
9. js/data/ganit/shapes.js
10. js/data/ganit/comparisons.js
11. js/data/mera_sansar/family.js
12. js/data/mera_sansar/body_parts.js
13. js/data/mera_sansar/animals_wild.js
14. js/data/mera_sansar/animals_domestic.js
15. js/data/mera_sansar/fruits.js
16. js/data/mera_sansar/vegetables.js
17. js/data/mera_sansar/habits.js
18. js/data/rangon_ka_sansar/colors_primary.js
19. js/data/rangon_ka_sansar/colors_secondary.js
20. js/data/rangon_ka_sansar/colors_natural.js
21. js/data/rangon_ka_sansar/colors_pink_red.js
22. js/data/rangon_ka_sansar/colors_blue_green.js
23. js/data/rangon_ka_sansar/colors_brown_beige.js
24. js/data/rangon_ka_sansar/colors_metallic.js
25. js/data/rangon_ka_sansar/colors_special.js
26. js/data/samay_prakriti/days_week.js
27. js/data/samay_prakriti/months_year.js
28. js/data/samay_prakriti/directions.js
29. js/data/samay_prakriti/nature.js
--- Core & UI ---
30. js/core/main.js
31. js/core/init.js
32. js/utils/helpers.js
33. js/ui/display.js
34. js/navigation/router.js
35. js/slideshow/controller.js
```

### JS-Controlled CSS Classes (Applied Dynamically)
| Class | Applied To | Trigger | Purpose |
|:---|:---|:---|:---|
| `.is-flipped` | `.card` | Card click | Triggers 3D flip animation |
| `.active-menu-icon` | `.nav-link` | Category selection | Highlights active navbar icon |
| `.disabled` | `.nav-btn-side` | Slideshow active | Disables arrow buttons |
| `.disabled-nav` | `.nav-link` | Slideshow active | Disables navbar icons |
| `.playing` | `.card` | Audio playback | Shows progress bar |
| `.hidden` | Various | Step navigation | Shows/hides overlay steps |
| `.flex-wrap-counting` | `.emoji` | Counting categories | Enables multi-icon grid |
| `.special-hundred` | `.card` | Number 100 | Golden celebration styling |
| `.numbers_10-card` | `.card` | Numbers 1-10 category | Fit-screen word visibility exception |
| `.numbers_100-card` | `.card` | Numbers 1-100 category | Fit-screen icon-only + 50% scale |
| `.vyanjan-card` | `.card` | Vyanjan category | Fit-screen 70% density scaling |
| `grid-1` / `grid-3` / `vertical-scroll` / `fit-screen` | `.container` | Layout selection | Switches layout mode CSS variables |

---
*Last Updated: 2026-02-24 | v14.0 — Hybrid Memory Split*
