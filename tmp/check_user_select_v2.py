
import os

root_dir = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project"
exclude_dirs = ["node_modules", ".git"]

def check_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            if "user-select" in content:
                lines = content.splitlines()
                for i, line in enumerate(lines):
                    if "user-select" in line and "-webkit-user-select" not in line:
                        # Check context /- 2 lines
                        found = False
                        for j in range(max(0, i-2), min(len(lines), i+3)):
                            if "-webkit-user-select" in lines[j]:
                                found = True
                                break
                        if not found:
                            print(f"MISSING_WEBKIT|{file_path}|{i+1}|{line.strip()}")
    except Exception as e:
        print(f"ERROR|{file_path}|{e}")

for root, dirs, files in os.walk(root_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith((".css", ".html", ".js")):
            check_file(os.path.join(root, file))
