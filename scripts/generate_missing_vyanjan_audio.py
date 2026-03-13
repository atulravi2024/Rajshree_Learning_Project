"""
Generate missing Vyanjan audio files using Edge-TTS.

Uses phonetic Hindi phrases to ensure correct pronunciation
for the nasal consonants ङ, ञ, and ण.
"""
import sys
import io

# Fix Windows console encoding for Hindi characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import edge_tts  # type: ignore
import asyncio
import os

# Output directory for the generated audio files
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio", "varnamala")

# --- Pronunciation Guide ---
# These consonants are nasal sounds that TTS engines often mispronounce
# when given the letter alone. We use a descriptive phrase format:
#   "[letter] से [word]" to give the TTS engine proper phonetic context.
#
# ङ (nga) - Velar nasal, as in "अंग" (body part)
# ञ (nya) - Palatal nasal, as in "रंजन" (entertainment)
# ण (nna) - Retroflex nasal, as in "गणेश" (Lord Ganesh)

# These nasal consonants rarely start Hindi words, so we speak just the bare
# letter sound for a clean, correct pronunciation.
MISSING_VYANJANS = [
    {
        "filename": "nga.mp3",
        "text": "अंगा अंगा से खाली, बच्चों बजाओ ताली",
        "letter": "ङ"
    },
    {
        "filename": "nya.mp3",
        "text": "इयां इयां से खाली, बच्चों बजाओ फिर से ताली",
        "letter": "ञ"
    },
    {
        "filename": "nna.mp3",
        "text": "अणा अणा से खाली, बच्चों बजाओ ताली",
        "letter": "ण"
    },
]

VOICE = "hi-IN-SwaraNeural"  # Secondary (Formal) from memory file
RATE = "-5%"  # Per standard memory file
PITCH = "+1Hz" # Per standard memory file


async def generate_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Output directory: {os.path.abspath(OUTPUT_DIR)}")
    print(f"Voice: {VOICE}, Rate: {RATE}\n")

    for item in MISSING_VYANJANS:
        filepath = os.path.join(OUTPUT_DIR, item["filename"])
        print(f"  Generating: {item['letter']} → {item['filename']}  (text: \"{item['text']}\")")
        
        communicate = edge_tts.Communicate(
            item["text"],
            VOICE,
            rate=RATE,
            pitch=PITCH
        )
        await communicate.save(filepath)
        
        # Verify file was created
        if os.path.exists(filepath):
            size_kb = os.path.getsize(filepath) / 1024
            print(f"    ✅ Created ({size_kb:.1f} KB)")
        else:
            print(f"    ❌ FAILED to create {filepath}")

    print(f"\n✅ All {len(MISSING_VYANJANS)} missing Vyanjan audio files generated successfully!")


if __name__ == "__main__":
    asyncio.run(generate_audio())
