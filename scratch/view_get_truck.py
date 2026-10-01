with open("drivers.html", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()
    for i in range(385, 415):
        if i < len(lines):
            print(f"{i+1}: {lines[i].strip()}")
