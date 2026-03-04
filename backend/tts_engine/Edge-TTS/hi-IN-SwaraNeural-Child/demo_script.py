import edge_tts
import asyncio
import os

# Longer text for Swara (Simulated Indian Girl) to provide a better sample duration.
TEXT = (
    "नमस्ते! मेरा नाम स्वरा है। मैं तीन साल की हूँ और मुझे नई चीज़ें सीखना बहुत पसंद है। "
    "आज मैं आपको अपनी पसंदीदा कहानी सुनाना चाहती हूँ। "
    "एक छोटी सी चिड़िया थी जिसे आसमान में बहुत ऊँचा उड़ना पसंद था। "
    "वो हर रोज़ नए पहाड़ों और सुंदर बाग़ों की सैर करती थी। "
    "रास्ते में उसे बहुत सारे दोस्त मिले और सबने मिलकर खूब मस्ती की। "
    "सीखना बहुत मज़ेदार है और हमें हमेशा खुश रहना चाहिए। "
    "उम्मीद है आपको मेरी आवाज़ अच्छी लगी होगी! आपका दिन बहुत अच्छा हो।"
)
VOICE = "hi-IN-SwaraNeural"
PITCH_SHIFT = "+25Hz"
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo.mp3")

async def generate():
    print(f"Generating EXTENDED simulated Child Audio using Edge-TTS ({VOICE} with {PITCH_SHIFT} pitch)...")
    communicate = edge_tts.Communicate(TEXT, VOICE, pitch=PITCH_SHIFT)
    await communicate.save(OUTPUT_FILE)
    print(f"✅ Extended audio generated successfully: {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(generate())
