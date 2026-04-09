import asyncio
import edge_tts
import os
import re
import io
import sys

# Fix Windows console encoding for Hindi characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Paths
MASTER_SCRIPT = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\memory\09 Audio Script\Mera_Sansar_Audio_Scripts.md"
BASE_DIR = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\memory\09 Audio Script\mera_sansar"
AUDIO_DIR = os.path.join(BASE_DIR, "audio")
VOICE = "hi-IN-SwaraNeural"
RATE = "-5%"
PITCH = "+1Hz"

async def generate_audio(text, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    print(f"Generating ({output_path}): {text[:50]}...")
    try:
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
        await communicate.save(output_path)
    except Exception as e:
        print(f"FAILED to generate {output_path}: {e}")

async def process_scripts():
    if not os.path.exists(AUDIO_DIR):
        os.makedirs(AUDIO_DIR)
        
    with open(MASTER_SCRIPT, "r", encoding="utf-8") as f:
        content = f.read()
                
    # Regex to find Sections
    # ### [Name] ([Char])
    # **फ़ाइल**: `[Path]`
    # **स्क्रिप्ट**:
    # "[Text]"
    
    pattern = re.compile(r"### .*?\n\*\*समय\*\*:.*?\n\*\*फ़ाइल\*\*: `(.*?)`\n\*\*स्क्रिप्ट\*\*:\n\"(.*?)\"", re.DOTALL)
    matches = pattern.findall(content)
    
    for file_rel_path, script_text in matches:
        # Strip markdown formatting like **bold** or *italic*
        clean_text = re.sub(r"\*\*|\*", "", script_text.strip())
        
        # Strip the 'mera_sansar/' prefix if it exists to avoid redundancy
        clean_path = file_rel_path.replace("mera_sansar/", "")
        target_path = os.path.join(AUDIO_DIR, clean_path)
        
        await generate_audio(clean_text, target_path)

if __name__ == "__main__":
    asyncio.run(process_scripts())
