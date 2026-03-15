import os
import re

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
JS_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

# Collect all valid audio files on disk (relative to AUDIO_DIR)
valid_paths = set()
for root, _, files in os.walk(AUDIO_DIR):
    for f in files:
        if f.endswith('.mp3'):
            rel = os.path.relpath(os.path.join(root, f), AUDIO_DIR).replace('\\', '/')
            valid_paths.add(rel)

missing = []

# Search all JS files for string literals that end in .mp3
for root, _, files in os.walk(JS_DIR):
    for f in files:
        if not f.endswith('.js'):
            continue
        js_path = os.path.join(root, f)
        with open(js_path, 'r', encoding='utf-8') as file:
            content = file.read()

        for match in re.finditer(r"['\"]([^'\"]*\.mp3)['\"]", content):
            audio_path = match.group(1)
            # Normalise — strip leading assets/audio/ if present
            clean = audio_path
            if clean.startswith('assets/audio/'):
                clean = clean[len('assets/audio/'):]

            full_path = os.path.join(AUDIO_DIR, clean.replace('/', os.sep))
            if not os.path.exists(full_path):
                missing.append({
                    "js_file": os.path.relpath(js_path, PROJECT_ROOT).replace('\\', '/'),
                    "path_in_code": audio_path,
                    "normalized": clean,
                })

print(f"\nTotal missing audio references across ALL JS files: {len(missing)}\n")
for m in missing:
    print(f"  [{m['js_file']}]")
    print(f"    Code path : {m['path_in_code']}")
    print(f"    Normalized: {m['normalized']}")
    print()
