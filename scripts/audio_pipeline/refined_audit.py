import os
import re
import json

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

# Curated semantic mappings for better audit
HINDI_TO_ENGLISH = {
    'सूरज': 'sun', 'चांद': 'moon', 'तारा': 'star', 'आसमान': 'sky', 'बादल': 'cloud',
    'इंद्रधनुष': 'rainbow', 'पहाड़': 'mountain', 'नदी': 'river', 'पेड़': 'tree',
    'फूल': 'flower', 'पत्ता': 'leaf', 'कमल': 'lotus', 'खरगोश': 'rabbit',
    'गमला': 'pot', 'घर': 'house', 'चकला': 'rolling', 'छतरी': 'umbrella',
    'जहाज': 'ship', 'झंडा': 'flag', 'टमाटर': 'tomato', 'ठठेरा': 'smith',
    'डमरू': 'drum', 'ढक्कन': 'lid', 'तरबूज': 'watermelon', 'थाली': 'plate',
    'धनुष': 'bow', 'नल': 'tap', 'पतंग': 'kite', 'बत्तख': 'duck', 'भालू': 'bear',
    'मछली': 'fish', 'यज्ञ': 'fire', 'लट्टू': 'top', 'वन': 'forest', 'शलगम': 'turnip',
    'षटकोण': 'hexagon', 'सपेरा': 'snake', 'हाथी': 'elephant', 'एक': 'one',
    'दो': 'two', 'तीन': 'three', 'चार': 'four', 'पाँच': 'five', 'छह': 'six',
    'सात': 'seven', 'आठ': 'eight', 'नौ': 'nine', 'दस': 'ten',
    'पिता': 'father', 'माता': 'mother', 'दादाजी': 'grandfather', 'दादीजी': 'grandmother'
}

EMOJI_TO_WORD = {
    '🌞': 'sun', '🌙': 'moon', '⭐': 'star', '🌌': 'sky', '☁️': 'cloud',
    '🌈': 'rainbow', '⛰️': 'mountain', '🏞️': 'river', '🌳': 'tree',
    '🌸': 'flower', '🍃': 'leaf', '🍎': 'apple', '🍌': 'banana',
    '🦁': 'lion', '🐘': 'elephant', '🐍': 'snake', '🏠': 'house',
    '🐰': 'rabbit', '🐇': 'rabbit', '🌻': 'pot', '🪴': 'pot',
    '🔴': 'red', '🟡': 'yellow', '🟢': 'green', '🔵': 'blue',
    '🟠': 'orange', '🟣': 'purple', '💓': 'pink', '🟤': 'brown',
    '⚫': 'black', '⚪': 'white', '📅': 'calendar', '🗓️': 'calendar',
    '📊': 'table', '📈': 'table', '🗡️': 'dagger', '🌿': 'herb',
    '📖': 'book', '💎': 'gem', '🪐': 'saturn', '❄️': 'snowflake',
    '💘': 'cupid', '🌷': 'tulip', '☔': 'umbrella', '🏖️': 'beach',
    '🍉': 'watermelon', '🌦️': 'sun', '🎃': 'pumpkin', '🍂': 'leaf',
    '🎄': 'tree', '1️⃣': '1', '2️⃣': '2', '3️⃣': '3', '4️⃣': '4',
    '5️⃣': '5', '6️⃣': '6', '7️⃣': '7', '8️⃣': '8', '9️⃣': '9',
    '🔟': '10', '🧪': 'special', '🥄': 'spoon', '🧼': 'soap',
    '🪥': 'brush', '🛀': 'bath', '🌅': 'early', '🙏': 'respect',
    '📚': 'read', '🛌': 'sleep', '🦁': 'lion', '🐅': 'tiger',
    '🐒': 'monkey', '🦒': 'giraffe', '🦓': 'zebra', '🦘': 'kangaroo',
    '🦏': 'rhinoceros', '🦛': 'hippopotamus', '🐊': 'crocodile',
    '🦊': 'fox', '🐺': 'wolf', '🐈': 'cat', '🐎': 'horse',
    '🐑': 'sheep', '🐐': 'goat', '🐷': 'pig', '🐔': 'hen',
    '🫏': 'donkey', '🐪': 'camel', '🦆': 'duck'
}

def parse_js_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r"window\.RAJSHREE_DATA\.\w+\s*=\s*\[(.*?)\];", content, re.DOTALL)
    if not match: return []
    entries = []
    # More robust regex for varied spacing
    obj_pattern = re.compile(r"\{\s*letter:\s*'([^']*)',\s*word:\s*'([^']*)',\s*emoji:\s*'([^']*)',\s*audio:\s*'([^']*)'.*?\}", re.DOTALL)
    for m in obj_pattern.finditer(match.group(1)):
        entries.append({'letter': m.group(1), 'word': m.group(2), 'emoji': m.group(3), 'audio': m.group(4)})
    return entries

def check_match(word, emoji, audio_filename):
    fname = audio_filename.lower()
    word = word.strip()
    
    # 1. Direct word match (English)
    if word.lower() in fname or fname in word.lower().replace(' ', '_'):
        return True
    
    # 2. Hindi word mapping match
    if word in HINDI_TO_ENGLISH:
        eng = HINDI_TO_ENGLISH[word]
        if eng in fname or fname in eng:
            return True
            
    # 3. Emoji mapping match
    if emoji in EMOJI_TO_WORD:
        eng = EMOJI_TO_WORD[emoji]
        if eng in fname or fname in eng:
            return True

    # 4. Special cases (Vyanjan/Swar sounds)
    # If audio filename is just the letter (e.g. 'ka', 'kha'), it's a match for Vyanjan
    if len(fname) <= 4 and (fname in "kakha gagha nga chachha jajha nya tattha daddha nna taattha daadha na papha babha bha ma ya ra la va sha shha sa ha"):
        return True

    return False

def main():
    print("--- Refined Asset Audit (Semantic) ---")
    results = {}
    total_checked = 0

    for root, _, files in os.walk(DATA_DIR):
        for file in files:
            if not file.endswith('.js'): continue
            js_path = os.path.join(root, file)
            rel_js_path = os.path.relpath(js_path, DATA_DIR)
            results[rel_js_path] = []
            
            entries = parse_js_data(js_path)
            for entry in entries:
                total_checked += 1
                audio_rel = entry['audio']
                audio_fname = os.path.splitext(os.path.basename(audio_rel))[0]
                
                if not check_match(entry['word'], entry['emoji'], audio_fname):
                    results[rel_js_path].append({
                        'word': entry['word'],
                        'emoji': entry['emoji'],
                        'audio': audio_rel,
                        'letter': entry['letter']
                    })

    # Generate Report
    report = "# Refined Audit Report\n\nIdentified potential mismatches using semantic mapping (Hindi/Emoji).\n\n"
    mismatch_count = 0
    
    for js_file, mismatches in results.items():
        if mismatches:
            report += f"### {js_file}\n"
            for m in mismatches:
                mismatch_count += 1
                report += f"- **{m['letter']} | {m['word']}** ( {m['emoji']} ) -> `{m['audio']}`\n"
            report += "\n"

    report = f"## Summary\n- Total Audited: {total_checked}\n- Semantic Mismatches: {mismatch_count}\n\n" + report
    
    with open(os.path.join(PROJECT_ROOT, "refined_audit_report.md"), 'w', encoding='utf-8') as f:
        f.write(report)
        
    print(f"Audit Complete! {mismatch_count} mismatches found. See refined_audit_report.md")

if __name__ == "__main__":
    main()
