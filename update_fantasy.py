import os
import json
import urllib.request
import re
import csv
import sys
import argparse
from datetime import datetime

# Path Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "fantasy_config.json")
DATA_JS_PATH = os.path.join(BASE_DIR, "fantasy_data.js")

def load_config():
    if not os.path.exists(CONFIG_PATH):
        print(f"Error: Config file not found at {CONFIG_PATH}")
        sys.exit(1)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

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
    # Find the drivers script block: drivers=[{...},{...}]
    # Match everything between "drivers=[" and "];"
    match = re.search(r'drivers\s*=\s*(\[.*?\])\s*;', html, re.DOTALL)
    if not match:
        print("Error: Could not find driver results array in SimRacerHub HTML.")
        sys.exit(1)
        
    drivers_raw_js = match.group(1)
    
    # Standardize JS to JSON keys and values
    # Replace keys like: id: to "id":
    # Replace strings like: name:"..." to "name":"..."
    # Replace unquoted values if any, but regex can clean keys
    # Replace key names
    json_str = re.sub(r'(\b\w+\b)\s*:', r'"\1":', drivers_raw_js)
    # Remove any trailing commas inside objects/arrays which JSON doesn't support
    json_str = re.sub(r',\s*\}', '}', json_str)
    json_str = re.sub(r',\s*\]', ']', json_str)
    
    try:
        drivers = json.loads(json_str)
    except Exception as e:
        # Fallback to a simpler regex parser if JSON load fails
        print("Warning: JSON parser failed, falling back to regex parser...")
        drivers = []
        # Find individual object blocks
        obj_matches = re.findall(r'\{(.*?)\}', drivers_raw_js)
        for obj_str in obj_matches:
            pairs = re.findall(r'(\w+)\s*:\s*(?:"([^"]*)"|\'([^\']*)\'|([-\d\.]+))', obj_str)
            driver_obj = {}
            for k, v1, v2, v3 in pairs:
                val = v1 or v2 or v3
                # Try converting to int or float
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
        # e.g., "May 13, 2026 &#183; Oval"
        race_date = date_match.group(1).split('&#183;')[0].strip()
    else:
        # Fallback to search around track-meta
        meta_match = re.search(r'<div class=\'track-meta\'[^>]*>(.*?)<span>', html)
        race_date = meta_match.group(1).strip() if meta_match else datetime.now().strftime("%B %d, %Y")
        
    # Extract total caution laps if available
    # e.g., "13 cautions (0 laps)"
    caution_match = re.search(r'(\d+)\s*cautions\s*\(\s*(\d+)\s*laps\s*\)', html)
    caution_laps = int(caution_match.group(2)) if caution_match else 0
    
    print(f"Parsed Race Details: {track_name} on {race_date} ({caution_laps} caution laps)")
    return drivers, track_name, race_date, caution_laps

def normalize_name(name):
    if not name:
        return ""
    # Convert "Last, First" -> "First Last"
    name = name.strip().lower()
    if ',' in name:
        parts = name.split(',')
        if len(parts) == 2:
            name = f"{parts[1].strip()} {parts[0].strip()}"
            
    # Remove single character initials (middle initials)
    name = re.sub(r'\s+[a-z]\s+', ' ', name)
    name = re.sub(r'\s+', ' ', name).strip()
    
    # Nickname and spelling variations mapping
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

def calculate_driver_scores(drivers, config):
    scoring = config["scoring"]
    finish_points = scoring["finish_points"]
    default_pts = scoring["default_finish_points"]
    pole_bonus = scoring["pole_bonus"]
    most_laps_led_bonus = scoring["most_laps_led_bonus"]
    clean_race_bonus = scoring["clean_race_bonus"]
    dnf_penalty = scoring["dnf_penalty"]
    
    # Find driver with most laps led
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
        
        # Calculate Base points
        base = finish_points.get(str(fp), default_pts)
        
        # Add bonuses
        pole = pole_bonus if qp == 1 else 0
        laps_led_most = most_laps_led_bonus if d.get("name") == most_led_driver and max_led > 0 else 0
        clean = clean_race_bonus if inc == 0 else 0
        
        # DNF penalty
        dnf = dnf_penalty if "running" not in status else 0
        
        total = base + pole + laps_led_most + clean + dnf
        
        driver_scores[norm_name] = {
            "driver_name": raw_name,
            "finish": fp,
            "start": qp,
            "incidents": inc,
            "status": d.get("st", "Running"),
            "base_points": base,
            "pole_bonus": pole,
            "most_laps_led_bonus": laps_led_most,
            "clean_race_bonus": clean,
            "dnf_penalty": dnf,
            "total_points": total
        }
        
    return driver_scores

