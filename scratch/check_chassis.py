import json, re, glob, os

print("=== Checking auto_update_league.py & update_teams.py ===")
for script_name in ["auto_update_league.py", "update_teams.py"]:
    if os.path.exists(script_name):
        print(f"--- {script_name} ---")
        with open(script_name, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
            for line in lines:
                if any(w in line.lower() for w in ["chassis", "condition", "100", "repair", "maintenance", "durability", "health"]):
                    print(line.strip())

print("\n=== Checking teams_data.js chassis condition values ===")
with open("teams_data.js", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()
    # Search for team chassis properties
    matches = re.findall(r'("(?:chassis|engine|condition|health|durability)"\s*:\s*[^,\}\n]+)', text, re.IGNORECASE)
    print("Found condition/chassis fields count:", len(matches))
    for m in matches[:25]:
        print(m)
