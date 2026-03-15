import os
import re
import sys
import io

# Ensure UTF-8 output for console
if sys.stdout.encoding != 'UTF-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
JS_DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")
AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")
MD_SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "memory", "09 Audio Script")

def get_js_references():
    """Extract all audio: 'path/to/file.mp3' references from JS data files."""
    refs = []
    for root, _, files in os.walk(JS_DATA_DIR):
        for f in files:
            if not f.endswith('.js'):
                continue
            js_path = os.path.join(root, f)
            rel_js_path = os.path.relpath(js_path, PROJECT_ROOT).replace('\\', '/')
            with open(js_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Match audio: '...' or audio: "..."
            for match in re.finditer(r"audio:\s*['\"]([^'\"]+)['\"]", content):
                audio_path = match.group(1)
                refs.append({
                    'js_file': rel_js_path,
                    'audio_path': audio_path,
                    'basename': os.path.basename(audio_path)
                })
    return refs

def get_audio_files_on_disk():
    """Get all .mp3 files in the audio directory."""
    files_on_disk = {}
    for root, _, files in os.walk(AUDIO_DIR):
        for f in files:
            if f.endswith('.mp3'):
                rel_path = os.path.relpath(os.path.join(root, f), AUDIO_DIR).replace('\\', '/')
                files_on_disk[rel_path] = f
    return files_on_disk

def get_md_script_filenames():
    """Extract all (filename.mp3) from MD script files."""
    md_filenames = set()
    if not os.path.exists(MD_SCRIPTS_DIR):
        return md_filenames
        
    for f in os.listdir(MD_SCRIPTS_DIR):
        if f.endswith('.md'):
            md_path = os.path.join(MD_SCRIPTS_DIR, f)
            with open(md_path, 'r', encoding='utf-8') as file:
                content = file.read()
            # Find patterns like (partX/subdir/file.mp3)
            # Some entries might just be (filename.mp3)
            matches = re.findall(r'\(([^)]+\.mp3)\)', content)
            for m in matches:
                md_filenames.add(os.path.basename(m))
    return md_filenames

def run_test():
    print("=" * 60)
    print("RAJSHREE PROJECT - AUDIO LINKING TEST")
    print("=" * 60)

    # 1. Gather data
    js_refs = get_js_references()
    audio_on_disk = get_audio_files_on_disk()
    md_filenames = get_md_script_filenames()

    # 2. Test: Referenced in JS but missing on disk (Broken Links)
    broken_links = []
    for ref in js_refs:
        if ref['audio_path'] not in audio_on_disk:
            # Look for candidates
            basename = ref['basename']
            candidates = [path for path, name in audio_on_disk.items() if name == basename]
            
            # If no exact match, try prefixing/suffixing or common replacements
            if not candidates:
                variants = [
                    f"shape_{basename}",
                    f"color_{basename}",
                    f"animal_{basename}",
                    f"v_{basename}",
                    basename.replace('math/', 'ganit/'),
                ]
                for var in variants:
                    candidates.extend([p for p, n in audio_on_disk.items() if n == var])

            broken_links.append({**ref, 'candidates': candidates})

    # 3. Test: On disk but NOT referenced in any JS (Orphan Audios)
    referenced_paths = set(ref['audio_path'] for ref in js_refs)
    orphan_audios = []
    for disk_path in audio_on_disk:
        if disk_path not in referenced_paths:
            orphan_audios.append(disk_path)

    # 4. Test: In MD script but NOT in any JS (Missing Implementation)
    referenced_basenames = set(ref['basename'] for ref in js_refs)
    missing_implementations = []
    for md_file in md_filenames:
        if md_file not in referenced_basenames:
            missing_implementations.append(md_file)

    # --- RESULTS ---
    
    print(f"\n[SECTION 1] BROKEN LINKS (In JS but missing on Disk): {len(broken_links)}")
    if broken_links:
        for b in broken_links[:20]: 
            print(f"  ❌ {b['js_file']} -> {b['audio_path']}")
            if b['candidates']:
                print(f"     💡 Suggestion: {', '.join(b['candidates'])}")
            else:
                # Try one more deep search for the word
                word = os.path.splitext(b['basename'])[0]
                deep_cands = [p for p in audio_on_disk if word in p]
                if deep_cands:
                    print(f"     🔍 Potential matches: {', '.join(deep_cands[:3])}...")
        
        if len(broken_links) > 20:
            print(f"  ... and {len(broken_links) - 20} more.")
    else:
        print("  ✅ All JS references exist on disk!")

    print(f"\n[SECTION 2] ORPHAN AUDIOS (On Disk but not used in JS): {len(orphan_audios)}")
    print("These files are generated but not linked to any flashcards.")
    if orphan_audios:
        # Group by folder to be cleaner
        folders = {}
        for o in orphan_audios:
            folder = os.path.dirname(o) or "root"
            folders.setdefault(folder, []).append(os.path.basename(o))
            
        sorted_folders = sorted(folders.keys(), key=lambda x: len(folders[x]), reverse=True)
        for f in sorted_folders[:10]:
            count = len(folders[f])
            print(f"  📁 {f}/ ({count} files)")
            # Show a few examples
            examples = folders[f][:5]
            print(f"     e.g., {', '.join(examples)}")

        if len(sorted_folders) > 10:
            print(f"  ... and {len(sorted_folders) - 10} more folders.")
    else:
        print("  ✅ Every audio file on disk is referenced in JS!")

    print(f"\n[SECTION 3] MISSING FROM FRONTEND (In MD Script but not in JS): {len(missing_implementations)}")
    print("These are items defined in your scripts that don't have a flashcard yet.")
    if missing_implementations:
        for m in sorted(missing_implementations)[:20]:
            print(f"  📝 {m}")
        if len(missing_implementations) > 20:
            print(f"  ... and {len(missing_implementations) - 20} more.")
    else:
        print("  ✅ All audio files from scripts are linked in JS!")

    print("\n" + "=" * 60)
    print("SUMMARY")
    print(f"Total JS references: {len(js_refs)}")
    print(f"Total MP3 files on disk: {len(audio_on_disk)}")
    print(f"Total filenames in scripts: {len(md_filenames)}")
    print("=" * 60)

if __name__ == "__main__":
    run_test()
