import sys, re, glob
sys.stdout.reconfigure(encoding='utf-8')

print("=== Searching for spotter / geezer app files ===")
for fn in sorted(glob.glob("*geezer*") + glob.glob("*spotter*") + glob.glob("*simhub*")):
    print(fn)

print("\n=== Checking Geezer_Auth_IDs.txt content ===")
with open("Geezer_Auth_IDs.txt", "r", encoding="utf-8", errors="ignore") as f:
    print(f.read())

print("\n=== Checking spotter.html snippet ===")
try:
    with open("spotter.html", "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
        print("spotter.html length:", len(text))
        m = re.search(r'<title>(.*?)</title>', text, re.IGNORECASE)
        if m: print("Title:", m.group(1))
except Exception as e:
    print(e)
