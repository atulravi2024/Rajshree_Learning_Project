import os
import json
import datetime

# --- CONFIGURATION ---
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MOCKUP_ASSETS_DIR = os.path.join(PROJECT_ROOT, "memory", "06 Internal Audit", "v2.0", "Mockups", "assets")
MANIFEST_PATH = os.path.join(MOCKUP_ASSETS_DIR, "asset_manifest.js")

EXCLUDE_DIRS = {'.git', 'node_modules', '.venv', '.vscode', '__pycache__', '.pytest_cache'}
EXCLUDE_FILES = {'package-lock.json', 'yarn.lock', '.gitignore'}

# Extension to Type Mapping
EXT_MAP = {
    '.mp3': 'audio',
    '.wav': 'audio',
    '.ogg': 'audio',
    '.m4a': 'audio',
    '.png': 'visual',
    '.jpg': 'visual',
    '.jpeg': 'visual',
    '.webp': 'visual',
    '.svg': 'visual',
    '.gif': 'animation',
    '.mp4': 'video',
    '.webm': 'video',
    '.mov': 'video',
    '.mkv': 'video',
    '.md': 'doc',
    '.txt': 'doc',
    '.pdf': 'doc',
    '.json': 'data', # Default, will be checked for Lottie
    '.js': 'data',
    '.css': 'style',
    '.html': 'doc',
    '.py': 'data'
}

def is_lottie(filepath):
    """Checks if a JSON file is a Lottie animation."""
    if not filepath.endswith('.json'):
        return False
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            data = json.load(f)
            # Lottie files usually have "v" (version), "fr" (frame rate), "ip" (in point), "op" (out point)
            return all(k in data for k in ('v', 'fr', 'ip', 'op'))
    except Exception:
        return False

def get_category_from_path(rel_path):
    """Infers category from folder structure."""
    parts = rel_path.replace('\\', '/').split('/')
    if len(parts) > 1:
        # e.g., frontend/public/assets/audio/varnamala/swar -> Varnamala Swar
        # We take the last two folders if available
        if 'assets' in parts:
            idx = parts.index('assets')
            sub_parts = parts[idx+1:-1]
            if sub_parts:
                return " ".join([p.capitalize() for p in sub_parts])
        return parts[0].capitalize()
    return "Root"

def format_size(size_bytes):
    """Formats size for display."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"

def scan_project():
    assets = []
    print(f"Scanning project root: {PROJECT_ROOT}")
    
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        for file in files:
            if file in EXCLUDE_FILES or file.startswith('.'):
                continue
                
            filepath = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()
            
            if ext not in EXT_MAP:
                continue
                
            asset_type = EXT_MAP[ext]
            
            # Special check for Lottie
            if asset_type == 'data' and is_lottie(filepath):
                asset_type = 'animation'
            
            # Special check for Voice Library (based on path)
            rel_path = os.path.relpath(filepath, PROJECT_ROOT)
            if 'audio/varnamala' in rel_path.lower() or 'audio/mera_sansar' in rel_path.lower():
                if asset_type == 'audio':
                    asset_type = 'voice'

            # Special check for Icon Library (based on path)
            if 'images/icons' in rel_path.lower():
                asset_type = 'icon'

            # Risk and Compliance (Mocked logic)
            risk = 5
            if asset_type in ['data', 'log']: risk = 15
            if 'gis' in rel_path.lower(): risk = 20
            
            stats = os.stat(filepath)
            size_bytes = stats.st_size
            mod_date = datetime.datetime.fromtimestamp(stats.st_mtime).strftime('%Y-%m-%d')
            
            # Path relative to the mockup assets folder
            # Mockup is at memory/06 Internal Audit/v2.0/Mockups/assets/
            # To get to PROJECT_ROOT, we go up 5 levels: ../../../../../
            mockup_rel_path = "../../../../../" + rel_path.replace('\\', '/')
            
            # Context Engine: Generate Real Metadata
            use_case = "System Resource"
            strategic_purpose = "Supports core project functionality."
            
            # Heuristic Analysis
            low_path = rel_path.lower().replace('\\', '/')
            
            if 'audio/varnamala' in low_path:
                use_case = "Linguistic Education"
                category_name = "Swar" if 'swar' in low_path else "Vyanjan"
                strategic_purpose = f"Provides high-fidelity voice-over for the '{category_name}' (Hindi Alphabet) literacy module."
            elif 'audio/ganit' in low_path:
                use_case = "Mathematical Literacy"
                if 'numbers' in low_path:
                    strategic_purpose = "Facilitates number recognition and counting skills for preschool learners."
                else:
                    strategic_purpose = "Teaches conceptual comparisons (Big/Small, Near/Far) through interactive audio."
            elif 'frontend/public/assets' in low_path:
                use_case = "Interface Asset"
                strategic_purpose = "Ensures a high-fidelity, engaging visual experience for the target 3-5 year age group."
            elif 'backend' in low_path:
                use_case = "Infrastructure Logic"
                strategic_purpose = "Handles critical server-side operations, including TTS generation and data processing."
            elif 'database' in low_path:
                use_case = "Data Architecture"
                strategic_purpose = "Maintains project state and provides structured schemas for application scaling."
            elif low_path.endswith('.md'):
                use_case = "System Documentation"
                strategic_purpose = "Codifies project rules, workflows, and developer guidelines for internal auditing."
            elif low_path.endswith('.js') or low_path.endswith('.css'):
                use_case = "Style/Logic Component"
                strategic_purpose = "Defines the Frontier/Lead Auditor design language and interactive application behavior."

            assets.append({
                "name": file,
                "type": asset_type,
                "category": get_category_from_path(rel_path),
                "size": format_size(size_bytes),
                "sizeBytes": size_bytes,
                "date": mod_date,
                "path": mockup_rel_path,
                "risk": risk,
                "compliance": 1,
                "perf": 100 if size_bytes < 100000 else (90 if size_bytes < 1000000 else 80),
                "use": use_case,
                "purpose": strategic_purpose
            })
            
    return assets

def write_manifest(assets):
    header = """/**
 * RAJSHREE LEARNING PROJECT // ASSET MANIFEST
 * This file is automatically generated by scripts/scan_project.py
 * DO NOT MODIFY MANUALLY.
 */

window.PROJECT_ASSETS = """
    
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        f.write(header)
        json.dump(assets, f, indent=4)
        f.write(";\n")
    
    print(f"Manifest written to: {MANIFEST_PATH}")
    print(f"Total assets found: {len(assets)}")

if __name__ == "__main__":
    assets = scan_project()
    write_manifest(assets)
