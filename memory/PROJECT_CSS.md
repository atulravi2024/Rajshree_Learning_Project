# 🎨 RAJSHREE LEARNING — CSS DETAIL MAP (v14.2)

> Synced with current software CSS files on 2026-02-26.
> This memory file now mirrors the active CSS architecture and behavior.

---

## CSS — Unified Modular Architecture
- **Entry Point**: `css/main.css` (master loader via `@import`)
- **Backup**: `css/style_backup_full.bak` (exists, inactive)

| Folder | File | Purpose |
|:---|:---|:---|
| `css/base/` | `base.css` | Global fonts, CSS variables (`:root`), body reset/layout |
| `css/base/` | `animations.css` | Shared animation selectors + keyframes |
| `css/layout/` | `navbar.css` | Navbar layout, branding animation, dropdowns |
| `css/layout/` | `overlay.css` | Welcome overlay, floating icons, start orb |
| `css/layout/` | `cards.css` | Flashcard 3D system + grid/fit layouts |
| `css/features/` | `navigation.css` | Side arrows, disabled states, progress bar |
| `css/features/` | `counting.css` | Counting/fitscreen special behavior (1-10, 1-100, vyanjan) |
| `css/themes/` | `kids.css` | Choice card theme + submenu gradients + back button |
| `css/` | `main.css` | Import order controller |

---

## `main.css` Import Order (Current)
```css
1. @import "base/base.css";
2. @import "base/animations.css";
3. @import "layout/navbar.css";
4. @import "layout/overlay.css";
5. @import "layout/cards.css";
6. @import "features/navigation.css";
7. @import "features/counting.css";
8. @import "themes/kids.css";
```

---

## Current File Line Counts (Software Source of Truth)
| File | Lines |
|:---|---:|
| `css/main.css` | 18 |
| `css/base/base.css` | 27 |
| `css/base/animations.css` | 35 |
| `css/layout/navbar.css` | 59 |
| `css/layout/overlay.css` | 58 |
| `css/layout/cards.css` | 80 |
| `css/features/navigation.css` | 25 |
| `css/features/counting.css` | 81 |
| `css/themes/kids.css` | 55 |

---

## Trigger & Interaction Map (Synced)

### A) `css/base/base.css`
- Google Fonts import: Outfit, Hind, Bubblegum Sans
- `:root` variables:
  - `--primary-pink`, `--light-pink`, `--soft-blue`, `--deep-purple`, `--vibrant-orange`, `--warm-yellow`, `--soft-green`
  - `--border-radius-lg`, `--border-radius-md`, `--nav-height`
- `body`:
  - gradient background, flex column, centered alignment
  - `min-height: 100vh`, `overflow-x: hidden`, zero margin/padding

### B) `css/base/animations.css`
- Active selectors:
  - `.emoji-animate` → `playful-bounce`
  - `.card:hover .emoji` → `emoji-wiggle` (`!important`)
  - `.rocket-icon` → `rocket-ready`
  - `.start-orb:hover .rocket-icon` → `rocket-launch`
- Keyframes defined:
  - `playful-bounce`
  - `emoji-wiggle`
  - `happy-wiggle`
  - `title-zoom`
  - `rocket-ready`
  - `rocket-launch`
  - `float-bubble`
  - `bounce-soft`
  - `celebrate-hundred`

### C) `css/layout/navbar.css`
- `.navbar`: fixed top glass bar, blur, border, shadow, high z-index
- `.logo-with-icon`, `.baby-icon`, `.logo-text`
- `.baby-icon` animation uses `happy-wiggle`
- `.nav-logo .hi` animation uses `title-zoom`
- `.nav-logo .en` subtitle styling
- `.nav-menu-container`, `.nav-menu`, `.nav-link.icon-only`
- Hover interactions:
  - `.nav-link.icon-only:hover` scale/lift
  - `.dropdown:hover .dropdown-content` show/animate dropdown
  - `.dropdown-content a:hover` color/bg highlight
- JS state classes:
  - `.active-menu-icon`
