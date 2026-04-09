import os
import re
import asyncio
from pathlib import Path
import sys
import io

try:
    import edge_tts
    import librosa
    import soundfile
except ImportError:
    print("Dependencies missing.")
    sys.exit(1)

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
DATA_DIR = Path(PROJECT_ROOT) / "frontend" / "shared" / "data"
AUDIO_BASE_DIR = Path(PROJECT_ROOT) / "frontend" / "assets" / "audio"
MD_OUTPUT_DIR = Path(PROJECT_ROOT) / "memory" / "09 Audio Script"

VOICE = "en-IN-NeerjaExpressiveNeural"
RATE = "-5%"  # Slightly slower for better clarity and duration
PITCH = "+0Hz"

def get_short_audio_items():
    object_pattern = re.compile(r'\{[^{]*?audio:.*?\}', re.DOTALL)
    audio_pattern = re.compile(r'audio:\s*[`\'"]([^`\'"]*)[\'"`]')
    id_properties = ['value', 'word', 'letter', 'text', 'english', 'hindi']
    
    short_items = []
    
    for root, _, files in os.walk(DATA_DIR):
        for file in files:
            if file.endswith('.js'):
                file_path = Path(root) / file
                rel_file_path = file_path.relative_to(DATA_DIR)
                domain = rel_file_path.parts[0]
                category = rel_file_path.stem
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    objects = object_pattern.findall(content)
                    
                    for obj in objects:
                        # Extract audio path
                        audio_match = audio_pattern.search(obj)
                        if not audio_match or not audio_match.group(1).strip():
                            continue
                        
                        audio_rel_path = audio_match.group(1).strip()
                        if '${' in audio_rel_path:
                            continue
                            
                        full_audio_path = AUDIO_BASE_DIR / audio_rel_path.replace('/', os.sep)
                        
                        # Extract IDs
                        details = {}
                        for prop in id_properties:
                            pattern = re.compile(fr'{prop}:\s*[`\'"]([^`\'"]*)[\'"`]')
                            m = pattern.search(obj)
                            if m and m.group(1).strip():
                                details[prop] = m.group(1).strip()
                                
                        name_parts = []
                        if 'word' in details: name_parts.append(details['word'])
                        if 'value' in details and details['value'] != details.get('word'): 
                            name_parts.append(f"({details['value']})")
                        if 'english' in details: name_parts.append(f"[{details['english']}]")
                        
                        display_name = " ".join(name_parts) if name_parts else "Unknown"
                        
                        if full_audio_path.exists():
                            try:
                                duration = librosa.get_duration(path=str(full_audio_path))
                                if duration <= 10.0:
                                    short_items.append({
                                        'domain': domain,
                                        'category': category,
                                        'name': display_name,
                                        'path': audio_rel_path,
                                        'status': 'short'
                                    })
                            except Exception:
                                pass
                        else:
                            # File is missing altogether
                            short_items.append({
                                'domain': domain,
                                'category': category,
                                'name': display_name,
                                'path': audio_rel_path,
                                'status': 'missing'
                            })
    return short_items

