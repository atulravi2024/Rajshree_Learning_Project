import asyncio
import edge_tts
import os
import re
import io
import sys

# Fix Windows console encoding for Hindi characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Paths
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
MASTER_SCRIPT = os.path.join(PROJECT_ROOT, "memory", "09 Audio Script", "Samay_Prakriti_Audio_Scripts.md")
BASE_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "memory", "09 Audio Script", "samay_prakriti", "audio")

# Voice Settings
VOICE_CONFIG = {
    "hi-IN-SwaraNeural": {
        "voice": "hi-IN-SwaraNeural",
        "rate": "-5%",
        "pitch": "+1Hz"
    },
    "en-IN-NeerjaExpressiveNeural": {
        "voice": "en-IN-NeerjaExpressiveNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    }
}

async def generate_audio(text, output_path, model_name):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    config = VOICE_CONFIG.get(model_name, VOICE_CONFIG["hi-IN-SwaraNeural"])
    
    print(f"Generating ({model_name}) -> {os.path.basename(output_path)}: {text[:50]}...")
    try:
        communicate = edge_tts.Communicate(text, config["voice"], rate=config["rate"], pitch=config["pitch"])
        await communicate.save(output_path)
        if os.path.exists(output_path):
            print(f"  ✅ Saved: {output_path}")
        else:
            print(f"  ❌ Failed: File not created")
    except Exception as e:
        print(f"  ❌ ERROR generating {output_path}: {e}")

async def process_scripts():
    if not os.path.exists(MASTER_SCRIPT):
        print(f"ERROR: Master script not found at {MASTER_SCRIPT}")
        return

    with open(MASTER_SCRIPT, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find blocks:
    # ### [Name]
    # **समय**: [Time]
    # **फ़ाइल**: `[Path]`
    # **मॉडल**: [Model]
    # **स्क्रिप्ट**:
    # "[Text]"
    
    # Updated regex to handle both hi-IN and en-IN models and different label names
    block_pattern = re.compile(
        r"###\s+.*?\n"                   # Header
        r"\*\*समय\*\*:\s+.*?\n"          # Time
        r"\*\*फ़ाइल\*\*:\s+`(.*?)`\n"     # File path
        r"\*\*मॉडल\*\*:\s+(.*?)\n"       # Model name
        r"\*\*स्क्रिप्ट\*\*:\n"           # Script label
        r"\"(.*?)\"",                    # Script text in quotes
        re.DOTALL
    )
    
    matches = block_pattern.findall(content)
    print(f"Found {len(matches)} script entries to process.")
    
    for file_rel_path, model_name, script_text in matches:
        # Sanitize text
        clean_text = re.sub(r"\*\*|\*", "", script_text.strip())
        
        # Determine target path
        # The markdown has paths like 'samay_prakriti/din_maheene/din/day_1.mp3'
        # We want to save into BASE_OUTPUT_DIR, stripping the 'samay_prakriti/' prefix
        clean_rel_path = file_rel_path.replace("samay_prakriti/", "")
        target_path = os.path.join(BASE_OUTPUT_DIR, clean_rel_path)
        
        await generate_audio(clean_text, target_path, model_name.strip())

if __name__ == "__main__":
    asyncio.run(process_scripts())
