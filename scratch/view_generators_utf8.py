import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("generate_upcoming_race_preview.py", "r", encoding="utf-8", errors="ignore") as f:
    print("=== generate_upcoming_race_preview.py ===")
    print(f.read())

with open("generate_promo_post.py", "r", encoding="utf-8", errors="ignore") as f:
    print("\n=== generate_promo_post.py ===")
    print(f.read())
