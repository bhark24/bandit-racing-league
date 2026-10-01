import glob

files = ["drivers.html", "bandit-roster.html", "teams_data.js", "roster_data.js"]

for fn in files:
    try:
        with open(fn, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
            print(f"=== {fn} ===")
            for i, line in enumerate(lines):
                if "fuller" in line.lower():
                    start = max(0, i-3)
                    end = min(len(lines), i+4)
                    for j in range(start, end):
                        print(f"{j+1}: {lines[j].strip()}")
                    print("---")
    except Exception as e:
        print(f"Error reading {fn}: {e}")
