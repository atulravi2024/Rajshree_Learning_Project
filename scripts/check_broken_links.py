
import os
import re

PROJECT_ROOT = r"C:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project"
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

def check_broken_links():
    broken = []
    for root, _, files in os.walk(DATA_DIR):
        for f in files:
            if f.endswith('.js'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as js_file:
                    content = js_file.read()
                    matches = re.findall(r"audio:\s*['\"]([^'\"]+)['\"]", content)
                    for m in matches:
                        audio_path = os.path.join(AUDIO_BASE_DIR, m.replace('/', os.sep))
                        if not os.path.exists(audio_path):
                            broken.append((f, m))
    
    if broken:
        print(f"Found {len(broken)} broken links:")
        for file, link in broken:
            print(f"{file}: {link}")
    else:
        print("No broken links found!")

if __name__ == "__main__":
    # Correction: I used AUDIO_BASE_DIR which is not defined in the scope of this script if I just copy-pasted.
    # Fixed below.
    AUDIO_BASE_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")
    check_broken_links()
