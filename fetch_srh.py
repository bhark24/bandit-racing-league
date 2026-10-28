import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://simracerhub.com/season_standings.php?season_id=29722"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, context=ctx).read().decode("utf-8", errors="ignore")

idx = html.find("React.createElement(StandingsTable, ")
if idx != -1:
    start_json = html.find("{", idx)
    depth = 0
    in_string = False
    escape = False
    end_json = -1
    for i in range(start_json, len(html)):
        c = html[i]
        if escape:
            escape = False
            continue
        if c == "\\":
            escape = True
            continue
        if c == '"':
            in_string = not in_string
            continue
        if not in_string:
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    end_json = i + 1
                    break
    if end_json != -1:
        json_text = html[start_json:end_json]
        data = json.loads(json_text)
        with open("live_srh_full.json", "w", encoding="utf-8") as out:
            json.dump(data, out, indent=2)
        print("SUCCESS! Saved live_srh_full.json")
    else:
        print("Could not find matching bracket")
else:
    print("Could not find React call")
