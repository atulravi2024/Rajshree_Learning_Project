
import os
import re

PROJECT_ROOT = r"C:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project"
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

def normalize(name):
    # Remove extension, lowercase, and remove non-alphanumeric, and remove common fillers like 'and', 'the', 'col', 'v'
    name = os.path.splitext(name)[0].lower()
    name = re.sub(r'[^a-z0-9]', '', name)
    name = name.replace('and', '').replace('the', '').replace('col', '').replace('v', '')
    return name

def get_all_audio_files():
    audio_files = {}
    for root, _, files in os.walk(AUDIO_DIR):
        for f in files:
            if f.endswith('.mp3'):
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, AUDIO_DIR).replace('\\', '/')
                size = os.path.getsize(full_path)
                audio_files[rel_path] = size
    return audio_files

def relink_audio():
    audio_files = get_all_audio_files()
    linked_files = set()
    
    # First pass: find what's already linked
    for root, _, files in os.walk(DATA_DIR):
        for f in files:
            if f.endswith('.js'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as js_file:
                    content = js_file.read()
                    matches = re.findall(r"audio:\s*['\"]([^'\"]+)['\"]", content)
                    for m in matches:
                        linked_files.add(m)
    
    # Second pass: find orphans
    orphans = {path: (size, normalize(os.path.basename(path))) for path, size in audio_files.items() if path not in linked_files}
    
    print(f"Found {len(orphans)} orphans.")
    
    relinked_count = 0
    
    # Third pass: analyze JS files
    for root, _, files in os.walk(DATA_DIR):
        for f in files:
            if f.endswith('.js'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as js_file:
                    original_content = js_file.read()
                
                content = original_content
                audio_links = re.findall(r"audio:\s*['\"]([^'\"]+)['\"]", content)
                
                for link in audio_links:
                    current_size = audio_files.get(link, 0)
                    norm_link = normalize(os.path.basename(link))
                    
                    best_orphan = None
                    max_size = current_size
                    
                    for orphan_path, (orphan_size, norm_orphan) in orphans.items():
                        if norm_orphan == norm_link:
                            if orphan_size > max_size + 1000: # At least 1KB larger to avoid trivial changes
                                max_size = orphan_size
                                best_orphan = orphan_path
                    
                    if best_orphan:
                        print(f"Smart Relinking {link} ({current_size}B) -> {best_orphan} ({max_size}B) in {f}")
                        content = content.replace(link, best_orphan)
                        relinked_count += 1
                
                if content != original_content:
                    with open(path, 'w', encoding='utf-8') as js_file:
                        js_file.write(content)
                        
    print(f"Smart Relinked {relinked_count} files.")

if __name__ == "__main__":
    relink_audio()
