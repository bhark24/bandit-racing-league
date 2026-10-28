import json

with open("live_srh_full.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Keys in data:", list(data.keys()))

# Let's inspect schedules
schedules = data.get("schedules", [])
print(f"\n--- SCHEDULE ({len(schedules)} races) ---")
for s in schedules:
    chase = s.get("chase")
    r_id = s.get("race_id")
    sched_id = s.get("schedule_id")
    track = s.get("track_name")
    config = s.get("config_name")
    date_str = s.get("race_date_fmt")
    winner = s.get("winner")
    print(f"Sched {sched_id} | Race {r_id} | {date_str} | {track} ({config}) | Chase: {chase} | Winner: {winner}")

# Let's inspect drivers and standings
# Let's see where driver standings are in data
print("\n--- STANDINGS STRUCTURE ---")
for k, v in data.items():
    if isinstance(v, list):
        print(f"Key '{k}': list of {len(v)} items")
    elif isinstance(v, dict):
        print(f"Key '{k}': dict with keys {list(v.keys())[:10]}")
