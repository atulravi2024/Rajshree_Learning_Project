# Free & Offline TTS Alternatives (Hindi & English)

## 📌 Overview
For projects where international billing (Google/AWS) is not possible or desired, these free and offline models provide a high-quality alternative for the Rajshree Learning Project.

---

## 🚀 Recommended Libraries (Installed)

| Model | Type | Best For | Status |
| :--- | :--- | :--- | :--- |
| **Edge-TTS** | Online (API-less) | High-quality Neural voices (Microsoft) | ✅ Installed |
| **Sherpa-ONNX** | 100% Offline | Privacy-focused, local, fast synthesis | ✅ Installed |

---

## 📊 Detailed Provider List

| Library | Type | Quality | Language Support | Pros / Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Edge-TTS** | Online | ⭐⭐⭐⭐⭐ | Excellent (Hindi/English) | ✅ Best free quality; ❌ Needs internet. |
| **Sherpa-ONNX** | Offline | ⭐⭐⭐⭐ | Great (Hindi/English) | ✅ No internet; ✅ 100% Privacy; ❌ Model download needed. |
| **gTTS** | Online | ⭐⭐⭐⭐ | Good (Hindi/English) | ✅ Authentic Google sound; ❌ Robotic prosody. |
| **Coqui XTTS v2**| Offline | ⭐⭐⭐⭐⭐ | Amazing (Voice Cloning) | ✅ Can clone any voice; ❌ High RAM usage. |
| **Bhashini.ai** | Online | ⭐⭐⭐⭐⭐ | 22 Indian Languages | ✅ Best native Indian context; ❌ Paid API. |
| **pyttsx3** | Offline | ⭐⭐ | Basic | ✅ Zero dependencies; ❌ Robotic/Old sound. |

---

## 💻 Technical Setup (Rajshree Project)

### 1. Edge-TTS (Premium Quality for Free)
*   **Usage:** Uses the Microsoft Edge Neural voice engine.
*   **Command:** `edge-tts --list-voices | grep hi-IN`
*   **Voice Suggestion:** `hi-IN-MadhurNeural` or `hi-IN-SwaraNeural`.

### 2. Sherpa-ONNX (True Offline)
*   **Usage:** Uses pre-trained ONNX models on the local CPU.
*   **Voice Models:** Requires downloading `.onnx` and `tokens.txt` (recommend Piper models for Hindi).
*   **Pros:** Extremely fast and does not require a GPU.

---
**Last Updated:** 2026-03-01
**Environment:** `.venv` (Python 3.14)
