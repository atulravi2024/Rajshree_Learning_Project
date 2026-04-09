import os
import librosa
import warnings

# Suppress potential warnings from librosa/soundfile
warnings.filterwarnings("ignore")

def get_audio_files(directory, threshold=10.0):
    """
    Finds all audio files in the given directory that are shorter than the threshold.
    """
    audio_files = []
    extensions = ('.mp3', '.wav', '.ogg', '.m4a')
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(extensions):
                file_path = os.path.join(root, file)
                try:
                    duration = librosa.get_duration(path=file_path)
                    if duration < threshold:
                        # Path relative to 'assets/audio'
                        rel_path = os.path.relpath(file_path, directory).replace('\\', '/')
                        audio_files.append({
                            'abs_path': file_path,
                            'rel_path': rel_path,
                            'duration': duration
                        })
                except Exception:
                    pass
    return audio_files

def check_links(audio_files, src_directory):
    """
    Checks if audio files are referenced in the source directory.
    """
    linked = []
    unlinked = []
    
    # Read all source files into memory once for faster searching
    # (assuming the codebase isn't gigabytes)
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
    
    combined_src = "\n".join(src_contents)
    
    for audio in audio_files:
        # Search for the relative path in the source code
        if audio['rel_path'] in combined_src:
            linked.append(audio)
        else:
            unlinked.append(audio)
            
    return linked, unlinked

if __name__ == "__main__":
    audio_dir = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\frontend\public\assets\audio"
    src_dir = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\frontend\src"
    
    print("Gathering audio files shorter than 10 seconds...")
    short_audio = get_audio_files(audio_dir)
    
    print(f"Analyzing {len(short_audio)} files for references in 'frontend/src'...\n")
    linked, unlinked = check_links(short_audio, src_dir)
    
    print(f"--- LINKED FILES ({len(linked)}) ---")
    if linked:
        print(f"{'Relative Path':<80} | {'Duration (s)':<12}")
        print("-" * 95)
        for item in sorted(linked, key=lambda x: x['rel_path']):
            print(f"{item['rel_path']:<80} | {item['duration']:>12.2f}")
    else:
        print("None found.")
        
    print(f"\n--- UNLINKED FILES ({len(unlinked)}) ---")
    if unlinked:
        print(f"{'Relative Path':<80} | {'Duration (s)':<12}")
        print("-" * 95)
        for item in sorted(unlinked, key=lambda x: x['rel_path']):
            print(f"{item['rel_path']:<80} | {item['duration']:>12.2f}")
    else:
        print("None found.")
