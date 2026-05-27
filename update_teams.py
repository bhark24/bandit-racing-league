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

def calculate_flight_cost(distance, date_str, origin_city=""):
    month = 5 # Default to May
    try:
        # Check standard date formats
        for fmt in ("%b %d, %Y", "%B %d, %Y", "%Y-%m-%d"):
            try:
                dt = datetime.strptime(date_str, fmt)
                month = dt.month
                break
            except ValueError:
                pass
    except Exception:
        pass
        
    # Real-world base economy flight costs from regional/major airports to Orlando/Daytona
    airport_base_prices = {
        "ashtabula, oh": 220,  # CLE major: ~$200 roundtrip
        "cleveland, oh": 220,  # CLE major: ~$200
        "west plains, mo": 420,  # SGF regional: ~$400 (no direct flights)
        "roanoke, va": 380,  # ROA regional: ~$350 (no direct flights)
        "dayton, oh": 340,  # DAY moderate: ~$330
        "springboro, oh": 340, # DAY
        "miamisburg, oh": 340, # DAY
        "xenia, oh": 340,  # DAY
    }
    
    city_key = origin_city.strip().lower() if origin_city else ""
    if city_key in airport_base_prices:
        base_cost = airport_base_prices[city_key]
    else:
        # Fallback to a distance-based formula that yields realistic costs
        base_cost = 250 + (distance * 0.20)
    
    # Seasonal multipliers
    if month in (6, 7, 8, 11, 12):
        seasonal_mult = 1.3 # Summer & winter holidays
    elif month in (1, 2):
        seasonal_mult = 0.8 # Winter off-season
    else:
        seasonal_mult = 1.0 # Spring / Fall
        
    cost = base_cost * seasonal_mult
    
    # Random market fluctuation (+/- 15%)
    import random
    fluctuation = random.uniform(0.85, 1.15)
    
    return int(cost * fluctuation)

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

    driver_data = {}
    
    def search_results(obj):
        if isinstance(obj, dict):
            name = None
            if "display_name" in obj:
                name = normalize_name(obj["display_name"])
            elif "name" in obj:
                name = normalize_name(obj["name"])
                
            if name and "fast_repairs_used" in obj:
                fast_repairs = int(obj["fast_repairs_used"])
                reason_out = str(obj.get("reason_out", ""))
                reason_out_id = int(obj.get("reason_out_id", 0)) if obj.get("reason_out_id") is not None else 0
                
                if name not in driver_data or fast_repairs > driver_data[name]["fast_repairs_used"]:
                    driver_data[name] = {
                        "fast_repairs_used": fast_repairs,
                        "reason_out": reason_out,
                        "reason_out_id": reason_out_id
                    }
            for v in obj.values():
                search_results(v)
        elif isinstance(obj, list):
            for item in obj:
                search_results(item)
                
    search_results(data)
    print(f"Found iRacing status for {len(driver_data)} drivers in JSON.")
    return driver_data


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
            "total_points": total,
            "status": status
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
    if position == 1: return 75000
    elif position == 2: return 55000
    elif position == 3: return 45000
    elif position == 4: return 35000
    elif position == 5: return 30000
    elif position >= 6 and position <= 10: return 25000
    elif position >= 11 and position <= 15: return 20000
    elif position >= 16 and position <= 20: return 15000
    else: return 12000

