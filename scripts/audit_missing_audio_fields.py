import os
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")

missing_audio_field = []
empty_audio_field = []

for root, _, files in os.walk(DATA_DIR):
    for f in files:
        if not f.endswith('.js'):
            continue
        js_path = os.path.join(root, f)
        with open(js_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Look for object literals in arrays, like { ... }
        # This is a very rough regex but should find objects
        objects = re.findall(r'\{[^{}]+\}', content)
        
        for obj in objects:
            # Check if it has an audio property
            if 'audio:' not in obj:
                missing_audio_field.append((f, obj))
            else:
                # Check if audio property is empty string
                match = re.search(r"audio:\s*['\"](['\"])", obj)
                if match:
                    empty_audio_field.append((f, obj))

print(f"Flashcards missing 'audio' field: {len(missing_audio_field)}")
for f, obj in missing_audio_field[:20]: # Show first 20
    print(f"  [{f}] -> {obj.strip()}")

print(f"\nFlashcards with empty 'audio' field: {len(empty_audio_field)}")
for f, obj in empty_audio_field[:20]:
    print(f"  [{f}] -> {obj.strip()}")
