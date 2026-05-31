import os
import re
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROSTER_DATA_PATH = os.path.join(BASE_DIR, "roster_data.js")
OUTPUT_PATH = os.path.join(BASE_DIR, "drivers.html")

# Hardcoded resolved SimRacerHub driver IDs (compiled from historical & current season data)
SRH_IDS = {
    "jackson knaak": 63408,
    "nolan gross": 41381,
    "bret guzik": 39652,
    "ricky hart": 20741,
    "nick nickerson": 17336,
    "logan murray": 118435,
    "sean britt": 63784,
    "nicole kriesel": 64312,
    "benjamin lacy": 50037,
    "kevin foster": 39648,
    "bill harkins": 39625,
    "jonathon platt": 39205,
    "victor weaver": 60464,
    "matt bailey": 137917,
    "nathan santos": 121220,
    "josh adams": 30420,
    "dylan nicastro": 119582,
    "ethan sikorski": 100493,
    "michael ramos": 59641,
    "conor gibson": 35159,
    "curtis yancey": 45358,
    "ty corino": 130105,
    "brandon geers": 67132,
    "bob berry": 1652,
    "mark alan bivens": 56258,
    "jason greenwell": 60453,
    "david leakey": 60455,
    "david westover jr": 119581,
    "brandon jackson": 21107,
    "eddie hagigh": 60452,
    "josh billiter": 45729,
    "diante roder": 136821,
    "dionte rader": 136821
}

# Exact filename mapping for drivers with custom numbers in "assets/drivers numbers"
NUMBER_IMAGES = {
    "benjamin lacy": "Benjamin Lacy.png",
    "bill harkins": "Bill Harkins.png",
    "brandon geers": "Brandon Geers.png",
    "curtis yancey": "Curtis Yancey.png",
    "david leakey": "David Leakey.png",
    "david westover jr": "David Westover.pmg.png",
    "diante roder": "Dionte_number.png",
    "dionte rader": "Dionte_number.png",
    "eddie hagigh": "Eddie Hagigh.png",
    "ethan sikorski": "Ethan Sikorski.png",
    "josh adams": "Josh Adams.png",
    "logan murray": "Logan Murray.png",
    "mark alan bivens": "Mark Alan Bivens.png",
    "matt crockett": "Matt Crockett.png",
    "michael rakes": "Michael Rakes.png",
    "nathan santos": "Nathan Santos.png",
    "sean britt": "Sean Britt.png",
    "ty corino": "Ty Corino.png",
    "victor weaver": "Victor Weaver.png",
    "dylan nicastro": "Dillon.png"
}

def clean_name(name):
    # E.g. "Jesse VAUGHAN" -> "Jesse Vaughan", "MARK ALAN BIVENS" -> "Mark Alan Bivens"
    return name.strip().title()

# Parse roster_data.js
if not os.path.exists(ROSTER_DATA_PATH):
    print(f"Error: Roster data file not found at {ROSTER_DATA_PATH}")
    exit(1)

with open(ROSTER_DATA_PATH, "r", encoding="utf-8") as f:
    js_content = f.read()

# Extract JSON object assigned to rosterData
match = re.search(r'const\s+rosterData\s*=\s*({.*?});', js_content, re.DOTALL)
if not match:
    print("Error: Could not parse rosterData object from roster_data.js")
    exit(1)

# Extract numbersList from roster_data.js
match_list = re.search(r'const\s+numbersList\s*=\s*(\[.*?\])\s*;', js_content, re.DOTALL)
if not match_list:
    print("Error: Could not parse numbersList from roster_data.js")
    exit(1)

try:
    roster_data = json.loads(match.group(1))
    numbers_list = json.loads(match_list.group(1))
except Exception as e:
    print(f"Error decoding JSON from roster_data.js: {e}")
    exit(1)

cards_html = ""

