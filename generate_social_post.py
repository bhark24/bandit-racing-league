import os
import re
import json
import ctypes
import webbrowser
import time
from datetime import datetime

# Path Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SIMHUB_PATH = os.path.join(BASE_DIR, "simhub.html")
FANTASY_DATA_PATH = os.path.join(BASE_DIR, "fantasy_data.js")
TEAMS_DATA_PATH = os.path.join(BASE_DIR, "teams_data.js")
INDEX_PATH = os.path.join(BASE_DIR, "index.html")

def clean_driver_name(raw_name):
    # Converts "lacy, benjamin" -> "Benjamin Lacy"
    raw_name = raw_name.strip()
    if ',' in raw_name:
        parts = raw_name.split(',')
        if len(parts) == 2:
            return f"{parts[1].strip().title()} {parts[0].strip().title()}"
    return raw_name.title()

def copy_to_clipboard(text):
    # Native Win32 Clipboard integration via ctypes (zero external dependencies)
    # Configured for both 32-bit and 64-bit Windows compatibility
    import ctypes
    from ctypes import wintypes
    
    CF_UNICODETEXT = 13
    GMEM_MOVEABLE = 0x0002
    
    user32 = ctypes.windll.user32
    kernel32 = ctypes.windll.kernel32
    
    # Define ctypes function signatures for 64-bit safety
    kernel32.GlobalAlloc.argtypes = [wintypes.UINT, ctypes.c_size_t]
    kernel32.GlobalAlloc.restype = wintypes.HGLOBAL
    
    kernel32.GlobalLock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalLock.restype = wintypes.LPVOID
    
    kernel32.GlobalUnlock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalUnlock.restype = wintypes.BOOL
    
    user32.OpenClipboard.argtypes = [wintypes.HWND]
    user32.OpenClipboard.restype = wintypes.BOOL
    
    user32.SetClipboardData.argtypes = [wintypes.UINT, wintypes.HANDLE]
    user32.SetClipboardData.restype = wintypes.HANDLE
    
    user32.CloseClipboard.argtypes = []
    user32.CloseClipboard.restype = wintypes.BOOL
    
    user32.EmptyClipboard.argtypes = []
    user32.EmptyClipboard.restype = wintypes.BOOL
    
    # Encode text to UTF-16 LE with double null terminator
    data = text.encode('utf-16-le') + b'\x00\x00'
    
    if not user32.OpenClipboard(None):
        raise RuntimeError("Failed to open clipboard. Ensure no other program is holding it.")
        
    try:
        user32.EmptyClipboard()
        h_mem = kernel32.GlobalAlloc(GMEM_MOVEABLE, len(data))
        if not h_mem:
            raise MemoryError("Failed to allocate memory.")
            
        ptr = kernel32.GlobalLock(h_mem)
        if not ptr:
            raise RuntimeError("Failed to lock memory.")
            
        try:
            ctypes.memmove(ptr, data, len(data))
        finally:
            kernel32.GlobalUnlock(h_mem)
            
        if not user32.SetClipboardData(CF_UNICODETEXT, h_mem):
            raise RuntimeError("Failed to write to clipboard.")
    finally:
        user32.CloseClipboard()

def load_js_variable(file_path, var_name):
    if not os.path.exists(file_path):
        return None
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        match = re.search(rf'const\s+{var_name}\s*=\s*({{.*?}});', content, re.DOTALL)
        if match:
            return json.loads(match.group(1))
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
    return None

