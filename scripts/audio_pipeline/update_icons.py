import os
import re

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "frontend", "src", "js", "data")

# Comprehensive Mapping
MAPPING = {
    # Numbers 1-10
    '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣',
    '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣', '10': '🔟',
    'एक': '1️⃣', 'दो': '2️⃣', 'तीन': '3️⃣', 'चार': '4️⃣', 'पाँच': '5️⃣',
    'छह': '6️⃣', 'सात': '7️⃣', 'आठ': '8️⃣', 'नौ': '9️⃣', 'दस': '🔟',

    # Days
    'Monday': '🌙', 'Tuesday': '🗡️', 'Wednesday': '🌿', 'Thursday': '📖',
    'Friday': '💎', 'Saturday': '🪐', 'Sunday': '🌞',
    'सोमवार': '🌙', 'मंगलवार': '🗡️', 'बुधवार': '🌿', 'गुरुवार': '📖',
    'शुक्रवार': '💎', 'शनिवार': '🪐', 'रविवार': '🌞',

    # Months
    'January': '❄️', 'February': '💘', 'March': '🌷', 'April': '☔',
    'May': '☀️', 'June': '🏖️', 'July': '🍉', 'August': '🌦️',
    'September': '🍎', 'October': '🎃', 'November': '🍂', 'December': '🎄',
    'जनवरी': '❄️', 'फरवरी': '💘', 'मार्च': '🌷', 'अप्रैल': '☔',
    'मई': '☀️', 'जून': '🏖️', 'जुलाई': '🍉', 'अगस्त': '🌦️',
    'सितंबर': '🍎', 'अक्टूबर': '🎃', 'नवंबर': '🍂', 'दिसंबर': '🎄',

    # Colors
    'Red': '🔴', 'Blue': '🔵', 'Green': '🟢', 'Yellow': '🟡', 'Orange': '🟠',
    'Purple': '🟣', 'Pink': '💓', 'Brown': '🟤', 'Black': '⚫', 'White': '⚪',
    'लाल': '🔴', 'नीला': '🔵', 'हरा': '🟢', 'पीला': '🟡', 'नारंगी': '🟠',
    'बैंगनी': '🟣', 'गुलाबी': '💓', 'भूरा': '🟤', 'काला': '⚫', 'सफ़ेद': '⚪',
    'चम्पई': '🟡', 'बसन्ती': '🌼', 'मूँगिया': '🍃', 'जामुनी': '🍇', 'अनारी': '🍎',
    'स्लेटी': '🩶', 'खुला-बंद': '📖', 'साफ़-गंदा': '✨', 'साफ़': '✨', 'गंदा': '💩',
    
    # Comparisons
    'बड़ा-छोटा': '🐘🐭', 'लंबा-पस्त': '🦒🐶', 'मोटा-पतला': '🐘🦒',
    'भारी-हल्का': '🧱🎈', 'ऊपर-नीचे': '⬆️⬇️', 'अन्दर-बाहर': '🏠🚪',
    'पास-दूर': '📍🏔️', 'खुला-बंद': '📖📕', 'तेज़-धीरे': '🚀🐢',
    'सूखा-गीला': '⛱️🌧️', 'चौड़ा-सँकरा': '🛣️🛤️', 'सख्त-मुलायम': '🪨🧸',
    'भरा-खाली': '🥛💧', 'दिन-रात': '☀️🌙'
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    changed = False
    new_lines = []
    
    for line in lines:
        new_line = line
        # Match entry: { letter: '...', word: '...', emoji: '...', ... }
        match = re.search(r"\{\s*letter:\s*'([^']*)',\s*word:\s*'([^']*)',\s*emoji:\s*'([^']*)'", line)
        if match:
            letter, word, original_emoji = match.groups()
            
            # Check if we should update based on word or letter
            new_emoji = original_emoji
            if word in MAPPING:
                new_emoji = MAPPING[word]
            elif letter in MAPPING:
                new_emoji = MAPPING[letter]
            
            if new_emoji != original_emoji:
                new_line = line.replace(f"emoji: '{original_emoji}'", f"emoji: '{new_emoji}'")
                changed = True
        
        new_lines.append(new_line)
    
    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    print("--- Starting Bulk Icon Update ---")
    files_updated = 0
    for root, _, files in os.walk(DATA_DIR):
        for file in files:
            if file.endswith('.js'):
                if update_file(os.path.join(root, file)):
                    print(f"Updated: {file}")
                    files_updated += 1
    print(f"Total files updated: {files_updated}")

if __name__ == "__main__":
    main()
