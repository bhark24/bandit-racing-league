import json, re

with open("teams_data.js", "r", encoding="utf-8") as f:
    text = f.read()

m = re.search(r'const\s+teamsData\s*=\s*(\{.*\});', text, re.DOTALL)
if not m:
    print("Error: Could not match teamsData in teams_data.js")
    exit(1)

data = json.loads(m.group(1))

total_repaired = 0
for team in data.get("teams", []):
    team_name = team.get("name", "Unknown")
    trucks = team.get("trucks", [])
    team_repaired = 0
    for t in trucks:
        old_cond = t.get("condition", 100)
        if old_cond < 100:
            t["condition"] = 100
            team_repaired += 1
            total_repaired += 1
    if team_repaired > 0:
        print(f"Repaired {team_repaired} trucks for {team_name} to 100%.")

# Write updated JSON back to teams_data.js
new_teams_json = json.dumps(data, indent=2)
new_content = f"const teamsData = {new_teams_json};\n"

with open("teams_data.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"\n[+] SUCCESS: Restored {total_repaired} trucks across all teams to 100% condition!")