def main():
    parser = argparse.ArgumentParser(description="Update teams_data.js from SimRacerHub results and optional iRacing JSON.")
    parser.add_argument("--schedule_id", type=str, help="SimRacerHub schedule ID to fetch.")
    parser.add_argument("--iracing_json", type=str, help="Path to raw iRacing results JSON to check fast repairs.")
    parser.add_argument("--damage", type=str, help="JSON string of manual additional damage, e.g. '{\"roundy-motorsports\": {\"truck-2\": 15}}'")
    parser.add_argument("--repair", type=str, help="JSON string of manual repairs to execute, e.g. '{\"roundy-motorsports\": [\"truck-2\"]}'")
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
                if team.get("loan", 0) > 0:
                    print(f"Error: Team '{team_id}' has an active emergency loan (${team['loan']}) and cannot perform repairs (Action Locked).")
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
        participating_finishes = []
        
        # Deduct team-wide hauler logistics cost
        # Calculate from team's specific homeBase to track coordinates
        home_base_coords = {
            "ashtabula, oh": (41.8651, -80.7898),
            "charlotte, nc": (35.2271, -80.8431),
            "concord, nc": (35.4088, -80.5795),
            "madison, wi": (43.0731, -89.4012),
            "cleveland, oh": (41.4993, -81.6944),
            "dayton, oh": (39.7589, -84.1916)
        }
        home_base_norm = team["homeBase"].strip().lower()
        coords = home_base_coords.get(home_base_norm, (35.4088, -80.5795)) # default to Concord coordinates
        
        hauler_dist = haversine_distance(coords[0], coords[1], track_lat, track_lon)
        hauler_cost = int(hauler_dist * 2 * 5) # $5/mi round trip
        team_expenses += hauler_cost
        team["ledger"].append({
            "date": race_date,
            "description": f"Hauler Logistics: {team['homeBase']} to {track_info['city']} ({int(hauler_dist)} mi)",
            "category": "expense",
            "amount": -hauler_cost
        })
        
        print(f"  Team Hauler Travel Cost: ${hauler_cost} ({int(hauler_dist)} mi)")
        
        # Quarterly Hauler Maintenance (every 4 races)
        race_count = sum(1 for item in team["ledger"] if item.get("category") == "info" or "race results" in item.get("description", "").lower())
        current_race_num = race_count + 1
        if current_race_num % 4 == 0:
            hauler_maint = 2000
            team_expenses += hauler_maint
            team["ledger"].append({
                "date": race_date,
                "description": f"Quarterly Hauler Maintenance (Race {current_race_num})",
                "category": "expense",
                "amount": -hauler_maint
            })
            print(f"  Quarterly Hauler Maintenance Charged: ${hauler_maint} (Race {current_race_num})")
        
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
                participating_finishes.append(driver_finish)
                
                # Standard maintenance race prep fee
                prep_fee = 2000
                team_expenses += prep_fee
                team["ledger"].append({
                    "date": race_date,
                    "description": f"Standard Race Prep: {truck['name']} ({driver_name})",
                    "category": "expense",
                    "amount": -prep_fee
                })
                
                # Travel lodging cost calculations (driver-specific)
                drv_loc = teams_db["driverLocations"].get(driver_name.upper())
                if drv_loc:
                    drv_dist = haversine_distance(drv_loc["lat"], drv_loc["lon"], track_lat, track_lon)
                    if drv_dist <= 50:
                        travel_fee = 20 # Local commute / fuel only, no lodging
                        desc = f"Local Travel: {driver_name} from {drv_loc['city']} ({int(drv_dist)} mi)"
                    elif drv_dist > 250:
                        travel_fee = calculate_flight_cost(drv_dist, race_date, drv_loc.get("city", ""))
                        desc = f"Flight & Lodging: {driver_name} from {drv_loc['city']} ({int(drv_dist)} mi)"
                    else:
                        travel_fee = 100 # Driving & Lodging
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
                driver_ir_data = fast_repairs.get(norm_driver, {})
                used_fast_repair = driver_ir_data.get("fast_repairs_used", 0) > 0
                
                # Check for DNF due to excessive damage
                driver_finish_status = score_data.get("status", "running").lower()
                srh_damage_dnf = any(term in driver_finish_status for term in ["accident", "crash", "damage", "suspension", "contact"])
                
                iracing_reason_out = driver_ir_data.get("reason_out", "").lower()
                iracing_damage_dnf = any(term in iracing_reason_out for term in ["accident", "crash", "damage", "suspension", "contact"])
                
                is_damage_dnf = srh_damage_dnf or iracing_damage_dnf
                
                # Check for DNF due to blown motor (mechanical / engine failure)
                srh_engine_dnf = any(term in driver_finish_status for term in ["engine", "mechanical", "blown motor"])
                iracing_engine_dnf = any(term in iracing_reason_out for term in ["engine", "mechanical"])
                is_engine_dnf = srh_engine_dnf or iracing_engine_dnf
                
                if is_engine_dnf:
                    # Engine replacement: costs $45,000 and restores truck to 100%
                    engine_cost = 45000
                    team_expenses += engine_cost
                    truck["condition"] = 100
                    
                    team["ledger"].append({
                        "date": race_date,
                        "description": f"Engine Replacement: {truck['name']} ({driver_name}) (Blown Motor)",
                        "category": "expense",
                        "amount": -engine_cost
                    })
                    print(f"  Slot {idx+1}: {driver_name} DNF'd due to a blown engine! Replaced motor on {truck['name']} for $45,000.")
                elif used_fast_repair:
                    if is_damage_dnf:
                        # Totaled! Replaced by a new truck costing $185k
                        replacement_cost = 185000
                        team_expenses += replacement_cost
                        truck["condition"] = 100
                        
                        team["ledger"].append({
                            "date": race_date,
                            "description": f"Replacement Fleet Truck: {truck['name']} ({driver_name}) (Totaled after DNF)",
                            "category": "expense",
                            "amount": -replacement_cost
                        })
                        print(f"  Slot {idx+1}: {driver_name} used Fast Repair but DNF'd due to damage! Truck {truck['name']} totaled. Replaced for $185,000.")
                    else:
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
                
        # Ensure sponsors array exists in database
        if "sponsors" not in team:
            if team["id"] == "roundy-motorsports":
                team["sponsors"] = ["Roundy Motorsports", "Ford Performance", "Craftsman Tools"]
            elif team["id"] == "wrists-up-racing":
                team["sponsors"] = ["Wrist's Up Racing", "Chevrolet Accessories", "Craftsman Tools"]
            else:
                team["sponsors"] = ["937 Racing", "Toyota Racing Development", "Craftsman Tools"]

        # Sponsor Trend Evaluation based on Average Finish Position:
        # Upward direction: Average finish <= 12.0
        # Downward direction: Average finish >= 20.0
        import random
        available_new_sponsors = ["SimGear Pro", "Apex Fuel", "Checkered Flag Media", "QuickPit Lubricants", "DraftMasters", "Veloce Simulators", "FastTrack Designs", "RPM Graphics", "Octane Apparel", "Precision Shifters"]
        
        if participating_finishes:
            avg_finish = sum(participating_finishes) / len(participating_finishes)
            print(f"  Team Average Finish: {avg_finish:.2f} ({len(participating_finishes)} participating drivers)")
            
            if avg_finish <= 12.0:
                if random.random() < 0.50:
                    options = [s for s in available_new_sponsors if s not in team["sponsors"]]
                    if options:
                        new_sponsor = random.choice(options)
                        sponsor_payout = random.randint(10000, 35000)
                        team["sponsors"].append(new_sponsor)
                        team_earnings += sponsor_payout
                        team["ledger"].append({
                            "date": race_date,
                            "description": f"Virtual Sponsorship Earned: {new_sponsor} (Upward Performance: {avg_finish:.1f} Avg Finish)",
                            "category": "income",
                            "amount": sponsor_payout
                        })
                        print(f"  [Sponsor Gain] {team['name']} earned sponsorship from {new_sponsor}! (+${sponsor_payout})")
            elif avg_finish >= 20.0:
                if random.random() < 0.40 and len(team["sponsors"]) > 1:
                    lost_sponsor = random.choice(team["sponsors"])
                    sponsor_loss = random.randint(5000, 20000)
                    team["sponsors"].remove(lost_sponsor)
                    team_expenses += sponsor_loss
                    team["ledger"].append({
                        "date": race_date,
                        "description": f"Lost Sponsor Capital: {lost_sponsor} (Downward Performance: {avg_finish:.1f} Avg Finish)",
                        "category": "expense",
                        "amount": -sponsor_loss
                    })
                    print(f"  [Sponsor Loss] {team['name']} lost sponsorship from {lost_sponsor}! (-${sponsor_loss})")
        else:
            print("  No participating drivers - sponsor trend skipped.")

        # Calculate updated balance
        loan = team.get("loan", 0)
        repayment = 0
        if loan > 0 and team_earnings > 0:
            repayment = min(loan, int(0.5 * team_earnings))
            loan -= repayment
            team["ledger"].append({
                "date": race_date,
                "description": f"Emergency Loan Repayment (50% of earnings): -${repayment}",
                "category": "expense",
                "amount": -repayment
            })

        if loan > 0:
            interest = int(loan * 0.02)
            loan += interest
            team["ledger"].append({
                "date": race_date,
                "description": f"Weekly Loan Interest Accrued (2%): +${interest} (New Loan: ${loan})",
                "category": "info",
                "amount": 0
            })

        team["balance"] += (team_earnings - team_expenses - repayment)

        if team["balance"] < 0:
            loan_issued = abs(team["balance"])
            loan += loan_issued
            team["balance"] = 0
            team["ledger"].append({
                "date": race_date,
                "description": f"Emergency Loan Issued: +${loan_issued} (To cover negative balance)",
                "category": "income",
                "amount": loan_issued
            })

        team["loan"] = loan
        team["points"] += team_points_this_week
        
        weekly_team_points[team_id] = team_points_this_week
        loan_str = f", Loan = ${team['loan']}" if team.get("loan", 0) > 0 else ""
        print(f"  Weekly Summary: Points = {team_points_this_week}, Earnings = +${team_earnings}, Expenses = -${team_expenses}, New Balance = ${team['balance']}{loan_str}")
        
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
