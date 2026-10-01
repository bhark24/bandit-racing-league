import os, glob

search_terms = ["Richmond", "Michigan", "wall-of-shame", "raceWeekSelect", "loadRaceWeek"]
files = glob.glob("*.html")

for f in sorted(files):
    with open(f, "r", encoding="utf-8", errors="ignore") as file:
        content = file.read()
        matches = [term for term in search_terms if term.lower() in content.lower()]
        if matches:
            print(f"{f}: matches {matches}")
