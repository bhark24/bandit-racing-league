import os
import re
import json
import time
import argparse
import urllib.request
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_supabase_config():
    cfg_path = os.path.join(BASE_DIR, "supabase_config.js")
    with open(cfg_path, "r", encoding="utf-8") as f:
        text = f.read()
    url = re.search(r'SUPABASE_URL\s*=\s*"(.*?)"', text).group(1)
    key = re.search(r'SUPABASE_KEY\s*=\s*"(.*?)"', text).group(1)
    return url, key

def push_brl_notification(title, body, target_url="/index.html", category="website_update", driver=None, team=None):
    url, key = get_supabase_config()
    req = urllib.request.Request(
        f"{url}/rest/v1/league_data?id=eq.2",
        headers={"apikey": key, "Authorization": f"Bearer {key}"}
    )
    with urllib.request.urlopen(req) as resp:
        rows = json.loads(resp.read().decode("utf-8"))

    row_data = rows[0].get("data", {}) if rows else {}
    notifs = row_data.get("appNotifications", [])
    if not isinstance(notifs, list):
        notifs = []

    now_label = datetime.now().strftime("%b %d, %I:%M %p")
    new_notif = {
        "id": int(time.time() * 1000),
        "category": category,
        "title": title,
        "body": body,
        "url": target_url,
        "dateLabel": now_label
    }
    if driver:
        new_notif["driver"] = driver.strip().upper()
    if team:
        new_notif["team"] = team.strip()

    notifs.insert(0, new_notif)
    row_data["appNotifications"] = notifs[:25]

    payload = json.dumps({
        "data": row_data,
        "updated_at": datetime.now().isoformat()
    }).encode("utf-8")

    patch_req = urllib.request.Request(
        f"{url}/rest/v1/league_data?id=eq.2",
        data=payload,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        method="PATCH"
    )
    with urllib.request.urlopen(patch_req) as _:
        safe_title = title.encode("ascii", "ignore").decode("ascii").strip()
        extra = f" (Driver: {driver})" if driver else (f" (Team: {team})" if team else "")
        print(f"[+] Broadcasted BRL App Alert: [{category.upper()}]{extra} {safe_title} -> {target_url}")

def main():
    parser = argparse.ArgumentParser(description="Send a real-time push notification to BRL Mobile App users.")
    parser.add_argument("--title", type=str, help="Notification title")
    parser.add_argument("--body", type=str, help="Notification body")
    parser.add_argument("--url", type=str, default="/index.html", help="Target page URL when tapped")
    parser.add_argument("--live", action="store_true", help="Send a 'Race Going Live' alert")
    parser.add_argument("--driver", type=str, help="Target specific driver name (e.g. 'DONALD KIGHT')")
    parser.add_argument("--team", type=str, help="Target specific franchise team name (e.g. 'ChainedGraboid Racing Team')")
    args = parser.parse_args()

    if args.live:
        title = args.title or "🔴 LIVE NOW: Bandit Racing League on SimTrax!"
        body = args.body or "Tonight's Bandit Racing League race is going LIVE! Tap now to watch the SimTrax broadcast."
        target_url = args.url if args.url != "/index.html" else "/simtrax.html"
        push_brl_notification(title, body, target_url, category="race_live", driver=args.driver, team=args.team)
    elif args.driver:
        title = args.title or f"🏎️ Driver Update: {args.driver.upper()}"
        body = args.body or f"New roster or race update posted for {args.driver.upper()}!"
        target_url = args.url if args.url != "/index.html" else "/drivers.html"
        push_brl_notification(title, body, target_url, category="driver_alert", driver=args.driver, team=args.team)
    elif args.team:
        title = args.title or f"🏁 Franchise Update: {args.team}"
        body = args.body or f"New franchise update posted for {args.team}!"
        target_url = args.url if args.url != "/index.html" else "/teams.html"
        push_brl_notification(title, body, target_url, category="team_alert", driver=args.driver, team=args.team)
    else:
        title = args.title or "🔄 BRL Website Updated!"
        body = args.body or "New updates have been posted on banditracingleague.net. Tap to view!"
        push_brl_notification(title, body, args.url, category="website_update")

if __name__ == "__main__":
    main()
