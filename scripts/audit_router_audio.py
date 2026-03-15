import os
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

# Collect all valid audio files on disk
valid_paths = set()
for root, _, files in os.walk(AUDIO_DIR):
    for f in files:
        if f.endswith('.mp3'):
            rel = os.path.relpath(os.path.join(root, f), AUDIO_DIR).replace('\\', '/')
            valid_paths.add(rel)

# Read all audio file paths referenced inside the router.js (they use object literals)
ROUTER_PATH = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "navigation", "router.js")

with open(ROUTER_PATH, 'r', encoding='utf-8') as f:
    router_content = f.read()

# Find all string dict values (of the form 'key': 'path/to/audio.mp3')
print("=== ROUTER.JS -- All mp3 References ===\n")
all_mp3_in_router = re.findall(r"['\"]([^'\"]+\.mp3)['\"]", router_content)

missing_in_router = []
for path in all_mp3_in_router:
    clean = path
    full = os.path.join(AUDIO_DIR, clean.replace('/', os.sep))
    exists = os.path.exists(full)
    status = "OK  " if exists else "MISS"
    print(f"  [{status}] {path}")
    if not exists:
        missing_in_router.append(path)

print(f"\n=== Missing: {len(missing_in_router)} ===")
for p in missing_in_router:
    print(f"  MISSING: {p}")
