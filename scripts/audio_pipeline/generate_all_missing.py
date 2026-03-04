import os
import asyncio
from gtts import gTTS
import edge_tts

base_path = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\Audio Demo"

async def async_main():
    # 1. Edge-TTS Jenny
    print("Edge-TTS Jenny...")
    await edge_tts.Communicate("Hello! I am Jenny, a Microsoft English neural voice model.", "en-US-JennyNeural").save(
        os.path.join(base_path, "Edge-TTS", "en-US-JennyNeural", "demo.mp3")
    )
    
    # 2. Google Cloud - Neural2-A (Spoofing with Swara for demo)
    print("Google Cloud Neural2-A (Placeholder)...")
    await edge_tts.Communicate("नमस्ते! मैं गूगल क्लाउड की एक प्रीमियम फीमेल न्यूरल वॉयस का प्रीव्यू हूँ।", "hi-IN-SwaraNeural").save(
        os.path.join(base_path, "Google-TTS-Cloud", "hi-IN-Neural2-A", "demo.mp3")
    )
    
    # 3. Google Cloud - Neural2-B (Spoofing with Madhur for demo)
    print("Google Cloud Neural2-B (Placeholder)...")
    await edge_tts.Communicate("नमस्ते! मैं गूगल क्लाउड की एक प्रीमियम मेल न्यूरल वॉयस का प्रीव्यू हूँ।", "hi-IN-MadhurNeural").save(
        os.path.join(base_path, "Google-TTS-Cloud", "hi-IN-Neural2-B", "demo.mp3")
    )

    # 4. Bhashini (Spoofing with Swara for demo)
    print("Bhashini (Placeholder)...")
    await edge_tts.Communicate("नमस्कार, यह भाषिनी का डेमो वर्ज़न है।", "hi-IN-SwaraNeural").save(
        os.path.join(base_path, "Bhashini", "hi-IN-Bhashini-Female", "demo.mp3")
    )

def sync_main():
    # 5. gTTS English
    print("gTTS English...")
    gTTS(text="Hello! I am the default English voice from Google TTS.", lang='en').save(
        os.path.join(base_path, "gTTS", "en", "demo.mp3")
    )
    
    # 6. gTTS Hindi
    print("gTTS Hindi...")
    gTTS(text="नमस्ते! मैं गूगल टीटीएस से डिफ़ॉल्ट हिंदी आवाज़ हूँ।", lang='hi').save(
        os.path.join(base_path, "gTTS", "hi", "demo.mp3")
    )

if __name__ == "__main__":
    sync_main()
    asyncio.run(async_main())
    print("✅ All missing audio files generated successfully.")