def build_script_text(identity, category):
    name = identity.split('(')[0].split('[')[0].strip()
    syllable = ""
    if '(' in identity:
        syllable = identity.split('(')[1].split(')')[0].strip()
    
    scripts = {
        "body_parts": f"नमस्ते नन्हे दोस्तों! मैं हूँ आपकी दोस्त नीरजा। आज हम अपने शरीर के अद्भुत अंगों के बारे में जानेंगे। देखो, यह है हमारा **{name}**! {f'बोलो मेरे साथ— {syllable}!' if syllable else ''} **{name}**! हमारे शरीर में {name} का बहुत महत्व है। क्या आप अपने {name} की तरफ इशारा कर सकते हैं? बहुत अच्छे! {name} को स्वस्थ रखने के लिए हमें सफाई का ध्यान रखना चाहिए। चलो, एक बार फिर से जोश के साथ बोलो— {name}!",
        "birds": f"चीं-चीं! सुनो-सुनो! आसमान की गहराइयों में देखो कौन उड़ रहा है? अरे, यह तो प्यारा-सा **{name}** है! {f'बोलो— {syllable}!' if syllable else ''} **{name}**! {name} अपने पंखों को फड़फड़ाकर उड़ता है और ऊँचे पेड़ों पर अपना घोंसला बनाता है। क्या आप भी {name} की तरह हवा में उड़ने का अभिनय कर सकते हैं? अपनी बाहें फैलाओ और बोलो— फुर्रर्र! और जोर से कहो— {name}!",
        "animals": f"आओ बच्चों, आज हम जंगल के एक दोस्त से मिलते हैं! देखो कौन आया है? यह है बहादुर **{name}**! {f'बोलो— {syllable}!' if syllable else ''} **{name}**! {name} बहुत ताकतवर होता है और जंगल में या हमारे खेतों में रहता है। क्या आपको पता है {name} कैसी आवाज़ निकालता है? चलो, मिलकर कोशिश करते हैं! और एक बार फिर से बोलो— {name}!",
        "vehicles": f"पीं-पीं! पों-पों! सड़क पर देखो कितनी हलचल है! यह है हमारी तेज चलने वाली **{name}**! {f'बोलो— {syllable}!' if syllable else ''} **{name}**! {name} हमें स्कूल, बाजार और नानी के घर ले जाती है। {name} के पहिए गोल-गोल घूमते हैं। चलो, अपना काल्पनिक स्टीयरिंग पकड़ो और बोलो— पों-पों! **{name}**!",
        "fruits": f"हम्म! कितनी मीठी महक है! आज हम एक बहुत ही रसीले और ताजे फल के बारे में जानेंगे। यह है हमारा मनपसंद **{name}**! {f'बोलो— {syllable}!' if syllable else ''} **{name}**! फल खाने से हम बहुत शक्तिशाली और सेहतमंद बनते हैं। क्या आपको {name} का स्वाद पसंद है? यह बहुत मीठा है! बोलो मेरे साथ— {name}!",
        "vegetables": f"चलो बच्चों, आज हम रसोई की सैर करते हैं! देखो माँ क्या लाई हैं? अरे वाह, यह तो ताजी और हरी **{name}** है! {f'बोलो— {syllable}!' if syllable else ''} **{name}**! सब्जियां हमारे स्वास्थ्य के लिए बहुत जरूरी होती हैं। {name} खाकर हम खूब सारी ऊर्जा पाते हैं। अगली बार जब आप खाना खाओ, तो जोर से अपनी इस दोस्त का नाम लेना— {name}!",
        "habits": f"नमस्ते प्यारे बच्चों! अच्छी आदतें हमें एक बहुत अच्छा इंसान बनाती हैं। आज हम सीखेंगे— **{name}**। {f'बोलो— {syllable}!' if syllable else ''} **{name}**! अगर हम हर रोज {name} करेंगे, तो हम हमेशा खुश और तंदुरुस्त रहेंगे। चलो, आज ही से हम अपने जीवन में {name} की अच्छी आदत अपनाते हैं। बहुत अच्छे! बोलो एक बार फिर— {name}!",
        "helpers": f"दोस्तों, हमारे आसपास बहुत से ऐसे लोग हैं जो हमारी मदद करते हैं। आज हम मिलेंगे **{name}** जी से! {f'बोलो— {syllable}!' if syllable else ''} **{name}**! {name} बहुत मेहनत करते हैं और हमारी जिंदगी को आसान बनाते हैं। हमें हमेशा {name} का मुस्कुराकर शुक्रिया करना चाहिए। बोलो मेरे साथ— {name}!",
        "nature": f"आओ बच्चों, प्रकृति की सुंदर दुनिया में खो जाएँ! देखो, यह कुदरत का कितना प्यारा तोहफा है— **{name}**! {f'बोलो— {syllable}!' if syllable else ''} **{name}**! हमारी धरती {name} से ही इतनी हरी-भरी और खूबसूरत लगती है। हमें इसकी सफाई और सुरक्षा का ध्यान रखना होगा। अपनी आँखें बंद करो, इसे महसूस करो और बोलो— {name}!",
        "colors": f"वाह! हमारे चारों तरफ कितने सुंदर और प्यारे रंग हैं! आज हम मिलेंगे एक बहुत ही खास रंग से। यह है— **{name}** रंग! **{name}**! अपने आसपास देखो, क्या आपको इस {name} रंग की कोई चीज दिखाई दे रही है? हाँ, वह देखो! वहां भी {name} रंग है! चलो, इस सुंदर रंग का नाम मेरे साथ दोहराओ— {name}!",
        "shapes": f"आओ नन्हे जादूगरों, आकारों की दुनिया में चलें! देखो मेरे पास क्या है? यह है— **{name}** आकार! {f'बोलो— {syllable}!' if syllable else ''} **{name}**! हम अपने घर और खिलौनों में हर जगह {name} आकार देख सकते हैं। क्या आप अपने कमरे में कोई और {name} चीज ढूँढ सकते हैं? चलो, मिलकर ढूँढते हैं और बोलते हैं— {name}!",
        "comparisons": f"आज हम सीखेंगे कि चीजें एक-दूसरे से कैसे अलग होती हैं! देखो, एक बड़ा है और एक छोटा। यह है— **{name}**! **{name}**! क्या आप बता सकते हैं कि इन दोनों में क्या अंतर है? बहुत बढ़िया! यह मजेदार है ना? चलो, एक बार फिर से इस अंतर को दोहराते हैं— {name}!",
        "actions": f"चलो बच्चों, अब थोड़ा खेलने और कूदने की बारी है! आज हम करेंगे— **{name}**! {f'बोलो— {syllable}!' if syllable else ''} **{name}**! क्या आप भी मेरे साथ {name} कर सकते हैं? अरे वाह! आप तो यह बहुत अच्छे से कर रहे हैं। चलो, खूब मस्ती करो और बार-बार बोलो— {name}!",
        "family": f"नमस्ते! परिवार ही हमारा सब कुछ होता है। आज हम मिलेंगे अपने बहुत ही प्यारे **{name}** से! **{name}**! {name} हमें बहुत प्यार करते हैं और हमारा ख्याल रखते हैं। क्या आप अपने {name} को एक प्यार भरी जादू की झप्पी दे सकते हैं? चलो, दौड़ कर जाओ और बोलो— {name}!",
        "objects": f"देखो नन्हे दोस्तों, हमारे घर में कितनी सारी काम की चीजें हैं! यह है— **{name}**। {f'बोलो मेरे साथ— {syllable}!' if syllable else ''} **{name}**! {name} का उपयोग हम अपनी रोजमर्रा की जिंदगी में करते हैं। क्या आप बता सकते हैं कि आप {name} का इस्तेमाल कैसे करते हैं? बहुत ही शानदार! बोलो— {name}!"
    }
    
    cat_lower = category.lower()
    if "color" in cat_lower:
        return scripts["colors"]
    if "animal" in cat_lower or "insect" in cat_lower:
        return scripts["animals"]
    if "place" in cat_lower or "ghar" in cat_lower:
        return scripts["nature"]
    if "food" in cat_lower:
        return scripts["fruits"]
    if "instrument" in cat_lower or "toy" in cat_lower or "magic" in cat_lower or "object" in cat_lower:
        return scripts["objects"]
    if "family" in cat_lower or "parivar" in cat_lower:
        return scripts["family"]
    if "emotions" in cat_lower:
        return scripts["habits"]
        
    return scripts.get(cat_lower, scripts["body_parts"])