def parse_simhub_results():
    if not os.path.exists(SIMHUB_PATH):
        print(f"Warning: simhub.html not found at {SIMHUB_PATH}")
        return "Unknown Driver", "Unknown Track", "Recent Date"
        
    try:
        with open(SIMHUB_PATH, "r", encoding="utf-8", errors="ignore") as f:
            html = f.read()
            
        # Parse Track Name and Date
        track_match = re.search(r"<span class='track-name'[^>]*>(.*?)</span>", html)
        track_name = track_match.group(1).strip() if track_match else "Unknown Track"
        
        date_match = re.search(r"<span class='race-details'[^>]*>(.*?)</span>", html)
        if date_match:
            race_date = date_match.group(1).split('&#183;')[0].strip()
        else:
            meta_match = re.search(r"<div class='track-meta'[^>]*>(.*?)<span>", html)
            race_date = meta_match.group(1).strip() if meta_match else datetime.now().strftime("%B %d, %Y")
            
        # Find drivers JS list inside HTML
        match = re.search(r'drivers\s*=\s*(\[.*?\])\s*;', html, re.DOTALL)
        if match:
            drivers_raw_js = match.group(1)
            json_str = re.sub(r'(\b\w+\b)\s*:', r'"\1":', drivers_raw_js)
            json_str = re.sub(r',\s*\}', '}', json_str)
            json_str = re.sub(r',\s*\]', ']', json_str)
            
            try:
                drivers = json.loads(json_str)
                winner_obj = next((d for d in drivers if int(d.get("fp", 99)) == 1), None)
                if winner_obj:
                    winner_name = clean_driver_name(winner_obj.get("name", "Unknown Driver"))
                    return winner_name, track_name, race_date
            except Exception as e:
                # Fallback simple regex search if json fails
                winner_match = re.search(r'fp\s*:\s*1\s*,[^{}]*name\s*:\s*"([^"]+)"', drivers_raw_js)
                if winner_match:
                    return clean_driver_name(winner_match.group(1)), track_name, race_date
    except Exception as e:
        print(f"Error parsing simhub.html: {e}")
        
    return "Unknown Driver", "Unknown Track", "Recent Date"

def get_next_race():
    if not os.path.exists(INDEX_PATH):
        return "Unknown Track", "Stay tuned for the next race!"
    try:
        with open(INDEX_PATH, "r", encoding="utf-8", errors="ignore") as f:
            html = f.read()
            
        matches = re.findall(r'\{\s*track:\s*"([^"]+)"[^{}]*time:\s*new\s+Date\("([^"]+)"\)\.getTime\(\)\s*\}', html)
        now_ms = time.time() * 1000
        
        for track, date_raw in matches:
            date_clean = re.sub(r'\s+[A-Z]{3,4}$', '', date_raw).strip()
            try:
                dt = datetime.strptime(date_clean, "%b %d, %Y %H:%M:%S")
                ts = dt.timestamp() * 1000
                if ts > now_ms:
                    line_match = re.search(r'\{\s*track:\s*"' + re.escape(track) + r'"[^}]+dateStr:\s*"([^"]+)"', html)
                    date_str = line_match.group(1) if line_match else date_raw
                    return track, date_str
            except Exception as e:
                pass
    except Exception as e:
        print(f"Error checking schedule: {e}")
    return "Daytona Oval", "Wednesday, June 17th @ 9:00 PM EST"

TRACK_LOGOS = {
    "daytona oval": "Daytona_Clean.png",
    "daytona": "Daytona_Clean.png",
    "atlanta": "AtlantaBlack.png",
    "charlotte": "Charlotte-Motor-Speedway-logo-2019.png",
    "bristol": "Bristol.png",
    "nashville superspeedway": "Nashville.png",
    "nashville": "Nashville.png",
    "pocono": "POCONO.png",
    "richmond": "Richmond.png",
    "michigan": "MICHIGAN INT.png",
    "gateway": "World_Wide_Technology_Raceway_logo.svg.png",
    "darlington": "Darlington.png",
    "kansas": "Kansas.png",
    "texas": "Texas Motorspeedway.png",
    "las vegas": "Vegas.png",
    "phoenix": "phoenix.png",
    "martinsville": "Martinsville.jpg",
    "talladega": "Talladega.jpg",
    "road america": "Road America.png",
    "homestead miami": "Homestead Miami.jpg"
}

