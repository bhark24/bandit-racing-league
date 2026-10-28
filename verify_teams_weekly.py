import json

with open("live_standings_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

teams = data.get("teams", {})
print("=== FRANCHISE TEAM STANDINGS ===")
team_list = []
for t_id, t_info in teams.items():
    name = t_info.get("name", t_info.get("team_name", t_id))
    pts = t_info.get("pts", t_info.get("tpts", t_info.get("points", 0)))
    wins = t_info.get("wins", 0)
    team_list.append({"name": name, "pts": pts, "wins": wins, "raw": t_info})

# Also check weekly_data.js teamStandings
with open("weekly_data.js", "r", encoding="utf-8") as f:
    w_text = f.read()

print("weekly_data.js excerpt:")
print(w_text[:1500])
