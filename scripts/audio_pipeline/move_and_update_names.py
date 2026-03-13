import os
import re
import shutil

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

def get_new_audio_path(old_audio_path, js_path):
    """
    Given old_audio_path like 'names/vegetables/potato.mp3'
    and js_path like '.../data/mera_sansar/vegetables.js'
    we want to return 'mera_sansar/vegetables/potato.mp3'
    """
    js_rel_dir = os.path.relpath(os.path.dirname(js_path), DATA_DIR).replace('\\', '/')
    return old_audio_path.replace("names/", f"{js_rel_dir}/", 1)

def main():
    moved_files = 0
    updated_js_files = 0
    
    for root, dirs, files in os.walk(DATA_DIR):
        for file in files:
            if not file.endswith('.js'): continue
            
            js_path = os.path.join(root, file)
            with open(js_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content = content
            lines = content.splitlines()
            changed = False
            
            # Find all instances of "names/..."
            for line in lines:
                match = re.search(r"audio:\s*['\"](names/[^'\"]+)['\"]", line)
                if match:
                    old_rel_path = match.group(1)
                    new_rel_path = get_new_audio_path(old_rel_path, js_path)
                    
                    # File moving logic
                    old_full_path = os.path.join(AUDIO_DIR, old_rel_path.replace('/', os.sep))
                    new_full_path = os.path.join(AUDIO_DIR, new_rel_path.replace('/', os.sep))
                    
                    if os.path.exists(old_full_path):
                        os.makedirs(os.path.dirname(new_full_path), exist_ok=True)
                        shutil.move(old_full_path, new_full_path)
                        moved_files += 1
                        print(f"Moved: {old_rel_path} -> {new_rel_path}")
                    elif os.path.exists(new_full_path):
                        # Already moved
                        pass
                    else:
                        print(f"Warning: Audio file not found: {old_full_path}")
                        
                    # Update JS content
                    old_str = f"'{old_rel_path}'"
                    new_str = f"'{new_rel_path}'"
                    if old_str in new_content:
                        new_content = new_content.replace(old_str, new_str)
                        changed = True
                    else:
                        old_str_double = f'"{old_rel_path}"'
                        new_str_double = f'"{new_rel_path}"'
                        if old_str_double in new_content:
                            new_content = new_content.replace(old_str_double, new_str_double)
                            changed = True

            if changed:
                with open(js_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                updated_js_files += 1
                print(f"Updated JS references in: {os.path.basename(js_path)}")

    print(f"\nSummary:")
    print(f"Files moved: {moved_files}")
    print(f"JS files updated: {updated_js_files}")
    
    # Try removing the now-empty names directory tree
    names_dir = os.path.join(AUDIO_DIR, "names")
    if os.path.exists(names_dir):
        try:
            shutil.rmtree(names_dir)
            print("Removed empty 'names' directory.")
        except Exception as e:
            print(f"Could not remove 'names' directory: {e}")

if __name__ == "__main__":
    main()
