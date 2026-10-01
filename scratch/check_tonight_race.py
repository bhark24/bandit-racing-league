import sys, re, glob
sys.stdout.reconfigure(encoding='utf-8')

print("=== Checking schedule.html content ===")
with open("schedule.html", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()
    # Extract table rows or schedule cards
    matches = re.findall(r'<tr[^>]*>.*?</tr>', text, re.DOTALL)
    for m in matches:
        if "sep" in m.lower() or "september" in m.lower() or "week" in m.lower() or "14" in m or "15" in m:
            clean_m = re.sub(r'<[^>]+>', ' ', m)
            print("Row:", re.sub(r'\s+', ' ', clean_m))

print("\n=== Checking teams_data.js latest race / schedule ===")
with open("teams_data.js", "r", encoding="utf-8", errors="ignore") as f:
    t = f.read()
    latest_race_match = re.search(r'"latestRace"\s*:\s*(\{.*?\})', t, re.DOTALL)
    if latest_race_match:
        print("latestRace:", latest_race_match.group(1))

print("\n=== Checking race_control_notes or txt files ===")
for fn in sorted(glob.glob("*.txt")):
    print(f"--- {fn} ---")
    with open(fn, "r", encoding="utf-8", errors="ignore") as f:
        print(f.read()[:300])
