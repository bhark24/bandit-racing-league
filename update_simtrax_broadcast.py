import os
import sys
import re
import ssl
import json
import urllib.request
from datetime import datetime

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SIMTRAX_HTML_PATH = os.path.join(BASE_DIR, "simtrax.html")
WEEKLY_DATA_PATH = os.path.join(BASE_DIR, "weekly_data.js")
CHANNEL_ID = "UC8D9f0DOxaf8hdyxIuk2NeQ"

# Season 16 Schedule for fallback & track matching
SEASON_16_SCHEDULE = [
    {"track": "Daytona International Speedway", "short": "Daytona", "date": "Jun 17, 2026", "banner": "assets/BCast Banners/Degas16.png"},
    {"track": "EchoPark Speedway (Atlanta)", "short": "Atlanta", "date": "Jun 24, 2026", "banner": "assets/BCast Banners/Degas16.png"},
    {"track": "Charlotte Motor Speedway", "short": "Charlotte", "date": "Jul 8, 2026", "banner": "assets/BCast Banners/Degas16.png"},
    {"track": "Bristol Motor Speedway", "short": "Bristol", "date": "Jul 15, 2026", "banner": "assets/BCast Banners/Degas16.png"},
    {"track": "Nashville Superspeedway", "short": "Nashville", "date": "Jul 22, 2026", "banner": "assets/BCast Banners/Degas16.png"},
    {"track": "Pocono Raceway", "short": "Pocono", "date": "Jul 29, 2026", "banner": "assets/BCast Banners/Poconos16.png"},
    {"track": "Richmond Raceway", "short": "Richmond", "date": "Aug 5, 2026", "banner": "assets/BCast Banners/Richmond16.png"},
    {"track": "Michigan International Speedway", "short": "Michigan", "date": "Aug 12, 2026", "banner": "assets/BCast Banners/Degas16.png"},
    {"track": "World Wide Technology Raceway (Gateway)", "short": "Gateway", "date": "Aug 19, 2026", "banner": "assets/BCast Banners/Gateway_Showdown_Banner.png"},
    {"track": "Darlington Raceway", "short": "Darlington", "date": "Sep 2, 2026", "banner": "assets/BCast Banners/Degas16.png"},
    {"track": "Kansas Speedway", "short": "Kansas", "date": "Sep 9, 2026", "banner": "assets/BCast Banners/yt_YtSABel3wLM.jpg"},
    {"track": "Texas Motor Speedway", "short": "Texas", "date": "Sep 16, 2026", "banner": "assets/BCast Banners/Texas.png"},
    {"track": "Las Vegas Motor Speedway", "short": "Las Vegas", "date": "Sep 23, 2026", "banner": "assets/BCast Banners/LasVegas.jpg"},
    {"track": "Watkins Glen International", "short": "Watkins Glen", "date": "Sep 30, 2026", "banner": "assets/BCast Banners/Watkins_Glen.png"},
    {"track": "Phoenix Raceway", "short": "Phoenix", "date": "Oct 7, 2026", "banner": "assets/BCast Banners/phoenix_s16.png"},
    {"track": "Martinsville Speedway", "short": "Martinsville", "date": "Oct 14, 2026", "banner": "assets/BCast Banners/yt_uaOxeFHIrTw.jpg"},
    {"track": "Talladega Superspeedway", "short": "Talladega", "date": "Oct 21, 2026", "banner": "assets/BCast Banners/Degas16.png"},
    {"track": "Kansas Speedway", "short": "Kansas", "date": "Oct 28, 2026", "banner": "assets/BCast Banners/yt_Mvniqkv6ycU.jpg"},
    {"track": "Road America", "short": "Road America", "date": "Nov 4, 2026", "banner": "assets/BCast Banners/Watkins_Glen.png"},
    {"track": "Phoenix Raceway", "short": "Phoenix", "date": "Nov 11, 2026", "banner": "assets/BCast Banners/phoenix_s16.png"},
    {"track": "Homestead-Miami Speedway", "short": "Homestead", "date": "Nov 18, 2026", "banner": "assets/BCast Banners/Degas16.png"}
]


