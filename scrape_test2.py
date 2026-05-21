import urllib.request

url = "https://simracerhub.com/season_standings.php?season_id=28135"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    idx = html.find("Jackson Knaak")
    if idx != -1:
        print("Found Jackson Knaak:")
        print(html[max(0, idx-100) : min(len(html), idx+100)])
    else:
        print("Jackson Knaak not found in HTML!")
except Exception as e:
    print(f"Error: {e}")
