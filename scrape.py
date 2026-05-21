import urllib.request
import re

urls = [
    "https://simracerhub.com/season_standings.php?season_id=28135",
    "https://simracerhub.com/season_standings.php?season_id=25504"
]

drivers = {}

for url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        # Regex to match driver links.
        # Example: <a href="driver_stats.php?driver_id=63408&season_id=28135">Jackson Knaak</a>
        matches = re.findall(r'<a[^>]*driver_id=(\d+)[^>]*>([^<]+)</a>', html)
        for did, name in matches:
            name = name.strip()
            name = re.sub(r'\s+', ' ', name)
            # Filter out random numbers or short garbage
            if len(name) > 2 and not name.isdigit():
                drivers[name] = did
    except Exception as e:
        print(f"Error fetching {url}: {e}")

# Output as JS array format
output = "const driversList = [\n"
# Sort alphabetically or keep as is? Let's sort alphabetically to make it easy for the user.
for name, did in sorted(drivers.items(), key=lambda x: x[0]):
    output += f'            {{ name: "{name}", simhubId: "{did}" }},\n'
output += "        ];"

with open("scraped_drivers.txt", "w", encoding="utf-8") as f:
    f.write(output)

print(f"Scraped {len(drivers)} unique drivers.")
