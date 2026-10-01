with open("generate_upcoming_race_preview.py", "r", encoding="utf-8", errors="ignore") as f:
    print("=== generate_upcoming_race_preview.py ===")
    print(f.read())

with open("generate_promo_post.py", "r", encoding="utf-8", errors="ignore") as f:
    print("\n=== generate_promo_post.py ===")
    print(f.read())

with open("generate_social_post.py", "r", encoding="utf-8", errors="ignore") as f:
    print("\n=== generate_social_post.py (first 100 lines) ===")
    lines = f.readlines()
    print("".join(lines[:100]))
