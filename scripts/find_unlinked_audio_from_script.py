import os
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
SCRIPT_PATH = os.path.join(PROJECT_ROOT, "memory", "09 Audio Script", "new_hindi_audio_scripts.md")

# 1. Get all audio paths from JS data files
js_referenced_audios = set()
for root, _, files in os.walk(DATA_DIR):
    for f in files:
        if not f.endswith('.js'):
            continue
        js_path = os.path.join(root, f)
        with open(js_path, 'r', encoding='utf-8') as file:
            content = file.read()
        for match in re.finditer(r"audio:\s*['\"]([^'\"]+)['\"]", content):
            audio_path = match.group(1)
            js_referenced_audios.add(os.path.basename(audio_path))

# 2. Extract filenames from the MD script
with open(SCRIPT_PATH, 'r', encoding='utf-8') as f:
    script_content = f.read()

script_filenames = re.findall(r'\((.*?\.mp3)\)', script_content)

print(f"Total filenames in script: {len(script_filenames)}")
print(f"Total distinct filenames referenced in JS: {len(js_referenced_audios)}")

unlinked = []
for filename in script_filenames:
    if filename not in js_referenced_audios:
        unlinked.append(filename)

print(f"\nFilenames in script but NOT referenced in any JS data file: {len(unlinked)}")
for u in unlinked:
    print(f"  {u}")
