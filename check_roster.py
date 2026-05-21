import re

try:
    with open(r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\bandit-roster.html", "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    cards = re.findall(r'<div class="card" data-status="([^"]+)">.*?<span class="car-number">#(\d+)</span>.*?<div class="driver-input"[^>]*>(.*?)</div>', html, re.DOTALL)
    
    found = 0
    for status, num, driver in cards:
        driver = driver.strip()
        # If it's not the default "Available" text (which has opacity 0.3)
        if "opacity" not in driver and driver != "":
            print(f"Num: {num}, Status: {status}, Driver: {driver}")
            found += 1
            
    print(f"Total populated drivers found: {found}")

except Exception as e:
    print(f"Error: {e}")