def normalize_name(name):
    if not name:
        return ""
    name = name.strip().lower()
    if ',' in name:
        parts = name.split(',')
        if len(parts) == 2:
            name = f"{parts[1].strip()} {parts[0].strip()}"
    name = re.sub(r'\d+$', '', name)
    name = re.sub(r'\s+[a-z]\s+', ' ', name)
    name = re.sub(r'\s+', ' ', name).strip()
    name = name.replace("mc ", "mc")
    
    name_map = {
        "josh": "joshua",
        "jonathon": "johnathon",
        "jon": "john",
        "dave": "david",
        "mike": "michael",
        "diante": "di0nte",
        "dionte": "di0nte",
        "roder": "rader",
        "conor": "connor",
        "kondas": "kondus"
    }
    
    words = name.split()
    mapped_words = [name_map.get(w, w) for w in words]
    return " ".join(mapped_words)

def get_driver_number(winner_name, roster_data_path):
    if not os.path.exists(roster_data_path):
        return ""
    try:
        with open(roster_data_path, "r", encoding="utf-8") as f:
            content = f.read()
        match = re.search(r'const\s+rosterData\s*=\s*({.*?});', content, re.DOTALL)
        if match:
            roster_data = json.loads(match.group(1))
            norm_winner = normalize_name(winner_name)
            for num, details in roster_data.items():
                if normalize_name(details.get("driver", "")) == norm_winner:
                    return num
    except Exception as e:
        print(f"Error loading roster: {e}")
    return ""

def find_custom_winner_image(winner_name, base_dir):
    winner_images_dir = os.path.join(base_dir, "assets", "WINNER IMAGES")
    if not os.path.exists(winner_images_dir):
        return ""
        
    # First priority: check for explicit name like dylan_winner_dylan
    for f in os.listdir(winner_images_dir):
        if "dylan_winner_dylan" in f.lower():
            return f"assets/WINNER IMAGES/{f}"
            
    # Second priority: match winner name parts
    norm_winner = winner_name.lower().replace(" ", "").replace("3", "").replace("2", "")
    for f in os.listdir(winner_images_dir):
        norm_f = f.lower().replace("_", "").replace("-", "")
        if norm_winner in norm_f:
            return f"assets/WINNER IMAGES/{f}"
            
    return ""

def scrape_driver_standings_playwright(browser, season_id="29722"):
    print("[*] Scraping driver standings from SimRacerHub...")
    try:
        page = browser.new_page()
        url = f"https://simracerhub.com/season_standings.php?season_id={season_id}"
        page.goto(url)
        page.wait_for_selector("#standings_react_root", timeout=10000)
        page.wait_for_timeout(3000)
        
        standings = page.evaluate("""() => {
            const rows = [];
            const table = document.querySelector('#standings_react_root table');
            if (!table) return [];
            
            const headers = Array.from(table.querySelectorAll('thead th, tr th')).map(th => th.textContent.trim().toUpperCase());
            const driverIdx = headers.findIndex(h => h.includes('DRIVER'));
            const ptsIdx = headers.findIndex(h => h.includes('TOT') || h === 'PTS' || h.includes('POINTS'));
            const posIdx = headers.findIndex(h => h === 'POS');
            
            const trs = Array.from(table.querySelectorAll('tbody tr'));
            for (let tr of trs) {
                const cells = Array.from(tr.querySelectorAll('td'));
                if (cells.length < 5) continue;
                
                let name = "";
                if (driverIdx !== -1 && driverIdx < cells.length) {
                    name = cells[driverIdx].textContent.trim();
                } else {
                    const link = tr.querySelector('a[href*="driver_id="]');
                    if (link) name = link.textContent.trim();
                }
                
                if (!name) continue;
                
                let points = 0;
                if (ptsIdx !== -1 && ptsIdx < cells.length) {
                    points = parseInt(cells[ptsIdx].textContent.trim()) || 0;
                }
                
                let pos = rows.length + 1;
                if (posIdx !== -1 && posIdx < cells.length) {
                    pos = parseInt(cells[posIdx].textContent.trim()) || pos;
                }
                
                rows.push({ pos, name, points });
            }
            return rows;
        }""")
        page.close()
        return standings
    except Exception as e:
        print(f"[!] Error scraping standings: {e}")
        return []

