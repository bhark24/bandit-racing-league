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
WEEKLY_DATA_PATH = os.path.join(BASE_DIR, "weekly_data.js")
INDEX_PATH = os.path.join(BASE_DIR, "index.html")

def clean_driver_name(raw_name):
    # Converts "lacy, benjamin" -> "Benjamin Lacy"
    raw_name = raw_name.strip()
    if ',' in raw_name:
        parts = raw_name.split(',')
        if len(parts) == 2:
            first = re.sub(r'\d+$', '', parts[1].strip()).strip()
            last = re.sub(r'\d+$', '', parts[0].strip()).strip()
            res = f"{first.title()} {last.title()}"
            return re.sub(r'\b(Mc)([a-z])', lambda m: m.group(1) + m.group(2).upper(), res)
    raw_name = re.sub(r'\d+$', '', raw_name).strip()
    res = raw_name.title()
    return re.sub(r'\b(Mc)([a-z])', lambda m: m.group(1) + m.group(2).upper(), res)

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

def find_custom_winner_image(winner_name, track_name, base_dir):
    winner_images_dir = os.path.join(base_dir, "assets", "WINNER IMAGES")
    if not os.path.exists(winner_images_dir):
        return ""
        
    track_norm = track_name.lower()
    for word in ["speedway", "raceway", "international", "motor", "superspeedway", "tri-oval", "trioval", "oval"]:
        track_norm = track_norm.replace(word, "")
    track_norm = track_norm.replace(" ", "").strip()

    # First priority: match both winner name and track name keywords
    norm_winner = winner_name.lower().replace(" ", "").replace("3", "").replace("2", "")
    for f in os.listdir(winner_images_dir):
        norm_f = f.lower().replace("_", "").replace("-", "").replace(" ", "")
        if norm_winner in norm_f and track_norm in norm_f:
            return f"assets/WINNER IMAGES/{f}"

    # Second priority: check for explicit name if the winner name matches
    if "dylan" in winner_name.lower():
        for f in os.listdir(winner_images_dir):
            if "dylan_winner_dylan" in f.lower():
                return f"assets/WINNER IMAGES/{f}"
            
    # Third priority: match winner name parts
    for f in os.listdir(winner_images_dir):
        norm_f = f.lower().replace("_", "").replace("-", "")
        if norm_winner in norm_f:
            return f"assets/WINNER IMAGES/{f}"
            
    return ""

def find_track_action_shots(track_name, base_dir):
    # Extract track keywords (e.g. "Atlanta" or "Daytona")
    track_norm = track_name.lower()
    match = re.search(r'\((.*?)\)', track_norm)
    if match:
        track_norm = match.group(1).strip()
    else:
        # Clean track name
        for word in ["speedway", "raceway", "international", "motor", "superspeedway", "tri-oval", "trioval", "oval"]:
            track_norm = track_norm.replace(word, "")
        track_norm = track_norm.replace(" ", "").strip()
    
    # Search in both assets/race images and assets/WINNER IMAGES/action shots
    dirs_to_check = [
        ("assets/race images", os.path.join(base_dir, "assets", "race images")),
        ("assets/WINNER IMAGES/action shots", os.path.join(base_dir, "assets", "WINNER IMAGES", "action shots"))
    ]
    
    matched_files = []
    for rel_path, abs_path in dirs_to_check:
        if os.path.exists(abs_path):
            for f in os.listdir(abs_path):
                if track_norm in f.lower():
                    # Standardize paths to use forward slashes for web consistency
                    matched_files.append(f"{rel_path}/{f}")
    return sorted(list(set(matched_files)))


