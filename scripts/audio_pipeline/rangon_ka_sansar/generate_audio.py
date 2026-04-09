import os
import asyncio
import edge_tts
import re

# --- Configuration ---
SCRIPT_PATH = r"memory/09 Audio Script/Rangon_Ka_Sansar_Audio_Scripts.md"
OUTPUT_DIR = r"memory/09 Audio Script/rangon_ka_sansar/audio"

VOICE_MAP = {
    "en-IN-NeerjaExpressiveNeural": "en-IN-NeerjaExpressiveNeural",
    "hi-IN-SwaraNeural": "hi-IN-SwaraNeural"
}

# --- Cleanup Logic ---
def clean_text(text):
    """Removes quotes and extra whitespace."""
    text = text.strip()
    if text.startswith('"') and text.endswith('"'):
        text = text[1:-1]
    # Remove markdown bold/italic just in case
    text = text.replace("**", "").replace("_", "")
    return text.strip()

# --- Parser ---
def parse_scripts(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find each entry
    # Expecting: ### [Number]. [Name] \n **समय**: ... \n **फ़ाइल**: ... \n **मॉडल**: ... \n **स्क्रिप्ट**: \n "[Text]"
    entries = []
    
    # Split by ### to get each item
    raw_entries = re.split(r'###\s+\d+\.', content)[1:]
    
    for entry in raw_entries:
        try:
            # Extract basic info
            file_match = re.search(r'\*\*फ़ाइल\*\*:\s*`?([^`\n]+)`?', entry)
            model_match = re.search(r'\*\*मॉडल\*\*:\s*([^\n]+)', entry)
            script_match = re.search(r'\*\*स्क्रिप्ट\*\*:\s*(?:["\'])(.*?)(?:["\'])', entry, re.DOTALL)
            
            if file_match and model_match and script_match:
                # Clean file name (remove subdir prefix if it matches output dir name)
                file_name = file_match.group(1).split('/')[-1]
                
                entries.append({
                    "file_name": file_name,
                    "model": model_match.group(1).strip(),
                    "text": clean_text(script_match.group(1))
                })
        except Exception as e:
            print(f"Error parsing entry: {e}")
            
    return entries

# --- TTS Generator ---
async def generate_audio(entry):
    voice = VOICE_MAP.get(entry['model'], "hi-IN-SwaraNeural")
    output_path = os.path.join(OUTPUT_DIR, entry['file_name'])
    
    # Ensure subdirectory exists if file_name has one (though we stripped it above)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    print(f"Generating: {entry['file_name']} with {voice}...")
    
    communicate = edge_tts.Communicate(entry['text'], voice)
    await communicate.save(output_path)

async def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    scripts = parse_scripts(SCRIPT_PATH)
    print(f"Found {len(scripts)} script entries to process.")
    
    for entry in scripts:
        await generate_audio(entry)
    
    print("\n✅ All audio files generated successfully.")

if __name__ == "__main__":
    asyncio.run(main())
