import asyncio
import edge_tts
import os
import io
import sys

# Fix console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

TEXT = "चलो बच्चों, अपनी जगह पर खड़े हो जाओ! आज हम करेंगे— दौड़ना! बोलो— दौ! दौड़ना! जैसे मैदान में हम तेज़ भागते हैं। क्या आप भी मेरे साथ अपनी जगह पर दौड़ सकते हो? धप-धप-धप! अरे वाह, आप तो बहुत तेज़ हो! खूब मस्ती करो और बार-बार बोलो— दौड़ना!"

DEMO_DIR = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\memory\09 Audio Script\mera_sansar\demo_comparison"

# Voice Settings from 01.07
VOICES_SETTINGS = [
    {
        "name": "Swara",
        "voice": "hi-IN-SwaraNeural",
        "rate": "-5%",
        "pitch": "+1Hz",
        "file": "Swara_Demo.mp3"
    },
    {
        "name": "Neerja",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "file": "Neerja_Demo.mp3"
    }
]

async def generate_demos():
    if not os.path.exists(DEMO_DIR):
        os.makedirs(DEMO_DIR)
        
    for vs in VOICES_SETTINGS:
        output_path = os.path.join(DEMO_DIR, vs["file"])
        print(f"Generating Demo for {vs['name']} using {vs['voice']}...")
        
        # Use Romanized text for Neerja, Devanagari for Swara
        current_text = TEXT
        if vs["name"] == "Neerja":
            current_text = "Chalo bacchon, apni jagah par khade ho jao! Aaj hum karenge— Daudna! Bolo— Dau! Daudna! Jaise maidan mein hum tez bhaagte hain. Kya aap bhi mere saath apni jagah par daud sakte ho? Dhap-dhap-dhap! Are waah, aap toh bahut tez ho! Khoob masti karo aur baar-baar bolo— Daudna!"
            
        try:
            communicate = edge_tts.Communicate(current_text, vs["voice"], rate=vs["rate"], pitch=vs["pitch"])
            await communicate.save(output_path)
            print(f"✅ Success: {output_path}")
        except Exception as e:
            print(f"❌ Failed for {vs['name']}: {e}")

if __name__ == "__main__":
    asyncio.run(generate_demos())
