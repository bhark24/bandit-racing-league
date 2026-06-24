import os
import json
import urllib.request
import re
from datetime import datetime

CONFIG_PATH = "C:/Users/Bill/.gemini/antigravity/scratch/bandit_racing_league/supabase_config.js"

def get_supabase_config():
    if not os.path.exists(CONFIG_PATH):
        print(f"Error: Config file not found at {CONFIG_PATH}")
        return None, None
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        url_match = re.search(r'SUPABASE_URL\s*=\s*"(.*?)"', content)
        key_match = re.search(r'SUPABASE_KEY\s*=\s*"(.*?)"', content)
        
        url = url_match.group(1) if url_match else None
        key = key_match.group(1) if key_match else None
        
        return url, key
    except Exception as e:
        print(f"Error parsing config: {e}")
        return None, None

def main():
    url, key = get_supabase_config()
    if not url or "your-project-id" in url or not key or "your-anon-public" in key:
        print("[!] Supabase configuration is not set in supabase_config.js. Cannot connect.")
        return
        
    print("[*] Connecting to Supabase...")
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {key}'
    }
    
    # 1. Fetch existing picks
    req_url = f"{url}/rest/v1/league_data?id=eq.2"
    req = urllib.request.Request(req_url, headers=headers)
    existing_picks = []
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            if res_data and len(res_data) > 0 and res_data[0].get("data") and "picks" in res_data[0]["data"]:
                existing_picks = res_data[0]["data"]["picks"]
                print(f"[+] Loaded {len(existing_picks)} existing picks from Supabase.")
    except Exception as e:
        print(f"[!] Warning fetching existing picks: {e}. Starting fresh.")
        
    # 2. Add Sean, Eddie, and Michael
    known_names = ["Sean Britt", "Eddie Hagigh", "Michael Rakes"]
    merged_picks_map = {p["name"].strip().lower(): p for p in existing_picks}
    
    added_count = 0
    for name in known_names:
        name_lower = name.strip().lower()
        if name_lower not in merged_picks_map:
            merged_picks_map[name_lower] = {
                "name": name,
                "picks": ["", "", "", ""],
                "tiebreaker": 0,
                "email": "",
                "submitted_at": datetime.now().isoformat()
            }
            print(f"[+] Adding {name} to competitor list.")
            added_count += 1
            
    if added_count == 0:
        print("[*] All three competitors are already in the list.")
        return
        
    # 3. Patch back to Supabase
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    payload = {
        "data": {
            "picks": list(merged_picks_map.values())
        },
        "updated_at": datetime.now().isoformat()
    }
    req_data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(req_url, data=req_data, headers=headers, method='PATCH')
    
    try:
        with urllib.request.urlopen(req) as response:
            print("[+] Successfully added competitors to your live website database!")
    except Exception as e:
        print(f"[!] Error updating Supabase: {e}")

if __name__ == "__main__":
    main()
