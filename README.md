# 🎒 Rajshree Learning Project

<div align="center">

**An interactive Hindi flashcard learning app for preschool children (ages 3–5)**

[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue)](https://atulravi2024.github.io/Rajshree_Learning_Project/)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

</div>

---

## 📖 About

**Rajshree Learning** is a beautifully designed, audio-powered Hindi learning app built for young children. It uses interactive flashcards with emojis, letters, and Hindi pronunciations to make learning fun and engaging.

The app covers **4 main learning categories** across **25+ sub-categories** with **369 audio files**.

---

## ✨ Features

- 🔊 **Audio-Powered** — Every card plays the correct Hindi pronunciation
- 🃏 **3D Flip Cards** — Tap a card to reveal its back side
- 🎛️ **4 Layout Modes** — Single card, 3-card grid, scroll view, fit-screen
- 🎞️ **Auto Slideshow** — Hands-free learning mode with timing controls
- 📱 **Responsive Design** — Works on tablets and desktops
- 🌙 **Glassmorphism UI** — Modern, beautiful interface kids love

---

## 📚 Learning Categories

| Icon | Category | Hindi | Sub-categories |
|:---:|:---|:---|:---|
| 📖 | **Alphabet** | वर्णमाला | Vowels, Consonants, Conjunct Letters, Matras |
| 🧮 | **Math** | गणित | Numbers 1–10, Numbers 1–100, Tables ×1, Tables ×2, Shapes, Comparisons |
| 🌍 | **My World** | मेरा संसार | Family, Body Parts, Wild Animals, Domestic Animals, Fruits, Vegetables, Habits |
| ☀️ | **Time & Colors** | समय और रंग | Days, Months, Directions, Nature, Colors (8 sub-groups) |

---

## 🚀 How to Run Locally

No build tools or installation required. It's a pure HTML/CSS/JS app.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/atulravi2024/Rajshree_Learning_Project.git
   ```

2. **Open the app:**
   - Navigate to the project folder
   - Open `index.html` in any modern browser
   - Or use a local server (e.g., VS Code Live Server extension)

> **Note:** Audio files require the browser to allow local file access. Use a local server (like Live Server) for best results.

---

## 📁 Project Structure

```
Rajshree_Learning_Project/
├── index.html              ← App entry point
├── .gitignore
├── LICENSE
├── README.md               ← This file
├── CONTRIBUTING.md
├── css/
│   ├── main.css            ← Master CSS loader
│   ├── base/               ← Variables, fonts, animations
│   ├── layout/             ← Navbar, overlay, flashcards
│   ├── features/           ← Navigation, counting rules
│   └── themes/             ← Kids color theme
├── js/
│   ├── core/               ← App logic (main.js, init.js)
│   ├── ui/                 ← Card rendering (display.js)
│   ├── navigation/         ← Routing (router.js)
│   ├── slideshow/          ← Slideshow (controller.js)
│   ├── utils/              ← Helpers (helpers.js)
│   └── data/               ← 29 data modules (5 categories)
└── assets/audio/           ← 369 MP3 pronunciation files
    ├── varnamala/           ← Alphabet audio (52 files)
    ├── ganit/               ← Math audio (145 files)
    ├── mera_sansar/         ← My World audio (21 files)
    ├── rangon_ka_sansar/    ← Colors audio (68 files)
    ├── samay_prakriti/      ← Time & Nature audio (23 files)
    └── system/              ← UI sounds & intros (60 files)
```

---

## 🗺️ Roadmap

| Phase | Theme | Age Group | Status |
|:---|:---|:---|:---|
| ✅ Phase 1 | Preschool 🧒 | 3–5 yrs (Nursery/LKG/UKG) | **Complete** |
| 🟡 Phase 2 | Primary 📖 | 5–8 yrs (Class 1–3) | Planned |
| 🟡 Phase 3 | Junior 🎓 | 8–12 yrs (Class 4–7) | Planned |
| 🔵 Phase 4 | Toddler 🍼 | 1–3 yrs (Pre-Nursery) | Future |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ for Rajshree 🎒
</div>
