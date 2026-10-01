import os, urllib.request

urls_to_check = [
    "https://banditracingleague.net/Geezer_Auth_IDs.txt",
    "https://banditracingleague.net/assets/Geezer_Dashboard_Setup.exe",
    "https://banditracingleague.net/geezer-app.html",
    "https://banditracingleague.net/spotter.html",
    "https://banditracingleague.net/fantasy.html"
]

print("=== Checking Live Remote URLs ===")
for url in urls_to_check:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            print(f"[200 OK] {url} - Size: {len(resp.read())} bytes")
    except Exception as e:
        print(f"[FAILED] {url} - Error: {e}")
