import asyncio
import edge_tts
import os
import io
import sys

# Fix Windows console encoding for Hindi characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
BASE_AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio", "varnamala", "matra")

os.makedirs(BASE_AUDIO_DIR, exist_ok=True)

VOICE = "hi-IN-SwaraNeural"
RATE = "-5%"
PITCH = "+1Hz"

SCRIPTS_MANIFEST = [
    {"path": "matra_a.mp3", "text": "नमस्ते नन्हे दोस्तों! आज हम सीखेंगे कि मात्राएं कैसे जादू करती हैं। देखो, क में अ मिलाओ तो होता है क। इसमें कोई अलग से मात्रा नहीं दिखती, पर अ की आवाज इसमें छुपी है। क! जैसे क से कबूतर! बोलो मेरे साथ— क!"},
    {"path": "matra_aa.mp3", "text": "अरे वाह! अब देखो, क में आ की मात्रा मिलाओ तो होता है का। अपना मुंह पूरा खोलो और बोलो— का! जैसे का से काला कौआ— कांव-कांव! जब भी हम आ की मात्रा लगाते हैं, आवाज लंबी हो जाती है। का!"},
    {"path": "matra_i.mp3", "text": "अब एक छोटी सी टोपी पहनाते हैं। क में इ की मात्रा मिलाओ तो होता है कि। जल्दी से बोलो— कि! जैसे कि से किताब। क्या आपको अपनी कहानियों वाली किताब पसंद है? चलो, मिलकर पढ़ते हैं— कि!"},
    {"path": "matra_ee.mp3", "text": "हम्म! अब टोपी पीछे से पहनाई। क में ई की मात्रा मिलाओ तो होता है की। इसे थोड़ा खींचकर बोलो— की! जैसे की से कीड़ा! छोटा-सा रेंगने वाला कीड़ा। डरो मत, वो भी आपसे बात करना चाहता है! की!"},
    {"path": "matra_u.mp3", "text": "चलो, क के पैरों के नीचे पूंछ लगाते हैं। क में उ की मात्रा मिलाओ तो होता है कु। जल्दी से बोलो— कु! जैसे कु से कुत्ता! वौ-वौ! क्या आप भी कुत्ते की तरह आवाज निकाल सकते हो? कोशिश करो— कु!"},
    {"path": "matra_oo.mp3", "text": "अब पूंछ को बाहर की तरफ खींच दो। क में ऊ की मात्रा मिलाओ तो होता है कू। लंबी आवाज— कू! जैसे कू से कूलर! गर्मी में कूलर की ठंडी हवा कितनी अच्छी लगती है ना? साय-साय! कू!"},
    {"path": "matra_ri.mp3", "text": "यह थोड़ी खास मात्रा है। क में ऋ की मात्रा मिलाओ तो होता है कृ। बोलो— कृ! जैसे कृ से कृषि। कृषि मतलब खेती, जहां किसान हमारे लिए फसल उगाते हैं। मिट्टी की खुशबू कितनी अच्छी होती है! कृ!"},
    {"path": "matra_e.mp3", "text": "क के सिर पर एक झंडा लगाओ। क में ए की मात्रा मिलाओ तो होता है के। बोलो— के! जैसे के से केला! पीला और मीठा केला! मुझे तो केला बहुत पसंद है। तुम भी खाओगे? के!"},
    {"path": "matra_ai.mp3", "text": "अरे! अब सिर पर दो झंडे लग गए। क में ऐ की मात्रा मिलाओ तो होता है कै। जोर से बोलो— कै! जैसे कै से कैमरा! स्माइल प्लीज! खिचिक! वाह, हमने एक बहुत सुंदर फोटो खींची है! कै!"},
    {"path": "matra_o.mp3", "text": "एक डंडी और एक झंडा— क में ओ की मात्रा मिलाओ तो होता है को। बोलो— को! जैसे को से कोयल! कोयल कैसे गाती है? कुहू-कुहू! चलो, हम भी कोयल की तरह गाते हैं— को!"},
    {"path": "matra_au.mp3", "text": "एक डंडी और दो झंडे— क में औ की मात्रा मिलाओ तो होता है कौ। बोलो— कौ! जैसे कौ से कौआ! कौआ बड़ा चालाक होता है, और वो बोलता है— कांव-कांव! कौ!"},
    {"path": "matra_am.mp3", "text": "क के माथे पर एक चमकती बिंदी। क में अं की मात्रा मिलाओ तो होता है कं। बोलो— कं! जैसे कं से कंगन! जब मम्मी हाथ हिलाती हैं, तो कंगन बजते हैं— खन-खन-खन! कं!"},
    {"path": "matra_ah.mp3", "text": "और आखिर में, क के पीछे दो बिंदियां। क में अः की मात्रा मिलाओ तो होता है कः। इसकी आवाज हंसी जैसी होती है— अहः! जैसे नमः। जब हम बड़ों को प्रणाम करते हैं। तो कैसी लगी मात्राओं की यह जादुई दुनिया?"}
]

async def generate_batch_audio():
    print(f"Starting batch audio generation using voice: {VOICE}...")
    success_count = 0
    fail_count = 0

    for item in SCRIPTS_MANIFEST:
        full_path = os.path.join(BASE_AUDIO_DIR, item["path"])
        print(f"Generating: {item['path']}...")
        try:
            communicate = edge_tts.Communicate(item["text"], VOICE, rate=RATE, pitch=PITCH)
            await communicate.save(full_path)
            
            if os.path.exists(full_path):
                size_kb = os.path.getsize(full_path) / 1024
                print(f"  ✅ Success ({size_kb:.1f} KB)")
                success_count += 1
            else:
                print(f"  ❌ Failed (File not found after save)")
                fail_count += 1
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            fail_count += 1

    print(f"\nGeneration Complete!")
    print(f"Total: {len(SCRIPTS_MANIFEST)}")
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")

if __name__ == "__main__":
    asyncio.run(generate_batch_audio())
