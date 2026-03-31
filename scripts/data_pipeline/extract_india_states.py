import json

with open(r'c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\global_states.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

india_states = {}
for state in data:
    if state.get('country_code') == 'IN':
        india_states[state.get('iso2')] = state.get('name')

print(json.dumps(india_states, indent=4))
