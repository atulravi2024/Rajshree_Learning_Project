# Cloud TTS Research & Strategy (Session Log)

## 📌 Context
This research was conducted for the **Rajshree Learning Project** to determine the most cost-effective and technically viable solution for integrating Natural Voice (TTS) into the "Audio Demo" module.

---

## 🏛️ Session History & Detailed Analysis

### 1. The Cloud TTS Choice
- **Decision:** Google Cloud TTS (Neural2/WaveNet).
- **Reason:** Provides a 1-million character "Always Free" allocation monthly that resets forever. Amazon Polly's free tier vanishes after 12 months.
- **Advanced Options:** Gemini-TTS (Token-based) costs $10-$20 per 1M audio tokens for Flash/Pro versions.

### 2. The Indian Payment Hurdles
- **Analysis of Current Banks:**
    - Indian Bank, Punjab & Sind Bank, Union Bank: These PSU banks generally block international auto-debit "E-Mandates" due to rigid 3D-Secure (OTP) enforcement and outdated server logic for overseas subscription flags.
    - Post Office (IPPB) & ICICI Pockets: Strictly domestic (RuPay/Wallet); does not support international API billing or Google Cloud verification.
- **Why Payments Fail:** Subscription/Recursive flags identify the merchant as a "recurring billing" provider, which is rejected at the server level for many standard Indian debit cards. Banks often have a "Hard Block" on transactions that bypass 3D Secure (OTP) for the initial ₹2 hold.
- **One-time vs Subscription:** Even when the user tries to make a one-time AI purchase, the bank system detects the "Subscription" flag in the payment request and auto-declines it without even sending an OTP.

### 3. The Digital Bank Breakthrough
- **Solutions Identified:** 
    - **Kotak 811:** Highest success rate for Google Cloud billing. Virtual card is 100% free for life.
    - **DBS digibank:** Global standard; excellent for international platforms.
    - **Fi/Jupiter:** Neobanks with modern API connectivity and low Forex fees.

---

## 📊 Bank Specification & Charges (Direct Comparison)

| Bank | Account Type | Virtual Card AMC | Forex Markup | Best Feature |
| :--- | :--- | :--- | :--- | :--- |
| **Kotak 811** | Zero Balance | ₹0 (Lifetime Free) | 3.5% + GST | Seamless Google API bind. |
| **DBS digibank**| Digital Savings | ~₹150 + GST | Up to 3.25% | Global backend stability. |
| **Fi / Jupiter** | Neobank | ₹0 | 0% - 2% | Low cost for large overages. |

---

## 🛠️ Actionable Integration Plan
1.  **Open Modern Account:** Set up a Kotak 811 or Fi account digitally.
2.  **Toggle Settings:** Manually enable "International Transactions" and "E-commerce" in the mobile app.
3.  **Validate Card:** ensure at least ₹100-200 is available for the verification hold.
4.  **Connect Console:** Link to Google Cloud Billing and select "Always Free" (1M chars).

---
**Timestamp:** 2026-03-01
**Project Root:** `Rajshree Learning Project`
