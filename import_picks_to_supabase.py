import os
import json
import urllib.request
import re
import csv
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "fantasy_config.json")

def load_config():
    if not os.path.exists(CONFIG_PATH):
        print(f"Error: Config file not found at {CONFIG_PATH}")
        return {}
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def get_supabase_config():
    config_path = os.path.join(BASE_DIR, "supabase_config.js")
    if not os.path.exists(config_path):
        return None, None
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            content = f.read()
        url_match = re.search(r'SUPABASE_URL\s*=\s*"(.*?)"', content)
        key_match = re.search(r'SUPABASE_KEY\s*=\s*"(.*?)"', content)
        
        url = url_match.group(1) if url_match else None
        key = key_match.group(1) if key_match else None
        
        if not url or "your-project-id" in url or not key or "your-anon-public" in key:
            return None, None
            
        return url, key
    except Exception as e:
        print(f"Warning parsing supabase_config.js: {e}")
        return None, None

def main():
    config = load_config()
    csv_url = config.get("google_sheet_csv_url", "")
    
    if not csv_url:
        print("Error: google_sheet_csv_url is empty in fantasy_config.json")
        return
        
    url, key = get_supabase_config()
    if not url or not key:
        print("Error: Supabase configuration is not set in supabase_config.js")
        return
        
    print(f"Fetching picks from Google Sheet: {csv_url}")
    req = urllib.request.Request(csv_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            csv_data = response.read().decode('utf-8', errors='ignore')
            reader = csv.reader(csv_data.splitlines())
            headers = next(reader)
            sheet_picks = list(reader)
    except Exception as e:
        print(f"Error fetching CSV from Google Sheets: {e}")
        return
        
    if not sheet_picks:
        print("No picks found in the Google Sheet CSV (0 entries).")
        return
        
    print(f"Found {len(sheet_picks)} entries in Google Sheet. Formatting for Supabase...")
    
    # Format entries
    formatted_picks = []
    for row in sheet_picks:
        if len(row) < 6:
            continue
        # Row layout: [Timestamp, Name, Pick A, Pick B1, Pick B2, Pick C, Tiebreaker]
        name = row[1].strip()
        picks = [row[2], row[3], row[4], row[5]]
        tiebreaker = 0
        if len(row) > 6:
            try:
                tiebreaker = int(row[6])
            except ValueError:
                pass
                
        formatted_picks.append({
            "name": name,
            "picks": picks,
            "tiebreaker": tiebreaker,
            "email": "",
            "submitted_at": row[0]
        })
        
    # Upload to Supabase
    print(f"Uploading {len(formatted_picks)} entries to Supabase...")
    try:
        # First, fetch existing picks from Supabase to avoid overwriting newer Supabase submissions
        headers = {
            'apikey': key,
            'Authorization': f'Bearer {key}'
        }
        req_url = f"{url}/rest/v1/league_data?id=eq.2"
        req = urllib.request.Request(req_url, headers=headers)
        existing_picks = []
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            if res_data and len(res_data) > 0 and res_data[0].get("data") and "picks" in res_data[0]["data"]:
                existing_picks = res_data[0]["data"]["picks"]
                
        # Merge picks (Sheet picks + existing Supabase picks, matching by name)
        merged_picks_map = {p["name"].strip().lower(): p for p in formatted_picks}
        for p in existing_picks:
            merged_picks_map[p["name"].strip().lower()] = p # Supabase updates overwrite sheet ones
            
        merged_picks = list(merged_picks_map.values())
        
        # Patch back to Supabase
        headers = {
            'apikey': key,
            'Authorization': f'Bearer {key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        payload = {
            "data": {
                "picks": merged_picks
            },
            "updated_at": datetime.now().isoformat()
        }
        req_data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(req_url, data=req_data, headers=headers, method='PATCH')
        with urllib.request.urlopen(req) as response:
            print(f"[+] Successfully imported and merged {len(merged_picks)} picks into Supabase!")
    except Exception as e:
        print(f"Error uploading to Supabase: {e}")

if __name__ == "__main__":
    main()