for number in numbers_list:
    # Check if this number is in roster_data AND the driver name is occupied
    is_occupied = False
    if number in roster_data:
        info = roster_data[number]
        driver_name = info.get("driver", "").strip()
        status = info.get("status", "").strip()
        if driver_name and driver_name.lower() != "available":
            is_occupied = True
            
    if is_occupied:
        display_name = clean_name(driver_name)
        status_display = status.replace("-", " ").title()
        
        # Check if there is a SimRacerHub ID
        lookup_name = display_name.lower()
        # Handle manual alias lookup overrides
        if "jesse vaughan" in lookup_name:
            did = None
        elif "davis carroll" in lookup_name:
            did = None
        elif "jason allegrini" in lookup_name:
            did = None
        elif "michael rakes" in lookup_name:
            did = None
        elif "tyson kopf" in lookup_name:
            did = None
        else:
            did = SRH_IDS.get(lookup_name)
            
        # Generate stats button
        if did:
            stats_btn_html = f'<a href="https://simracerhub.com/driver_stats.php?driver_id={did}&season_id=28135" target="_blank" class="btn-stats">View Stats &rarr;</a>'
        else:
            stats_btn_html = '<a href="#" class="btn-stats disabled-stats" style="opacity: 0.55; cursor: not-allowed; pointer-events: none; border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05);">No Stats Yet</a>'
            
        # Render custom number image if available on disk, otherwise render text fallback
        if lookup_name in NUMBER_IMAGES:
            img_filename = NUMBER_IMAGES[lookup_name]
            number_render_html = f'<img src="assets/drivers%20numbers/{img_filename}" alt="Custom Number" style="max-height: 120px; max-width: 200px; object-fit: contain;">'
        else:
            number_render_html = f'<span style="color:var(--neon-green); font-size:3.5rem; font-weight:900; font-style:italic; font-family:var(--font-heading); text-shadow: 0 0 10px rgba(0,255,0,0.3);">#{number}</span>'

        cards_html += f"""
            <div class="driver-card" data-status="{status}">
                <div class="driver-img-box">
                    <span class="placeholder-photo">[ CAR IMAGE ]</span>
                    <!-- <img src="assets/drivers/{did if did else 'placeholder'}.png" alt="{display_name}"> -->
                </div>
                <div class="driver-info">
                    <div class="watermark-number">{number}</div>
                    <div style="font-size: 0.8rem; font-weight: bold; color: var(--neon-green); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">{status_display}</div>
                    <h3 class="italic-heavy" style="margin-bottom:10px; font-size: 1.6rem; z-index: 2; position: relative;">{display_name}</h3>
                    <div class="driver-number-img" style="min-height: 120px; margin-bottom: 15px; display: flex; justify-content: center; align-items: center; z-index: 2; position: relative;">
                        {number_render_html}
                    </div>
                    {stats_btn_html}
                </div>
            </div>"""
    else:
        # Render Vacant / Available Slot Card
        cards_html += f"""
            <div class="driver-card available-card" style="border: 1px dashed rgba(57, 255, 20, 0.25); background: linear-gradient(180deg, #0d0d0f 0%, #040405 100%); opacity: 0.8; transition: all 0.3s ease;" onmouseover="this.style.borderColor='var(--neon-green)'; this.style.opacity='1'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='rgba(57, 255, 20, 0.25)'; this.style.opacity='0.8'; this.style.transform='translateY(0)';" data-status="available">
                <div class="driver-img-box" style="background-color: #030303; border-bottom: 2px dashed rgba(57, 255, 20, 0.15); display: flex; align-items: center; justify-content: center; height: 180px;">
                    <span style="color: rgba(255, 255, 255, 0.12); font-size: 1rem; font-weight: bold; font-family: var(--font-heading); text-transform: uppercase; letter-spacing: 2px;">Vacant Slot</span>
                </div>
                <div class="driver-info" style="padding: 20px; text-align: center; display: flex; flex-direction: column; flex-grow: 1;">
                    <div class="watermark-number" style="color: rgba(255, 255, 255, 0.015);">{number}</div>
                    <div style="font-size: 0.8rem; font-weight: bold; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Available</div>
                    <h3 class="italic-heavy" style="margin-bottom:10px; font-size: 1.6rem; color: rgba(255,255,255,0.35); z-index: 2; position: relative;">#{number} Available</h3>
                    <div class="driver-number-img" style="min-height: 120px; margin-bottom: 15px; display: flex; justify-content: center; align-items: center; z-index: 2; position: relative;">
                        <span style="color: rgba(255, 255, 255, 0.08); font-size: 3.5rem; font-weight: 900; font-style: italic; font-family: var(--font-heading);">#{number}</span>
                    </div>
                    <a href="/apply.html" class="btn-stats" style="border-color: rgba(57, 255, 20, 0.25); color: var(--neon-green); background: rgba(57, 255, 20, 0.02); text-decoration: none; padding: 10px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-family: var(--font-heading); transition: all 0.2s ease;" onmouseover="this.style.background='rgba(57, 255, 20, 0.12)'; this.style.borderColor='var(--neon-green)';" onmouseout="this.style.background='rgba(57, 255, 20, 0.02)'; this.style.borderColor='rgba(57, 255, 20, 0.25)';" onclick="window.location.href='/apply.html'; return false;">Claim Number &rarr;</a>
                </div>
            </div>"""

