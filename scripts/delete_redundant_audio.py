import os
import librosa
import warnings
import re

# Suppress potential warnings from librosa/soundfile
warnings.filterwarnings("ignore")

def get_all_audio_files(directory):
    audio_files = []
    extensions = ('.mp3', '.wav', '.ogg', '.m4a')
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(extensions):
                file_path = os.path.join(root, file)
                try:
                    duration = librosa.get_duration(path=file_path)
                    rel_path = os.path.relpath(file_path, directory).replace('\\', '/')
                    audio_files.append({
                        'abs_path': file_path,
                        'rel_path': rel_path,
                        'filename': file,
                        'stem': os.path.splitext(file)[0],
                        'duration': duration
                    })
                except Exception:
                    pass
    return audio_files

def get_src_contents(src_directory):
    src_contents = []
    for root, _, files in os.walk(src_directory):
        for file in files:
            if file.lower().endswith(('.js', '.json', '.html', '.css')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        src_contents.append(f.read())
                except Exception:
                    pass
    return "\n".join(src_contents)

def extract_core_word(stem):
    clean = re.sub(r'^[0-9_\-]+', '', stem)
    clean = re.sub(r'[0-9_\-]+$', '', clean)
    parts = re.split(r'[_ \-]+', clean)
    if not parts:
        return stem
    return parts[-1].lower()

def identify_redundant_files(audio_dir, src_dir):
    all_audio = get_all_audio_files(audio_dir)
    src_text = get_src_contents(src_dir)
    
    linked = [a for a in all_audio if a['rel_path'] in src_text]
    unlinked = [a for a in all_audio if a['rel_path'] not in src_text]
    
    redundant = []
    for un in unlinked:
        core = extract_core_word(un['stem'])
        for l in linked:
            if core in l['stem'].lower():
                redundant.append(un)
                break
    return redundant

if __name__ == "__main__":
    AUDIO_DIR = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\frontend\public\assets\audio"
    SRC_DIR = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\frontend\src"
    
    redundant_files = identify_redundant_files(AUDIO_DIR, SRC_DIR)
    
    print(f"Found {len(redundant_files)} redundant files to delete.\n")
    
    deleted_count = 0
    for file in redundant_files:
        try:
            os.remove(file['abs_path'])
            print(f"Deleted: {file['rel_path']}")
            deleted_count += 1
        except Exception as e:
            print(f"Error deleting {file['rel_path']}: {e}")
            
    print(f"\nTotal files deleted: {deleted_count}")