def generate_social_graphic(winner_name, track_name, race_date, teams_data, fantasy_data):
    # 1. Gather all weekly data
    winner_number = get_driver_number(winner_name, os.path.join(BASE_DIR, "roster_data.js"))
    track_logo = TRACK_LOGOS.get(track_name.strip().lower(), "")
    
    team_list = []
    if teams_data and "teams" in teams_data:
        sorted_teams = sorted(teams_data["teams"], key=lambda x: x.get("points", 0), reverse=True)
        for t in sorted_teams:
            team_list.append({
                "name": t.get("name", "Team"),
                "points": t.get("points", 0),
                "wins": t.get("wins", 0)
            })
            
    fantasy_list = []
    if fantasy_data and "leaderboard" in fantasy_data:
        sorted_fans = fantasy_data["leaderboard"]
        for fan in sorted_fans:
            fantasy_list.append({
                "name": fan.get("name", "Fan"),
                "score": fan.get("score", 0),
                "wins": fan.get("wins", 0)
            })
            
    # 2. Generate standings and graphic using Playwright
    try:
        from playwright.sync_api import sync_playwright
        print("[*] Initializing Playwright...")
        
        with sync_playwright() as p:
            browser = p.chromium.launch()
            
            # Scrape driver standings
            driver_standings = scrape_driver_standings_playwright(browser, "29722")
            
            # Construct weekly data dict
            winner_image = find_custom_winner_image(winner_name, BASE_DIR)
            weekly_data = {
                "winnerName": winner_name,
                "winnerNumber": winner_number,
                "winnerImage": winner_image,
                "trackName": track_name,
                "trackLogo": track_logo,
                "raceDate": race_date,
                "teamStandings": team_list,
                "fantasyLeaderboard": fantasy_list,
                "driverStandings": driver_standings
            }
            
            # Write data to weekly_data.js
            weekly_js_path = os.path.join(BASE_DIR, "weekly_data.js")
            with open(weekly_js_path, "w", encoding="utf-8") as f:
                f.write(f"const weeklyData = {json.dumps(weekly_data, indent=2)};\n")
            print(f"[+] Standings and results data written to {weekly_js_path}")
            
            # Render and capture weekly update graphic
            print("[*] Generating weekly post graphic...")
            html_path = os.path.join(BASE_DIR, "social_graphic.html")
            out_graphic_path = os.path.join(BASE_DIR, "assets", "weekly_social_update.png")
            out_brain_path = r"C:\Users\Bill\.gemini\antigravity\brain\0aeaaa4b-1ddf-44e2-ad3d-0f83196a5bc7\weekly_social_update.png"
            
            # Ensure parent directories for output exist
            os.makedirs(os.path.dirname(out_graphic_path), exist_ok=True)
            os.makedirs(os.path.dirname(out_brain_path), exist_ok=True)
            
            page = browser.new_page(viewport={'width': 1200, 'height': 1200})
            url = f"file:///{html_path.replace(os.sep, '/')}"
            page.goto(url)
            page.evaluate("document.fonts.ready")
            page.wait_for_timeout(2000) # give images time to load
            
            page.screenshot(path=out_graphic_path)
            page.screenshot(path=out_brain_path)
            browser.close()
            
        print(f"[+] Success: Standings graphic generated at {out_graphic_path}")
    except Exception as e:
        print(f"[!] Error generating graphic: {e}")

