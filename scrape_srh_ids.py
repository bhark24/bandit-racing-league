import urllib.request
import re
import os

# Baseline of known IDs
srh_ids = {
    "JACKSONKNAAK": 63408,
    "NOLANGROSS": 41381,
    "BRETGUZIK": 39652,
    "RICKYHART": 20741,
    "RICKYHARTJR": 20741,
    "NICKNICKERSON": 17336,
    "LOGANMURRAY": 118435,
    "LOGANAMURRAY": 118435,
    "SEANBRITT": 63784,
    "NICOLEKRIESEL": 64312,
    "BENJAMINLACY": 50037,
    "BENJAMINILACY": 50037,
    "KEVINFOSTER": 39648,
    "BILLHARKINS": 39625,
    "JONATHONPLATT": 39205,
    "JOHNATHONPLATT": 39205,
    "VICTORWEAVER": 60464,
    "MATTBAILEY": 137917,
    "MATTHEWBAILEY9": 137917,
    "NATHANSANTOS": 121220,
    "NATHANSANTOS2": 121220,
    "JOSHADAMS": 30420,
    "JOSHUALADAMS": 30420,
    "DYLANNICASTRO": 119582,
    "ETHANSIKORSKI": 100493,
    "MICHAELRAMOS": 59641,
    "MICHAELRRAMOS": 59641,
    "CONORGIBSON": 35159,
    "CONNORGIBSON": 35159,
    "CURTISYANCEY": 45358,
    "TYCORINO": 130105,
    "BRANDONGEERS": 67132,
    "BOBBERRY": 1652,
    "MARKALANBIVENS": 56258,
    "JASONGREENWELL": 60453,
    "DAVIDLEAKEY": 60455,
    "DAVELEAKEY": 60455,
    "DAVIDWESTOVERJR": 119581,
    "DAVIDWESTOVER": 119581,
    "BRANDONJACKSON": 21107,
    "EDDIEHAGIGH": 60452,
    "JOSHBILLITER": 45729,
    "JOSHUABILLITER": 45729,
    "DIANTERODER": 136821,
    "DIONTERADER": 136821,
    "MATTCROCKETT": 47625,
    "PETERMURPHY": 71230,
    "CARTERPHILLIPS": 99226,
    "TERRYKONDUS": 39651
}

urls = [
    "https://simracerhub.com/season_standings.php?season_id=28135",
    "https://simracerhub.com/season_standings.php?season_id=25504"
]

def normalize_name(name):
    return re.sub(r'[\s\.\-_]', '', name.upper().strip())

# 1. Scrape online standings
print("Scraping SimRacerHub standings for driver IDs...")
for url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        matches = re.findall(r'driver_id=(\d+)[^>]*>([^<]+)<', html)
        for did, name in matches:
            name_clean = name.strip()
            if len(name_clean) > 2 and not name_clean.isdigit():
                norm = normalize_name(name_clean)
                srh_ids[norm] = int(did)
    except Exception as e:
        print(f"Error scraping {url}: {e}")

# 2. Scan all local HTML files in the website directory and parent scratch directory
print("Scanning local HTML files for driver IDs...")
local_files = []

# Files in current website dir
for f in os.listdir("."):
    if f.endswith(".html"):
        local_files.append(f)

# Files in parent scratch directory
parent_dir = ".."
if os.path.exists(parent_dir):
    for f in os.listdir(parent_dir):
        if f.endswith(".html"):
            local_files.append(os.path.join(parent_dir, f))

# Extract IDs from local files
for filepath in local_files:
    if os.path.exists(filepath) and os.path.isfile(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
                # Pattern 1: HTML links like driver_stats.php?driver_id=XXXX
                matches = re.findall(r'driver_id=(\d+)[^>]*>([^<]+)<', content)
                for did, name in matches:
                    name_clean = name.strip()
                    if len(name_clean) > 2 and not name_clean.isdigit():
                        norm = normalize_name(name_clean)
                        srh_ids[norm] = int(did)
                
                # Pattern 2: Javascript objects like "driver_id":"XXXX","name":"XXXX"
                js_matches = re.findall(r'"driver_id":"(\d+)","name":"([^"]+)"', content)
                for did, name in js_matches:
                    name_clean = name.strip()
                    if len(name_clean) > 2:
                        norm = normalize_name(name_clean)
                        srh_ids[norm] = int(did)
                        
                # Pattern 3: Javascript objects like id:XXXX,...,name:"XXXX"
                js_matches2 = re.findall(r'id:(\d+),[^}]+?name:"([^"]+)"', content)
                for did, name in js_matches2:
                    name_clean = name.strip()
                    if len(name_clean) > 2:
                        norm = normalize_name(name_clean)
                        srh_ids[norm] = int(did)
        except Exception as e:
            print(f"Error parsing local file {filepath}: {e}")

# Read drivers.html
drivers_path = "drivers.html"
if not os.path.exists(drivers_path):
    print("drivers.html not found.")
    exit(1)

with open(drivers_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# Build the replacement string
ids_lines = ["        const SRH_IDS = {"]
sorted_entries = sorted(srh_ids.items())
for idx, (name, did) in enumerate(sorted_entries):
    comma = "," if idx < len(sorted_entries) - 1 else ""
    ids_lines.append(f'            "{name}": {did}{comma}')
ids_lines.append("        };")
replacement = "\n".join(ids_lines)

# Replace const SRH_IDS block in drivers.html
new_html, count = re.subn(
    r'const SRH_IDS = \{[\s\S]*?\};',
    replacement,
    html_content
)

if count > 0:
    with open(drivers_path, "w", encoding="utf-8") as f:
        f.write(new_html)
    print(f"Successfully updated drivers.html with {len(srh_ids)} driver IDs.")
else:
    print("Failed to find and replace SRH_IDS block in drivers.html.")
