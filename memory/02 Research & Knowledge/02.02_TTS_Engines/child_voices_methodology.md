# 🎤 Simulated Child Voices Methodology (Edge-TTS)

> *Technical documentation on how to programmatically replicate natural-sounding child voices and handle regional language limitations using Microsoft's Edge-TTS Neural models.*

---

## 1. 🎵 The Pitch-Shift Technique (Vocal Age Modification)
Microsoft Edge-TTS lacks a native "Indian Child" category. To simulate authentic 3-5 year old Indian voices, we use native adult/young-adult neural models and programmatically modify their pitch using the `edge-tts` Python library.

### Required Parameters
*   **Pitch Parameter**: `pitch="+20Hz"` to `pitch="+25Hz"`
*   **Library Component**: `edge_tts.Communicate(text, voice, pitch="+25Hz")`

### Authorized Child Models
| Voice Name | Base Model | Modification | Result |
| :--- | :--- | :--- | :--- |
| **Swara (Child)** | `hi-IN-SwaraNeural` | `+25Hz` | High-pitched 3-5 yr old Indian Girl |
| **Madhur (Child)** | `hi-IN-MadhurNeural` | `+20Hz` | Energetic 3-5 yr old Indian Boy |
| **Neerja (Child)** | `en-IN-NeerjaExpressiveNeural` | `+25Hz` | Expressive 3-5 yr old Indian Girl |
| **Ana (Native)** | `en-US-AnaNeural` | *None* | High-quality US English Child |

---

## 2. 🗣️ The "Hinglish Hack" (Cross-Lingual Expressiveness)
Some highly expressive models (e.g., `en-IN-NeerjaExpressiveNeural`) are rigidly hardcoded to expect **Latin characters (English)**. 

### The Problem
If you attempt to feed pure **Devanagari script** (हिंदी) into an English-optimized neural model via Edge-TTS, the API will silently crash, resulting in a **0-byte output file** with no error thrown.

### The Solution
You must **Romanize the Hindi text (Hinglish)**.

*   ❌ **Fails**: `edge_tts.Communicate("नमस्ते! मेरा नाम नीरजा है।", "en-IN-NeerjaExpressiveNeural")`
*   ✅ **Succeeds**: `edge_tts.Communicate("Namaste! Mera naam Neerja hai.", "en-IN-NeerjaExpressiveNeural")`

Because the `en-IN` models are natively trained on Indian accents, sending Romanized Hindi triggers a flawless, deeply expressive Hindi pronunciation, allowing us to generate high-quality Hindi child voices using English models.

---
*Documented: March 2026 - Rajshree Learning Project*
