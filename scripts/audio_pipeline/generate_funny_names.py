import os
import re
import asyncio
import sys
import io

# Fix Windows console encoding for Hindi characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

try:
    import edge_tts  # type: ignore
except ImportError:
    print("Error: edge_tts not found. Please install it using `pip install edge-tts`")
    sys.exit(1)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")
VOICE = "hi-IN-SwaraNeural"
PITCH = "+1Hz"
RATE = "-5%"

TEMPLATES = {
    "vegetables": "मैं हूँ {word}! मुझे रोज़ खाने से बनोगे आप एकदम सुपर हीरो!",
    "fruits": "अरे वाह! मैं हूँ ताज़ा और मीठा {word}! क्या तुम्हें मैं पसंद हूँ?",
    "transport": "पों-पों, छुक-छुक! मैं हूँ {word}! जल्दी बैठो, तुम्हें बहुत दूर तक घुमा कर लाता हूँ!",
    "vehicles": "पों-पों, ब्रूम-ब्रूम! मैं हूँ {word}! जल्दी बैठो, तुम्हें मज़ेदार सैर करा कर लाती हूँ!",
    "nature": "देखो-देखो, मैं हूँ {word}! प्रकृति कितनी सुंदर है ना? मुझे देखकर तो बहुत अच्छा लगता है!",
    "animals": "हलो दोस्तो, मैं हूँ {word}! चलो हम सब मिलकर खेलें और खूब मस्ती करें!",
    "domestic": "हलो दोस्तो, मैं हूँ प्यारा {word}! चलो हम सब मिलकर खेलें और खूब मस्ती करें!",
    "wild": "हलो दोस्तो, मैं हूँ जंगली {word}! चलो हम सब मिलकर खेलें और खूब मस्ती करें!",
    "birds": "चीं-चीं, चू-चू! मैं हूँ प्यारा सा {word}! मुझे खुले आसमान में उड़ना बहुत ही पसंद है!",
    "body_parts": "देखो, यह है हमारा {word}! इसे हमेशा साफ़ और एकदम मज़बूत रखना चाहिए, समझे ना!",
    "clothes": "मैं हूँ {word}! मुझे पहनकर तुम एकदम राजकुमार या राजकुमारी जैसे लगोगे!",
    "emotions": "अरे अरे, यह तो है {word}! हमें हमेशा खुश-खुश और मुस्कुराते हुए रहना चाहिए!",
    "family": "ये हैं हमारे प्यारे {word}! परिवार तो सबसे ख़ास होता है, है ना दोस्तो!",
    "habits": "यह है बहुत ही अच्छी आदत, {word}! अच्छे बच्चे रोज़ ऐसा ही करते हैं, क्या तुम भी करते हो?",
    "helpers": "ये हैं {word}, जो हमारी बहुत मदद करते हैं! हमें इन्हें हमेशा 'थैंक यू' बोलना चाहिए!",
    "actions": "चलो मैं दिखाती हूँ! यह है {word}! क्या तुम भी मेरे साथ-साथ इसे करके दिखा सकते हो?",
}

DEFAULT_TEMPLATE = "नमस्ते! मैं हूँ {word}! चलो मिलकर मस्ती करें और कुछ नया सीखें!"

async def process_files():
    generated_count = 0
    missing_items = []
    
    print(f"Scanning data files in {DATA_DIR}...")
    
    for root, dirs, files in os.walk(DATA_DIR):
        for file in files:
            if not file.endswith('.js'): continue
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            for line in lines:
                audio_match = re.search(r"audio:\s*['\"](.*?)['\"]", line)
                if not audio_match: continue
                
                audio_path = audio_match.group(1)
                
                # Verify if it's the "names/" category the user requested
                if audio_path.startswith("names/"):
                    letter_match = re.search(r"letter:\s*['\"](.*?)['\"]", line)
                    word_match = re.search(r"word:\s*['\"](.*?)['\"]", line)
                    
                    word = word_match.group(1) if word_match else ""
                    if not word:
                        word = letter_match.group(1) if letter_match else ""
                    
                    # Ignore if somehow still blank
                    if not word: continue
                    
                    # Discover category format: names/[category]/filename.mp3
                    # e.g. names/vegetables/potato.mp3 -> vegetables
                    parts = audio_path.split("/")
                    category = parts[1] if len(parts) > 1 else ""
                    
                    template = TEMPLATES.get(category, DEFAULT_TEMPLATE)
                    final_text = template.replace("{word}", word)
                    
                    full_output_path = os.path.join(AUDIO_DIR, audio_path.replace('/', os.sep))
                    os.makedirs(os.path.dirname(full_output_path), exist_ok=True)
                    
                    print(f"[{file}] {audio_path}")
                    print(f"  Word: '{word}' | Category: {category}")
                    print(f"  Outputting Text: \"{final_text}\"")
                    
                    # Generate Audio
                    max_retries = 3
                    for attempt in range(max_retries):
                        try:
                            communicate = edge_tts.Communicate(final_text, VOICE, pitch=PITCH, rate=RATE)
                            await communicate.save(full_output_path)
                            size_kb = os.path.getsize(full_output_path) / 1024
                            print(f"    ✅ Created ({size_kb:.1f} KB)")
                            generated_count += 1
                            break
                        except Exception as e:
                            print(f"    ❌ Attempt {attempt+1} failed for {audio_path}: {e}")
                            if attempt == max_retries - 1:
                                missing_items.append(audio_path)
                            await asyncio.sleep(1)

    print("\n--- Summary ---")
    print(f"Total audio files regenerated: {generated_count}")
    if missing_items:
        print(f"Failed to generate: {len(missing_items)} files.")
        for item in missing_items:
            print(f"  - {item}")

if __name__ == "__main__":
    asyncio.run(process_files())