async def main():
    print("Extracting short audio metadata directly from JS (UTF-8)...")
    items = get_short_audio_items()
    print(f"Found {len(items)} items to fix.")
    
    # Group by domain
    domain_map = {
        "mera_sansar": {"file": "Mera_Sansar_Audio_Scripts.md", "items": []},
        "rangon_ka_sansar": {"file": "Rangon_Ka_Sansar_Audio_Scripts.md", "items": []},
        "samay_prakriti": {"file": "Samay_Prakriti_Audio_Scripts.md", "items": []},
        "ganit": {"file": "Ganit_Audio_Scripts.md", "items": []}
    }
    
    for item in items:
        # Augment with generated script
        item["script"] = build_script_text(item["name"], item["category"])
        if item["domain"] in domain_map:
            domain_map[item["domain"]]["items"].append(item)
            
    # Write robust markdown and save MP3s phase by phase
    for domain, data in domain_map.items():
        if not data["items"]: continue
        
        # 1. Update Markdown File
        md_path = MD_OUTPUT_DIR / data["file"]
        display_title = data["file"].replace('_', ' ').replace('.md', '')
        content = f"# {display_title}\n\nयह स्क्रिप्ट्स **नीरजा (Neerja)** की आवाज़ में रिकॉर्ड की जानी हैं।\n\n---\n\n"
        
        # Group by category for markdown
        cat_map = {}
        for itm in data["items"]:
            cat_map.setdefault(itm['category'], []).append(itm)
            
        count = 1
        for cat, cat_items in cat_map.items():
            content += f"## {cat.replace('_', ' ').title()}\n\n"
            for itm in cat_items:
                content += f"### {count}. {itm['name']}\n"
                content += f"**समय**: २५-३० सेकंड\n"
                content += f"**फ़ाइल**: `{itm['path']}`\n"
                content += f"**स्क्रिप्ट**:\n\"{itm['script']}\"\n\n"
                count += 1
            content += "---\n\n"
            
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated {data['file']} ({len(data['items'])} scripts)")
        
        # 2. Generate Audio Phase
        print(f"🔊 Starting TTS generation for {domain}...")
        for idx, itm in enumerate(data["items"], 1):
            full_path = AUDIO_BASE_DIR / itm["path"].replace('/', os.sep)
            full_path.parent.mkdir(parents=True, exist_ok=True)
            
            if full_path.exists():
                try:
                    # Resume logic: If the file is already long enough, skip it
                    duration = librosa.get_duration(path=str(full_path))
                    if duration > 10.0:
                        sys.stdout.write(f"  [{idx}/{len(data['items'])}] {itm['name']} -> ✅ (Already long: {duration:.1f}s)\n")
                        continue
                    os.remove(full_path)
                except Exception:
                    pass
                
            # Print without newlines for a clean progress output
            sys.stdout.write(f"  [{idx}/{len(data['items'])}] {itm['name']} -> ")
            sys.stdout.flush()
            
            try:
                communicate = edge_tts.Communicate(itm["script"], VOICE, rate=RATE, pitch=PITCH)
                await communicate.save(str(full_path))
                if full_path.exists():
                    size = os.path.getsize(full_path) / 1024
                    sys.stdout.write(f"✅ ({size:.1f} KB)\n")
                else:
                    sys.stdout.write("❌ Failed\n")
            except Exception as e:
                sys.stdout.write(f"❌ Error: {e}\n")

if __name__ == "__main__":
    asyncio.run(main())
