import json
import os

# Config Paths
EXHAUSTIVE_JSON = r'c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\india_exhaustive.json'
GLOBAL_STATES_JSON = r'c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\global_states.json'
OUTPUT_FILE = r'c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\memory\06 Internal Audit\v2.0\map\country\india.js'

# State mapping manual check/override for official 36 States/UTs
STATE_MAP = {
    "AN": "Andaman and Nicobar Islands",
    "AP": "Andhra Pradesh",
    "AR": "Arunachal Pradesh",
    "AS": "Assam",
    "BR": "Bihar",
    "CH": "Chandigarh",
    "CT": "Chhattisgarh",
    "DH": "Dadra and Nagar Haveli and Daman and Diu",
    "DL": "Delhi",
    "GA": "Goa",
    "GJ": "Gujarat",
    "HR": "Haryana",
    "HP": "Himachal Pradesh",
    "JK": "Jammu and Kashmir",
    "JH": "Jharkhand",
    "KA": "Karnataka",
    "KL": "Kerala",
    "LA": "Ladakh",
    "LD": "Lakshadweep",
    "MP": "Madhya Pradesh",
    "MH": "Maharashtra",
    "MN": "Manipur",
    "ML": "Meghalaya",
    "MZ": "Mizoram",
    "NL": "Nagaland",
    "OR": "Odisha",
    "PY": "Puducherry",
    "PB": "Punjab",
    "RJ": "Rajasthan",
    "SK": "Sikkim",
    "TN": "Tamil Nadu",
    "TG": "Telangana",
    "TR": "Tripura",
    "UP": "Uttar Pradesh",
    "UK": "Uttarakhand",
    "WB": "West Bengal"
}

def generate_js():
    print("Loading exhaustive city data...")
    with open(EXHAUSTIVE_JSON, 'r', encoding='utf-8') as f:
        cities_data = json.load(f)

    print(f"Loaded {len(cities_data)} cities.")

    # Group by state
    grouped = {}
    for state_name in STATE_MAP.values():
        grouped[state_name] = {}

    count = 0
    for city in cities_data:
        # Only process cities for India (country code IN)
        if city.get('country_code') != 'IN':
            continue
            
        state_code = city.get('state_code')
        if state_code in STATE_MAP:
            state_name = STATE_MAP[state_code]
            city_name = city.get('name')
            # Use lower-case city name as key for search compatibility (as per existing file)
            city_key = city_name.lower()
            lat = float(city.get('latitude'))
            lon = float(city.get('longitude'))
            
            # Use small float precision (7 decimal places)
            grouped[state_name][city_key] = {"lat": round(lat, 7), "lon": round(lon, 7)}
            count += 1

    print(f"Mapped {count} cities to {len(grouped)} states/UTs.")

    # Generate the JS content
    lines = [
        "// Indian States and Cities Data",
        "window.LOCATION_DATA = window.LOCATION_DATA || {};",
        "",
        'window.LOCATION_DATA["india"] = {'
    ]

    # Sort states for consistency
    sorted_states = sorted(grouped.keys())

    for i, state in enumerate(sorted_states):
        lines.append(f'    "{state}": {{')
        
        # Sort cities for consistency
        cities = grouped[state]
        sorted_city_keys = sorted(cities.keys())
        
        for j, city_key in enumerate(sorted_city_keys):
            lat = cities[city_key]["lat"]
            lon = cities[city_key]["lon"]
            comma = "," if j < len(sorted_city_keys) - 1 else ""
            lines.append(f'        "{city_key}": {{ lat: {lat}, lon: {lon} }}{comma}')
        
        state_comma = "," if i < len(sorted_states) - 1 else ""
        lines.append(f'    }}{state_comma}')

    lines.append("};")
    lines.append("")
    lines.append("// Flatten to global dictionary for search compatibility")
    lines.append("if (window.LOCATION_COORDS) {")
    lines.append('    for (const state in window.LOCATION_DATA["india"]) {')
    lines.append('        const cities = window.LOCATION_DATA["india"][state];')
    lines.append("        for (const city in cities) {")
    lines.append('            window.LOCATION_COORDS[city.toLowerCase()] = cities[city];')
    lines.append("        }")
    lines.append("    }")
    lines.append("}")

    js_content = "\n".join(lines)

    # Write to file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"Generated {OUTPUT_FILE} successfully.")

if __name__ == "__main__":
    generate_js()
