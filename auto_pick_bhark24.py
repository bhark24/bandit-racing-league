import os
import re
import json
import urllib.request
import urllib.parse
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Track-optimized auto-picks for Bhark24 across the remaining Season 16 Chase schedule
BHARK24_AUTO_PICKS = {
    "Kansas": {
        "picks": ["BENJAMIN LACY", "NICK NICKERSON", "SCOTT SANDERSON", "JOSH ADAMS"],
        "tiebreaker": 18
    },
    "Mid-Ohio": {
        "picks": ["NICK NICKERSON", "SCOTT SANDERSON", "BENJAMIN LACY", "Jackson Knaak"],
        "tiebreaker": 8
    },
    "Road America": {
        "picks": ["NICK NICKERSON", "SCOTT SANDERSON", "BENJAMIN LACY", "Jackson Knaak"],
        "tiebreaker": 8
    },
    "Phoenix": {
        "picks": ["DYLAN MCDONALD", "NICK NICKERSON", "SCOTT SANDERSON", "BENJAMIN LACY"],
        "tiebreaker": 22
    },
    "Homestead Miami": {
        "picks": ["BENJAMIN LACY", "SCOTT SANDERSON", "NICK NICKERSON", "DYLAN MCDONALD"],
        "tiebreaker": 18
    },
    "default": {
        "picks": ["BENJAMIN LACY", "NICK NICKERSON", "SCOTT SANDERSON", "DYLAN MCDONALD"],
        "tiebreaker": 18
    }
}

SCHEDULE = [
    {"track": "Kansas", "date": "2026-10-28"},
    {"track": "Mid-Ohio", "date": "2026-11-04"},
    {"track": "Phoenix", "date": "2026-11-11"},
    {"track": "Homestead Miami", "date": "2026-11-18"}
]

def get_upcoming_track():
    now_str = datetime.now().strftime("%Y-%m-%d")
    for r in SCHEDULE:
        if r["date"] >= now_str:
            return r["track"]
    return "default"

def get_auto_pick_for_track(track_name):
    if not track_name:
        return BHARK24_AUTO_PICKS["default"]
    t_low = track_name.lower()
    if "kansas" in t_low:
        return BHARK24_AUTO_PICKS["Kansas"]
    elif "ohio" in t_low or "road" in t_low or "glen" in t_low:
        return BHARK24_AUTO_PICKS["Mid-Ohio"]
    elif "phoenix" in t_low:
        return BHARK24_AUTO_PICKS["Phoenix"]
    elif "homestead" in t_low:
        return BHARK24_AUTO_PICKS["Homestead Miami"]
    return BHARK24_AUTO_PICKS["default"]

def get_supabase_creds():
    cfg_path = os.path.join(BASE_DIR, "supabase_config.js")
    with open(cfg_path, "r", encoding="utf-8") as f:
        c = f.read()
    url = re.search(r'SUPABASE_URL\s*=\s*"(.*?)"', c).group(1)
    key = re.search(r'SUPABASE_KEY\s*=\s*"(.*?)"', c).group(1)
    return url, key

def submit_bhark24_auto_pick(track_override=None, submit_google_form=True):
    track = track_override or get_upcoming_track()
    plan = get_auto_pick_for_track(track)
    picks = plan["picks"]
    tiebreaker = plan["tiebreaker"]

    url, key = get_supabase_creds()
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    req = urllib.request.Request(f"{url}/rest/v1/league_data?id=eq.2", headers=headers)
    res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
    row_data = (res[0].get("data") if res and len(res) > 0 else {}) or {}
    active_picks = row_data.get("picks") or []

    new_entry = {
        "name": "Bhark24",
        "picks": picks,
        "tiebreaker": tiebreaker,
        "email": "",
        "submitted_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    }

    idx = next((i for i, p in enumerate(active_picks) if p.get("name", "").strip().lower() == "bhark24"), -1)
    if idx >= 0:
        active_picks[idx] = new_entry
    else:
        active_picks.append(new_entry)

    row_data["picks"] = active_picks
    patch_headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    payload = json.dumps({
        "data": row_data,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).encode("utf-8")

    patch_req = urllib.request.Request(f"{url}/rest/v1/league_data?id=eq.2", data=payload, headers=patch_headers, method="PATCH")
    urllib.request.urlopen(patch_req)
    print(f"[+] Locked in Bhark24 auto-picks in Supabase for {track}: {picks} (Tiebreaker: {tiebreaker})")

    if submit_google_form:
        try:
            form_url = "https://docs.google.com/forms/d/e/1FAIpQLScgUSQNAfVpdD0BHqH4afJdEMV9xNvorSkQ-ZTumX9RrxLYKw/formResponse"
            form_data = urllib.parse.urlencode({
                "entry.600556052": "Bhark24",
                "entry.660537648": picks[0],
                "entry.1220374346": picks[1],
                "entry.202307613": picks[2],
                "entry.1542867592": picks[3],
                "entry.900395544": str(tiebreaker)
            }).encode("utf-8")
            form_req = urllib.request.Request(form_url, data=form_data, headers={"User-Agent": "Mozilla/5.0"}, method="POST")
            urllib.request.urlopen(form_req)
            print("[+] Also submitted Bhark24 auto-picks to Google Form backup!")
        except Exception as e:
            print(f"[*] Note: Google Form backup response: {e}")

if __name__ == "__main__":
    submit_bhark24_auto_pick()
