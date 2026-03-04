import edge_tts
import asyncio
import os

TEXT = (
    "Namaste! Mera naam Neerja hai, aur main ek expressive Indian child voice hoon. "
    "Mujhe nayi cheezein seekhna aur nayi jagahon par ghoomna bahut pasand hai! "
    "Aaj hum apne aas pass ki khoobsurat duniya ke baare mein jaanenge. "
    "Kya aap taiyaar hain? Toh chaliye is mazedar safar ki shuruaat karte hain!"
)
VOICE = "en-IN-NeerjaExpressiveNeural"
PITCH_SHIFT = "+25Hz"
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo.mp3")

async def generate():
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    print(f"Generating simulated Child Audio using Edge-TTS ({VOICE} with {PITCH_SHIFT} pitch)...")
    try:
        communicate = edge_tts.Communicate(TEXT, VOICE, pitch=PITCH_SHIFT)
        await communicate.save(OUTPUT_FILE)
    except Exception as e:
        print(f"Failed with {VOICE}, trying en-IN-NeerjaNeural... Error: {e}")
        communicate = edge_tts.Communicate(TEXT, "en-IN-NeerjaNeural", pitch=PITCH_SHIFT)
        await communicate.save(OUTPUT_FILE)
    print(f"✅ Audio generated successfully: {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(generate())
