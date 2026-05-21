import urllib.request
import re

url = "https://simracerhub.com/season_standings.php?season_id=28135"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    links = re.findall(r'<a[^>]+href="[^"]*driver_id=(\d+)[^"]*"[^>]*>(.*?)</a>', html, re.IGNORECASE)
    print(f"Found {len(links)} driver links with driver_id in href")
    for did, text in links[:5]:
        print(did, text.strip())
except Exception as e:
    print(f"Error: {e}")
