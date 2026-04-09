
import asyncio
import edge_tts  # type: ignore[import-not-found]
import os
import io
import sys

# Fix Windows console encoding for Hindi characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
BASE_AUDIO_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "assets", "audio")

VOICE = "hi-IN-SwaraNeural"
RATE = "-5%"
PITCH = "+1Hz"

SCRIPTS_MANIFEST = [
    # Batch 1
    {"path": "ganit/shapes/shape_star_funny.mp3", "text": "Namaste doston! Main hoon ek chamchamata Taara, yaani Star! ⭐ Mujhse milna hai toh raat ko aasmaan mein dekhiye. Mere paas paanch pyaari pyaari konen hain. Twinkle twinkle little star, mere saath bolo aur mere saath chamko! Kya aapne mera jaisa tara kabhi banaya hai?"},
    {"path": "ganit/shapes/shape_heart.mp3", "text": "Doston, dekho ye hai 'Dil', jise English mein 'Heart' kehte hain! ❤️ Ye pyaar ka nishaan hai. Jab hum khush hote hain, toh humara dil bhi naachta hai! Apne dono haathon se ek chhota sa dil banao aur apne mummy-papa ko dikhao. Pyaar baantein aur muskurate rahein!"},
    {"path": "ganit/shapes/shape_circle.mp3", "text": "Gool gool, dahi badal! Ye hai 'Gool', yaani 'Circle'! ⭕ Jaise meri mummy ki roti gool, papa ka chashma gool, aur humari pyaari dharti bhi gool! Mere paas koi kona nahi hai, bas ek lambi si gool lakeer hoon. Mere saath hawa mein ek bada sa circle banao!"},
    {"path": "mera_sansar/animals/wild/lion.mp3", "text": "Grrr! Main hoon Sher, jungle ka Raja! 🦁 Meri dhaad itni tez hai ki saara jungle kaanpta hai. Main bahut taqatwar aur bahadur hoon. Kya aap mere jaisa dhaad sakte ho? Chalo koshish karo... Grrrr! Bahut acche, nanhe raja!"},
    {"path": "mera_sansar/animals/domestic/animal_cow.mp3", "text": "Mooo! Main hoon aapki pyaari Gaaye mata. 🐮 Main aapko taaza aur swasth doodh deti hoon. Main ghaas khana pasand karti hoon aur khet mein rehti hoon. Doodh peene se aap banenge mazboot aur sehatmand. Toh har roz ek gilaas doodh zaroor peena, theek hai?"},
    {"path": "mera_sansar/family/family_mummy.mp3", "text": "Meri pyaari Mummy! ❤️ Mummy humse sabse zyada pyaar karti hain. Wo humein swadisht khana khilati hain aur sote waqt pyaari kahaniyaan sunati hain. Mummy ki lori sunkar humein kitni acchi neend aati hai na? Mummy ke liye ek bada sa hug toh banta hai!"},
    {"path": "mera_sansar/family/family_dadaji.mp3", "text": "Namaste! Ye hain humare 'Dadaji'. 👴 Unke paas dher saari kahaniyan aur tajurba hota hai. Wo humein bagiche mein ghumane le jaate hain aur purani baatein batate hain. Dadaji ke saath samay bitana kitna mazedaar hota hai na? Unka samman karo aur unse roz naya seekho."},
    {"path": "system/effects/reward_well_done.mp3", "text": "Waah! Bahut badiya! Aapne toh kamaal kar diya! 🌟 Aap bahut mehnat kar rahe hain aur mujhe aap par garv hai. Aise hi seekhte rahiye aur naye-naye achievements haasil kijiye. Well done, superstar!"},
    {"path": "system/effects/reward_keep_going.mp3", "text": "Rukiye nahi, aap bilkul sahi ja rahe hain! 🚀 Thodi si aur koshish aur aap agle level par honge. Seekhna ek mazedaar safar hai, aur aap iske asli khiladi hain! Chaliye, aage badhte hain aur kuch naya seekhte hain!"},
    
    # Batch 2
    {"path": "rangon_ka_sansar/primary/col_red.mp3", "text": "Laal, laal... seb hai laal! 🍎 Namaste doston! Ye hai 'Laal' rang, jise English mein 'Red' kehte hain. Dekho mere paas ek raseela tamatar aur ek mitha seb hai, dono hi laal hain! Kya aapke pas koi laal rang ka khilauna hai? Chalo, dhundo aur mujhe dikhao!"},
    {"path": "rangon_ka_sansar/primary/col_blue.mp3", "text": "Upar dekho! Itna bada neela aasmaan! ☁️ Ye hai 'Neela' rang, yaani 'Blue'. Samundar ka paani bhi neela hota hai aur humari pyaari dharti bhi! Kya aapko neela rang pasand hai? Chalo saath mein bolo... Neela Aasmaan, Neela Pani!"},
    {"path": "ganit/comparisons/comp_near_far.mp3", "text": "Doston, chalo ek khel khelte hain! 🏃 Jo cheez humare pass hai, use 'Near' kehte hain, jaise aapka mobile. Aur jo cheez bahut door hai, use 'Far' kehte hain, jaise aasmaan mein chanda mama! Pass yaani Near, Door yaani Far. Mere saath bolo... Pass aur Door!"},
    {"path": "ganit/comparisons/comp_open_closed.mp3", "text": "Dekho, ye darwaza 'Khula' hai, yaani 'Open'! 🚪 Aur ab, maine ise 'Band' kar diya, yaani 'Closed'. Jab hum school jaate hain toh bag 'Open' karte hain, aur kaam khatam hone par 'Closed'! Khula yaani Open, Band yaani Closed. Kya aap apni aankhein Band aur Khul kar sakte hain? Koshish kijiye!"},
    {"path": "samay_prakriti/nature/moon.mp3", "text": "Aasmaan mein dekho, chamak raha hai humara 'Chanda Mama'! 🌙 Ise English mein 'Moon' kehte hain. Kabhi ye gool hota hai, toh kabhi aadha. Ye humein raat ko thandi-thandi roshni deta hai. Chanda mama se kaho... Good Night, Chanda Mama! Kal phir milenge!"},
    {"path": "samay_prakriti/nature/star.mp3", "text": "Tim-tim karte taare! 🌟 Ise English mein 'Star' kehte hain. Ye raat ko aasmaan mein hero ki tarah chamakte hain. Kya aap taare gin sakte ho? Ek, do, teen... arey ye toh bahut saare hain! Kitne sundar hain ye nanhe taare!"},
    {"path": "samay_prakriti/din_maheene/din/day_7.mp3", "text": "Hooray! Aaj hai 'Ravivaar', yaani 'Sunday'! ☀️ Ye sabka pasandeeda din hai kyunki aaj chutti hai! Aaj hum khelenge, nachenge, aur dher saari masti karenge. Sunday matlab fun-day! Kya aapne aaj ki masti shuru kar di?"},
    {"path": "samay_prakriti/din_maheene/maheene/month_1.mp3", "text": "Naya saal mubarak! Saalo ka pehla maheena hai 'Janvari', yaani 'January'. ❄️ Is maheene mein thodi thand hoti hai aur hum naye saal ka swagat karte hain. Nayi umeed aur naya seekhna! Chalo, January ke saath naye safar par chalte hain!"},

    # Batch 3
    {"path": "varnamala/swar/v_a_anar.mp3", "text": "Namaste nanhe doston! Sabse pehla swar hai 'Aa', yaani 'A'! 🍎 'Aa' se hota hai meetha aur raseela 'Anar'. Anar khane se bahut taqat milti hai. Chalo mere saath bolo... 'Aa' se Anar, Laal-Laal Anar! Ek baar aur... 'Aa' se Anar!"},
    {"path": "varnamala/vyanjan/ka.mp3", "text": "Suno doston! Agla akshar hai 'Ka'! 🕊️ 'Ka' se hota hai bhol-bhala 'Kabutar'. Kabutar gutar-goon, gutar-goon karta hai. Kya aapne kabhi kabutar ko daana khilaya hai? Mere saath zor se bolo... 'Ka' se Kabutar, gutar-goon Kabutar!"},
    {"path": "mera_sansar/helpers/doctor.mp3", "text": "Jab hum bimaar hote hain, toh hum kiska pass jaate hain? Bilkul sahi! Hum 'Doctor' ke paas jaate hain. 👨‍⚕️ Doctor humein check karte hain aur dawai dekar humein jaldi theek kar dete hain. Doctor humare dost hote hain! Doctor uncle ko bolo... 'Thank you, Doctor!'"},
    {"path": "mera_sansar/helpers/teacher.mp3", "text": "School mein humein kaun padhata hai? Humari pyaari 'Teacher'! 👩‍🏫 Wo humein kahaniyan sunati hain, naye-naye khel khilati hain, aur humein bahut kuch sikhati hain. Maine aaj ek naya gana seekha! Kya aapne apni teacher ko aaj 'Good Morning' kaha? Chalo saath mein kehye!"},
    {"path": "mera_sansar/habits/brushing.mp3", "text": "Upar-neeche, aage-piche! Chalo hum apne daant saaf karte hain. 🦷 Rozana 'Brushing' karne se humare daant chamakdar aur mazboot rehte hain. Do baar brush karo, ek baar subah aur ek baar raat ko sote waqt. Cham-chamate daant, sabse pyaari muskaan!"},
    {"path": "mera_sansar/habits/bathing.mp3", "text": "Chapaak! Paani ke saath khelte huye 'Nahana' kitna mazedaar hai na? 🛁 Roz nahane se hum saaf-suthre aur taaza mehsus karte hain. Sabun lagao, paani dhalo, aur gungunao! Nahane se hum saari bimaariyon se door rehte hain. Chalo, fresh ho jaao!"},
    {"path": "ganit/numbers/num_1.mp3", "text": "Aao doston, ginti shuru karte hain! Sabse pehle aata hai number 'Ek', yaani 'One'! ☝️ Dekho, aasmaan mein sooraj kitne hain? Ek! Humari naak kitni hai? Ek! Bolna seekhein... Ek, Ek, Ek! Ek hai mera sooraj!"},
    {"path": "ganit/numbers/num_2.mp3", "text": "Agla number hai 'Do', yaani 'Two'! ✌️ Humare paas do aankhein hain, do kaan hain, aur do haath hain! Chalo mere saath do baar taali bajao... Ek... Do! Bahut badiya! Do, Do, Do, do hain mere kaan!"},

    # Batch 4
    {"path": "system/intros/intro_ganit.mp3", "text": "Namaste nanhe doston! RajShree Learning Project mein aapka swagat hai. 📐 Chaliye, Ganit ki duniya mein kadam rakhte hain! Yahan hum seekhenge ginti karna, pyaari-pyaari shapes ke baare mein, aur bahut kuch mazedaar things. Kya aap taiyaar hain? Chaliye shuru karte hain!"},
    {"path": "system/intros/intro_samay.mp3", "text": "Doston, kya aapne kabhi socha hai ki Suraj kab ugta hai ya saal mein kitne mahine hote hain? 🌙 Chaliye, Samay aur Prakriti ke baare mein jaante hain. Hum directions, seasons aur humari khoobsurat dharti ke baare mein seekhenge. Aao, mere saath chalo!"},
    {"path": "varnamala/matra/matra_aha.mp3", "text": "Ye hai 'Aha' ki matra! 😸 Jab hum 'Aha' bolte hain, toh thodi hansi aati hai na? Jaise 'Pratah' ya 'Namah'. Chalo mere saath hansi ke saath bolo... Aha! Aha! Aha! Kitna mazedaar swar hai ye!"},
    {"path": "varnamala/matra/matra_o.mp3", "text": "Agli matra hai 'O'! 🍩 Jaise 'Mo-tar' ya 'To-ta'. Is matra ko lagane se sab kuch 'O' bolne lagta hai! Mere saath bolo... 'Ka' pe 'O' ki matra... 'Ko'! 'Ma' pe 'O' ki matra... 'Mo'! O, O, O, meetha meetha O!"},
    {"path": "varnamala/matra/matra_e.mp3", "text": "Chalo seekhte hain 'Chhoti E' ki matra! 🐭 Jaise 'Ki-tab' ya 'Ci-diya'. Ye matra akshar se pehle lagti hai aur 'E' ki pyaari si awaaz nikalti hai. Chlo mere saath bolo... Ki, Ki, Kitab! Ci, Ki, Cidiya! E... E... E!"},
]

async def generate_batch_audio():
    print(f"Starting batch audio generation using voice: {VOICE}...")
    
    success_count: int = 0
    fail_count: int = 0

    for item in SCRIPTS_MANIFEST:
        full_path = os.path.join(BASE_AUDIO_DIR, item["path"])
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        print(f"Generating: {item['path']}...")
        try:
            communicate = edge_tts.Communicate(item["text"], VOICE, rate=RATE, pitch=PITCH)
            await communicate.save(full_path)
            
            if os.path.exists(full_path):
                size_kb = os.path.getsize(full_path) / 1024
                print(f"  ✅ Success ({size_kb:.1f} KB)")
                success_count += 1  # type: ignore[operator]
            else:
                print(f"  ❌ Failed (File not found after save)")
                fail_count += 1  # type: ignore[operator]
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            fail_count += 1  # type: ignore[operator]

    print(f"\nGeneration Complete!")
    print(f"Total: {len(SCRIPTS_MANIFEST)}")
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")

if __name__ == "__main__":
    asyncio.run(generate_batch_audio())
