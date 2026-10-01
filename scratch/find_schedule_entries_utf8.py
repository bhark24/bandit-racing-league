import glob, re, sys
sys.stdout.reconfigure(encoding='utf-8')

for fn in ["schedule.html", "fantasy_data.js", "weekly_data.js", "teams_data.js", "index.html"]:
    with open(fn, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
        print(f"=== {fn} ===")
        for line in text.splitlines():
            if any(w in line.lower() for w in ["week 1", "week 2", "week 3", "week 4", "week 5", "week 6", "week 7", "week 8", "week 9", "week 10", "week 11", "week 12", "week 13", "week 14", "week 15", "week 16", "bristol", "kansas", "charlotte", "atlanta", "pocono", "nashville", "sep"]):
                print(line.strip()[:140])
        print("\n")
