import asyncio
import edge_tts
import os

TEXT_SHORT = "राजश्री लर्निंग प्रोजेक्ट में आपका स्वागत है!"
VOICE = "hi-IN-SwaraNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../frontend/assets/audio/system")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "welcome_short.mp3")

async def generate():
    print(f"Generating Short welcome fallback audio...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    communicate = edge_tts.Communicate(TEXT_SHORT, VOICE, rate="+5%", pitch="+0Hz")
    await communicate.save(OUTPUT_FILE)
    
    if os.path.exists(OUTPUT_FILE):
        print(f"Successfully generated: {OUTPUT_FILE}")
    else:
        print(f"Failed to generate audio.")

if __name__ == "__main__":
    asyncio.run(generate())
