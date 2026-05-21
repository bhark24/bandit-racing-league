import re
import json

try:
    with open(r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\bandit-roster.html", "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    cards = re.findall(r'<div class="card" data-status="([^"]+)">.*?<span class="car-number">#(\d+)</span>.*?<div class="driver-input"[^>]*>(.*?)</div>', html, re.DOTALL)
    
    data = {}
    for status, num, driver in cards:
        driver = driver.strip()
        if "opacity" not in driver and driver != "":
            data[num] = {"driver": driver, "status": status}
            
    print(json.dumps(data))

except Exception as e:
    print(f"Error: {e}")
