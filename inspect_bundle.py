import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://simracerhub.com/standingsTable.bundle.js?v=78a01d46"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    js_text = urllib.request.urlopen(req, context=ctx).read().decode("utf-8", errors="ignore")
    print("Bundle JS length:", len(js_text))
    # Search for .php or fetch or ajax or api
    matches = re.findall(r'[\'"]([^\'"]+\.php[^\'"]*)[\'"]', js_text)
    print("Found PHP endpoints in bundle:")
    for m in set(matches):
        print(" -", m)
except Exception as e:
    print("Error:", e)
