import json, sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open("teams_data.js", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()
    print("=== Checking teams_data.js standings ===")
    m = re.search(r'driverStandings\s*:\s*(\[.*?\])', text, re.DOTALL)
    if m:
        print("driverStandings snippet:", m.group(1)[:500])

with open("weekly_data.js", "r", encoding="utf-8", errors="ignore") as f:
    t = f.read()
    print("\n=== weekly_data.js ===")
    print(t[:1000])