def main():
    print("=" * 60)
    print("        BRL SOCIAL MEDIA POST AUTOMATION GENERATOR")
    print("=" * 60)
    
    # 1. Fetch Franchise Team Standings
    teams_data = load_js_variable(TEAMS_DATA_PATH, "teamsData")
    
    # 2. Fetch Latest Results from teams_data.js first
    winner_name, track_name, race_date = "Unknown Driver", "Unknown Track", "Recent Date"
    if teams_data and "latestRace" in teams_data:
        latest = teams_data["latestRace"]
        track_name = latest.get("track", "Unknown Track")
        race_date = latest.get("date", "Recent Date")
        results = latest.get("results", [])
        if results:
            winner_name = clean_driver_name(results[0].get("name", "Unknown Driver"))
            print(f"[+] Race Winner loaded from teams_data.js: {winner_name} at {track_name}")
    
    if winner_name == "Unknown Driver":
        winner_name, track_name, race_date = parse_simhub_results()
        print(f"[+] Race Winner parsed from simhub.html: {winner_name} at {track_name}")
    
    team_rows = []
    if teams_data and "teams" in teams_data:
        sorted_teams = sorted(teams_data["teams"], key=lambda x: x.get("points", 0), reverse=True)
        emojis = ["🥇", "🥈", "🥉", "🏎️", "🏎️", "🏎️"]
        for idx, t in enumerate(sorted_teams):
            emoji = emojis[idx] if idx < len(emojis) else "🏎️"
            name = t.get("name", "Team")
            pts = t.get("points", 0)
            wins = t.get("wins", 0)
            win_suffix = f" ({wins} Win{'s' if wins != 1 else ''})" if wins > 0 else ""
            team_rows.append(f"{emoji} {idx+1}. {name} — {pts} pts{win_suffix}")
    else:
        team_rows.append("No active team standings available.")
        
    # 3. Fetch Viewer Fantasy Standings
    fantasy_data = load_js_variable(FANTASY_DATA_PATH, "fantasyData")
    fantasy_rows = []
    if fantasy_data and "leaderboard" in fantasy_data:
        sorted_fans = fantasy_data["leaderboard"][:5] # Top 5
        emojis = ["🥇", "🥈", "🥉", "🏎️", "🏎️"]
        for idx, fan in enumerate(sorted_fans):
            emoji = emojis[idx] if idx < len(emojis) else "🏎️"
            name = fan.get("name", "Fan")
            score = fan.get("score", 0)
            wins = fan.get("wins", 0)
            win_suffix = f" ({wins} Win{'s' if wins != 1 else ''})" if wins > 0 else ""
            fantasy_rows.append(f"{emoji} {idx+1}. {name} — {score} pts{win_suffix}")
    else:
        fantasy_rows.append("No active fantasy standings available.")
        
    # 4. Fetch Next Race Details
    next_track, next_date = get_next_race()
    
    # 5. Format Social Media Post Template
    post_text = f"""🏁 **BANDIT RACING LEAGUE - WEEKLY UPDATE** 🏁
Custom Standing Graphic: assets/weekly_social_update.png

What a race! Congratulations to **{winner_name}** for taking the checkered flag at **{track_name}** ({race_date})! 🏆

💼 **FRANCHISE TEAM STANDINGS** 💼
Here is how the Team Championship looks after this week:
{"\n".join(team_rows)}

🔮 **FANTASY LEAGUE LEADERBOARD** 🔮
Here is the Top 5 for our Viewer Fantasy Challenge:
{"\n".join(fantasy_rows)}

See the full results, driver statistics, and updated standings on our website:
👉 **https://banditracingleague.net/**

🗓️ **UPCOMING RACE** 🗓️
Next week, the series travels to **{next_track}**!
📅 {next_date}

Who is your pick to win? Let us know in the comments below! 👇"""

    print("\n" + "-" * 50)
    print("GENERATED SOCIAL POST:")
    print("-" * 50)
    try:
        print(post_text)
    except UnicodeEncodeError:
        # Fallback for Windows consoles that don't support UTF-8/emojis by default
        print(post_text.encode('ascii', errors='replace').decode('ascii'))
    print("-" * 50)
    
    # 6. Generate Social Graphic
    generate_social_graphic(winner_name, track_name, race_date, teams_data, fantasy_data)
    
    # 7. Copy to Clipboard
    try:
        copy_to_clipboard(post_text)
        print("\n[+] SUCCESS: Post text copied to your clipboard!")
    except Exception as e:
        print(f"\n[!] Clipboard Error: {e}")
        print("Please copy the text manually from the window above.")
        
    # 8. Open Facebook Page URL
    fb_url = "https://www.facebook.com/profile.php?id=61585435839542"
    print(f"[+] Opening Facebook: {fb_url}")
    webbrowser.open(fb_url)
    print("=" * 60)

if __name__ == "__main__":
    main()