def fetch_url(url):
    ctx = ssl._create_unverified_context()
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        }
    )
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def extract_video_items(obj, found=None):
    if found is None:
        found = []
    if isinstance(obj, dict):
        # Modern YouTube lockupViewModel on @channel/streams
        if "lockupViewModel" in obj:
            lvm = obj["lockupViewModel"]
            vid = lvm.get("contentId", "")
            meta_vm = lvm.get("metadata", {}).get("lockupMetadataViewModel", {})
            title = meta_vm.get("title", {}).get("content", "")
            rows = meta_vm.get("metadata", {}).get("contentMetadataViewModel", {}).get("metadataRows", [])
            meta_texts = [
                p.get("text", {}).get("content", "")
                for r in rows
                for p in r.get("metadataParts", [])
                if p.get("text", {}).get("content")
            ]
            meta_joined = " | ".join(meta_texts)
            meta_lower = meta_joined.lower()

            # Check thumbnail badges as well
            overlays = lvm.get("contentImage", {}).get("thumbnailViewModel", {}).get("overlays", [])
            badge_texts = []
            for ov in overlays:
                tb = ov.get("thumbnailBottomOverlayViewModel", {})
                for b in tb.get("badges", []):
                    t_text = b.get("thumbnailBadgeViewModel", {}).get("text", "")
                    b_style = b.get("thumbnailBadgeViewModel", {}).get("badgeStyle", "")
                    if t_text:
                        badge_texts.append(t_text.upper())
                    if b_style:
                        badge_texts.append(b_style.upper())

            badge_joined = " ".join(badge_texts)
            is_live = ("LIVE" in badge_joined) or ("watching" in meta_lower)
            is_upcoming = (
                ("UPCOMING" in badge_joined)
                or ("scheduled" in meta_lower)
                or ("upcoming" in meta_lower)
                or ("premieres" in meta_lower)
                or ("waiting" in meta_lower)
                or (not is_live and "streamed" not in meta_lower and "ago" not in meta_lower)
            )

            if vid and title:
                found.append({
                    "videoId": vid,
                    "title": title,
                    "isUpcoming": is_upcoming,
                    "isLive": is_live,
                    "publishedText": meta_joined
                })
        # Legacy YouTube videoRenderer
        elif "videoRenderer" in obj:
            vr = obj["videoRenderer"]
            vid = vr.get("videoId", "")
            title_runs = vr.get("title", {}).get("runs", [])
            title = "".join(r.get("text", "") for r in title_runs) if title_runs else vr.get("title", {}).get("simpleText", "")
            upcoming_data = vr.get("upcomingEventData")
            is_upcoming = upcoming_data is not None
            is_live = False
            for b in vr.get("badges", []):
                style = b.get("metadataBadgeRenderer", {}).get("style", "")
                if "LIVE" in style:
                    is_live = True
            for ov in vr.get("thumbnailOverlays", []):
                style = ov.get("thumbnailOverlayTimeStatusRenderer", {}).get("style", "")
                if style == "LIVE":
                    is_live = True
                elif style == "UPCOMING":
                    is_upcoming = True
            pub_text = vr.get("publishedTimeText", {}).get("simpleText", "")
            if vid and title:
                found.append({
                    "videoId": vid,
                    "title": title,
                    "isUpcoming": is_upcoming,
                    "isLive": is_live,
                    "publishedText": pub_text
                })
        else:
            for v in obj.values():
                extract_video_items(v, found)
    elif isinstance(obj, list):
        for item in obj:
            extract_video_items(item, found)
    return found


def fetch_simtrax_streams():
    streams = []
    try:
        html = fetch_url("https://www.youtube.com/@simtraxbroadcasting/streams")
        m = re.search(r"var ytInitialData\s*=\s*(\{.*?\});\s*</script>", html, re.S)
        if m:
            data = json.loads(m.group(1))
            streams = extract_video_items(data)
            print(f"[+] Extracted {len(streams)} stream entries from SimTrax YouTube /streams page.")
    except Exception as e:
        print(f"[!] Warning fetching /streams page: {e}")

    return streams


def download_youtube_thumbnail(video_id, target_rel_path):
    ctx = ssl._create_unverified_context()
    target_abs = os.path.join(BASE_DIR, target_rel_path.replace("/", os.sep))
    os.makedirs(os.path.dirname(target_abs), exist_ok=True)
    for res in ["maxresdefault.jpg", "sddefault.jpg", "hqdefault.jpg"]:
        url = f"https://i.ytimg.com/vi/{video_id}/{res}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                if resp.status == 200:
                    data = resp.read()
                    if len(data) > 2000:
                        with open(target_abs, "wb") as f:
                            f.write(data)
                        print(f"[+] Downloaded YouTube thumbnail ({res}) to {target_rel_path}")
                        return target_rel_path
        except Exception:
            continue
    return None


