import re

with open("wall-of-shame.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("wall_of_shame_app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

ids_in_js = set(re.findall(r'document\.getElementById\(["\']([^"\']+)["\']\)', app_js))
print("IDs queried in JS:", sorted(list(ids_in_js)))

missing_ids = []
for element_id in ids_in_js:
    if f'id="{element_id}"' not in html and f"id='{element_id}'" not in html:
        missing_ids.append(element_id)

if missing_ids:
    print("MISSING IDs IN HTML:", missing_ids)
else:
    print("ALL IDs match HTML successfully!")
