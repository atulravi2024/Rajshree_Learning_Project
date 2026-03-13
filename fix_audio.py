import os
import re
import asyncio
import edge_tts

DATA_DIR = r"frontend/src/js/data"
AUDIO_DIR = r"frontend/public/assets/audio"
VOICE = "hi-IN-SwaraNeural"
PITCH = "+25Hz"

async def process_files():
    missing_count = 0
    generated_count = 0
    for root, dirs, files in os.walk(DATA_DIR):
        for file in files:
            if not file.endswith('.js'): continue
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            new_lines = []
            changed = False
            for line in lines:
                audio_match = re.search(r"audio:\s*['\"](.*?)['\"]", line)
                if audio_match:
                    orig_audio = audio_match.group(1)
                    clean_audio = orig_audio.replace('../assets/audio/', '').replace('assets/audio/', '')
                    if orig_audio != clean_audio:
                        line = line.replace(f"'{orig_audio}'", f"'{clean_audio}'")
                        line = line.replace(f'"{orig_audio}"', f'"{clean_audio}"')
                        changed = True
                    
                    full_audio_path = os.path.join(AUDIO_DIR, clean_audio.replace('/', os.sep))
                    
                    if not os.path.exists(full_audio_path):
                        missing_count += 1
                        letter_match = re.search(r"letter:\s*['\"](.*?)['\"]", line)
                        word_match = re.search(r"word:\s*['\"](.*?)['\"]", line)
                        
                        # handle template literals or missing loosely
                        letter = letter_match.group(1) if letter_match else ""
                        word = word_match.group(1) if word_match else ""
                        
                        text_to_speak = letter
                        # If word has hindi characters, prefer word as it usually is more descriptive like 'खाना' instead of just 'खा'
                        if any('\u0900' <= c <= '\u097F' for c in word):
                            text_to_speak = word
                        
                        if not text_to_speak:
                            text_to_speak = word or letter
                            
                        if "पहाड़ा" in word or "पहाड़ा" in letter:
                            # e.g. letter='11', word='पहाड़ा'
                            # Should say: ग्यारह का पहाड़ा, but passing '11 का पहाड़ा' usually works
                            num = re.sub(r'[^\d]', '', letter)
                            if num:
                                text_to_speak = f"{num} का पहाड़ा"
                            else:
                                text_to_speak = letter + " " + word
                                
                        # In Matra like "क + उ"
                        if "+" in letter:
                            text_to_speak = word
                            
                        # if empty fallback
                        if not text_to_speak.strip():
                            text_to_speak = "ध्वनि"
                            
                        print(f"[{file}] Missing: {clean_audio} -> Saying: '{text_to_speak}'")
                        os.makedirs(os.path.dirname(full_audio_path), exist_ok=True)
                        
                        max_retries = 3
                        for attempt in range(max_retries):
                            try:
                                communicate = edge_tts.Communicate(text_to_speak, VOICE, pitch=PITCH)
                                await communicate.save(full_audio_path)
                                generated_count += 1
                                break
                            except Exception as e:
                                print(f"Attempt {attempt+1} failed for {clean_audio}: {e}")
                                if attempt == max_retries - 1:
                                    print(f"Failed to generate {clean_audio}")
                                await asyncio.sleep(2)
                new_lines.append(line)
            
            if changed:
                with open(path, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)

    print(f"Total missing: {missing_count}, Generated: {generated_count}")

if __name__ == "__main__":
    asyncio.run(process_files())
