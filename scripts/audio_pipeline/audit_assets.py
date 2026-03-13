import os
import re
import json

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

def parse_js_data(file_path):
    """
    Parses the data array from a JS file using regex.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to find the array content [...]
    # Matches: window.RAJSHREE_DATA.key = [ ... ];
    match = re.search(r"window\.RAJSHREE_DATA\.\w+\s*=\s*\[(.*?)\];", content, re.DOTALL)
    if not match:
        return []
    
    array_content = match.group(1).strip()
    
    # Now parse individual objects { ... }
    # Using a slightly safer regex than just splitting by comma
    entries = []
    # Match { letter: '...', word: '...', emoji: '...', audio: '...', textOnly: ... }
    obj_pattern = re.compile(r"\{\s*letter:\s*'([^']*)',\s*word:\s*'([^']*)',\s*emoji:\s*'([^']*)',\s*audio:\s*'([^']*)'.*?\}", re.DOTALL)
    
    for m in obj_pattern.finditer(array_content):
        entries.append({
            'letter': m.group(1),
            'word': m.group(2),
            'emoji': m.group(3),
            'audio': m.group(4)
        })
    
    return entries

def main():
    print(f"--- Starting Asset Audit ---")
    print(f"Data Dir: {DATA_DIR}")
    print(f"Audio Dir: {AUDIO_DIR}")
    print("-" * 50)

    mismatches = []
    missing_files = []
    total_checked = 0

    for root, _, files in os.walk(DATA_DIR):
        for file in files:
            if not file.endswith('.js'):
                continue
            
            js_path = os.path.join(root, file)
            rel_js_path = os.path.relpath(js_path, DATA_DIR)
            
            entries = parse_js_data(js_path)
            
            for entry in entries:
                total_checked += 1
                audio_rel_path = entry['audio']
                word = entry['word']
                
                audio_full_path = os.path.join(AUDIO_DIR, audio_rel_path.replace('/', os.sep))
                
                # 1. Check if audio file exists
                if not os.path.exists(audio_full_path):
                    missing_files.append({
                        'js_file': rel_js_path,
                        'word': word,
                        'audio_path': audio_rel_path
                    })
                    continue
                
                # 2. Heuristic Check: Does audio filename match the word?
                # Case sensitivity and extensions
                audio_filename = os.path.splitext(os.path.basename(audio_rel_path))[0].lower()
                
                # For English words, easy check
                # For Hindi words, we might not have the English translation in the JS currently
                # But many audio files are named after the English word.
                
                # If word is English, check directly
                if re.match(r"^[A-Za-z\s\-]+$", word):
                    word_clean = word.lower().replace(' ', '_')
                    if word_clean not in audio_filename and audio_filename not in word_clean:
                         mismatches.append({
                            'js_file': rel_js_path,
                            'word': word,
                            'audio_filename': audio_filename,
                            'reason': 'Name mismatch (English)'
                        })
    
    print(f"\nAudit Complete!")
    print(f"Total Entries Checked: {total_checked}")
    print(f"Missing Audio Files: {len(missing_files)}")
    print(f"Potential Mismatches: {len(mismatches)}")
    
    if missing_files:
        print("\nMISSING AUDIO FILES:")
        for m in missing_files:
            print(f"  - [{m['js_file']}] {m['word']} -> {m['audio_path']}")
            
    if mismatches:
        print("\nPOTENTIAL NAME MISMATCHES:")
        for m in mismatches:
            print(f"  - [{m['js_file']}] Word: '{m['word']}' | Audio: '{m['audio_filename']}' | Reason: {m['reason']}")

    # Save report to artifact directory
    report_content = f"# Audit Report\n\n"
    report_content += f"## Summary\n- Total Entries Checked: {total_checked}\n- Missing Audio Files: {len(missing_files)}\n- Potential Mismatches: {len(mismatches)}\n\n"
    
    if missing_files:
        report_content += "## Missing Audio Files\n"
        for m in missing_files:
            report_content += f"- **[{m['js_file']}]** {m['word']} -> `{m['audio_path']}`\n"
            
    if mismatches:
        report_content += "\n## Potential Name Mismatches\n"
        for m in mismatches:
            report_content += f"- **[{m['js_file']}]** Word: '{m['word']}' | Audio: `{m['audio_filename']}` | Reason: {m['reason']}\n"

    with open(os.path.join(PROJECT_ROOT, "audit_report.md"), 'w', encoding='utf-8') as f:
        f.write(report_content)
    
    print(f"\nDetailed report saved to: audit_report.md")

if __name__ == "__main__":
    main()
