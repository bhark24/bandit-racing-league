import json

with open("live_standings_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

schedules = data.get("schedules", [])
drivers_meta = data.get("drivers", {})
rps = data.get("rps", {})

print("=== RACE WINNERS LIST (RACES 1-14) ===")
# Let's map race_id to winners or check schedules
for s in schedules:
    if s.get("chase") == "N":
        r_id = s.get("race_id")
        track = s.get("track_name")
        config = s.get("config_name")
        date_str = s.get("race_date_fmt")
        winner = s.get("winner")
        print(f"Race {r_id} | {date_str} | {track} | Winner: {winner}")

print("\n=== LAPS LED BY LOCKED-IN DRIVERS ===")
locked_ids = [
    ("50037", "Benjamin Lacy", 655),
    ("118610", "Scott Sanderson", 569),
    ("17336", "Nick Nickerson", 500),
    ("39648", "Kevin Foster", 493),
    ("85538", "Joshua L Adams", 489),
    ("63408", "Jackson Knaak", 435),
    ("47625", "Michael Rakes", 425),
    ("118435", "Dylan McDonald", 423),
    ("128122", "Connor Gibson", 410)
]

for d_id, default_name, pts in locked_ids:
    stats = rps.get(d_id, {})
    meta = drivers_meta.get(d_id, {})
    name = meta.get("name", default_name)
    led = stats.get("led", 0)
    wins = stats.get("wins", 0)
    t5 = stats.get("t5", 0)
    print(f"{name:<20} | Laps Led: {led:>4} | Wins: {wins} | Points: {pts}")
