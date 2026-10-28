import os
import re
import json
import time
import argparse
import urllib.request
from datetime import datetime, timezone, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

WEDNESDAY_RACES = {
    "2026-10-28": ("Kansas Speedway", "Chase Round 2 — Wendy Jo Memorial 110"),
    "2026-11-04": ("Mid-Ohio Sports Car Course", "Chase Round 3 — Road Course Showdown"),
    "2026-11-11": ("Phoenix Raceway", "Chase Round 4 — Desert Dogleg Elimination"),
    "2026-11-18": ("Homestead-Miami Speedway", "Season 16 Championship Finale")
}

TUESDAY_PRACTICES = {
    "2026-10-27": ("Kansas Speedway", "Chase Round 2 — Wendy Jo Memorial 110"),
    "2026-11-03": ("Mid-Ohio Sports Car Course", "Chase Round 3 — Road Course Showdown"),
    "2026-11-10": ("Phoenix Raceway", "Chase Round 4 — Desert Dogleg Elimination"),
    "2026-11-17": ("Homestead-Miami Speedway", "Season 16 Championship Finale")
}

def get_eastern_now():
    """Returns current datetime in US Eastern Time (handles EDT/EST automatically)."""
    utc_now = datetime.now(timezone.utc)
    year = utc_now.year
    # US DST starts 2nd Sunday in March, ends 1st Sunday in November at 2:00 AM local
    march_1 = datetime(year, 3, 1, tzinfo=timezone.utc)
    dst_start_day = 14 - (march_1.weekday() + 1) % 7
    dst_start = datetime(year, 3, dst_start_day, 7, 0, tzinfo=timezone.utc)

    nov_1 = datetime(year, 11, 1, tzinfo=timezone.utc)
    dst_end_day = 7 - (nov_1.weekday() + 1) % 7
    dst_end = datetime(year, 11, dst_end_day, 6, 0, tzinfo=timezone.utc)

    offset_hours = -4 if (dst_start <= utc_now < dst_end) else -5
    return utc_now.astimezone(timezone(timedelta(hours=offset_hours)))

def get_supabase_config():
    cfg_path = os.path.join(BASE_DIR, "supabase_config.js")
    with open(cfg_path, "r", encoding="utf-8") as f:
        text = f.read()
    url = re.search(r'SUPABASE_URL\s*=\s*"(.*?)"', text).group(1)
    key = re.search(r'SUPABASE_KEY\s*=\s*"(.*?)"', text).group(1)
    return url, key

