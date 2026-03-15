import os
import re

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

# Collect all valid audio files
valid_audio_files = {}

for root, _, files in os.walk(AUDIO_DIR):
    for f in files:
        if f.endswith('.mp3') or f.endswith('.flac') or f.endswith('.wav') or f.endswith('.ogg'):
            rel_path = os.path.relpath(os.path.join(root, f), AUDIO_DIR).replace('\\', '/')
            if f not in valid_audio_files:
                valid_audio_files[f] = []
            valid_audio_files[f].append(rel_path)
            
            # also index without v_ prefix for swar
            if f.startswith('v_'):
                no_v_f = f[2:]
                if no_v_f not in valid_audio_files:
                    valid_audio_files[no_v_f] = []
                valid_audio_files[no_v_f].append(rel_path)

# Also index animal_dog.mp3 as dog.mp3
for f in list(valid_audio_files.keys()):
    if f.startswith('animal_'):
        no_animal_f = f[7:]
        if no_animal_f not in valid_audio_files:
            valid_audio_files[no_animal_f] = []
        valid_audio_files[no_animal_f].extend(valid_audio_files[f])

for root, _, files in os.walk(DATA_DIR):
    for f in files:
        if not f.endswith('.js'):
            continue
            
        js_path = os.path.join(root, f)
        with open(js_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        new_content = content
        
        matches = re.finditer(r"audio:\s*['\"]([^'\"]+)['\"]", content)
        for match in matches:
            full_match = match.group(0)
            audio_path = match.group(1)
            
            # Check if current path exists
            full_audio_path = os.path.join(AUDIO_DIR, audio_path.replace('/', os.sep))
            if os.path.exists(full_audio_path):
                continue
                
            basename = os.path.basename(audio_path)
            
            # Special logic for vyanjan fallback since ga_new.mp3 might not exist, maybe ga.mp3 exists?
            if basename not in valid_audio_files:
                base_no_ext, ext = os.path.splitext(basename)
                if base_no_ext.endswith('_new'):
                    fallback = base_no_ext[:-4] + ext
                    if fallback in valid_audio_files:
                        basename = fallback
            
            target = None
            if basename in valid_audio_files:
                targets = valid_audio_files[basename]
                
                # Filter by simple logic: if it's animals_wild, prefer wild/
                if 'wild' in js_path and any('wild' in t for t in targets):
                    targets = [t for t in targets if 'wild' in t]
                elif 'domestic' in js_path and any('domestic' in t for t in targets):
                    targets = [t for t in targets if 'domestic' in t]
                elif 'vyanjan' in js_path and any('vyanjan' in t for t in targets):
                    targets = [t for t in targets if 'vyanjan' in t]
                    
                target = targets[0]
                
            if target:
                print(f"[{f}] Fix: {audio_path} -> {target}")
                new_content = new_content.replace(f"audio: '{audio_path}'", f"audio: '{target}'")
                new_content = new_content.replace(f'audio: "{audio_path}"', f"audio: '{target}'")
            else:
                print(f"[{f}] Warning: Could not find valid replacement for {audio_path}")
                
        if new_content != content:
            with open(js_path, 'w', encoding='utf-8') as file:
                file.write(new_content)

print("Done scanning and fixing.")
