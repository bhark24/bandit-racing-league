import glob, json

print("=== Promo/Generator Files ===")
for f in sorted(glob.glob("*promo*") + glob.glob("*preview*") + glob.glob("*social*") + glob.glob("*.bat")):
    print(f)

print("\n=== Inspecting weekly_data.js or schedule data ===")
try:
    with open("weekly_data.js", "r", encoding="utf-8") as f:
        print("weekly_data.js snippet:\n", f.read()[:500])
except Exception as e:
    print("weekly_data.js error:", e)

try:
    with open("schedule.html", "r", encoding="utf-8") as f:
        content = f.read()
        print("\nschedule.html snippet length:", len(content))
except Exception as e:
    print("schedule.html error:", e)
