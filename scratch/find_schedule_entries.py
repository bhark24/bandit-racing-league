import glob, re

for fn in sorted(glob.glob("*.html") + glob.glob("*.js") + glob.glob("*.json")):
    with open(fn, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
        if "darlington" in text.lower() and ("september" in text.lower() or "sep" in text.lower() or "week" in text.lower()):
            print(f"=== {fn} ===")
            for line in text.splitlines():
                if any(w in line.lower() for w in ["week", "darlington", "bristol", "kansas", "charlotte", "atlanta", "pocono", "nashville", "sep 9", "september 9", "sep 16", "stage"]):
                    print(line.strip()[:140])
            print("\n")
