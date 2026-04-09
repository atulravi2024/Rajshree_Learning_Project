import os
import re
import librosa
import warnings
import sys
from pathlib import Path

# Set stdout to UTF-8 to handle Hindi characters and emojis
if sys.stdout.encoding != 'utf-8':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

# Suppress librosa/soundfile warnings
warnings.filterwarnings("ignore")

def verify_flashcard_audio():
    # Paths
    BASE_DIR = Path(r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project")
    DATA_DIR = BASE_DIR / "frontend" / "shared" / "data"
    AUDIO_BASE_DIR = BASE_DIR / "frontend" / "assets" / "audio"
    
    # Results
    no_audio_link = []
    missing_audio_file = []
    short_audio = []
    dynamic_links = []
    
    # regex for objects: handles both single line and multi-line.
    # We'll look for chunks that start with { and contain audio: and end with }
    # This is still not perfect for deeply nested JS but better for our flashcard data.
    object_pattern = re.compile(r'\{[^{]*?audio:.*?\}', re.DOTALL)
    
    # Pattern to find audio property inside an object
    # Handles both ' and " and ` (template literals)
    audio_pattern = re.compile(r'audio:\s*[`\'"]([^`\'"]*)[\'"`]')
    
    # Patterns to find identification properties
    id_properties = ['value', 'word', 'letter', 'text', 'english', 'hindi']
    
    print(f"Scanning data directory: {DATA_DIR}")
    print(f"Audio base directory: {AUDIO_BASE_DIR}")
    print("-" * 60)

    for root, _, files in os.walk(DATA_DIR):
        for file in files:
            if file.endswith('.js'):
                file_path = Path(root) / file
                rel_file_path = file_path.relative_to(DATA_DIR)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Find all flashcard objects that contain an audio property
                        objects = object_pattern.findall(content)
                        
                        for obj in objects:
                            # Identify the flashcard - capture all available info
                            details = {}
                            for prop in id_properties:
                                pattern = re.compile(fr'{prop}:\s*[`\'"]([^`\'"]*)[\'"`]')
                                m = pattern.search(obj)
                                if m and m.group(1).strip():
                                    details[prop] = m.group(1).strip()
                            
                            # Construct a human-readable name
                            # Preference: word > value > letter
                            name_parts = []
                            if 'word' in details: name_parts.append(details['word'])
                            if 'value' in details and details['value'] != details.get('word'): 
                                name_parts.append(f"({details['value']})")
                            if 'english' in details: name_parts.append(f"[{details['english']}]")
                            
                            display_name = " ".join(name_parts) if name_parts else "Unknown"
                            
                            # Check audio property
                            audio_match = audio_pattern.search(obj)
                            
                            if not audio_match or not audio_match.group(1).strip():
                                no_audio_link.append(f"{rel_file_path}: {display_name}")
                            else:
                                audio_rel_path = audio_match.group(1)
                                
                                # Skip dynamic paths like ${n}
                                if '${' in audio_rel_path:
                                    dynamic_links.append(f"{rel_file_path}: {display_name} (Dynamic: {audio_rel_path})")
                                    continue
                                    
                                full_audio_path = AUDIO_BASE_DIR / audio_rel_path.replace('/', os.sep)
                                
                                if not full_audio_path.exists():
                                    missing_audio_file.append(f"{rel_file_path}: {display_name} (Link: {audio_rel_path})")
                                else:
                                    try:
                                        duration = librosa.get_duration(path=str(full_audio_path))
                                        if duration <= 10.0:
                                            short_audio.append({
                                                "id": f"{rel_file_path}: {display_name}",
                                                "path": audio_rel_path,
                                                "file_path": rel_file_path,
                                                "duration": duration
                                            })
                                    except Exception as e:
                                        print(f"Error checking duration for {full_audio_path}: {e}")
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

    # Report Results
    print("\n" + "=" * 80)
    print("HUMAN-READABLE VERIFICATION REPORT")
    print("=" * 80)
    print("Note: This report shows full words and phonetic syllables for easier identification.")

    print(f"\n[!] Flashcards WITHOUT ANY audio link ({len(no_audio_link)}):")
    if no_audio_link:
        for item in no_audio_link:
            try:
                print(f" - {item}")
            except UnicodeEncodeError:
                print(f" - {item.encode('ascii', 'replace').decode('ascii')}")
    else:
        print(" None found.")

    print(f"\n[!] Flashcards with BROKEN audio links ({len(missing_audio_file)}):")
    if missing_audio_file:
        for item in missing_audio_file:
            try:
                print(f" - {item}")
            except UnicodeEncodeError:
                print(f" - {item.encode('ascii', 'replace').decode('ascii')}")
    else:
        print(" None found.")

    print(f"\n[!] Content with audio LESS THAN OR EQUAL TO 10 seconds ({len(short_audio)}):")
    if short_audio:
        print(f"{'Flashcard Detail':<60} | {'Duration (s)':<12}")
        print("-" * 75)
        for item in sorted(short_audio, key=lambda x: x['duration']):
            try:
                print(f"{item['id']:<60} | {item['duration']:>12.2f}")
            except UnicodeEncodeError:
                safe_id = item['id'].encode('ascii', 'replace').decode('ascii')
                print(f"{safe_id:<60} | {item['duration']:>12.2f}")
    else:
        print(" None found.")

    if dynamic_links:
        print(f"\n[i] Detected {len(dynamic_links)} dynamic links (could not verify existence/duration automatically).")

    print("\n" + "=" * 80)

if __name__ == "__main__":
    verify_flashcard_audio()
