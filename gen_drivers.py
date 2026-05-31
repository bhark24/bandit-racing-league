drivers = [
    ("Jackson Knaak", 63408),
    ("Brandon Jackson", 21107),
    ("Curtis Yancey", 45358),
    ("Kevin Foster", 39648),
    ("Logan A Murray", 118435),
    ("Nick Nickerson", 17336),
    ("Nathan Santos2", 121220),
    ("David Leakey", 60455),
    ("Conor Gibson", 35159),
    ("Nolan Gross", 41381),
    ("Bob Berry", 1652),
    ("Bill Harkins", 39625),
    ("Johnathon Platt", 39205),
    ("Victor Weaver", 60464),
    ("Matt Crockett", 47625),
    ("Nicole Kriesel", 64312),
    ("Adam Clark", 105478)
]

cards_html = ""
for name, did in drivers:
    display_name = name.replace("2", "") if name == "Nathan Santos2" else name
    cards_html += f"""
            <div class="driver-card">
                <div class="driver-img-box">
                    <span class="placeholder-photo">[ CAR IMAGE ]</span>
                    <!-- <img src="assets/drivers/{did}.png" alt="{display_name}"> -->
                </div>
                <div class="driver-info">
                    <div class="watermark-number">00</div>
                    <h3 class="italic-heavy" style="margin-bottom:10px;">{display_name}</h3>
                    <div class="driver-number-img" style="min-height: 60px; margin-bottom: 15px; display: flex; justify-content: center; align-items: center;">
                        <!-- Drop your custom number graphic in assets/numbers/! -->
                        <img src="assets/numbers/{display_name}.png" alt="Custom Number" style="max-height: 60px; max-width: 100px; object-fit: contain;" onerror="this.onerror=null; this.outerHTML='<span style=\\'color:var(--neon-green); font-size:2rem; font-weight:900; font-style:italic;\\'>#00</span>'">
                    </div>
                    <a href="https://simracerhub.com/driver_stats.php?driver_id={did}&season_id=28135" target="_blank" class="btn-stats">View Stats &rarr;</a>
                </div>
            </div>"""

html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drivers Roster | Bandit Racing League</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <img src="assets/logo-wide.png" alt="Bandit Racing League" class="logo-img" onerror="this.onerror=null; this.outerHTML='<span class=\\'logo-text\\'>BANDIT <span class=\\'accent\\'>RACING</span></span>'">
            </div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="standings.html">Standings</a></li>
                <li><a href="schedule.html">Schedule</a></li>
                <li><a href="results.html">Results</a></li>
                <li><a href="drivers.html" class="active">Drivers</a></li>
                <li><a href="#">Rulebook</a></li>
            </ul>
            <div class="nav-actions">
                <a href="#" class="btn-primary">Join Discord</a>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <header class="schedule-header container text-center">
        <div class="header-content">
            <h1 class="italic-heavy accent title-massive">DRIVER ROSTER</h1>
            <h2 class="italic-heavy text-light">SEASON 16</h2>
        </div>
    </header>

    <!-- Grid -->
    <section class="container" style="margin-bottom: 80px;">
        <div class="grid-4">
{cards_html}
        </div>
    </section>

    <footer>
        <div class="container footer-content">
            <p>&copy; 2026 Bandit Racing League. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
"""

with open(r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\drivers.html", "w", encoding="utf-8") as f:
    f.write(html_template)
