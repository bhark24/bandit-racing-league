import glob, re

for f in sorted(glob.glob("*.html")):
    with open(f, "r", encoding="utf-8", errors="ignore") as file:
        lines = file.readlines()
        for i, line in enumerate(lines):
            if "wall-of-shame.html" in line:
                print(f"{f}:{i+1}: {line.strip()}")
