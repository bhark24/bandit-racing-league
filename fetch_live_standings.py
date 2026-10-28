import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://simracerhub.com/get_standings.php?season_id=29722",
    "https://simracerhub.com/get_standings.php?season_id=29722&class_id=0",
    "https://simracerhub.com/get_standings.php?season_id=29722&season_class_id=0"
]

for url in urls:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        text = resp.read().decode("utf-8", errors="ignore")
        print(f"URL: {url} | Status: {resp.status} | Length: {len(text)}")
        data = json.loads(text)
        print("Keys:", list(data.keys()))
        with open("live_standings_data.json", "w", encoding="utf-8") as out:
            json.dump(data, out, indent=2)
        print("Saved to live_standings_data.json!")
        break
    except Exception as e:
        print(f"URL: {url} | Error: {e}")
