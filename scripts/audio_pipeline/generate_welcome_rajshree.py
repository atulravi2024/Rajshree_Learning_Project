import asyncio
import edge_tts
import os

TEXT_RAJSHREE = "Namaste Rajshree! Rajshree... seekhne ki duniya mein aapka swagat hai. Chaliye ab hum seekhna shuru karte hain!"
VOICE = "en-IN-NeerjaExpressiveNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../frontend/assets/audio/system/welcome")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "welcome_rajshree.mp3")

async def generate():
    print(f"Generating welcome audio for Rajshree...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    communicate = edge_tts.Communicate(TEXT_RAJSHREE, VOICE, rate="+0%", pitch="+0Hz")
    await communicate.save(OUTPUT_FILE)
    
    if os.path.exists(OUTPUT_FILE):
        print(f"✅ Successfully generated: {OUTPUT_FILE}")
    else:
        print(f"❌ Failed to generate audio.")

if __name__ == "__main__":
    asyncio.run(generate())
