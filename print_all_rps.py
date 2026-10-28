import json

with open("live_standings_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

drivers_meta = data.get("drivers", {})
rps = data.get("rps", {})

print("=== ALL DRIVERS IN RPS WITH PTS, WINS, LAPS LED ===")
drivers_info = []
for d_id, stats in rps.items():
    meta = drivers_meta.get(d_id, {})
    name = meta.get("name", meta.get("last_first", d_id))
    tpts = stats.get("tpts", 0)
    wins = stats.get("wins", 0)
    led = stats.get("led", 0)
    drivers_info.append({"id": d_id, "name": name, "pts": tpts, "wins": wins, "led": led})

drivers_info.sort(key=lambda x: x["pts"], reverse=True)

for i, d in enumerate(drivers_info, 1):
    print(f"P{i:2d} | ID: {d['id']:<8} | {d['name']:<25} | Pts: {d['pts']:>4} | Wins: {d['wins']} | Laps Led: {d['led']}")
