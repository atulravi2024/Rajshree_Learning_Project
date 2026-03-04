import edge_tts
import asyncio
import os

# Longer text for Madhur (Simulated Indian Boy) to provide a better sample duration.
TEXT = (
    "नमस्ते! मेरा नाम मधुर है और मैं पाँच साल का एक साहसी लड़का हूँ। "
    "क्या आप मेरे साथ एक जादुई जंगल की सैर पर चलना चाहेंगे? "
    "वहाँ रंग-बिरंगे फूल खिलते हैं और मज़ेदार जानवर रहते हैं। "
    "हम मिलकर ऊंचे पेड़ों पर चढ़ेंगे और साफ़ ठंडे झरनों का पानी पिएंगे। "
    "सीखने में बहुत मज़ा आता है, खासकर जब हम नई कहानियाँ पढ़ते हैं। "
    "हमेशा सच बोलना चाहिए और दूसरों की मदद करनी चाहिए। "
    "चलो, अब हम अपनी अगली कहानी की शुरुआत करते हैं। धन्यवाद!"
)
VOICE = "hi-IN-MadhurNeural"
PITCH_SHIFT = "+20Hz"
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo.mp3")

async def generate():
    print(f"Generating EXTENDED simulated Child Audio using Edge-TTS ({VOICE} with {PITCH_SHIFT} pitch)...")
    communicate = edge_tts.Communicate(TEXT, VOICE, pitch=PITCH_SHIFT)
    await communicate.save(OUTPUT_FILE)
    print(f"✅ Extended audio generated successfully: {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(generate())
