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

def main():
    print("=" * 60)
    print("        BRL SOCIAL MEDIA POST AUTOMATION GENERATOR")
    print("=" * 60)
    
    # 1. Fetch Latest Results
    winner_name, track_name, race_date = parse_simhub_results()
    print(f"[+] Race Winner parsed: {winner_name} at {track_name}")
    
    # 2. Fetch Franchise Team Standings
    teams_data = load_js_variable(TEAMS_DATA_PATH, "teamsData")
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
    
    # 6. Copy to Clipboard
    try:
        copy_to_clipboard(post_text)
        print("\n[+] SUCCESS: Post text copied to your clipboard!")
    except Exception as e:
        print(f"\n[!] Clipboard Error: {e}")
        print("Please copy the text manually from the window above.")
        
    # 7. Open Facebook Page URL
    fb_url = "https://www.facebook.com/BanditRacingLeague/posts" # standard league path or general FB
    print(f"[+] Opening Facebook: {fb_url}")
    webbrowser.open(fb_url)
    print("=" * 60)

if __name__ == "__main__":
    main()
