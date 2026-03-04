import edge_tts
import asyncio
import os

# Text aimed to produce approx 10-15 seconds of audio.
TEXT = (
    "Hello! My name is Neerja, and I am an expressive Indian child voice. "
    "I love learning new things and going on wonderful adventures! "
    "Today we are going to learn about the beautiful world around us. "
    "Are you ready? Let's dive right in and start our amazing journey!"
)
VOICE = "en-IN-NeerjaExpressiveNeural"
PITCH_SHIFT = "+25Hz"
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo.mp3")

async def generate():
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