- Includes duplicate keyframes:
  - `happy-wiggle`
  - `title-zoom`

### D) `css/layout/overlay.css`
- `#overlay` full-screen centered intro layer
- `#step-1` to `#step-5` shared flex setup
- `.floating-icons` + `.float-icon` (`float-bubble`)
- `.welcome-title`
- `.start-orb` + hover scaling/rotation
- `.start-orb::before` blinking red ring (`blink-ring`)

### E) `css/layout/cards.css`
- `.main-content`, `.learning-wrapper`, `.container`
- 3D card system:
  - `.card`, `.card-inner`, `.card.is-flipped .card-inner`
  - `.card-front`, `.card-back`
  - hover glow on front/back
- Core content selectors:
  - `.letter`, `.emoji`, `.word`, `.text-group`
- Dynamic layout variable presets:
  - `.container.grid-1`
  - `.container.grid-3`
  - `.container.vertical-scroll`
  - `.container.fit-screen`
- Grid/fitscreen overrides:
  - `.grid-3 .card`
  - `.vertical-scroll .card`
  - `.fit-screen .card`

### F) `css/features/navigation.css`
- `.nav-btn-side` default style
- interactions:
  - `.nav-btn-side:hover`
  - `.nav-btn-side:active`
- variants/states:
  - `.nav-btn-side.large-arrows`
  - `.nav-btn-side.disabled`
  - `.nav-link.disabled-nav`
- icon styling:
  - `.nav-btn-side svg`
  - `.nav-btn-side:hover svg`
- progress system:
  - `.progress-container`, `.progress-bar`, `.card.playing .progress-container`
- utility/media:
  - `.hidden`
  - `.flash-image`

### G) `css/features/counting.css`
- counting grid wrapper:
  - `.emoji.flex-wrap-counting`
  - `.emoji.flex-wrap-counting span`
- small count centering with `:has(...)`
- fitscreen word rules:
  - global hide: `.fit-screen .card-front .word`
  - exceptions for `.numbers_10-card` and `.numbers_100-card`
- `numbers_100` front-side specialization:
  - centered front
  - hide `.text-group`
  - emoji at 50% scale
- `vyanjan` fit-screen specialization:
  - emoji and letter at 70% scale
- special 100 card highlight:
  - `.special-hundred .card-front`
  - `.special-hundred .emoji` with `celebrate-hundred`

### H) `css/themes/kids.css`
- `.choice-grid` horizontal scroll layout (scrollbar hidden)
- `.kid-choice-card` + hover effect
- `.choice-icon` (`bounce-soft`) + `.choice-label-hi`
- themed cards:
  - `.kid-choice-card.swar`
  - `.kid-choice-card.vyanjan`
  - `.kid-choice-card.samyukt`
  - `.kid-choice-card.magic`
  - `.kid-choice-card.colors`
- back button:
  - `button.nav-link`
  - `button.nav-link:hover`

---

## Dynamic CSS Variables (Used Across CSS)
| Variable | Source | Primary Usage |
|:---|:---|:---|
| `--emoji-size` | layout container classes | `.emoji` font-size |
| `--letter-size` | layout container classes | `.letter` font-size |
| `--word-size` | layout container classes | `.word` font-size |
| `--text-scale` | JS runtime variable | `.text-group` transform scale |
| `--dynamic-emoji-size` | JS runtime variable | counting grid spans |

---

## Known Structural Notes (Current)
1. **Duplicate keyframes intentionally present in two files**:
   - `happy-wiggle` in `animations.css` and `navbar.css`
   - `title-zoom` in `animations.css` and `navbar.css`
2. **Cross-file animation usage**:
   - `float-bubble` defined in `animations.css`, used in `overlay.css`
   - `bounce-soft` defined in `animations.css`, used in `kids.css`
   - `celebrate-hundred` defined in `animations.css`, used in `counting.css`
3. **Backup file exists**:
   - `css/style_backup_full.bak` found and unchanged

---

*Last Synced: 2026-02-26 | v14.2 — Memory CSS aligned to software CSS source files*