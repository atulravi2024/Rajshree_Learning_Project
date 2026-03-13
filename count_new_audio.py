import os
import time

AUDIO_BASE = r"frontend/public/assets/audio"
THRESHOLD = 14400 # 4 hours - covers the last session

def count_new_files():
    new_files = {}
    now = time.time()
    
    for root, dirs, files in os.walk(AUDIO_BASE):
        for file in files:
            if file.endswith('.mp3'):
                path = os.path.join(root, file)
                mtime = os.path.getmtime(path)
                if now - mtime < THRESHOLD:
                    rel_dir = os.path.relpath(root, AUDIO_BASE)
                    new_files[rel_dir] = new_files.get(rel_dir, 0) + 1
    
    # Clean up names for display
    print("New Audio Files Count per Sub-Category:")
    print("-" * 40)
    total = 0
    for folder, count in sorted(new_files.items()):
        # Prettify folder name e.g. names/actions -> Actions
        display_name = folder.replace('\\', '/').split('/')[-1].replace('_', ' ').title()
        print(f"{display_name}: {count}")
        total += count
    print("-" * 40)
    print(f"Total New Audio Files: {total}")

if __name__ == "__main__":
    count_new_files()
