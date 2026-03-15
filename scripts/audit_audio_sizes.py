import os
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

# Collect all valid audio files on disk keyed by relative path
on_disk = {}
for root, _, files in os.walk(AUDIO_DIR):
    for f in files:
        if f.endswith('.mp3'):
            rel = os.path.relpath(os.path.join(root, f), AUDIO_DIR).replace('\\', '/')
            size = os.path.getsize(os.path.join(root, f))
            on_disk[rel] = size

# Find every audio path referenced in data JS files
referenced = {}  # path -> list of js files referencing it
for root, _, files in os.walk(DATA_DIR):
    for f in files:
        if not f.endswith('.js'):
            continue
        js_path = os.path.join(root, f)
        with open(js_path, 'r', encoding='utf-8') as file:
            content = file.read()
        for match in re.finditer(r"audio:\s*['\"]([^'\"]+)['\"]", content):
            audio_path = match.group(1)
            referenced.setdefault(audio_path, []).append(f)

print(f"Total distinct audio paths referenced in data: {len(referenced)}")
print()

missing = []
small = []
ok = []

for path, sources in sorted(referenced.items()):
    if path not in on_disk:
        missing.append((path, sources))
    elif on_disk[path] < 1000:  # Less than 1KB - probably placeholder
        small.append((path, on_disk[path], sources))
    else:
        ok.append((path, on_disk[path]))

print(f"=== MISSING ({len(missing)}) ===")
for path, sources in missing:
    print(f"  {path}  (in: {', '.join(sources)})")

print()
print(f"=== TOO SMALL / LIKELY BROKEN ({len(small)}) ===")
for path, size, sources in small:
    print(f"  {path}  ({size} bytes)  (in: {', '.join(sources)})")

print()
print(f"=== OK ({len(ok)}) ===")
for path, size in ok:
    print(f"  {path}  ({size} bytes)")
