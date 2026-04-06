
import os
import re

root_dir = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project"
exclude_dirs = ["node_modules", ".git"]

css_files = []
for root, dirs, files in os.walk(root_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith(".css") or file.endswith(".html"):
            css_files.append(os.path.join(root, file))

for file_path in css_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            if "user-select" in content:
                # Find occurrences of user-select: that don't have -webkit-user-select nearby
                lines = content.splitlines()
                for i, line in enumerate(lines):
                    if "user-select" in line and "-webkit-user-select" not in line:
                        # Check previous and next lines
                        found_webkit = False
                        if i > 0 and "-webkit-user-select" in lines[i-1]:
                            found_webkit = True
                        if i < len(lines) - 1 and "-webkit-user-select" in lines[i+1]:
                            found_webkit = True
                        
                        if not found_webkit:
                            print(f"MISSING: {file_path}:{i+1}: {line.strip()}")
                    elif "-webkit-user-select" in line and "user-select" not in line:
                         # Check if user-select is missing nearby
                        found_std = False
                        if i > 0 and "user-select" in lines[i-1] and "-webkit-" not in lines[i-1]:
                            found_std = True
                        if i < len(lines) - 1 and "user-select" in lines[i+1] and "-webkit-" not in lines[i+1]:
                            found_std = True
                        
                        if not found_std:
                            # If it has -webkit but not standard, that's also weird but the user asked for -webkit.
                            # Standard is usually there if -webkit is there, but let's check.
                            pass
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
