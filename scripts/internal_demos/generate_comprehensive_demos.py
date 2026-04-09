import asyncio
import edge_tts
import os
import re
import io
import sys

# Fix console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

MASTER_SCRIPT = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\memory\09 Audio Script\Mera_Sansar_Audio_Scripts.md"
DEMO_DIR = r"c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\memory\09 Audio Script\mera_sansar\demo_comparison"

VOICES_SETTINGS = [
    {
        "name": "Swara",
        "voice": "hi-IN-SwaraNeural",
        "rate": "-5%",
        "pitch": "+1Hz",
    },
    {
        "name": "Neerja",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
    }
]

# Mapping Categories to a good English transliteration keyword for filenames
FILE_KEYS = {
    "Activities": "Kneading",
    "Smaller Animals": "Snail",
    "Wild Animals": "Deer",
    "Birds": "Peacock",
    "Body Parts": "Teeth",
    "Clothes": "Shoes",
    "Emotions": "Respect",
    "Family": "Elders",
    "Festivals": "Holi",
    "Food": "Barfi",
    "Games": "Top_Spinning",
    "Habits": "Washing_Hands",
    "Helpers": "Doctor",
    "Imagination": "Cloud",
    "Insects": "Butterfly",
    "Magic": "Treasure_Map",
    "Objects": "Wheel",
    "Places": "Fair",
    "Sounds": "Laughing",
    "Toys": "Kitchen_Set"
}

