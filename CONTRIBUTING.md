# 🤝 Contributing to Rajshree Learning Project

Thank you for your interest in contributing! This guide explains how to add new categories, audio files, themes, and more.

---

## 📋 Before You Start

- Read the [README.md](README.md) to understand the project.
- Check existing [Issues](https://github.com/atulravi2024/Rajshree_Learning_Project/issues) to avoid duplicating work.
- For major changes, open an Issue first to discuss.

---

## 🌿 Branch & Workflow Rules

| Branch | Purpose |
|:---|:---|
| `main` | Stable production code — do **not** push directly |
| `dev` | Active development — base your work here |
| `feature/*` | New features (e.g., `feature/new-category-vegetables`) |
| `fix/*` | Bug fixes (e.g., `fix/audio-not-playing`) |

**Steps:**
```bash
# 1. Fork and clone the repo
git clone https://github.com/atulravi2024/Rajshree_Learning_Project.git

# 2. Create your branch from main
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git add .
git commit -m "feat(scope): your short description"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

---

## 📝 Commit Message Convention

Use this format for all commits:

```
<type>(<scope>): <short description>
```

| Type | When to Use |
|:---|:---|
| `feat` | Adding a new feature or category |
| `fix` | Bug fixes |
| `style` | CSS/UI changes only (no logic) |
| `refactor` | Code restructuring |
| `docs` | README, CONTRIBUTING, or memory file updates |
| `audio` | Adding or updating audio files |
| `chore` | Config, tooling, or `.gitignore` changes |

**Examples:**
```
feat(ganit): add division category with 20 cards
fix(slideshow): prevent double audio on page switch
audio(mera_sansar): add 5 missing body_parts MP3 files
docs(readme): update project structure section
```

---

## ➕ How to Add a New Category

### 1. Add the Data File
Create a new JS file in the correct data folder:

```
js/data/<category_folder>/<new_category>.js
```

**File format:**
```javascript
const newCategoryData = [
  { letter: 'अ', emoji: '🍎', word: 'सेब', audio: 'v_a_seb.mp3' },
  // ... more items
];
```

### 2. Add the Script Tag to `index.html`
Add it in the correct loading order (data files load before core scripts):
```html
<script src="js/data/category_folder/new_category.js"></script>
```

### 3. Register the Category in Core JS
Update `js/core/main.js` to register the new category key and data array.

### 4. Add Audio Files
Place `.mp3` files in the matching audio folder:
```
assets/audio/<category_folder>/
```
Follow the naming convention (see below).

---

## 🔊 Audio File Naming Convention

| Pattern | Example | Used For |
|:---|:---|:---|
| `v_<letter>_<word>.mp3` | `v_a_anar.mp3` | Varnamala (alphabet) |
| `num_<number>.mp3` | `num_42.mp3` | Number pronunciations |
| `shape_<name>.mp3` | `shape_circle.mp3` | Shapes |
| `comp_<name>.mp3` | `comp_greater.mp3` | Comparisons |
| `method_<n>_table_<t>.mp3` | `method_1_table_2.mp3` | Multiplication tables |
| `final_<category>.mp3` | `final_swar.mp3` | Category intro narration |
| `sub_<subcategory>.mp3` | `sub_animals.mp3` | Sub-category narration |

---

## 🎨 How to Add a New CSS Theme

CSS themes live in `css/themes/`. To add a new age-group theme:

1. Create `css/themes/<theme-name>.css`
2. Add the `@import` line to `css/main.css`
3. Apply the theme class via JS on the `<body>` or a wrapper element

---

## ✅ Pull Request Checklist

Before submitting your PR, make sure:

- [ ] Code works in Chrome, Firefox, and Edge
- [ ] Audio files follow the naming convention
- [ ] No absolute paths (`C:\...`) in any file
- [ ] No `.bak` files or editor folders included
- [ ] Commit messages follow the convention
- [ ] `GITHUB_CHANGELOG.md` updated if it's a significant change

---

## ❓ Questions?

Open an [Issue](https://github.com/atulravi2024/Rajshree_Learning_Project/issues) with the label `question`.
