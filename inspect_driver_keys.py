import json

with open("live_standings_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

drivers = data.get("drivers", {})
first_id = list(drivers.keys())[0]
print(f"Sample driver dict ({first_id}):")
print(json.dumps(drivers[first_id], indent=2))

# Also check rps (race participant scores)
rps = data.get("rps", [])
print(f"\nTotal rps records: {len(rps)}")
if rps:
    print("Sample rps record:")
    print(json.dumps(rps[0], indent=2))
