import json, re

with open("teams_data.js", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

# Extract json object from const teamsData = {...};
m = re.search(r'const\s+teamsData\s*=\s*(\{.*\});', text, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    print("Total teams:", len(data.get("teams", [])))
    for team in data.get("teams", []):
        name = team.get("name", "Unknown")
        trucks = team.get("trucks", [])
        print(f"\nTeam: {name} (Balance: ${team.get('balance', 0):,})")
        for t in trucks:
            print(f"  - {t.get('name', 'Truck')} | Condition: {t.get('condition')}% | Status: {t.get('status')}")
else:
    print("Could not match const teamsData in teams_data.js")
