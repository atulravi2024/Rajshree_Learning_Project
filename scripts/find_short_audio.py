import os
import librosa
import warnings

# Suppress potential warnings from librosa/soundfile
warnings.filterwarnings("ignore")

def find_short_audio_files(directory, threshold=10.0):
    """
    Finds all audio files in the given directory that are shorter than the threshold in seconds.
    """
    short_files = []
    
    # Supported audio extensions
    extensions = ('.mp3', '.wav', '.ogg', '.m4a')
    
    print(f"Scanning directory: {directory}")
    print(f"Threshold: {threshold} seconds\n")
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(extensions):
                file_path = os.path.join(root, file)
                try:
                    # Using librosa to get duration
                    duration = librosa.get_duration(path=file_path)
                    if duration < threshold:
                        short_files.append((file_path, duration))
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    
    return short_files

if __name__ == "__main__":
    audio_dir = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\frontend\public\assets\audio"
    
    if not os.path.exists(audio_dir):
        print(f"Error: Directory not found: {audio_dir}")
    else:
        results = find_short_audio_files(audio_dir)
        
        if results:
            print(f"Found {len(results)} files shorter than 10 seconds:\n")
            print(f"{'Path':<100} | {'Duration (s)':<12}")
            print("-" * 115)
            for path, duration in results:
                # Get relative path for cleaner output
                rel_path = os.path.relpath(path, audio_dir)
                print(f"{rel_path:<100} | {duration:>12.2f}")
        else:
            print("No audio files shorter than 10 seconds found.")
