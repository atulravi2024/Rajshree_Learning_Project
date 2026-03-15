import os
import librosa
import warnings
import re

# Suppress potential warnings from librosa/soundfile
warnings.filterwarnings("ignore")

def get_all_audio_files(directory):
    """
    Returns a list of all audio files with their relative paths and durations.
    """
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
    """
    Reads all source files into a single string for searching.
    """
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
    """
    Extracts the 'core' word from a filename stem.
    e.g., 'body_arm' -> 'arm', 'habit_brushing' -> 'brushing', '1_apple' -> 'apple'
    """
    # Remove numbers and surrounding underscores/hyphens
    clean = re.sub(r'^[0-9_\-]+', '', stem)
    clean = re.sub(r'[0-9_\-]+$', '', clean)
    # Split by underscore/hyphen and take the last part (heuristic)
    parts = re.split(r'[_ \-]+', clean)
    if not parts:
        return stem
    return parts[-1].lower()

def analyze_alternatives(audio_dir, src_dir):
    print("Gathering all audio files...")
    all_audio = get_all_audio_files(audio_dir)
    
    print("Reading source code...")
    src_text = get_src_contents(src_dir)
    
    # Categorize linked vs unlinked
    linked = []
    unlinked = []
    for audio in all_audio:
        if audio['rel_path'] in src_text:
            linked.append(audio)
        else:
            unlinked.append(audio)
    
    print(f"Total: {len(all_audio)} | Linked: {len(linked)} | Unlinked: {len(unlinked)}\n")
    
    results = []
    
    for un in unlinked:
        core = extract_core_word(un['stem'])
        alternatives = []
        for l in linked:
            # If the linked file's stem contains the core word of the unlinked file
            if core in l['stem'].lower():
                alternatives.append(l['rel_path'])
        
        results.append({
            'unlinked_path': un['rel_path'],
            'duration': un['duration'],
            'core_word': core,
            'linked_alternatives': alternatives
        })
        
    return results

if __name__ == "__main__":
    AUDIO_DIR = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\frontend\public\assets\audio"
    SRC_DIR = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\frontend\src"
    
    analysis = analyze_alternatives(AUDIO_DIR, SRC_DIR)
    
    print(f"{'Unlinked Path':<60} | {'Linked Alternatives':<60}")
    print("-" * 125)
    
    with_alt = 0
    for item in analysis:
        if item['linked_alternatives']:
            with_alt += 1
            alts = ", ".join(item['linked_alternatives'][:2]) # Show first 2
            if len(item['linked_alternatives']) > 2:
                alts += f" (+{len(item['linked_alternatives'])-2} more)"
            print(f"{item['unlinked_path']:<60} | {alts:<60}")
            
    print(f"\nSummary: {with_alt} unlinked files have potential linked alternatives.")
    print(f"{len(analysis) - with_alt} unlinked files have NO linked alternatives.")
