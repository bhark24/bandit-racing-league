import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open("standings.html", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()
    print("=== standings.html ===")
    print(text[:1500])

with open("article_darlington_recap.html", "r", encoding="utf-8", errors="ignore") as f:
    t = f.read()
    print("\n=== article_darlington_recap.html ===")
    print(t[:1500])
