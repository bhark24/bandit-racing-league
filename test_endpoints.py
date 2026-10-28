import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls_to_test = [
    "https://simracerhub.com/season_standings_data.php?season_id=29722",
    "https://simracerhub.com/api/season_standings.php?season_id=29722",
    "https://simracerhub.com/get_season_standings.php?season_id=29722",
    "https://simracerhub.com/season_standings_json.php?season_id=29722",
    "https://simracerhub.com/ajax_season_standings.php?season_id=29722"
]

for url in urls_to_test:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        content = resp.read().decode("utf-8", errors="ignore")
        print(f"URL: {url} | Status: {resp.status} | Length: {len(content)}")
        print(content[:200])
    except Exception as e:
        print(f"URL: {url} | Error: {e}")
