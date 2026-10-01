import glob

for f in sorted(glob.glob("*.html") + glob.glob("*.js")):
    with open(f, "r", encoding="utf-8", errors="ignore") as file:
        content = file.read()
        if "wes_fuller" in content.lower() or "wes%20fuller" in content.lower() or "kansas" in content.lower():
            print(f"Match in {f}")