# Simplified Manual Hinglish Translation for Neerja Demo
HINGLISH_MAP = {
    "आटा गूँथना": "Chalo rasoi mein chalkar dekhte hain mummy kya kar rahi hain. Are, yeh hai— Aata goonthna! Aata goonthkar hi toh gol-gol rotiyan banti hain. Kya aapne kabhi aate ke saath khelne ki koshish ki hai? Yeh kitna naram hota hai! Bolo mere saath— Aata goonthna!",
    "घोंघा": "Dekho bacchon, zameen par dheere-dheere kaun chal raha hai? Yeh chhoti si cheez hai— Ghongha! Iske upar ek mazboot khol hota hai, jisme yeh chhup jata hai. Yeh bahut shaant jeev hai. Kya aap bhi ghonghe ki tarah dheere-dheere chal sakte hain? Bahut acche! Bolo— Ghongha!",
    "हिरण": "Jangal ki ghaas mein dekho kaun chhupkar baitha hai? Yeh hai sundar aur tez daudne wala— Hiran! Iske kaan bahut tez hote hain aur yeh bahut unchi chhalaang laga sakta hai. Kya aap bhi hiran ki tarah uchhal sakte ho? Hop-hop-hop! Waah! Bolo— Hiran!",
    "मोर": "Dekho-dekho, kitne sundar rangeen pankh hain! Yeh hai humara rashtriya pakshi— Mor! Jab baarish hoti hai, toh mor apne pankh failakar jhoom-jhoom kar naachta hai. Kya aap bhi mor ki tarah naach kar dikha sakte ho? Me-yaoo-me-yaoo! Waah! Bolo— Mor!",
    "दाँत": "Ek badi si muskaan dijiye! Kya aapko safed-safed cheezein dikh rahi hain? Yeh hain aapke— Daant! Daant khaana chabaane mein humari madad karte hain. Humein din mein do baar brush karna chahiye. Chalo, brush karne ka abhinay karo. Shabaash! Bolo— Daant!",
    "जूते": "Chalo, baahar khelne ki taiyaari karte hain! Apne pairon mein kya pahnoge? Hum pehnenge— Joote! Joote pehenkar humare pair surakshit rehte hain aur hum kahin bhi ja sakte hain. Kya aapne apne joote pehen liye? Khat-khat-khat! Chalo chalte hain! Bolo— Joote!",
    "सम्मान": "Jab hum badon ke pair chhoote hain ya 'Namaste' kehte hain, toh hum kya dete hain? Hum dete hain— Samman. Doosron ka samman karne se sab humein pyaar karte hain. Chalo, haath jodkar sabko namaste karo. Bahut pyaare bacche! Bolo— Samman.",
    "बुज़ुर्ग": "Humare ghar mein rehne waale dada-dadi ya nana-nani ko hum kehte hain— Buzurg. Unke paas kahaniyon ka dher hota hai aur woh humein bahut gyan dete hain. Chalo, apne ghar ke buzurgon ko jaakar ek pyaari si muskaan do. Bolo— Buzurg!",
    "होली": "Bura na maano holi hai! Rangon aur khushiyon ka tyauhaar aa gaya hai— Holi! Laal, peela, hara— har taraf rang hi rang hain! Kya aapke paas bhi pichkari hai? Chalo, milkar rang udaate hain. Happy Holi! Bolo— Holi!",
    "बर्फी": "Safed rang ki aur chakor aakaar ki yeh kya cheez hai? Yeh hai humari meethi— Barfi. Yeh doodh se banti hai aur munh mein jaate hi ghul jaati hai. Kya aapne barfi khaakar dekhi hai? Yeh toh bahut swadisht hai! Bolo— Barfi!",
    "लट्टू": "Dekho bacchon, yeh gol-gol gol-gol kaise ghoom raha hai! Yeh hai humara— Lattoo. Zameen par lattoo ko nachaane mein kitna maza aata hai na? Chalo, aap bhi lattoo ki tarah gol-gol ghoom kar dikhao. Phirni ki tarah! Bahut acche! Bolo— Lattoo!",
    "हाथ धोना": "Khaana khaane se pehle aur khelne ke baad, sabse zyada zaroori kya hai? Woh hai— Haath dhona! Sabun se apne haathon ko acchi tarah ragden— mal-mal-mal! Ab saare keetaanu bhaag gaye. Bahut saaf! Bolo— Haath dhona!",
    "डॉक्टर": "Jab hum bimaar padte hain, toh humein kaun theek karta hai? Woh hain— Doctor! Doctor uncle humein dava dete hain aur injection se bhi humein bachaate hain. Woh humare swasthya ka dhyan rakhte hain. Chalo, doctor ko Thank You kahein. Bolo— Doctor!",
    "बादल": "Neele aasmaan mein dekho! Rui ke golon ki tarah kaun tair raha hai? Yeh hain humare— Baadal! Kabhi yeh safed hote hain, toh kabhi kaale. Kaale baadal varsha laate hain— rimjhim-rimjhim! Kya aap baadal mein koi aakriti dekh sakte ho? Bahut majedar! Bolo— Baadal!",
    "तितली": "Phool-phool par udti hai, rang-birange pankh hain iske— yeh hai pyaari— Titli! Titli udna bahut pasand karti hai. Kya aap dheere se titli ko pakadne ki koshish kar sakte ho? Oho, woh toh ud gayi! Phurrrr! Bolo— Titli!",
    "खज़ाने का नक्शा": "Chalo bacchon, ek saahasi yaatra par chalte hain! Humare haath mein kya hai? Yeh hai— Khazane ka Naksha! Ismein bane raaston par chalkar hum gupt khazana dhoondhenge. Kya aap taiyaar ho? Chalo, naksha kholo aur raasta dhoondho! Bahut romanchak! Bolo— Khazane ka Naksha!",
    "पहिया": "Cycle ho ya bus, sab kiske upar chalte hain? Yeh hai gol-gol— Pahiya! Pahiya ghoomta hai toh gaadi aage badhti hai. Kya aapne apni cycle ka pahiya ghoomte dekha hai? Zoom-zoom-zoom! Bahut tez! Bolo— Pahiya!",
    "मेला": "Jhoole, mithai aur dher saare khilaune! Chalo chalte hain— Mela! Mele mein kitni bheed aur kitni raunak hoti hai na? Kya aapko jhoola jhoola pasand hai? Ooooeeee! Bahut maza aa raha hai! Chalo, gubbaara khareedte hain. Bolo— Mela!",
    "हँसना": "Jab humein koi gudgudi karta hai ya koi mazak sunaata hai, toh hum kya करते hain? Hum shuru karte hain— Hasna! Ha-ha-ha! Hasne se humara dil khush rehta hai. Chalo, sab milkar ek thahaka lagakar haso— ha-ha-ha-ha! Bahut badiya! Bolo— Hasna!",
    "रसोई सेट": "Aaj hum kya pakayenge? Humare paas chhote-chhote bartan aur chammach hain— yeh hai humara— Rasoi Set. Ismein chai banao ya khaana, ghar-ghar khelne mein bahut maza aata hai. Kya aapki chai taiyaar hai? Hmm, bahut swadisht! Bolo— Rasoi Set!"
}

