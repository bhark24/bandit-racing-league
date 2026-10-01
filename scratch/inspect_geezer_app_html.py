import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open("geezer-app.html", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()
    
    print("=== geezer-app.html Title & Headers ===")
    m = re.search(r'<title>(.*?)</title>', text, re.IGNORECASE)
    if m: print("Title:", m.group(1))

    print("\n=== Searching for Auth / Telemetry / Download links in geezer-app.html ===")
    links = re.findall(r'href=["\']([^"\']+\.exe[^"\']*)["\']', text)
    print("EXE Download Links:", links)

    auth_matches = re.findall(r'(\b\d{5,7}\b)', text)
    print("Sample IDs in html:", list(set(auth_matches))[:10])

    print("\n=== Searching for Spotter / Dashboard features in geezer-app.html ===")
    feature_matches = re.findall(r'class=["\'][^"\']*(?:feature|card|banner|download|spotter|telemetry)[^"\']*["\']', text, re.IGNORECASE)
    print("Feature classes count:", len(feature_matches))
