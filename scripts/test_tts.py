
import asyncio
import edge_tts  # type: ignore[import-not-found]
import os

async def test_gen():
    print("Testing edge-tts...")
    communicate = edge_tts.Communicate("Hello test", "en-US-GuyNeural")
    await communicate.save("test_audio.mp3")
    print("Saved test_audio.mp3" if os.path.exists("test_audio.mp3") else "Failed to save")

if __name__ == "__main__":
    asyncio.run(test_gen())
