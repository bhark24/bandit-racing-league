with open("drivers.html", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "truck" in line.lower() or "fuller" in line.lower() or "35" in line:
            print(f"{i+1}: {line.strip()}")
