import re

FILE_PATH = r'c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\memory\06 Internal Audit\v2.0\map\country\india.js'

with open(FILE_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match city entries: "city_name": { lat: ..., lon: ... }
city_pattern = re.compile(r'"[^"]+":\s*{\s*lat:\s*-?\d+\.?\d*,\s*lon:\s*-?\d+\.?\d*\s*}')
matches = city_pattern.findall(content)

# Group by state to check coverage
state_pattern = re.compile(r'"([^"]+)":\s*{')
states = state_pattern.findall(content)
# The first match is window.LOCATION_DATA["india"], so we skip it or filter
# Actually, let's just count total cities first.
total_cities = len(matches)

print(f"Total city entries found in india.js: {total_cities}")
