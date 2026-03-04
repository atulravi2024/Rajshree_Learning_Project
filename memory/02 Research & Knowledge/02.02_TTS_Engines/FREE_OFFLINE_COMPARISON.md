# Free/Offline TTS Deep Dive Comparison

## 🎯 Strategic Overview
For the **Rajshree Learning Project**, having high-quality Hindi and English voice synthesis without relying on international credit cards is critical. This document provides a side-by-side comparison and setup guide for the three best methods.

---

## 📊 Comprehensive Comparison (2025)

| Metric | **Edge-TTS** (Microsoft) | **Sherpa-ONNX** (Offline) | **Indic Context** (Bhashini) |
| :--- | :--- | :--- | :--- |
| **Connection** | Online (No API Key) | **100% Offline** | Online (API Key) |
| **Voice Quality** | ⭐⭐⭐⭐⭐ (Neural) | ⭐⭐⭐⭐ (VITS/Piper) | ⭐⭐⭐⭐⭐ (Native) |
| **Hindi Support** | Excellent (Madhur/Swara) | Great (Priyamvada/Pratham)| **Best** (22+ Dialects) |
| **Setup Cost** | ₹0 | ₹0 | ₹0 (Free Tier) |
| **Privacy/Security**| Low (Cloud) | **Full (Local)** | Moderate (Govt) |

---

## 🛠️ Step-by-Step Setup Process

### 1. Edge-TTS (Premium Quality - No Account Needed)
*   **Best For:** When you have an internet connection and want "Google Cloud quality" for free.
*   **Setup:**
    1.  Activate `.venv`.
    2.  `pip install edge-tts` (Completed).
*   **Usage:**
    ```bash
    # List Hindi voices
    edge-tts --list-voices | findstr "hi-IN"
    
    # Save a test file
    edge-tts --text "नमस्ते" --voice hi-IN-MadhurNeural --write-media test.mp3
    ```

### 2. Sherpa-ONNX (True Offline - No Internet Needed)
*   **Best For:** Privacy-focused projects or when working without an internet connection.
*   **Setup:**
    1.  Activate `.venv`.
    2.  `pip install sherpa-onnx` (Completed).
    3.  **Download Hindi Models:** You need the `hi_IN` ONNX model and `tokens.txt` from the Sherpa-ONNX GitHub binary releases.
*   **Usage:**
    - Requires loading the `.onnx` file locally in your Python script.
    - No external API ever called.

### 3. Indic Context (Bhashini - Govt. of India)
*   **Best For:** Official/Government applications and high-accuracy regional Hindi dialects.
*   **Setup:**
    1.  **Register:** Create an account at `bhashini.gov.in`.
    2.  **Generate Keys:** Get `userId`, `ulcaApiKey`, and `InferenceApiKey`.
    3.  **Install Interface:** `pip install bhashini_translator`.
*   **Usage:**
    - Requires making REST API calls to the Bhashini "Pipeline" system.
    - Returns Base64 audio strings for processing.

---

## ✅ Current Installation Progress
*   [X] **edge-tts** installed in `.venv`.
*   [X] **sherpa-onnx** installed in `.venv`.
*   [ ] **Hindi Models** (ONNX format) - Pending download.
*   [ ] **Bhashini Keys** - Pending registration.

---
**Last Updated:** 2026-03-01
**Project Reference:** Rajshree Learning Project Audio Demo
