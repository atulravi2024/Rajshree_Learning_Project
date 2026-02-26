# 📜 RAJSHREE LEARNING — CHANGELOG (v14.0)

> *Full version history and migration records. Load during audits and reviews.*

---

## Version History

| Date | Version | Change |
|:---|:---|:---|
| 2026-02-23 | v12.0 | High-Precision Multi-Audit layout rules finalized. Flash card anchoring, dynamic scaling table, fit-screen column logic, slideshow protocol with lockdown, and 3D card flip system established. |
| 2026-02-24 | v13.0 | **CSS Modular Split** — Monolithic `style.css` (19KB) → Unified Modular Vault (8 files across 5 folders: `base/`, `layout/`, `features/`, `themes/`, `lang/`). Created `main.css` master loader with `@import`. Original file renamed to `style_backup_full.bak`. Updated `index.html` to link to `css/main.css`. |
| 2026-02-24 | v13.1 | **Full Audit** — Added complete Assets/Audio section (369 files, 6 categories). Documented CSS import order, all animation names, overlay navigation flow (Step 1→5), audio naming conventions. Added `samay_rang/` empty folder note. Fixed Z-Index map (added Overlay: 3000). |
| 2026-02-24 | v13.2 | **Re-Audit & Corrections** — Fixed JS loading order (added missing `utils/helpers.js` between Core and UI). Moved `blink-ring` animation from `animations.css` listing to `overlay.css` (where it actually lives). Corrected system audio file names: `final_*.mp3` (not `final_intro_*`), quiz files are `quiz_find_mango/red` (not `quiz_finish`), sub-category intros = 21 files. Intro count: 25 final + 4 main + 21 sub = 50 intros total. |
| 2026-02-24 | v13.3 | **Deep CSS Trigger Audit** — Added complete CSS Trigger & Interaction Map (Sections A-J). Documented all hover/active/click/class triggers, pseudo-elements (`.start-orb::before`), `:has()` selectors, card flip mechanism (`perspective: 2500px`, `.is-flipped`), dynamic JS-set variables (`--text-scale`, `--font-scale`, `--dynamic-emoji-size`), fit-screen overrides, neumorphic press effects, progress bar trigger (`.card.playing`). Flagged 2 duplicate `@keyframes` (happy-wiggle, title-zoom in both animations.css and navbar.css). |
| 2026-02-24 | v14.0 | **Hybrid Memory Split** — Single 26KB `PROJECT_MEMORY.md` split into 5 files using Frequency × Layer hybrid method. Core memory (6KB, always load) + 3 on-demand layer files (CSS 13KB, JS 4KB, Assets 5KB) + Archive changelog. Total: ~30KB across 5 files, but only 6KB loads per session. Cross-reference system added to core memory. |

---

## Architecture Decisions

### Why CSS Was Split (v13.0)
- Original `style.css` was 19KB monolith
- Adding more languages, age groups, and features would make it unmanageable
- Modular approach allows swapping themes without touching core code
- Each file can be loaded conditionally via JS in the future

### Why Memory Was Split (v14.0)
- Single `PROJECT_MEMORY.md` grew to 26KB after deep CSS audit
- Most sessions only need core rules (~6KB), not the full trigger map
- Frequency × Layer hybrid ensures minimal token usage per session
- Cross-references in core file guide Jarvis to load details on-demand

### Backup Strategy
- All original monolith files preserved with `.bak` extension
- `.bak` files are never loaded by browser or build tools
- Serve as rollback safety net if modular architecture has issues

---
*Last Updated: 2026-02-24 | v14.0 — Hybrid Memory Split*
