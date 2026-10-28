import json

with open("live_standings_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Top keys:", list(data.keys()))
print("Type of rps:", type(data.get("rps")))

rps = data.get("rps")
if isinstance(rps, dict):
    print("rps dict keys sample:", list(rps.keys())[:5])
    sample_key = list(rps.keys())[0]
    print(f"Sample rps item ({sample_key}):", json.dumps(rps[sample_key], indent=2))
elif isinstance(rps, list):
    print("rps list length:", len(rps))

# Let's check where the actual standings numbers are in data
for k in data.keys():
    val = data[k]
    if isinstance(val, dict):
        print(f"Key '{k}': dict with {len(val)} entries. Sample inner keys: {list(val.keys())[:3]}")
    elif isinstance(val, list):
        print(f"Key '{k}': list with {len(val)} entries.")
    else:
        print(f"Key '{k}': {type(val)}")
