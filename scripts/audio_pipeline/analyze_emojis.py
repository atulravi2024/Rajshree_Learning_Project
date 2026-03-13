import os
import re

emojis = {}
data_dir = 'frontend/src/js/data'

for root, _, files in os.walk(data_dir):
    for f in files:
        if f.endswith('.js'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                for line in file:
                    match = re.search(r"emoji:\s*'([^']*)'", line)
                    if match:
                        e = match.group(1)
                        if e:
                            emojis[e] = emojis.get(e, 0) + 1

for e, count in sorted(emojis.items(), key=lambda x: x[1], reverse=True):
    print(f"{count}: {e}")
