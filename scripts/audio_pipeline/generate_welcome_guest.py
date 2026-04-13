import asyncio
import edge_tts
import os

TEXT_GUEST = "नमस्ते! राजश्री लर्निंग प्रोजेक्ट में आपका स्वागत है। चलिए अब हम सीखना शुरू करते हैं!"
VOICE = "hi-IN-SwaraNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../frontend/assets/audio/system/welcome")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "welcome_guest.mp3")

async def generate():
    print(f"Generating Guest welcome audio...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    communicate = edge_tts.Communicate(TEXT_GUEST, VOICE, rate="+0%", pitch="+0Hz")
    await communicate.save(OUTPUT_FILE)
    
    if os.path.exists(OUTPUT_FILE):
        print(f"Successfully generated: {OUTPUT_FILE}")
    else:
        print(f"Failed to generate audio.")

if __name__ == "__main__":
    asyncio.run(generate())
