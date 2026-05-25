import os
import json
import urllib.request
import re
import sys
import argparse
import math
from datetime import datetime

# Path Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "fantasy_config.json")
TEAMS_DATA_PATH = os.path.join(BASE_DIR, "teams_data.js")

def load_config():
    if not os.path.exists(CONFIG_PATH):
        print(f"Error: Config file not found at {CONFIG_PATH}")
        sys.exit(1)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def load_teams_database():
    if not os.path.exists(TEAMS_DATA_PATH):
        print(f"Error: teams_data.js not found at {TEAMS_DATA_PATH}")
        sys.exit(1)
    with open(TEAMS_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract JSON object from JS variable
    match = re.search(r'const\s+teamsData\s*=\s*({.*?});', content, re.DOTALL)
    if not match:
        print("Error: Could not extract teamsData from teams_data.js")
        sys.exit(1)
    
    try:
        data = json.loads(match.group(1))
        return data, content
    except Exception as e:
        print(f"Error parsing teamsData JSON: {e}")
        sys.exit(1)

def save_teams_database(data, original_content):
    js_content = json.dumps(data, indent=2)
    # Replace the old json block with new json
    new_content = re.sub(
        r'const\s+teamsData\s*=\s*({.*?});',
        f'const teamsData = {js_content};',
        original_content,
        flags=re.DOTALL
    )
    with open(TEAMS_DATA_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully saved updated database to {TEAMS_DATA_PATH}")

def fetch_html(url):
    print(f"Fetching: {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching URL: {e}")
        sys.exit(1)

def parse_simhub_results(html):
    match = re.search(r'drivers\s*=\s*(\[.*?\])\s*;', html, re.DOTALL)
    if not match:
        print("Error: Could not find driver results array in SimRacerHub HTML.")
        sys.exit(1)
        
    drivers_raw_js = match.group(1)
    
    # Standardize JS to JSON
    json_str = re.sub(r'(\b\w+\b)\s*:', r'"\1":', drivers_raw_js)
    json_str = re.sub(r',\s*\}', '}', json_str)
    json_str = re.sub(r',\s*\]', ']', json_str)
    
    try:
        drivers = json.loads(json_str)
    except Exception as e:
        drivers = []
        obj_matches = re.findall(r'\{(.*?)\}', drivers_raw_js)
        for obj_str in obj_matches:
            pairs = re.findall(r'(\w+)\s*:\s*(?:"([^"]*)"|\'([^\']*)\'|([-\d\.]+))', obj_str)
            driver_obj = {}
            for k, v1, v2, v3 in pairs:
                val = v1 or v2 or v3
                try:
                    if '.' in val:
                        val = float(val)
                    else:
                        val = int(val)
                except ValueError:
                    pass
                driver_obj[k] = val
            if driver_obj:
                drivers.append(driver_obj)
                
    if not drivers:
        print("Error: Parsed 0 drivers from SimRacerHub HTML.")
        sys.exit(1)
        
    # Extract track name
    track_match = re.search(r'<span class=\'track-name\'[^>]*>(.*?)</span>', html)
    track_name = track_match.group(1).strip() if track_match else "Unknown Track"
    
    # Extract race date
    date_match = re.search(r'<span class=\'race-details\'[^>]*>(.*?)</span>', html)
    if date_match:
        race_date = date_match.group(1).split('&#183;')[0].strip()
    else:
        meta_match = re.search(r'<div class=\'track-meta\'[^>]*>(.*?)<span>', html)
        race_date = meta_match.group(1).strip() if meta_match else datetime.now().strftime("%B %d, %Y")
        
    return drivers, track_name, race_date

def normalize_name(name):
    if not name:
        return ""
    name = name.strip().lower()
    if ',' in name:
        parts = name.split(',')
        if len(parts) == 2:
            name = f"{parts[1].strip()} {parts[0].strip()}"
    name = re.sub(r'\s+[a-z]\s+', ' ', name)
    name = re.sub(r'\s+', ' ', name).strip()
    
    name_map = {
        "josh": "joshua",
        "jonathon": "johnathon",
        "jon": "john",
        "dave": "david",
        "mike": "michael",
        "diante": "dionte",
        "roder": "rader"
    }
    
    words = name.split()
    mapped_words = [name_map.get(w, w) for w in words]
    return " ".join(mapped_words)

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 3958.8  # Earth radius in miles
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def parse_iracing_json(path):
    if not path or not os.path.exists(path):
        return {}
    
    print(f"Parsing iRacing results JSON: {path}")
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading iRacing JSON: {e}")
        return {}

    fast_repairs = {}
    
    def search_results(obj):
        if isinstance(obj, dict):
            if "display_name" in obj and "fast_repairs_used" in obj:
                name = normalize_name(obj["display_name"])
                fast_repairs[name] = int(obj["fast_repairs_used"])
            elif "name" in obj and "fast_repairs_used" in obj:
                name = normalize_name(obj["name"])
                fast_repairs[name] = int(obj["fast_repairs_used"])
            for v in obj.values():
                search_results(v)
        elif isinstance(obj, list):
            for item in obj:
                search_results(item)
                
    search_results(data)
    print(f"Found fast repair status for {len(fast_repairs)} drivers in JSON.")
    return fast_repairs

def calculate_driver_points(drivers, config):
    scoring = config["scoring"]
    finish_points = scoring["finish_points"]
    default_pts = scoring["default_finish_points"]
    pole_bonus = scoring["pole_bonus"]
    most_laps_led_bonus = scoring["most_laps_led_bonus"]
    clean_race_bonus = scoring["clean_race_bonus"]
    dnf_penalty = scoring["dnf_penalty"]
    
    max_led = -1
    most_led_driver = None
    for d in drivers:
        led = int(d.get("led", 0) or 0)
        if led > max_led:
            max_led = led
            most_led_driver = d.get("name")
            
    driver_scores = {}
    for d in drivers:
        raw_name = d.get("name", "")
        norm_name = normalize_name(raw_name)
        
        fp = int(d.get("fp", 99))
        qp = int(d.get("qp", 99))
        inc = int(d.get("inc", 0) or 0)
        status = str(d.get("st", "Running")).lower()
        
        base = finish_points.get(str(fp), default_pts)
        pole = pole_bonus if qp == 1 else 0
        laps_led_most = most_laps_led_bonus if d.get("name") == most_led_driver and max_led > 0 else 0
        clean = clean_race_bonus if inc == 0 else 0
        dnf = dnf_penalty if "running" not in status else 0
        
        total = base + pole + laps_led_most + clean + dnf
        
        driver_scores[norm_name] = {
            "driver_name": raw_name,
            "finish": fp,
            "incidents": inc,
            "total_points": total
        }
        
    return driver_scores

def find_track_key(track_name, tracks_data):
    normalized_srh = track_name.lower().replace(" ", "").replace("-", "")
    for key, info in tracks_data.items():
        normalized_key = key.lower().replace("_", "")
        normalized_info_name = info["name"].lower().replace(" ", "").replace("-", "")
        if normalized_key in normalized_srh or normalized_srh in normalized_key or normalized_info_name in normalized_srh or normalized_srh in normalized_info_name:
            return key
    return None

def get_prize_money(position):
    if position == 1: return 50000
    elif position == 2: return 40000
    elif position == 3: return 30000
    elif position == 4: return 25000
    elif position == 5: return 20000
    elif position >= 6 and position <= 10: return 15000
    elif position >= 11 and position <= 15: return 10000
    elif position >= 16 and position <= 20: return 5000
    else: return 2500

def main():
    parser = argparse.ArgumentParser(description="Update teams_data.js from SimRacerHub results and optional iRacing JSON.")
    parser.add_argument("--schedule_id", type=str, help="SimRacerHub schedule ID to fetch.")
    parser.add_argument("--iracing_json", type=str, help="Path to raw iRacing results JSON to check fast repairs.")
    parser.add_argument("--damage", type=str, help="JSON string of manual additional damage, e.g. '{\"geezer-authentics-racing\": {\"truck-2\": 15}}'")
    parser.add_argument("--repair", type=str, help="JSON string of manual repairs to execute, e.g. '{\"geezer-authentics-racing\": [\"truck-2\"]}'")
    parser.add_argument("--test", action="store_true", help="Run with local simhub.html test file.")
    args = parser.parse_args()
    
    config = load_config()
    teams_db, original_content = load_teams_database()
    
    # Process Manual Repairs first if passed
    if args.repair:
        try:
            repairs_to_do = json.loads(args.repair)
            for team_id, truck_ids in repairs_to_do.items():
                team = next((t for t in teams_db["teams"] if t["id"] == team_id), None)
                if not team:
                    print(f"Error: Repair team '{team_id}' not found.")
                    continue
                for t_id in truck_ids:
                    truck = next((tr for tr in team["trucks"] if tr["id"] == t_id), None)
                    if not truck:
                        print(f"Error: Truck '{t_id}' not found on team '{team_id}'.")
                        continue
                    
                    # Calculate cost to restore to 100%
                    pct_needed = 100 - truck["condition"]
                    if pct_needed <= 0:
                        print(f"Truck '{truck['name']}' is already at 100% condition.")
                        continue
                    
                    repair_cost = pct_needed * 500 # $500 per 1%
                    if team["balance"] < repair_cost:
                        print(f"Warning: Team '{team_id}' has insufficient balance ({team['balance']}) to repair '{truck['name']}' (costs ${repair_cost}).")
                        continue
                    
                    # Execute repair
                    team["balance"] -= repair_cost
                    truck["condition"] = 100
                    team["ledger"].append({
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "description": f"Repaired Fleet Truck: {truck['name']} (+{pct_needed}%)",
                        "category": "expense",
                        "amount": -repair_cost
                    })
                    print(f"Repaired '{truck['name']}' for ${repair_cost}. New balance: ${team['balance']}")
        except Exception as e:
            print(f"Error processing manual repairs: {e}")
            sys.exit(1)

    # Process manual damage overrides if passed
    manual_damage = {}
    if args.damage:
        try:
            manual_damage = json.loads(args.damage)
        except Exception as e:
            print(f"Error parsing manual damage JSON: {e}")
            sys.exit(1)

    # If no schedule_id is provided, we might just be doing manual repairs/damage.
    # We save and exit in that case.
    if not args.schedule_id and not args.test:
        if args.repair or args.damage:
            save_teams_database(teams_db, original_content)
            print("Successfully applied manual actions.")
            sys.exit(0)
        else:
            parser.print_help()
            sys.exit(1)

    # Fetch and parse SimRacerHub results
    if args.test:
        test_html_path = os.path.join(BASE_DIR, "simhub.html")
        if not os.path.exists(test_html_path):
            test_html_path = os.path.join(os.path.dirname(BASE_DIR), "simhub.html")
        print(f"Reading local test file: {test_html_path}")
        with open(test_html_path, "r", encoding="utf-8") as f:
            html = f.read()
    else:
        url = f"https://simracerhub.com/season_race.php?schedule_id={args.schedule_id}"
        html = fetch_html(url)
        
    drivers_list, track_name, race_date = parse_simhub_results(html)
    driver_scores = calculate_driver_points(drivers_list, config)
    
    # Parse iRacing results JSON for fast repairs status
    fast_repairs = parse_iracing_json(args.iracing_json) if args.iracing_json else {}
    
    # Match track coordinates
    track_key = find_track_key(track_name, teams_db["tracks"])
    if not track_key:
        print(f"Error: Could not match track '{track_name}' in teams_data.js tracks list.")
        sys.exit(1)
    
    track_info = teams_db["tracks"][track_key]
    track_lat = track_info["lat"]
    track_lon = track_info["lon"]
    track_dist_concord = track_info["distance"]
    print(f"Matched Track: {track_info['name']} (Lat: {track_lat}, Lon: {track_lon})")
    
    # Track weekly scores to calculate the weekly team winner
    weekly_team_points = {}
    
    # Process each team
    for team in teams_db["teams"]:
        team_id = team["id"]
        print(f"\nProcessing Team: {team['name']}")
        
        primaries = team["drivers"]["primary"]
        backups = team["drivers"]["backup"]
        
        active_lineup = [] # list of (driver_name, is_backup, replaced_primary_name)
        backup_index = 0
        
        # Determine Active Lineup using Option 1 (DNS Auto-Sub)
        for primary in primaries:
            norm_pri = normalize_name(primary)
            if norm_pri in driver_scores:
                active_lineup.append((primary, False, None))
            else:
                # Primary is DNS. Try to sub in a backup
                subbed = False
                while backup_index < len(backups):
                    backup_driver = backups[backup_index]
                    norm_back = normalize_name(backup_driver)
                    backup_index += 1
                    
                    if norm_back in driver_scores:
                        active_lineup.append((backup_driver, True, primary))
                        subbed = True
                        break
                
                if not subbed:
                    # No backup available
                    active_lineup.append((primary, False, None)) # remains primary, will score DNS
        
        # Process team scoring and economy for the 4 active slots
        team_points_this_week = 0
        team_expenses = 0
        team_earnings = 0
        
        # Deduct team-wide hauler logistics cost
        # Flat $5/mi round trip from Concord, NC
        hauler_cost = int(track_dist_concord * 2 * 5)
        team_expenses += hauler_cost
        team["ledger"].append({
            "date": race_date,
            "description": f"Hauler Logistics: Concord, NC to {track_info['name']} ({track_dist_concord} mi)",
            "category": "expense",
            "amount": -hauler_cost
        })
        
        print(f"  Team Hauler Travel Cost: ${hauler_cost}")
        
        # Evaluate each active slot (mapping to trucks[0..3])
        for idx, (driver_name, is_backup, replaced_pri) in enumerate(active_lineup):
            norm_driver = normalize_name(driver_name)
            truck = team["trucks"][idx]
            
            # Check if this driver actually participated
            if norm_driver in driver_scores:
                score_data = driver_scores[norm_driver]
                driver_pts = score_data["total_points"]
                driver_inc = score_data["incidents"]
                driver_finish = score_data["finish"]
                
                team_points_this_week += driver_pts
                
                # Travel lodging cost calculations (driver-specific)
                drv_loc = teams_db["driverLocations"].get(driver_name.upper())
                if drv_loc:
                    drv_dist = haversine_distance(drv_loc["lat"], drv_loc["lon"], track_lat, track_lon)
                    if drv_dist > 250:
                        travel_fee = 250 # Flight cost
                        desc = f"Flight & Lodging: {driver_name} from {drv_loc['city']} ({int(drv_dist)} mi)"
                    else:
                        travel_fee = 100 # Driving cost
                        desc = f"Drive & Lodging: {driver_name} from {drv_loc['city']} ({int(drv_dist)} mi)"
                else:
                    # Fallback to driving if no coordinate found
                    travel_fee = 100
                    desc = f"Drive & Lodging: {driver_name} (Location N/A)"
                
                team_expenses += travel_fee
                team["ledger"].append({
                    "date": race_date,
                    "description": desc,
                    "category": "expense",
                    "amount": -travel_fee
                })
                
                # Sponsor start bonus
                sponsor_bonus = 15000
                team_earnings += sponsor_bonus
                team["ledger"].append({
                    "date": race_date,
                    "description": f"Sponsor Start Bonus: {driver_name}",
                    "category": "income",
                    "amount": sponsor_bonus
                })
                
                # Prize money
                prize = get_prize_money(driver_finish)
                team_earnings += prize
                team["ledger"].append({
                    "date": race_date,
                    "description": f"Prize Money: {driver_name} (P{driver_finish})",
                    "category": "income",
                    "amount": prize
                })
                
                # Auto-substitution note
                if is_backup and replaced_pri:
                    team["ledger"].append({
                        "date": race_date,
                        "description": f"Substituted {driver_name} for {replaced_pri} (DNS)",
                        "category": "income", # categorized as general log info with 0 amount
                        "amount": 0
                    })
                    print(f"  Slot {idx+1}: {driver_name} substituted in for {replaced_pri} (DNS)")
                
                # Wear and damage calculations
                import random
                natural_wear = random.randint(2, 5)
                incident_damage = driver_inc * 4
                
                # Check for manual damage overrides
                extra_dmg = manual_damage.get(team_id, {}).get(truck["id"], 0)
                
                total_wear = natural_wear + incident_damage + extra_dmg
                
                # Check for fast repair flag in iRacing JSON
                used_fast_repair = fast_repairs.get(norm_driver, 0) > 0
                
                if used_fast_repair:
                    # Flat 45% of truck price ($185k)
                    fast_repair_fee = 83250
                    team_expenses += fast_repair_fee
                    # Reset truck condition to 100% immediately
                    truck["condition"] = 100
                    
                    team["ledger"].append({
                        "date": race_date,
                        "description": f"Fast Repair: {truck['name']} ({driver_name})",
                        "category": "expense",
                        "amount": -fast_repair_fee
                    })
                    print(f"  Slot {idx+1}: {driver_name} used Fast Repair on {truck['name']}! Cost: $83,250")
                else:
                    # Reduce truck condition
                    truck["condition"] = max(0, truck["condition"] - total_wear)
                    print(f"  Slot {idx+1}: {driver_name} drove {truck['name']}. Incidents: {driver_inc}. Wear/Damage: -{total_wear}% (Condition: {truck['condition']}%)")
                    
            else:
                # Driver DNS and no backup was subbed
                team["ledger"].append({
                    "date": race_date,
                    "description": f"{driver_name} DNS - No active backup available",
                    "category": "expense",
                    "amount": 0
                })
                print(f"  Slot {idx+1}: {driver_name} DNS - No active backup available")
                
        # Calculate updated balance
        team["balance"] += (team_earnings - team_expenses)
        team["points"] += team_points_this_week
        
        weekly_team_points[team_id] = team_points_this_week
        print(f"  Weekly Summary: Points = {team_points_this_week}, Earnings = +${team_earnings}, Expenses = -${team_expenses}, New Balance = ${team['balance']}")
        
    # Determine weekly winner and credit points/wins
    if weekly_team_points:
        highest_score = max(weekly_team_points.values())
        weekly_winners = [t_id for t_id, pts in weekly_team_points.items() if pts == highest_score and pts > 0]
        
        # Credit wins
        for team in teams_db["teams"]:
            if team["id"] in weekly_winners:
                team["wins"] += 1
                print(f"Weekly Winner: {team['name']} with {highest_score} points! Credit +1 Win.")
                
    # Save the updated database
    save_teams_database(teams_db, original_content)

if __name__ == "__main__":
    main()