def load_picks(config):
    csv_url = config.get("google_sheet_csv_url", "")
    picks = []
    
    # If no URL is set, read/create test_picks.csv
    if not csv_url:
        test_csv = os.path.join(BASE_DIR, "test_picks.csv")
        print(f"Google Sheet CSV URL is empty. Checking local test file: {test_csv}")
        if not os.path.exists(test_csv):
            # Create a sample picks file
            with open(test_csv, "w", encoding="utf-8", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(["Timestamp", "Fan Name", "Tier A Driver", "Tier B Driver 1", "Tier B Driver 2", "Tier C Driver", "Caution Laps"])
                writer.writerow(["2026-05-20 12:00:00", "John Smith", "Benjamin Lacy", "Jackson Knaak", "Josh Adams", "Curtis Yancey", "12"])
                writer.writerow(["2026-05-20 12:05:00", "RaceFan99", "Nick Nickerson", "Bill Harkins", "Nicole Kriesel", "Nolan Gross", "5"])
                writer.writerow(["2026-05-20 12:10:00", "LateModelLover", "Jonathon Platt", "Sean Britt", "Matt Crockett", "Curtis Yancey", "0"])
            print(f"Created sample mock picks in {test_csv}")
            
        with open(test_csv, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            headers = next(reader)
            for row in reader:
                if len(row) >= 6:
                    picks.append(row)
    else:
        print("Downloading picks CSV from Google Sheet...")
        req = urllib.request.Request(csv_url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req) as response:
                csv_data = response.read().decode('utf-8', errors='ignore')
                reader = csv.reader(csv_data.splitlines())
                headers = next(reader)
                for row in reader:
                    picks.append(row)
        except Exception as e:
            print(f"Error fetching CSV from Google Sheets: {e}")
            sys.exit(1)
            
    print(f"Loaded {len(picks)} fan picks.")
    return picks

def score_picks(picks, driver_scores, caution_laps):
    # Match headers to figure out columns
    # We expect columns like: Name, Tier A, Tier B1, Tier B2, Tier C, Tiebreaker (Caution)
    # Since headers might change, we'll map by index based on our standard layout
    fan_results = []
    
    for row in picks:
        if not row or len(row) < 6:
            continue
        
        # Row layout: [Timestamp, Name, Pick A, Pick B1, Pick B2, Pick C, Tiebreaker]
        fan_name = row[1].strip()
        pick_a = normalize_name(row[2])
        pick_b1 = normalize_name(row[3])
        pick_b2 = normalize_name(row[4])
        pick_c = normalize_name(row[5])
        
        tiebreaker = 0
        if len(row) > 6:
            try:
                tiebreaker = int(row[6])
            except ValueError:
                pass
                
        # Calculate points for each pick
        score_a = driver_scores.get(pick_a, {}).get("total_points", 0)
        score_b1 = driver_scores.get(pick_b1, {}).get("total_points", 0)
        score_b2 = driver_scores.get(pick_b2, {}).get("total_points", 0)
        score_c = driver_scores.get(pick_c, {}).get("total_points", 0)
        
        # Alert if a driver wasn't found in results (did not start)
        if pick_a and pick_a not in driver_scores:
            print(f"Warning: Roster pick '{row[2]}' for fan '{fan_name}' was not found in race results.")
        if pick_b1 and pick_b1 not in driver_scores:
            print(f"Warning: Roster pick '{row[3]}' for fan '{fan_name}' was not found in race results.")
        if pick_b2 and pick_b2 not in driver_scores:
            print(f"Warning: Roster pick '{row[4]}' for fan '{fan_name}' was not found in race results.")
        if pick_c and pick_c not in driver_scores:
            print(f"Warning: Roster pick '{row[5]}' for fan '{fan_name}' was not found in race results.")
            
        total_score = score_a + score_b1 + score_b2 + score_c
        
        fan_results.append({
            "name": fan_name,
            "picks": [row[2], row[3], row[4], row[5]],
            "scores": [score_a, score_b1, score_b2, score_c],
            "total": total_score,
            "tiebreaker_guess": tiebreaker,
            "tiebreaker_diff": abs(tiebreaker - caution_laps)
        })
        
    return fan_results

def update_data_js(fan_results, track_name, race_date, caution_laps, config):
    # Load existing standings from data_js
    existing_standings = {}
    races_history = []
    
    if os.path.exists(DATA_JS_PATH):
        try:
            with open(DATA_JS_PATH, "r", encoding="utf-8") as f:
                js_content = f.read()
                
            # Extract JSON from JS variable
            # e.g., const fantasyData = { ... };
            match = re.search(r'const\s+fantasyData\s*=\s*({.*?});', js_content, re.DOTALL)
            if match:
                data = json.loads(match.group(1))
                existing_standings = {player["name"]: player for player in data.get("leaderboard", [])}
                races_history = data.get("races", [])
        except Exception as e:
            print(f"Warning: Could not parse existing standings, starting fresh. Details: {e}")
            
    # Check if this race is already recorded to avoid duplicate updates
    race_key = f"{track_name} ({race_date})"
    if any(r["race"] == race_key for r in races_history):
        print(f"Warning: Race '{race_key}' is already recorded. Overwriting standings for this race.")
        # Filter out the existing race from history
        races_history = [r for r in races_history if r["race"] != race_key]
        # Recalculate standings scores from other races
        # (For simplicity in this automated script, we overwrite and reconstruct scores)
        
    # Find the weekly winner (highest score)
    best_score = -9999
    weekly_winners = []
    
    for res in fan_results:
        if res["total"] > best_score:
            best_score = res["total"]
            weekly_winners = [res["name"]]
        elif res["total"] == best_score:
            # Handle tie with tiebreaker (closest to caution laps)
            # Find current best's tiebreaker diff
            current_best_diff = next((x["tiebreaker_diff"] for x in fan_results if x["name"] in weekly_winners), 9999)
            if res["tiebreaker_diff"] < current_best_diff:
                weekly_winners = [res["name"]]
            elif res["tiebreaker_diff"] == current_best_diff:
                weekly_winners.append(res["name"])
                
    # Record race detail in history
    races_history.append({
        "race": race_key,
        "track": track_name,
        "date": race_date,
        "caution_laps": caution_laps,
        "results": [{
            "name": res["name"],
            "picks": res["picks"],
            "total": res["total"]
        } for res in fan_results]
    })
    
    # Recalculate leaderboard based on entire race history
    leaderboard_map = {}
    
    for r in races_history:
        # Find weekly winner(s) for this historical race
        race_best = -9999
        race_winners = []
        # First pass to find highest score
        for entry in r["results"]:
            if entry["total"] > race_best:
                race_best = entry["total"]
                
        # Find who achieved it
        for entry in r["results"]:
            if entry["total"] == race_best:
                # We won't re-run complex tiebreaker logic for past races unless saved, 
                # we'll just reward wins based on max score for historical rebuild
                race_winners.append(entry["name"])
                
        for entry in r["results"]:
            name = entry["name"]
            if name not in leaderboard_map:
                leaderboard_map[name] = {
                    "name": name,
                    "score": 0,
                    "wins": 0,
                    "history": []
                }
            leaderboard_map[name]["score"] += entry["total"]
            leaderboard_map[name]["history"].append({
                "race": r["race"],
                "total": entry["total"],
                "picks": entry["picks"]
            })
            if name in race_winners:
                leaderboard_map[name]["wins"] += 1
                
    # Sort leaderboard by score desc
    leaderboard = sorted(leaderboard_map.values(), key=lambda x: x["score"], reverse=True)
    
    # Assign ranks
    for rank, player in enumerate(leaderboard, 1):
        player["rank"] = rank
        
    output_data = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "latest_race": {
            "track": track_name,
            "date": race_date,
            "caution_laps": caution_laps,
            "winner": ", ".join(weekly_winners) + f" ({best_score} pts)"
        },
        "tiers": config.get("tiers", {}),
        "leaderboard": leaderboard,
        "races": races_history
    }
    
    js_output = f"// Automatically generated by update_fantasy.py. Do not edit directly.\nconst fantasyData = {json.dumps(output_data, indent=2)};\n"
    
    with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_output)
        
    print(f"Successfully updated fantasy_data.js with {len(leaderboard)} players!")
    print(f"Weekly Winner: {', '.join(weekly_winners)} with {best_score} points!")

