import json

with open("live_standings_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

drivers = data.get("drivers", {})
schedules = data.get("schedules", [])
rps = data.get("rps", []) # race participant scores/results
teams = data.get("teams", {})

print(f"Total drivers in JSON: {len(drivers)}")

# Let's inspect drivers structure
driver_list = []
for d_id, d_info in drivers.items():
    name = d_info.get("name", d_info.get("driver_name", ""))
    pts = d_info.get("pts", d_info.get("points", 0))
    wins = d_info.get("wins", 0)
    top5 = d_info.get("top5", d_info.get("top_5", 0))
    top10 = d_info.get("top10", d_info.get("top_10", 0))
    starts = d_info.get("starts", d_info.get("races", 0))
    laps_led = d_info.get("laps_led", 0)
    incidents = d_info.get("inc", d_info.get("incidents", 0))
    driver_list.append({
        "id": d_id,
        "name": name,
        "pts": pts,
        "wins": wins,
        "top5": top5,
        "top10": top10,
        "starts": starts,
        "laps_led": laps_led,
        "incidents": incidents,
        "raw": d_info
    })

# Sort by pts descending
driver_list.sort(key=lambda x: x["pts"], reverse=True)

print("\n=== TOP 25 DRIVERS IN STANDINGS POST-WATKINS GLEN ===")
for i, d in enumerate(driver_list[:25], 1):
    print(f"P{i:2d}: {d['name']:<25} | Pts: {d['pts']:>4} | Wins: {d['wins']} | Top 5: {d['top5']} | Starts: {d['starts']}")

with open("parsed_drivers_summary.json", "w", encoding="utf-8") as out:
    json.dump(driver_list, out, indent=2)
