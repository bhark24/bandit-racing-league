import json

with open("live_srh_full.json", "r", encoding="utf-8") as f:
    data = json.load(f)

classes = data.get("classes", [])
for c in classes:
    print("Class ID:", c.get("class_id"))
    print("Class Name:", c.get("class_name"))
    print("Keys in class:", list(c.keys()))
    drivers = c.get("drivers", [])
    print(f"Driver count in class: {len(drivers)}")

lss_class = data.get("lss", {}).get("class", {})
print("\nlss.class keys:", list(lss_class.keys()))
lss_drivers = lss_class.get("drivers", [])
print(f"lss_drivers count: {len(lss_drivers)}")
