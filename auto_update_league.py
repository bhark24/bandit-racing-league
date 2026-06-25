import os
import re
import json
import urllib.request
import subprocess
import sys
from datetime import datetime

# Path Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEAMS_DATA_PATH = os.path.join(BASE_DIR, "teams_data.js")
SEASON_ID = "29722"

def load_teams_data():
    if not os.path.exists(TEAMS_DATA_PATH):
        print(f"Error: teams_data.js not found at {TEAMS_DATA_PATH}")
        return None
    with open(TEAMS_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r'const\s+teamsData\s*=\s*({.*?});', content, re.DOTALL)
    if not match:
        print("Error: Could not extract teamsData")
        return None
    try:
        return json.loads(match.group(1))
    except Exception as e:
        print(f"Error parsing teamsData: {e}")
        return None

def fetch_html(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def parse_race_details(html):
    # Check if results are posted by looking for drivers array
    drivers_match = re.search(r'drivers\s*=\s*(\[.*?\])\s*;', html, re.DOTALL)
    if not drivers_match:
        return None, None # No results posted yet
        
    track_match = re.search(r"<span class='track-name'[^>]*>(.*?)</span>", html)
    track_name = track_match.group(1).strip() if track_match else "Unknown Track"
    
    date_match = re.search(r"<span class='race-details'[^>]*>(.*?)</span>", html)
    if date_match:
        race_date = date_match.group(1).split('&#183;')[0].strip()
    else:
        meta_match = re.search(r"<div class='track-meta'[^>]*>(.*?)<span>", html)
        race_date = meta_match.group(1).strip() if meta_match else None
        
    return track_name, race_date

def get_recorded_dates(teams_data):
    dates = set()
    if not teams_data:
        return dates
    
    # 1. Check latestRace date
    latest = teams_data.get("latestRace")
    if latest and latest.get("date"):
        dates.add(latest["date"])
        
    # 2. Check team ledgers for race dates
    for team in teams_data.get("teams", []):
        for entry in team.get("ledger", []):
            desc = entry.get("description", "")
            if "Prize Money" in desc or "Race Prep" in desc:
                dates.add(entry.get("date"))
                
    return dates

def run_command(command_list):
    print(f"[*] Running: {' '.join(command_list)}")
    result = subprocess.run(command_list, capture_output=True, text=True, cwd=BASE_DIR)
    if result.returncode != 0:
        print(f"[!] Error running command:\n{result.stderr}")
        return False
    print(result.stdout)
    return True

def main():
    print("=" * 60)
    print("        BRL AUTOMATIC WEBSITE AUTO-UPDATE MONITOR")
    print("=" * 60)
    
    # 1. Load local teams data to check recorded history
    teams_data = load_teams_data()
    if not teams_data:
        sys.exit(1)
        
    recorded_dates = get_recorded_dates(teams_data)
    print(f"[+] Loaded {len(recorded_dates)} previously recorded race dates from teams_data.js")
    
    # 2. Fetch the Season Schedule from SimRacerHub
    schedule_url = f"https://simracerhub.com/season_schedule.php?season_id={SEASON_ID}"
    print(f"[*] Checking SimRacerHub schedule: {schedule_url}")
    schedule_html = fetch_html(schedule_url)
    if not schedule_html:
        print("[!] Failed to load schedule. Exiting.")
        sys.exit(1)
        
    # Find all schedule IDs
    schedule_ids = sorted(list(set(re.findall(r'schedule_id=(\d+)', schedule_html))))
    if not schedule_ids:
        print("[!] No schedule IDs found on SimRacerHub schedule page.")
        sys.exit(1)
        
    print(f"[+] Found {len(schedule_ids)} schedule IDs on SimRacerHub. Scanning for updates...")
    
    new_race_processed = False
    
    # 3. Check each schedule ID
    for sched_id in schedule_ids:
        race_url = f"https://simracerhub.com/season_race.php?schedule_id={sched_id}"
        race_html = fetch_html(race_url)
        if not race_html:
            continue
            
        track_name, race_date = parse_race_details(race_html)
        
        # If results are not posted, skip this race
        if not race_date:
            continue
            
        # Check if we already have this race in our database
        if race_date in recorded_dates:
            print(f"[*] Already recorded: {track_name} ({race_date})")
            continue
            
        # Found a new race that has results posted but is not in our database!
        print(f"\n[+] NEW RACE RESULTS DETECTED!")
        print(f"    Track: {track_name}")
        print(f"    Date:  {race_date}")
        print(f"    ID:    {sched_id}")
        print("-" * 40)
        
        # Run updates in order
        print("[*] Launching update pipeline...")
        
        # A. Update Teams Standings and Financials
        if not run_command(["python", "update_teams.py", "--schedule_id", sched_id]):
            print("[!] Team updates failed. Stopping pipeline.")
            sys.exit(1)
            
        # B. Update Fantasy Scoring
        if not run_command(["python", "update_fantasy.py", "--schedule_id", sched_id]):
            print("[!] Fantasy updates failed. Stopping pipeline.")
            sys.exit(1)
            
        # C. Generate Homepage Standings and Social Graphic
        if not run_command(["python", "generate_social_post.py"]):
            print("[!] Homepage standings and graphic generation failed.")
            sys.exit(1)
            
        print(f"[+] SUCCESS: Processed results for {track_name} ({race_date}) successfully!")
        new_race_processed = True
        
        # Normally we process one new race per run (the weekly update).
        # We can break here to avoid run-away script execution.
        break
        
    if not new_race_processed:
        print("\n[*] Website is fully up-to-date! No new race results found on SimRacerHub.")
    else:
        # Auto-push updates to GitHub if in a Git repo
        git_dir = os.path.join(BASE_DIR, ".git")
        if os.path.exists(git_dir):
            print("\n[*] Git repository detected. Staging changes...")
            subprocess.run(["git", "add", "teams_data.js", "weekly_data.js", "fantasy_data.js", "assets/weekly_social_update.png"], cwd=BASE_DIR)
            subprocess.run(["git", "commit", "-m", "Auto-update race results and standings"], cwd=BASE_DIR)
            print("[*] Commited updates locally. Pushing to GitHub remote...")
            push_res = subprocess.run(["git", "push"], cwd=BASE_DIR, capture_output=True, text=True)
            if push_res.returncode == 0:
                print("[+] Successfully pushed changes to GitHub! Pages build triggered.")
            else:
                print(f"[!] Git push failed:\n{push_res.stderr}")
            
    print("=" * 60)

if __name__ == "__main__":
    main()