html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Roster | Bandit Racing League</title>
    <!-- SEO & Page Previews -->
    <meta name="description" content="Official driver roster of the Bandit Racing League. View driver stats, car numbers, status tags, and profiles of our short track sim racers.">
    <meta name="keywords" content="Bandit Racing League, Roster, iRacing League, Short Track Racing, Sim Racing, Drivers">
    
    <!-- Open Graph / Discord Previews -->
    <meta property="og:title" content="Driver Roster | Bandit Racing League">
    <meta property="og:description" content="Official driver roster of the Bandit Racing League. View driver stats, car numbers, status tags, and profiles.">
    <meta property="og:image" content="https://banditracingleague.net/assets/main-logo.png">
    <meta property="og:url" content="https://banditracingleague.net/drivers.html">
    <meta property="og:type" content="website">
    <meta name="theme-color" content="#00ff00">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <!-- Mobile Header (Visible only on mobile) -->
            <div class="nav-mobile-header">
                <a href="/index.html" class="nav-brand-mobile">BANDIT RACING LEAGUE</a>
                <button class="nav-toggle" aria-label="Toggle navigation">
                    <span class="hamburger"></span>
                </button>
            </div>
            
            <ul class="nav-links">
                <li><a href="/apply.html" class="btn-secondary">Apply to League</a></li>
                <li><a href="/index.html">Home</a></li>
                <li><a href="/standings.html">Standings</a></li>
                <li><a href="/schedule.html">Schedule</a></li>
                <li><a href="/results.html">Results</a></li>
                <li><a href="/drivers.html" class="active">Drivers</a></li>
                <li><a href="/teams.html">Teams</a></li>
                <li><a data-tooltip="Fantasy League" href="/fantasy.html"><img src="assets/fantasy-icon.png" alt="Fantasy League" style="height: 42px; width: 42px; border-radius: 50%; border: 1.5px solid var(--neon-green); vertical-align: middle; filter: drop-shadow(0 0 5px rgba(0,255,0,0.4)); object-fit: cover;"><span class="nav-icon-label">Fantasy League</span></a></li>
                <li><a data-tooltip="Geezer App" href="/geezer-app.html"><img src="assets/geezer-icon.png" alt="Geezer App" style="height: 42px; vertical-align: middle; filter: drop-shadow(0 0 5px rgba(0,255,0,0.5));"><span class="nav-icon-label">Geezer App</span></a></li>
                <li><a data-tooltip="SimTrax Broadcasting" href="/simtrax.html"><img src="assets/simtrax-logo.png" alt="SimTrax Broadcasting" style="height: 42px; vertical-align: middle; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2));"><span class="nav-icon-label">SimTrax Broadcasting</span></a></li>
            </ul>
            <div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">
                <a href="https://discord.gg/HSvP4UG2st" target="_blank" class="btn-primary">Join Discord</a>
                <div class="qr-container">
                    <img src="assets/discord-qr.png" alt="QR Code" style="height: 42px; border-radius: 4px; border: 2px solid var(--neon-green); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" onerror="this.onerror=null; this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='">
                    <div class="qr-popup">
                        <img src="assets/discord-qr.png" style="width: 100%; border-radius: 4px;" onerror="this.style.display='none'">
                        <p style="margin-top: 10px; font-weight: bold; font-family: var(--font-heading); color: var(--neon-green); text-transform: uppercase;">Scan to Join!</p>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <header class="schedule-header container text-center" style="margin-top: 140px; margin-bottom: 40px;">
        <div class="header-content">
            <h1 class="italic-heavy accent title-massive">DRIVER ROSTER</h1>
            <h2 class="italic-heavy text-light">SEASON 16</h2>
        </div>
    </header>

    <!-- Grid -->
    <section class="container" style="margin-bottom: 120px; padding: 0 20px;">
        <div class="grid-4">
{cards_html}
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container footer-content">
            <p>&copy; 2026 Bandit Racing League. All rights reserved.</p>
        </div>
    </footer>

    <!-- Mobile Navigation Toggle -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            const toggleBtn = document.querySelector('.nav-toggle');
            const navContainer = document.querySelector('.nav-container');
            
            if (toggleBtn && navContainer) {{
                toggleBtn.addEventListener('click', function() {{
                    navContainer.classList.toggle('nav-open');
                }});
            }}
        }});
    </script>
</body>
</html>
"""

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(html_template)

print(f"Successfully generated drivers.html with {len(numbers_list)} total slots.")