def get_next_scheduled_race():
    now = datetime.now()
    for item in SEASON_16_SCHEDULE:
        dt = datetime.strptime(item["date"] + " 23:59:59", "%b %d, %Y %H:%M:%S")
        if dt >= now:
            return item
    return SEASON_16_SCHEDULE[-1]


def main():
    print("=" * 60)
    print("   SIMTRAX YOUTUBE BROADCAST & UPCOMING STREAM SYNC")
    print("=" * 60)

    streams = fetch_simtrax_streams()
    for idx, s in enumerate(streams[:8]):
        status = "UPCOMING" if s["isUpcoming"] else ("LIVE" if s["isLive"] else "VOD")
        pub_text = s['publishedText'].replace('\u202f', ' ').replace('\xa0', ' ')
        print(f"  [{idx+1}] [{status}] {s['videoId']} | {s['title']} ({pub_text})")

    upcoming_streams = [s for s in streams if s["isUpcoming"] or s["isLive"]]
    vod_streams = [s for s in streams if not s["isUpcoming"] and not s["isLive"]]

    next_race = get_next_scheduled_race()
    print(f"[*] Next Season 16 Scheduled Race: {next_race['track']} ({next_race['date']})")

    featured_stream = None
    is_upcoming_featured = False

    if upcoming_streams:
        featured_stream = upcoming_streams[0]
        is_upcoming_featured = True
        print(f"[+] Found UPCOMING/LIVE SimTrax Broadcast: {featured_stream['title']} ({featured_stream['videoId']})")
    elif vod_streams:
        featured_stream = vod_streams[0]
        print(f"[+] No upcoming stream scheduled on YouTube yet; latest completed broadcast: {featured_stream['title']} ({featured_stream['videoId']})")

    if not featured_stream:
        print("[!] Could not retrieve any streams from YouTube.")
        return

    vid_id = featured_stream["videoId"]
    vid_title = featured_stream["title"]

    # Download high-res YouTube thumbnail for the featured stream
    banner_rel_path = f"assets/BCast Banners/yt_{vid_id}.jpg"
    downloaded = download_youtube_thumbnail(vid_id, banner_rel_path)
    if not downloaded:
        if os.path.exists(os.path.join(BASE_DIR, next_race["banner"].replace("/", os.sep))):
            banner_rel_path = next_race["banner"]
        else:
            banner_rel_path = "assets/BCast Banners/Degas16.png"

    # Format heading and status text for the top card on simtrax.html
    if is_upcoming_featured:
        if featured_stream.get("isLive"):
            banner_heading = f"🔴 LIVE NOW &bull; {vid_title}"
            sub_caption = f"Watch the live SimTrax Broadcasting stream below or <a href='https://www.youtube.com/watch?v={vid_id}' target='_blank' style='color: var(--neon-green); font-weight: bold;'>open on YouTube &rarr;</a>"
        else:
            sched_note = f"Wednesday, {next_race['date']} @ 9:00 PM EST &bull; {next_race['track']}"
            banner_heading = f"🔴 Tonight's Live Broadcast &bull; {vid_title}"
            sub_caption = f"Scheduled Live Stream ({sched_note}) &bull; <a href='https://www.youtube.com/watch?v={vid_id}' target='_blank' style='color: var(--neon-green); font-weight: bold;'>Click Here to Set Reminder / Watch Live on YouTube &rarr;</a>"
    else:
        banner_heading = f"Upcoming Broadcast: {next_race['track']} ({next_race['date']} @ 9:00 PM EST)"
        sub_caption = f"Latest Completed Broadcast Replay: <strong>{vid_title}</strong> &bull; <a href='https://www.youtube.com/watch?v={vid_id}' target='_blank' style='color: var(--neon-green); font-weight: bold;'>Watch Full Broadcast on YouTube &rarr;</a><br><span style='font-size: 0.85rem; color: #999;'>(Synced daily with <a href='https://www.youtube.com/@simtraxbroadcasting/streams' target='_blank' style='color: #aaa;'>@simtraxbroadcasting</a> — upcoming {next_race['short']} stream link &amp; banner auto-update as soon as posted)</span>"

    changed = False

    # 1. Update weekly_data.js
    if os.path.exists(WEEKLY_DATA_PATH):
        with open(WEEKLY_DATA_PATH, "r", encoding="utf-8") as f:
            w_content = f.read()
        m = re.search(r"const\s+weeklyData\s*=\s*(\{.*\});", w_content, re.S)
        if m:
            w_data = json.loads(m.group(1))
            if (
                w_data.get("latestBroadcastVideoId") != vid_id
                or w_data.get("latestBroadcastIsUpcoming") != is_upcoming_featured
                or w_data.get("latestBroadcastBanner") != banner_rel_path
            ):
                changed = True
            w_data["latestBroadcastVideoId"] = vid_id
            w_data["latestBroadcastTitle"] = vid_title
            w_data["latestBroadcastIsUpcoming"] = is_upcoming_featured
            w_data["latestBroadcastBanner"] = banner_rel_path
            with open(WEEKLY_DATA_PATH, "w", encoding="utf-8") as f:
                f.write(f"const weeklyData = {json.dumps(w_data, indent=2)};\n")
            print(f"[+] Updated weekly_data.js with latestBroadcastVideoId={vid_id}")

    # 2. Update simtrax.html
    if os.path.exists(SIMTRAX_HTML_PATH):
        with open(SIMTRAX_HTML_PATH, "r", encoding="utf-8") as f:
            s_html = f.read()

        new_banner_block = f"""        <!-- Upcoming Race Broadcast Banner (Auto-Synced Daily from SimTrax YouTube) -->
        <div style="display: flex; justify-content: center; margin-bottom: 40px;">
            <div class="card neon-border" style="width: 100%; max-width: 900px; padding: 20px; text-align: center;">
                <h2 id="simtrax-upcoming-heading" style="color: var(--neon-green); font-family: var(--font-heading); text-transform: uppercase; margin-bottom: 10px; font-size: 1.45rem; letter-spacing: 1.5px;">{banner_heading}</h2>
                <p id="simtrax-upcoming-sub" style="color: #ccc; font-size: 0.95rem; margin-bottom: 15px; line-height: 1.5;">{sub_caption}</p>
                <a id="simtrax-upcoming-link" href="https://www.youtube.com/watch?v={vid_id}" target="_blank" style="display: block;">
                    <img id="simtrax-upcoming-img" src="{banner_rel_path}" alt="{vid_title}" style="width: 100%; border-radius: 8px; box-shadow: 0 0 25px rgba(57, 255, 20, 0.25); border: 1.5px solid rgba(57, 255, 20, 0.3);">
                </a>
            </div>
        </div>"""

        # Replace the Upcoming Race Broadcast Banner block in simtrax.html
        s_html_new = re.sub(
            r"[ \t]*<!-- Upcoming Race Broadcast Banner.*?(?=\s*<!-- Top Row: Presenting Sponsor -->)",
            new_banner_block + "\n\n",
            s_html,
            count=1,
            flags=re.S
        )

        # Also update the default iframe src in simtrax.html
        s_html_new = re.sub(
            r'(<iframe id="broadcast-iframe" src="https://www\.youtube\.com/embed/)[^"?]+(\?rel=0")',
            rf"\g<1>{vid_id}\g<2>",
            s_html_new
        )

        if s_html_new != s_html:
            changed = True
            with open(SIMTRAX_HTML_PATH, "w", encoding="utf-8") as f:
                f.write(s_html_new)
            print(f"[+] Updated {SIMTRAX_HTML_PATH} with video {vid_id} ({vid_title})")

    # 3. If changed, apply cache-busting and auto-push to GitHub so live site updates
    if changed and os.path.exists(os.path.join(BASE_DIR, ".git")):
        import subprocess
        print("[*] Broadcast update detected! Running cache-busting and pushing to GitHub...")
        subprocess.run(["python", "apply_cache_busting.py"], cwd=BASE_DIR)
        subprocess.run(["git", "add", "simtrax.html", "weekly_data.js", banner_rel_path], cwd=BASE_DIR)
        subprocess.run(["git", "add", "-u"], cwd=BASE_DIR)
        subprocess.run(["git", "commit", "-m", f"Auto-sync SimTrax broadcast: {vid_title} ({vid_id})"], cwd=BASE_DIR)
        push_res = subprocess.run(["git", "push", "origin", "main"], cwd=BASE_DIR, capture_output=True, text=True)
        if push_res.returncode == 0:
            print("[+] Successfully pushed SimTrax broadcast update to GitHub Pages!")
        else:
            print(f"[!] Git push warning:\n{push_res.stderr}")
    else:
        print("[*] SimTrax broadcast already up-to-date on website.")


if __name__ == "__main__":
    main()
