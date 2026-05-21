import re

try:
    with open("scrape_league.html", "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    matches = re.findall(r'<a[^>]+driver_id=(\d+)[^>]*>([^<]+)</a>', html, re.IGNORECASE)
    
    drivers = {}
    for did, name in matches:
        name = name.strip()
        name = re.sub(r'\s+', ' ', name)
        if len(name) > 2 and not name.isdigit():
            drivers[name] = did

    print(f"Found {len(drivers)} unique drivers.")
    
    # Save the JS array block to a file
    output = "const driversList = [\n"
    for name, did in sorted(drivers.items(), key=lambda x: x[0]):
        output += f'            {{ name: "{name}", simhubId: "{did}" }},\n'
    output += "        ];"
    
    with open("extracted_drivers.js", "w", encoding="utf-8") as f:
        f.write(output)
        
    print("Wrote to extracted_drivers.js")
except Exception as e:
    print(f"Error: {e}")
