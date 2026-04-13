import asyncio
import edge_tts

async def main():
    voices = await edge_tts.VoicesManager.create()
    hindi_voices = voices.find(Language="hi")
    for v in hindi_voices:
        print(f"{v['ShortName']} - {v['Gender']}")

if __name__ == "__main__":
    asyncio.run(main())