def main():
    parser = argparse.ArgumentParser(description="Calculate fantasy league scores from SimRacerHub and Google Sheets.")
    parser.add_argument("--schedule_id", type=str, help="SimRacerHub schedule ID to fetch. E.g. 342696")
    parser.add_argument("--test", action="store_true", help="Run with mock SimRacerHub data instead of fetching live.")
    args = parser.parse_args()
    
    config = load_config()
    
    # Determine URL to fetch
    if args.schedule_id:
        url = f"https://simracerhub.com/season_race.php?schedule_id={args.schedule_id}"
    else:
        url = f"https://simracerhub.com/season_race.php?season_id={config.get('season_id', '28135')}"
        
    # Get HTML
    if args.test:
        test_html_path = os.path.join(BASE_DIR, "simhub.html")
        if not os.path.exists(test_html_path):
            test_html_path = os.path.join(os.path.dirname(BASE_DIR), "simhub.html")
        print(f"Test Mode: Reading local file {test_html_path}")
        if os.path.exists(test_html_path):
            with open(test_html_path, "r", encoding="utf-8") as f:
                html = f.read()
        else:
            # Fallback to fetching live
            print("Local file not found, fetching live instead.")
            html = fetch_html(url)
    else:
        html = fetch_html(url)
        
    # Parse results
    drivers_list, track_name, race_date, caution_laps = parse_simhub_results(html)
    
    # Calculate driver fantasy scores
    driver_scores = calculate_driver_scores(drivers_list, config)
    
    # Load fan picks from sheet/local file
    picks = load_picks(config)
    
    # Calculate scores for picks
    fan_results = score_picks(picks, driver_scores, caution_laps)
    
    # Update standings JS file
    update_data_js(fan_results, track_name, race_date, caution_laps, config)

if __name__ == "__main__":
    main()
