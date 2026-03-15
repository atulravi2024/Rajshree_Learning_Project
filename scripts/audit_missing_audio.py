import os
import re

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

# Collect all valid audio files by filename
valid_audio_files = {}
for root, _, files in os.walk(AUDIO_DIR):
    for f in files:
        if f.endswith('.mp3'):
            rel_path = os.path.relpath(os.path.join(root, f), AUDIO_DIR).replace('\\', '/')
            valid_audio_files.setdefault(f, []).append(rel_path)

missing = []

for root, _, files in os.walk(DATA_DIR):
    for f in files:
        if not f.endswith('.js'):
            continue
        js_path = os.path.join(root, f)
        with open(js_path, 'r', encoding='utf-8') as file:
            content = file.read()

        for match in re.finditer(r"audio:\s*['\"]([^'\"]+)['\"]", content):
            audio_path = match.group(1)
            full_path = os.path.join(AUDIO_DIR, audio_path.replace('/', os.sep))
            if not os.path.exists(full_path):
                basename = os.path.basename(audio_path)
                candidates = valid_audio_files.get(basename, [])
                missing.append({
                    "file": f,
                    "path": audio_path,
                    "basename": basename,
                    "candidates": candidates
                })

print(f"\nTotal missing audio references: {len(missing)}\n")
for m in missing:
    cands = ", ".join(m['candidates']) if m['candidates'] else "NO MATCH FOUND"
    print(f"  [{m['file']}] {m['path']}")
    print(f"    -> Candidates: {cands}")
