# AGENTS.md - Rajshree Learning Project

A pure HTML/CSS/JS Hindi flashcard app for preschool children (3-5 years). Runs from `file://` or GitHub Pages. **No build tools required** for frontend.

---

## Critical Rules

### 🚨 NEVER DO
- Use `http://localhost:[PORT]` URLs
- Run `npm run dev` or similar (unless for backend/scripts)
- Use `fetch()` for local JSON/HTML files
- Commit absolute paths (`C:\...`, `/Users/...`)

### ✅ ALWAYS DO
- Open via file path: `file:///path/to/index.html`
- Use relative paths for assets
- Use JavaScript template strings for inline components

---

## Build Commands

**Frontend (static):** No build needed. Open `index.html` directly.

**Backend Scripts:**
```bash
npm install
node scripts/data_pipeline/build_database.js     # Build data from Excel
node scripts/data_pipeline/cat_excel.js         # Extract categories
node database/schemas/upgrade_excel.js          # DB upgrade
```

**GitHub Actions:** Push to `main` auto-deploys to GitHub Pages.

---

## Code Style

### JavaScript

**Global State (window object):**
```javascript
window.selectedCategory = '';
window.currentLayout = '1';
window.AUDIO_BASE_PATH = 'assets/audio/';
```

**Data Files:**
```javascript
if (!window.RAJSHREE_DATA) window.RAJSHREE_DATA = {};
window.RAJSHREE_DATA.swar = [
    { letter: 'अ', word: 'अनार', emoji: '🍎', audio: 'varnamala/swar/v_a_anar.mp3' },
];
```

**DOM Guards:**
```javascript
const master = document.getElementById('master-container');
if (!master) return;
prevBtn?.classList.remove('hidden');
```

**Function Naming:**
- camelCase: `renderCards()`, `updateDisplay()`
- PascalCase: `Segmenter`, `ChildSafetyLock`
- Verb prefix: `playSound()`, `stopCurrentAudio()`

**Event Handling:**
```javascript
document.addEventListener('DOMContentLoaded', () => { /* init */ });
card.onclick = () => flipCard(card, data.audio);
```

### CSS

**Variables (base.css):**
```css
:root {
    --primary-pink: #FF1493;
    --light-pink: #FFDEE9;
    --border-radius-lg: 50px;
    --nav-height: 95px;
}
```

**Font Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Hind:wght@400;700&family=Bubblegum+Sans&display=swap');
```

**Class Naming:** kebab-case (`master-container`, `card-front`, `hidden`, `is-flipped`)

---

## Error Handling

**Audio:**
```javascript
currentAudio.addEventListener('error', () => {
    if (window.ChildSafetyLock) window.ChildSafetyLock.unlock();
    card.classList.remove('playing');
});
```

**DOM:**
```javascript
const master = document.getElementById('master-container');
if (!master) return;
```

**Scripts (try-catch):**
```javascript
try { xlsx.readFile(EXCEL_FILE); }
catch (e) { console.error('Build failed:', e.message); }
```

---

## Audio Naming

| Pattern | Example | Purpose |
|---------|---------|---------|
| `v_<letter>_<word>.mp3` | `v_a_anar.mp3` | Varnamala |
| `num_<number>.mp3` | `num_42.mp3` | Numbers |
| `final_<category>.mp3` | `final_swar.mp3` | Intro |
| `sub_<subcategory>.mp3` | `sub_animals.mp3` | Sub-category |

---

## Git Workflow

**Branches:** `main`, `dev`, `feature/*`, `fix/*`

**Commits:**
```
<type>(<scope>): <description>
Types: feat, fix, style, refactor, docs, audio, chore
```

---

## Adding Categories

1. Create `frontend/src/js/data/<category>/<name>.js`
2. Add script tag to `index.html` (before core scripts)
3. Register in navigation router
4. Add audio files to `assets/audio/<category>/`

---

## Child Safety

`ChildSafetyLock` handles:
- Parental gate (3s hold for settings)
- Interaction locking during audio
- Navigation safety in slideshow mode