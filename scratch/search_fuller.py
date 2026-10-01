import glob, re

for f in sorted(glob.glob("*.html") + glob.glob("*.js")):
    with open(f, "r", encoding="utf-8", errors="ignore") as file:
        content = file.read()
        if "fuller" in content.lower():
            print(f"Match in {f}")
