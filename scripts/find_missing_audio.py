import os
import re

def find_missing_audio(src_directory, audio_directory):
    """
    Finds all audio files referenced in the source code but missing from the audio directory.
    """
    missing_files = {}
    
    # Regex to find audio file paths in strings (e.g., 'mera_sansar/fruits/apple.mp3')
    # Focuses on paths ending in common audio extensions
    audio_regex = re.compile(r'[\'"]([^\'"]+\.(?:mp3|wav|ogg|m4a))[\'"]')
    
    print(f"Scanning source directory: {src_directory}")
    print(f"Base audio directory: {audio_directory}\n")
    
    for root, _, files in os.walk(src_directory):
        for file in files:
            if file.lower().endswith(('.js', '.json', '.html', '.css')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        matches = audio_regex.findall(content)
                        for match in matches:
                            # Normalize path (replace forward/backward slashes to match OS)
                            normalized_match = match.replace('/', os.sep).replace('\\', os.sep)
                            
                            # Construct the absolute path where the file SHOULD be
                            # The references are relative to 'assets/audio' or some other base
                            # Based on previous analysis, they are relative to 'assets/audio'
                            abs_path = os.path.join(audio_directory, normalized_match)
                            
                            if not os.path.exists(abs_path):
                                if match not in missing_files:
                                    missing_files[match] = []
                                missing_files[match].append(os.path.relpath(file_path, src_directory))
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return missing_files

if __name__ == "__main__":
    SRC_DIR = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\frontend\src"
    AUDIO_DIR = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\frontend\public\assets\audio"
    
    missing = find_missing_audio(SRC_DIR, AUDIO_DIR)
    
    if missing:
        print(f"Found {len(missing)} missing audio files:\n")
        print(f"{'Referenced Path':<80} | {'Found in File(s)'}")
        print("-" * 120)
        for ref, files in sorted(missing.items()):
            files_str = ", ".join(files[:2])
            if len(files) > 2:
                files_str += f" (+{len(files)-2} more)"
            print(f"{ref:<80} | {files_str}")
    else:
        print("No missing audio files found. All references exist on disk.")
