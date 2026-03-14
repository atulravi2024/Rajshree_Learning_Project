import os
import re
import asyncio
import edge_tts  # type: ignore[import-not-found]
import sys
import io

# Fix Windows console encoding for Hindi characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
BASE_AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")
MD_PATH = os.path.join(PROJECT_ROOT, "memory", "09 Audio Script", "new_hindi_audio_scripts.md")

VOICE = "hi-IN-SwaraNeural"
RATE = "-5%"
PITCH = "+1Hz"

def find_audio_file_dir(filename):
    for root, dirs, files in os.walk(BASE_AUDIO_DIR):
        if filename in files:
            return root
    return None

async def main():
    print(f"Reading MD file: {MD_PATH}")
    with open(MD_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = re.split(r'### \d+\.', content)[1:]
    
    success_count = 0
    fail_count = 0
    
    for block in blocks:
        match_file = re.search(r'\((.*?\.mp3)\)', block)
        if not match_file: 
            continue
        filename = match_file.group(1).strip()
        
        match_text = re.search(r'"(.*?)"', block, re.DOTALL)
        if not match_text: 
            print(f"Warning: No text found for {filename}")
            continue
        
        text = match_text.group(1).strip().replace('\n', ' ')
        
        target_dir = find_audio_file_dir(filename)
        
        if not target_dir:
            # Fallbacks based on category if the file doesn't exist yet
            if "shape_" in filename:
                target_dir = os.path.join(BASE_AUDIO_DIR, "ganit", "shapes")
            elif "comp_" in filename:
                target_dir = os.path.join(BASE_AUDIO_DIR, "ganit", "comparisons")
            elif "family_" in filename:
                target_dir = os.path.join(BASE_AUDIO_DIR, "mera_sansar", "family")
            elif "nature_" in filename or "summer" in filename:
                target_dir = os.path.join(BASE_AUDIO_DIR, "samay_prakriti", "nature")
            else:
                # Animals
                animal_domestic = ["sheep", "camel", "cat", "dog", "horse", "cow"]
                animal_wild = ["bear", "elephant", "monkey", "tiger", "lion", "zebra", "snake"]
                name_without_ext = filename.replace(".mp3", "")
                if name_without_ext in animal_domestic:
                    target_dir = os.path.join(BASE_AUDIO_DIR, "mera_sansar", "animals", "domestic")
                elif name_without_ext in animal_wild:
                    target_dir = os.path.join(BASE_AUDIO_DIR, "mera_sansar", "animals", "wild")
                else:
                    target_dir = BASE_AUDIO_DIR
            
            os.makedirs(target_dir, exist_ok=True)
            
        full_path = os.path.join(target_dir, filename)
        
        print(f"Generating {filename} -> {full_path}")
        try:
            communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
            await communicate.save(full_path)
            
            if os.path.exists(full_path):
                print(f"  ✅ Success")
                success_count += 1
            else:
                print(f"  ❌ Failed to save")
                fail_count += 1
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            fail_count += 1

    print(f"\nDone. Success: {success_count}, Failed: {fail_count}")

if __name__ == "__main__":
    asyncio.run(main())
