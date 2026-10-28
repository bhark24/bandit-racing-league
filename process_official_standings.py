import json

with open("live_standings_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

drivers_meta = data.get("drivers", {})
rps = data.get("rps", {})
teams_meta = data.get("teams", {})
schedules = data.get("schedules", [])

driver_standings = []

for d_id, stats in rps.items():
    # lookup driver name
    meta = drivers_meta.get(d_id, {})
    name = meta.get("name", meta.get("last_first", d_id))
    
    tpts = stats.get("tpts", 0)
    starts = stats.get("starts", 0)
    wins = stats.get("wins", 0)
    poles = stats.get("poles", 0)
    t5 = stats.get("t5", 0)
    t10 = stats.get("t10", 0)
    led = stats.get("led", 0)
    inc = stats.get("inc", 0)
    rpts = stats.get("rpts", 0)
    spts = stats.get("spts", 0)
    bpts = stats.get("bpts", 0)
    
    driver_standings.append({
        "driver_id": d_id,
        "name": name,
        "tpts": tpts,
        "starts": starts,
        "wins": wins,
        "poles": poles,
        "t5": t5,
        "t10": t10,
        "led": led,
        "inc": inc,
        "rpts": rpts,
        "spts": spts,
        "bpts": bpts
    })

# Sort by tpts descending
driver_standings.sort(key=lambda x: (x["tpts"], x["wins"], x["t5"], x["t10"]), reverse=True)

print("=== OFFICIAL BRL SEASON 16 DRIVER STANDINGS POST-WATKINS GLEN (RACE 14) ===")
print(f"{'Pos':<4} | {'Driver Name':<25} | {'Pts':<5} | {'Wins':<4} | {'T5':<3} | {'T10':<4} | {'Poles':<5} | {'Laps Led':<8} | {'Inc':<4}")
print("-" * 80)
for i, d in enumerate(driver_standings, 1):
    print(f"{i:<4} | {d['name']:<25} | {d['tpts']:<5} | {d['wins']:<4} | {d['t5']:<3} | {d['t10']:<4} | {d['poles']:<5} | {d['led']:<8} | {d['inc']:<4}")

with open("official_post_watkins_glen_standings.json", "w", encoding="utf-8") as out:
    json.dump(driver_standings, out, indent=2)
