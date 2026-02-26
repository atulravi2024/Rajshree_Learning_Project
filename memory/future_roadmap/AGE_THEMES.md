# 🗺️ FUTURE ROADMAP — Age Theme Expansion Plan (v1.0)

> *Strategic plan for expanding Rajshree Learning to multiple age groups. Load when planning new themes or features.*

---

## 📚 Standard Child Age Categories

| Age | English Name | Hindi Name | Indian School Level | Learning Style |
|:---|:---|:---|:---|:---|
| 0-1 | Infant (शिशु) | नवजात | — | Sensory only |
| 1-3 | Toddler (टॉडलर) | बालक | — | Touch, sound, visual |
| 3-5 | **Preschooler (प्रीस्कूलर)** | **नर्सरी बच्चा** | **Nursery / LKG / UKG** | ✅ **CURRENT TARGET** |
| 5-7 | Early Schooler (अर्ली स्कूलर) | छोटा विद्यार्थी | **Class 1-2** | Reading, writing, basic math |
| 7-9 | Junior Schooler (जूनियर स्कूलर) | प्राथमिक विद्यार्थी | **Class 3-4** | Comprehension, logic, grammar |
| 9-12 | Senior Schooler (सीनियर स्कूलर) | वरिष्ठ विद्यार्थी | **Class 5-7** | Advanced concepts, reasoning |
| 12-15 | Adolescent (किशोर) | किशोर | **Class 8-10** | Abstract thinking, exams |

---

## 🎯 Planned Theme Split (4 Themes)

| Theme Name | Age Range | Class | Status |
|:---|:---|:---|:---|
| 🍼 **Toddler** (टॉडलर) | 1-3 yrs | Pre-Nursery | 🔵 Future (Phase 4) |
| 🧒 **Preschool** (प्रीस्कूल) | 3-5 yrs | Nursery / LKG / UKG | ✅ Built (current `kids.css`) |
| 📖 **Primary** (प्राइमरी) | 5-8 yrs | Class 1-3 | 🟡 Next (Phase 2) |
| 🎓 **Junior** (जूनियर) | 8-12 yrs | Class 4-7 | 🟡 Planned (Phase 3) |

### Build Priority:
1. 🧒 **Preschool** — ✅ Already built (rename `kids.css` → `preschool.css`)
2. 📖 **Primary** — Biggest market, Class 1-3 parents actively search for learning apps
3. 🎓 **Junior** — Final target, quiz-heavy, exam-prep oriented
4. 🍼 **Toddler** — Different UX entirely (no text, no buttons, tap-only)

---

## 💡 Feature Differences Per Theme

| Feature | 🍼 Toddler | 🧒 Preschool | 📖 Primary | 🎓 Junior |
|:---|:---|:---|:---|:---|
| **Text** | None | Single letter/word | Sentences | Paragraphs |
| **Card Front** | Icon only | Icon + Letter | Icon + Word + Meaning | Full content |
| **Icons** | Huge (10rem+) | Large (8rem) | Medium (5rem) | Small (3rem) |
| **Animations** | Slow, gentle | Bouncy, playful | Smooth, moderate | Minimal |
| **Audio** | Auto-play everything | Tap to play | Optional | Self-read mode |
| **Colors** | Ultra bright, high contrast | Bright pastels | Balanced | Clean/neutral |
| **Font** | — | Bubblegum Sans | Rounded (Outfit) | Standard (Hind) |
| **Navigation** | Swipe only (no buttons) | Big icon buttons | Dropdown menus | Full menu bar |
| **Interaction** | Tap = reward sound | Tap = flip card | Tap = quiz + learn | Quiz + typing |
| **Content** | Shapes, animals, sounds | Varnamala, counting, colors | Grammar, tables, GK | Stories, reasoning, exams |
| **Quiz** | No quiz | Simple (find the 🥭) | MCQ + match | MCQ + fill-in + timed |
| **Reward** | 🎉 Every tap | 🎉 Every correct | ⭐ Score-based | 📊 Leaderboard |

---

## 📁 Planned CSS Theme Files

```
css/themes/
├── preschool.css      ← Current kids.css (rename in Phase 2)
├── primary.css        ← New: Class 1-3 (Phase 2)
├── junior.css         ← New: Class 4-7 (Phase 3)
└── toddler.css        ← New: Pre-nursery (Phase 4)
```

---

## 📁 Planned Memory Structure (When 3+ Themes Exist)

```
memory/
├── PROJECT_MEMORY.md           ← 🔴 Core rules (always)
├── PROJECT_CSS_CORE.md         ← 🟡 Base, navbar, cards, features
├── PROJECT_CSS_THEMES.md       ← 🟡 All theme details (preschool/primary/junior)
├── PROJECT_JS.md               ← 🟡 JS modules
├── PROJECT_ASSETS.md           ← 🟡 Audio & files
├── PROJECT_CHANGELOG.md        ← 🟢 Archive
└── future_roadmap/
    └── AGE_THEMES.md           ← This file
```

---

## 🔑 Key Design Decision

> **Toddler requires a completely different UX** (no text, no menus, only tap-and-play). Primary and Junior can reuse the existing card/layout system with CSS-only theme changes. This is why Toddler is Phase 4.

---

## ⏳ Phase Timeline (Suggested)

| Phase | Theme | Key Deliverables | Dependencies |
|:---|:---|:---|:---|
| **Phase 1** ✅ | Preschool | Current app — Varnamala, Ganit, Mera Sansar, Samay & Rang | Done |
| **Phase 2** 🟡 | Primary (5-8) | `primary.css`, sentence-level content, grammar module, advanced tables | Rename `kids.css` → `preschool.css`, theme switcher in JS |
| **Phase 3** 🟡 | Junior (8-12) | `junior.css`, story module, reasoning quiz, timed tests, leaderboard | Quiz engine, scoring system |
| **Phase 4** 🔵 | Toddler (1-3) | `toddler.css`, completely new UX (swipe-only, auto-play, no text) | Separate navigation system |

---
*Created: 2026-02-24 | Roadmap v1.0 — Age Theme Expansion Strategy*
