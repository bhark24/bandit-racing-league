import sys, re
sys.stdout.reconfigure(encoding='utf-8')

print("=== Checking Geezer_Auth_IDs.txt ===")
try:
    with open("Geezer_Auth_IDs.txt", "r", encoding="utf-8", errors="ignore") as f:
        print(f.read())
except Exception as e:
    print(e)

print("\n=== Checking geezer-app.html snippet ===")
try:
    with open("geezer-app.html", "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
        print("Length of geezer-app.html:", len(text))
        # Search for version, Kansas, or driver IDs
        version_match = re.search(r'version|v1\.\d|version\s*\d', text, re.IGNORECASE)
        if version_match:
            print("Version mention:", version_match.group(0))
except Exception as e:
    print(e)

print("\n=== Checking driver count in roster_data.js ===")
try:
    with open("roster_data.js", "r", encoding="utf-8", errors="ignore") as f:
        t = f.read()
        drivers = re.findall(r'"driver"\s*:\s*"([^"]+)"', t)
        active_drivers = [d for d in drivers if d and d.strip().lower() != 'available']
        print(f"Active drivers count: {len(active_drivers)}")
        print("Active drivers list:", active_drivers)
except Exception as e:
    print(e)
