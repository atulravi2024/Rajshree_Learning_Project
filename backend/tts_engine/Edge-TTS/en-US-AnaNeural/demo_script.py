import edge_tts
import asyncio
import os

# Longer text for Ana (US Child) to provide a better sample duration.
TEXT = (
    "Hello! My name is Ana. I am so happy to meet you! "
    "Today, I want to tell you a little story about a brave tiny bird. "
    "Once upon a time, there was a little bird who wanted to see the whole world. "
    "She flew over tall green mountains and sparkling blue oceans. "
    "Everywhere she went, she made new friends and sang happy songs. "
    "It was a wonderful adventure, and she learned that being kind is the most important thing of all. "
    "I hope you liked my story! Have a beautiful and magical day!"
)
VOICE = "en-US-AnaNeural"
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo.mp3")

async def generate():
    print(f"Generating EXTENDED audio using Edge-TTS ({VOICE})...")
    communicate = edge_tts.Communicate(TEXT, VOICE)
    await communicate.save(OUTPUT_FILE)
    print(f"✅ Extended audio generated successfully: {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(generate())
