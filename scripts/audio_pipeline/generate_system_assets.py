import edge_tts
import asyncio
import os

TEXT_NEERJA = "Hello! I am Neerja. This is the primary dynamic and expressive system voice for the Rajshree Learning Project."
TEXT_SWARA = "नमस्ते! मैं स्वरा हूँ। यह सिस्टम की प्रोफेशनल और शांत आवाज़ है।"
TEXT_MADHUR = "नमस्ते! मैं मधुर हूँ। यह सिस्टम की ऊर्जावान और तेज आवाज़ है, जो तुरंत उत्तर देने के लिए बनी है।"

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "System-Audio-Models")
os.makedirs(BASE_DIR, exist_ok=True)

async def generate():
    print("Generating System Audio Models from memory specification...")
    
    # 1. Neerja (Try Expressive, fallback to standard if Edge-TTS doesn't map it)
    try:
        print("Generating Neerja (Dynamic)...")
        await edge_tts.Communicate(TEXT_NEERJA, "en-IN-NeerjaExpressiveNeural").save(
            os.path.join(BASE_DIR, "en-IN-NeerjaExpressive_Primary.mp3")
        )
    except:
        print("Falling back to NeerjaNeural...")
        await edge_tts.Communicate(TEXT_NEERJA, "en-IN-NeerjaNeural").save(
            os.path.join(BASE_DIR, "en-IN-NeerjaExpressive_Primary.mp3")
        )
        
    # 2. Swara Formal: Rate -5%, Pitch +1Hz
    print("Generating Swara (Formal)...")
    await edge_tts.Communicate(TEXT_SWARA, "hi-IN-SwaraNeural", rate="-5%", pitch="+1Hz").save(
        os.path.join(BASE_DIR, "hi-IN-SwaraNeural_Secondary_Formal.mp3")
    )
    
    # 3. Madhur Energetic: Rate +5%, Pitch +2Hz
    print("Generating Madhur (Energetic)...")
    await edge_tts.Communicate(TEXT_MADHUR, "hi-IN-MadhurNeural", rate="+5%", pitch="+2Hz").save(
        os.path.join(BASE_DIR, "hi-IN-MadhurNeural_Tertiary_Energetic.mp3")
    )
    
    print(f"\n✅ All System Audio models successfully saved to: {BASE_DIR}")

if __name__ == "__main__":
    asyncio.run(generate())
