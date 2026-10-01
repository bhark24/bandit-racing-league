import json, re

print("=== generate_upcoming_race_preview.py ===")
try:
    with open("generate_upcoming_race_preview.py", "r", encoding="utf-8") as f:
        print(f.read())
except Exception as e:
    print(e)

print("\n=== schedule.html ===")
try:
    with open("schedule.html", "r", encoding="utf-8") as f:
        content = f.read()
        print(content[:2000])
except Exception as e:
    print(e)

print("\n=== fantasy_config.json ===")
try:
    with open("fantasy_config.json", "r", encoding="utf-8") as f:
        print(f.read())
except Exception as e:
    print(e)