async def generate_demos():
    if not os.path.exists(DEMO_DIR):
        os.makedirs(DEMO_DIR)
        
    with open(MASTER_SCRIPT, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to extract item name and path and script
    pattern = re.compile(r"### \d+\. (.*?) \(.*?\)\n\*\*समय\*\*:.*?\n\*\*फ़ाइल\*\*: `(.*?)`\n\*\*स्क्रिप्ट\*\*:\n\"(.*?)\"", re.DOTALL)
    matches = pattern.findall(content)
    
    generated_count = 0
    
    for item_name, file_rel_path, script_text in matches:
        # Find which category this belongs to based on file_rel_path
        category = "Unknown"
        if "activities" in file_rel_path: category = "Activities"
        elif "animals_smaller" in file_rel_path: category = "Smaller Animals"
        elif "animals/wild" in file_rel_path: category = "Wild Animals"
        elif "birds" in file_rel_path: category = "Birds"
        elif "body_parts" in file_rel_path: category = "Body Parts"
        elif "clothes" in file_rel_path: category = "Clothes"
        elif "emotions" in file_rel_path: category = "Emotions"
        elif "family" in file_rel_path: category = "Family"
        elif "festivals" in file_rel_path: category = "Festivals"
        elif "food" in file_rel_path: category = "Food"
        elif "games" in file_rel_path: category = "Games"
        elif "habits" in file_rel_path: category = "Habits"
        elif "helpers" in file_rel_path: category = "Helpers"
        elif "imagination" in file_rel_path: category = "Imagination"
        elif "insects" in file_rel_path: category = "Insects"
        elif "magic" in file_rel_path: category = "Magic"
        elif "objects" in file_rel_path: category = "Objects"
        elif "places" in file_rel_path: category = "Places"
        elif "actions" in file_rel_path: category = "Sounds" if "laughing" in file_rel_path else "Actions"
        elif "toys" in file_rel_path: category = "Toys"
        
        # We only want one demo per category (and only those in FILE_KEYS)
        if category in FILE_KEYS and category not in ["Actions"]: # Skip Actions since we did Running
            # Check if we already picked an item for this category
            # We'll just pick the FIRST one we encounter in the MD file that matches HINGLISH_MAP
            if item_name in HINGLISH_MAP:
                # Check if file already exists (to avoid duplication if re-run)
                file_base = FILE_KEYS[category]
                
                # Check if we already processed this category in THIS run
                if f"Swara_{file_base}.mp3" in os.listdir(DEMO_DIR):
                    continue

                for vs in VOICES_SETTINGS:
                    output_file = f"{vs['name']}_{file_base}.mp3"
                    output_path = os.path.join(DEMO_DIR, output_file)
                    
                    # Determine text
                    text = script_text.strip()
                    if vs["name"] == "Neerja":
                        text = HINGLISH_MAP[item_name]
                    
                    # Strip markdown from text
                    clean_text = re.sub(r"\*\*|\*", "", text)
                    
                    print(f"Generating {output_file} ({vs['voice']})...")
                    try:
                        communicate = edge_tts.Communicate(clean_text, vs["voice"], rate=vs["rate"], pitch=vs["pitch"])
                        await communicate.save(output_path)
                    except Exception as e:
                        print(f"Error for {output_file}: {e}")
                
                generated_count += 1
                # Mark category as done by removing from keys or just checking dir
                # Actually I'll just keep track
                #del FILE_KEYS[category] 

    print(f"Finished generating {generated_count} category demos.")

if __name__ == "__main__":
    asyncio.run(generate_demos())