def post_to_discord_webhook(webhook_url, notif):
    """Automatically mirrors BRL App push notifications to a Discord channel via Webhook."""
    if not webhook_url or not webhook_url.startswith("https://discord"):
        return
    try:
        cat = notif.get("category", "website_update")
        color_map = {
            "race_live": 0xFF1744,
            "practice_open": 0x39FF14,
            "pit_gate_open": 0xFFCC00,
            "fantasy_lock": 0xFF9100,
            "outlaw_challenge": 0xFF0055,
            "driver_alert": 0x00D4FF,
            "team_alert": 0xFFCC00,
            "website_update": 0x39FF14
        }
        embed_color = color_map.get(cat, 0x39FF14)
        rel_url = notif.get("url", "/index.html")
        full_url = rel_url if rel_url.startswith("http") else f"https://banditracingleague.net{rel_url if rel_url.startswith('/') else '/' + rel_url}"

        embed = {
            "title": notif.get("title", "🏁 Bandit Racing League Alert"),
            "description": f"{notif.get('body', '')}\n\n🔗 **[Open in BRL App / Website]({full_url})**",
            "url": full_url,
            "color": embed_color,
            "thumbnail": {"url": "https://banditracingleague.net/assets/app-icon-192.png"},
            "footer": {"text": f"Bandit Racing League Mobile App • {notif.get('dateLabel', '')}"}
        }
        payload = json.dumps({
            "username": "BRL Outlaw App Alerts",
            "avatar_url": "https://banditracingleague.net/assets/app-icon-192.png",
            "embeds": [embed]
        }).encode("utf-8")

        req = urllib.request.Request(
            webhook_url,
            data=payload,
            headers={"Content-Type": "application/json", "User-Agent": "BRL-App-Bot/1.0"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=8) as _:
            print("[+] Synced alert to Discord Webhook!")
    except Exception as e:
        print(f"[!] Note: Discord Webhook sync skipped or failed: {e}")

def push_brl_notification(title, body, target_url="/index.html", category="website_update", driver=None, team=None, dedup_key=None):
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

    auto_keys = row_data.get("autoFiredKeys", {})
    if not isinstance(auto_keys, dict):
        auto_keys = {}

    if dedup_key and auto_keys.get(dedup_key):
        print(f"[i] Scheduled alert '{dedup_key}' was already broadcasted today. Skipping duplicate.")
        return

    et_now = get_eastern_now()
    now_label = et_now.strftime("%b %d, %I:%M %p ET")
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
    if dedup_key:
        auto_keys[dedup_key] = et_now.isoformat()
        row_data["autoFiredKeys"] = auto_keys

    notifs.insert(0, new_notif)
    row_data["appNotifications"] = notifs[:25]

    payload = json.dumps({
        "data": row_data,
        "updated_at": datetime.now(timezone.utc).isoformat()
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

    # Check for Discord Webhook URL in Supabase row_data, environment, or discord_config.json
    webhook_url = os.environ.get("DISCORD_WEBHOOK_URL") or row_data.get("discordWebhookUrl")
    if not webhook_url:
        dc_path = os.path.join(BASE_DIR, "discord_config.json")
        if os.path.exists(dc_path):
            try:
                with open(dc_path, "r", encoding="utf-8") as df:
                    webhook_url = json.load(df).get("webhook_url")
            except Exception:
                pass
    if webhook_url:
        post_to_discord_webhook(webhook_url, new_notif)

def main():
    parser = argparse.ArgumentParser(description="Send a real-time push notification to BRL Mobile App users.")
    parser.add_argument("--title", type=str, help="Notification title")
    parser.add_argument("--body", type=str, help="Notification body")
    parser.add_argument("--url", type=str, default="/index.html", help="Target page URL when tapped")
    parser.add_argument("--tuesday-practice", action="store_true", help="Send Tuesday Night 'Practice Session Open' alert")
    parser.add_argument("--fantasy-reminder", action="store_true", help="Send Wednesday 7:30 PM 'Fantasy Picks Lock' reminder")
    parser.add_argument("--pit-gate", action="store_true", help="Send Wednesday Night 'Pit Gate & Practice Open' alert")
    parser.add_argument("--live", action="store_true", help="Send Wednesday Night 'Race Going Live' alert")
    parser.add_argument("--auto-cron", action="store_true", help="Automatically check Eastern Time & schedule and send due Tuesday/Wednesday alerts")
    parser.add_argument("--driver", type=str, help="Target specific driver name (e.g. 'DONALD KIGHT')")
    parser.add_argument("--team", type=str, help="Target specific franchise team name (e.g. 'ChainedGraboid Racing Team')")
    parser.add_argument("--force", action="store_true", help="Send even if already sent today or not on a scheduled date")
    args = parser.parse_args()

    et_now = get_eastern_now()
    today_str = et_now.strftime("%Y-%m-%d")
    total_mins = et_now.hour * 60 + et_now.minute

    if args.auto_cron:
        # 1. Check Tuesday Night Practice Open (Tuesday 8:00 PM - 10:30 PM ET)
        if today_str in TUESDAY_PRACTICES and (20 * 60 <= total_mins <= 22 * 60 + 30):
            track, rnd = TUESDAY_PRACTICES[today_str]
            push_brl_notification(
                title=f"🟢 TUESDAY PRACTICE OPEN: {track}!",
                body=f"The pit gate for official Tuesday Night practice for tomorrow's {rnd} at {track} is now OPEN!",
                target_url="/schedule.html",
                category="practice_open",
                dedup_key=f"tue_practice_{today_str}"
            )
        # 2. Check Wednesday 7:30 PM ET Fantasy Picks Lock Reminder (Wednesday 7:30 PM - 7:59 PM ET)
        if today_str in WEDNESDAY_RACES and (19 * 60 + 30 <= total_mins <= 19 * 60 + 59):
            track, rnd = WEDNESDAY_RACES[today_str]
            push_brl_notification(
                title=f"⚠️ 90 MINS LEFT: Lock In Your {track} Fantasy Picks!",
                body=f"Fantasy picks for tonight's {rnd} at {track} lock at 9:00 PM EST! Tap now to submit your lineup.",
                target_url="/fantasy.html",
                category="fantasy_lock",
                dedup_key=f"wed_fantasy_{today_str}"
            )
        # 3. Check Wednesday Night Pit Gate & Practice Open (Wednesday 8:00 PM - 8:59 PM ET)
        if today_str in WEDNESDAY_RACES and (20 * 60 <= total_mins <= 20 * 60 + 59):
            track, rnd = WEDNESDAY_RACES[today_str]
            push_brl_notification(
                title=f"🏁 PIT GATE OPEN: Wednesday Race Session at {track}!",
                body=f"The pit gate for tonight's {rnd} at {track} is officially OPEN and practice has begun!",
                target_url="/index.html",
                category="pit_gate_open",
                dedup_key=f"wed_pit_gate_{today_str}"
            )
        # 4. Check Wednesday Night Race Broadcast Live (Wednesday 9:00 PM - 10:30 PM ET)
        if today_str in WEDNESDAY_RACES and (21 * 60 <= total_mins <= 22 * 60 + 30):
            track, rnd = WEDNESDAY_RACES[today_str]
            push_brl_notification(
                title=f"🔴 LIVE NOW: BRL at {track}!",
                body=f"{rnd} is going LIVE on SimTrax! Tap now to watch the broadcast.",
                target_url="/simtrax.html",
                category="race_live",
                dedup_key=f"wed_live_{today_str}"
            )
        return

    if args.tuesday_practice:
        track_info = TUESDAY_PRACTICES.get(today_str)
        if not track_info and not args.force:
            print(f"[i] Today ({today_str}) is not a scheduled Tuesday practice night. Use --force to override.")
            return
        if track_info and not args.title:
            title = f"🟢 TUESDAY PRACTICE OPEN: {track_info[0]}!"
            body = f"The pit gate for official Tuesday Night practice for tomorrow's {track_info[1]} at {track_info[0]} is now OPEN!"
        else:
            title = args.title or "🟢 TUESDAY PRACTICE OPEN: Bandit Racing League!"
            body = args.body or "The pit gate for official Tuesday Night practice for tomorrow night's Bandit Racing League race is now OPEN!"
        target_url = args.url if args.url != "/index.html" else "/schedule.html"
        dedup = None if args.force else f"tue_practice_{today_str}"
        push_brl_notification(title, body, target_url, category="practice_open", driver=args.driver, team=args.team, dedup_key=dedup)

    elif args.fantasy_reminder:
        track_info = WEDNESDAY_RACES.get(today_str)
        if not track_info and not args.force:
            print(f"[i] Today ({today_str}) is not a scheduled Wednesday race night. Use --force to override.")
            return
        if track_info and not args.title:
            title = f"⚠️ 90 MINS LEFT: Lock In Your {track_info[0]} Fantasy Picks!"
            body = f"Fantasy picks for tonight's {track_info[1]} at {track_info[0]} lock at 9:00 PM EST! Tap now to submit your lineup."
        else:
            title = args.title or "⚠️ 90 MINS LEFT: Lock In Your BRL Fantasy Picks!"
            body = args.body or "Weekly Viewer Fantasy picks lock at 9:00 PM EST! Tap now to submit your driver lineup."
        target_url = args.url if args.url != "/index.html" else "/fantasy.html"
        dedup = None if args.force else f"wed_fantasy_{today_str}"
        push_brl_notification(title, body, target_url, category="fantasy_lock", driver=args.driver, team=args.team, dedup_key=dedup)

    elif args.pit_gate:
        track_info = WEDNESDAY_RACES.get(today_str)
        if not track_info and not args.force:
            print(f"[i] Today ({today_str}) is not a scheduled Wednesday race night. Use --force to override.")
            return
        if track_info and not args.title:
            title = f"🏁 PIT GATE OPEN: Wednesday Race Session at {track_info[0]}!"
            body = f"The pit gate for tonight's {track_info[1]} at {track_info[0]} is officially OPEN and practice has begun!"
        else:
            title = args.title or "🏁 PIT GATE OPEN: Wednesday Night Race Session!"
            body = args.body or "The pit gate for tonight's Wednesday Night race is officially OPEN and practice has begun!"
        target_url = args.url if args.url != "/index.html" else "/index.html"
        dedup = None if args.force else f"wed_pit_gate_{today_str}"
        push_brl_notification(title, body, target_url, category="pit_gate_open", driver=args.driver, team=args.team, dedup_key=dedup)

    elif args.live:
        track_info = WEDNESDAY_RACES.get(today_str)
        if not track_info and not args.force:
            print(f"[i] Today ({today_str}) is not a scheduled Wednesday race night. Use --force to override.")
            return
        if track_info and not args.title:
            title = f"🔴 LIVE NOW: BRL at {track_info[0]}!"
            body = f"{track_info[1]} is going LIVE on SimTrax! Tap now to watch the broadcast."
        else:
            title = args.title or "🔴 LIVE NOW: Bandit Racing League on SimTrax!"
            body = args.body or "Tonight's Bandit Racing League race is going LIVE! Tap now to watch the SimTrax broadcast."
        target_url = args.url if args.url != "/index.html" else "/simtrax.html"
        dedup = None if args.force else f"wed_live_{today_str}"
        push_brl_notification(title, body, target_url, category="race_live", driver=args.driver, team=args.team, dedup_key=dedup)

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
