# AGENTS.md - Rajshree Learning Project

A high-fidelity HTML/CSS/JS Hindi flashcard ecosystem for children (ages 3–5). Runs directly from `file://` or GitHub Pages. Zero frontend build requirement.

## 📁 System Architecture (Folder Structure)

```
Rajshree_Learning_Project/
├── frontend/               ← Learning UI Core
│   ├── assets/             ← Universal Multimedia (Audio/Images)
│   ├── desktop/            ← Desktop-specific application
│   ├── mobile/             ← Mobile-specific application
│   └── shared/             ← Common assets, data logic, and UI tokens
├── database/               ← Backend Data Repository
│   ├── excel/              ← Master .xlsx dataset & backups (DEMO ONLY)
│   ├── master_records/     ← Global/India city & state JSON datasets
│   └── schemas/            ← Python/JS database utility tools
├── backend/                ← Backend Core Logic
│   ├── tts_engine/         ← Edge-TTS generation engine (Madhur, Swara voices)
│   └── bg_music/           ← Background Music Assets (Loops & Themes)
├── scripts/                ← Advanced Operational Pipelines
│   ├── audio_pipeline/     ← Batch audio generation and audit tools
│   └── data_pipeline/      ← Data extraction and JS building tools
├── memory/                 ← Project Intelligence (12 Memory Domains)
│   ├── 00-11               ← System, State, Audit, AI, and Ethics
├── admin_panel/            ← Management Interface (Desktop/Mobile)
├── index.html              ← Main Entry Point
├── sitemap.xml             ← SEO Sitemap
└── robots.txt              ← Search Engine Instructions
```

---

## Critical Rules

### 🚨 NEVER DO
- Use `http://localhost:[PORT]` URLs
- Run `npm run dev` or similar (unless for backend/scripts)
- Use `fetch()` for local JSON/HTML files
- Commit absolute paths (`C:\...`, `/Users/...`)
- **NEVER** use Excel for backup, restore, or reading unless user manually says so.

### 🚨 FORBIDDEN ACTIONS
- **NEVER** use `http://localhost:[PORT]` for testing or viewing (Use `file:///` paths).
- **NEVER** use `fetch()` for local files; it fails in local filesystem environments.
- **NEVER** commit absolute computer paths (`C:\Users\...`). Use relative paths.

---

## 🧠 Memory Domains (00-11)

| Domain | Description |
|--------|-------------|
| **00 System & Guardrails** | Immutable laws, memory architecture (v17.2), and safety protocols. |
| **01 Current State** | Exhaustive technical documentation of current UI, registry, and playback standards. |
| **02 Research & Knowledge** | Deep analysis of schemas, TTS engines, and regional expansion roadmaps. |
| **03 Architecture & Planning** | Blueprints for project scaling, navigation logic, and infrastructure modularity. |
| **04 Sandbox & Demos** | Experimental UI prototypes and proof-of-concept features. |
| **05 Infrastructure & Workflows** | CI/CD pipelines, GitHub Actions, and deployment guides. |
| **06 Internal Audit** | Neural Hub for quality assurance, asset integrity, and link verification (v2.0). |
| **07 AI Training & Models** | Specific context and instruction sets for AI agents working in this repo. |
| **08 Protocol X** | Real-time state monitoring and heuristic logic for detecting project structural drift. |
| **09 Audio Script** | Master scripts for phoneme-perfect Hindi pronunciations and category intro scripts. |
| **10 MVP** | Minimum Viable Product scope, release criteria, and feature priorities. |
| **11 Security & Ethics** | Centralizes standards for child safety (COPPA), data privacy, and ethical AI development guidelines. |

---

## 🛠️ Build & Core Scripts

**Note: Frontend is static and requires no build.**

**Backend Pipelines (MANUAL/DEMO ONLY):**
- `node scripts/data_pipeline/build_database.js`: Syncs manual Excel changes to JS data objects (DEMO ONLY).
- `node scripts/data_pipeline/cat_excel.js`: Quickly checks columns and row samples from the master spreadsheet (DEMO ONLY).
- `node database/schemas/upgrade_excel.js`: Upgrades Excel files with new future-proof columns (DEMO ONLY).

**Operational Pipelines (FOR AI AGENTS):**

*Data & Manifests:*
- `python scripts/scan_project.py`: Generates the critical `asset_manifest.js` across multiple directories.
- `python scripts/data_pipeline/generate_india_js.py`: Extracts exhaustive Indian location data into the map layer.

*Audio Engineering:*
- `python scripts/generate_batch_audio.py`: Runs the massive TTS pipeline for category audio generation.
- `python scripts/generate_matra_audio.py`: Runs the specialized matra-completion TTS pipeline.

*Integrity & Audit:*
- `python scripts/audio_pipeline/refined_audit.py`: Performs high-resolution integrity checks on audio assets.
- `python scripts/analyze_audio_links.py`: Audits audio link integrity across the project database.
- `python scripts/find_missing_audio.py`: Identifies and reports missing audio assets for registry entries.

---

## 🧼 Code Style & Standards

### JavaScript
- **Global State**: Managed via `window.RAJSHREE_DATA` and `window.selectedCategory`.
- **Audio Paths**: Always use `window.AUDIO_BASE_PATH` for relative asset calculation.
- **Function Naming**: camelCase (e.g., `updateUI()`) with PascalCase for classes (e.g., `Segmenter`).

### CSS (Vanilla)
- **Glassmorphism**: Use variables like `--primary-pink` and `--border-radius-lg` defined in `base.css`.
- **Banners**: Consistent `is-hidden` and `active-link` classes for layout navigation.

---

## 🧠 Category Registry

| Domain | Modules |
|--------|---------|
| **Varnamala** | `swar.js`, `vyanjan.js`, `matra.js`, `samyukt.js` |
| **Ganit** | `numbers_10.js`, `numbers_100.js`, `shapes.js`, `comparisons.js`, `tables.js` |
| **Mera Sansar** | `parivar.js`, `sharir_ke_ang.js`, `kapde.js`, `ghar.js` |
| **Rangon Ka Sansar** | `primary_colors.js`, `secondary_colors.js` |
| **Samay & Prakriti** | `mosam.js`, `mausam.js`, `din_rat.js` |

---

## 🎙️ Audio & TTS Pipeline

- **Engine**: Microsoft Edge-TTS (Neural)
- **Primary Voices**:
  - `hi-IN-MadhurNeural`: Warm, child-friendly male voice.
  - `hi-IN-SwaraNeural`: Clear, expressive female voice.
  - `hi-IN-NeerjaExpressive`: High-fidelity expressive child voice.
- **Processing**: Matra-completion logic ensures phoneme-perfect pronunciation for compound Hindi characters.

---

## 🤝 Adding Categories

1. Create a new data JS file in `frontend/shared/data/<category>/`.
2. Reference the script in both `frontend/desktop/index.html` and `frontend/mobile/index.html` BEFORE logic scripts.
3. Register the new route in `frontend/desktop/js/navigation/router.js`.
4. Run `python scripts/scan_project.py` to update manifests.