def find_driver_team(driver_name, teams_data):
    if not teams_data or "teams" not in teams_data:
        return "Legacy Racing"
    norm_driver = normalize_name(driver_name)
    for team in teams_data["teams"]:
        drivers = team.get("drivers", {})
        primary = [normalize_name(d) for d in drivers.get("primary", [])]
        backup = [normalize_name(d) for d in drivers.get("backup", [])]
        if norm_driver in primary or norm_driver in backup:
            return team.get("name", "Legacy Racing")
    return "Legacy Racing"


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
            const winsIdx = headers.findIndex(h => h === 'WINS' || h === 'W');
            
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
                
                let wins = 0;
                if (winsIdx !== -1 && winsIdx < cells.length) {
                    wins = parseInt(cells[winsIdx].textContent.trim()) || 0;
                }
                
                rows.push({ pos, name, points, wins });
            }
            return rows;
        }""")
        page.close()
        return standings
    except Exception as e:
        print(f"[!] Error scraping standings: {e}")
        return []

def get_latest_youtube_video_id(channel_id="UC8D9f0DOxaf8hdyxIuk2NeQ"):
    import urllib.request
    import xml.etree.ElementTree as ET
    print(f"[*] Fetching latest YouTube video ID for channel {channel_id}...")
    url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            xml_data = response.read().decode('utf-8')
        root = ET.fromstring(xml_data)
        namespaces = {
            '': 'http://www.w3.org/2005/Atom',
            'yt': 'http://www.youtube.com/xml/schemas/2015'
        }
        entries = root.findall('entry', namespaces)
        if entries:
            video_id = entries[0].find('yt:videoId', namespaces).text
            print(f"[+] Found latest YouTube video ID: {video_id}")
            return video_id
    except Exception as e:
        print(f"[!] Error fetching YouTube video ID: {e}")
    # Fallback to the current Daytona video ID if fetch fails
    return "oF84lT2ODkw"

def save_teams_database_file(data):
    try:
        with open(TEAMS_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        js_content = json.dumps(data, indent=2)
        new_content = re.sub(
            r'const\s+teamsData\s*=\s*({.*?});',
            f'const teamsData = {js_content};',
            content,
            flags=re.DOTALL
        )
        with open(TEAMS_DATA_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"[+] Successfully saved updated database to {TEAMS_DATA_PATH}")
    except Exception as e:
        print(f"[!] Error saving teams_data.js: {e}")

def correct_driver_standings(driver_standings):
    # SimRacerHub points have been corrected on the server, so we use scraped points directly.
    # We still sort them and calculate tie positions and clean driver names for the UI.
    corrected_standings = []
    for entry in driver_standings:
        name = entry.get("name", "")
        scraped_pts = entry.get("points", 0)
        wins = entry.get("wins", 0)
        corrected_standings.append({
            "name": name,
            "points": scraped_pts,
            "wins": wins
        })
            
    corrected_standings.sort(key=lambda x: x["points"], reverse=True)
    
    final_standings = []
    for idx, entry in enumerate(corrected_standings):
        if idx == 0:
            pos = 1
        else:
            if entry["points"] == corrected_standings[idx - 1]["points"]:
                pos = final_standings[-1]["pos"]
            else:
                pos = idx + 1
        
        final_standings.append({
            "pos": pos,
            "name": clean_driver_name(entry["name"]),
            "points": entry["points"]
        })
        
    return final_standings


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
            
            # Scrape driver standings and apply self-correcting alignment
            driver_standings = scrape_driver_standings_playwright(browser, "29722")
            driver_standings = correct_driver_standings(driver_standings)
            
            # 1.5. Determine Spotlight Driver based on new rules
            # Rules: 
            # - Participated in the latest race (not isMock)
            # - Advanced position (finish < qualify)
            # - Not selected in the previous 4 races (not in last 4 of spotlightHistory, matching normalized names)
            import hashlib
            spotlight_history = teams_data.get("spotlightHistory", []) if teams_data else []
            selected_spotlight = "Kevin Foster" # Default fallback
            
            existing_spotlight = next((h["driver"] for h in spotlight_history if h["date"] == race_date), None)
            if existing_spotlight:
                selected_spotlight = clean_driver_name(existing_spotlight)
                print(f"[+] Reusing existing spotlight driver from history: {selected_spotlight}")
            else:
                latest_race_data = teams_data.get("latestRace", {}) if teams_data else {}
                results = latest_race_data.get("results", [])
                
                eligible_drivers = []
                for r in results:
                    if r.get("isMock", False):
                        continue
                    name = r.get("name", "")
                    finish = int(r.get("finish", 99))
                    qualify = int(r.get("qualify", 99) or 99)
                    if finish < qualify:
                        cleaned_name = clean_driver_name(name)
                        if cleaned_name:
                            eligible_drivers.append(cleaned_name)
                
                # Filter out drivers selected in the previous 4 races (excluding current race_date)
                previous_history = [h for h in spotlight_history if h["date"] != race_date]
                recent_drivers_normalized = {normalize_name(h["driver"]) for h in previous_history[-4:]}
                
                filtered_eligible = [d for d in eligible_drivers if normalize_name(d) not in recent_drivers_normalized]
                
                if not filtered_eligible:
                    filtered_eligible = eligible_drivers
                    
                eligible_names = sorted(list(set(filtered_eligible)))
                if eligible_names:
                    seed_str = f"{track_name}-{race_date}"
                    hash_digest = hashlib.md5(seed_str.encode('utf-8')).hexdigest()
                    index = int(hash_digest, 16) % len(eligible_names)
                    selected_spotlight = eligible_names[index]
                    
                    if teams_data:
                        if "spotlightHistory" not in teams_data:
                            teams_data["spotlightHistory"] = []
                        teams_data["spotlightHistory"].append({
                            "date": race_date,
                            "driver": selected_spotlight
                        })
                        save_teams_database_file(teams_data)
                else:
                    print("[!] No eligible spotlight drivers found (no one gained positions). Falling back.")
                    selected_spotlight = "Kevin Foster"

            # Construct weekly data dict
            winner_image = find_custom_winner_image(winner_name, track_name, BASE_DIR)
            action_shots = find_track_action_shots(track_name, BASE_DIR)
            latest_video_id = get_latest_youtube_video_id("UC8D9f0DOxaf8hdyxIuk2NeQ")
            weekly_data = {
                "winnerName": winner_name,
                "winnerNumber": winner_number,
                "winnerImage": winner_image,
                "actionShots": action_shots,
                "trackName": track_name,
                "trackLogo": track_logo,
                "raceDate": race_date,
                "teamStandings": team_list,
                "fantasyLeaderboard": fantasy_list,
                "driverStandings": driver_standings,
                "latestBroadcastVideoId": latest_video_id,
                "spotlightDriver": selected_spotlight
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
            out_brain_path = r"C:\Users\Bill\.gemini\antigravity\brain\9ba04bcf-37da-404f-858c-21209e2562f2\weekly_social_update.png"
            
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
            page.close()

            # Render and capture story graphic
            print("[*] Generating facebook story graphic...")
            story_html_path = os.path.join(BASE_DIR, "story_graphic.html")
            out_story_path = os.path.join(BASE_DIR, "final_facebook_story_graphic.png")
            
            story_page = browser.new_page(viewport={'width': 1080, 'height': 1350})
            story_url = f"file:///{story_html_path.replace(os.sep, '/')}"
            story_page.goto(story_url)
            story_page.evaluate("document.fonts.ready")
            story_page.wait_for_timeout(2000)
            story_page.screenshot(path=out_story_path)
            story_page.close()

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
    
    # 2b. Fetch Driver Standings from weekly_data.js (Top 10)
    driver_rows = []
    weekly_data = load_js_variable(WEEKLY_DATA_PATH, "weeklyData")
    if weekly_data and "driverStandings" in weekly_data:
        sorted_drivers = weekly_data["driverStandings"][:10] # Top 10
        emojis = ["🥇", "🥈", "🥉", "🏎️", "🏎️", "🏎️", "🏎️", "🏎️", "🏎️", "🏎️"]
        for idx, d in enumerate(sorted_drivers):
            emoji = emojis[idx] if idx < len(emojis) else "🏎️"
            name = clean_driver_name(d.get("name", "Driver"))
            pts = d.get("points", 0)
            pos = d.get("pos", idx + 1)
            driver_rows.append(f"{emoji} {pos}. {name} — {pts} pts")
    else:
        driver_rows.append("No active driver standings available.")

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
    if "daytona" in track_name.lower():
        story_lead = f"Controversy at Daytona! Sean Britt crossed the line first after contact sent Jonathon Platt spinning into the infield. However, after a post-race administrative review, the win was stripped from Britt and awarded to **{winner_name}**! Platt was scored where he crossed the line as the contact was ruled a racing incident."
    elif "atlanta" in track_name.lower():
        story_lead = f"Redemption in the Peach State! After the heartbreak of the opener, **{winner_name}** drove a masterful race to secure victory at **{track_name}**! Platt qualified 10th but charged forward, leading 32 laps to seal the win. Meanwhile, Connor Gibson earned Hard Charger honors, slicing from 19th all the way to a brilliant 2nd-place finish!"
    elif "charlotte" in track_name.lower():
        story_lead = f"937 Racing Dominates Charlotte! **{winner_name}** drove a flawless race in the #22 Toyota Tundra to claim victory, leading a race-high 54 laps! It was a double top-5 for 937 Racing as Michael Rakes charged from a distant 21st on the grid to finish a spectacular 4th. Johnathon Platt (GFR Racing) continued his strong season, fighting from 14th to finish 2nd, while Benjamin Lacy secured 3rd after leading 27 laps!"
    elif "bristol" in track_name.lower():
        story_lead = f"Lacy Conquers Bristol! **{winner_name}** executed a flawless race strategy in the GFR Racing Chevrolet #7, surviving a caution-heavy concrete battle to take the checkered flag at Bristol Motor Speedway! Bob Berry finished a strong 2nd, while Wes Fuller completed the podium in 3rd."
    elif "nashville" in track_name.lower():
        story_lead = f"Adams Ascends at Nashville! **{winner_name}** drove a patient and calculated race, slicing through the pack from 18th on the grid to lead a race-high 44 laps and capture the victory for 937 Racing! Connor Gibson finished 2nd, while Dylan McDonald completed the podium in 3rd. Jon Osborne was the hard charger of the night, climbing from 28th to 4th!"
    elif "pocono" in track_name.lower():
        story_lead = f"GFR Racing Sweeps Pocono! **{winner_name}** led 21 laps and drove a masterful race to secure the victory at the Tricky Triangle! GFR teammate Nick Nickerson finished a close 2nd to seal a spectacular 1-2 sweep for the team, while Eddie Hagigh claimed 3rd. Pole-sitter Adam Tahan dominated early, leading 37 laps to finish 4th."
    else:
        story_lead = f"What a race! **{winner_name}** executed a perfect game plan, outrunning the field to secure P1 and the largest loot payout of the night at **{track_name}**!"
    
    winner_team = find_driver_team(winner_name, teams_data)

    post_text = f"""**BANDIT RACING LEAGUE - WEEKLY UPDATE** 🏁
{story_lead}

What a wild start to Season 16! Congratulations to **{winner_name}** and {winner_team} for taking the checkered flag at **{track_name}** ({race_date})! 🏆

🏆 **BRL DRIVER STANDINGS** 🏆
Here is the current Top 10 in the Driver Championship:
{"\n".join(driver_rows)}

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
