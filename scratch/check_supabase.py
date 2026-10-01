import glob

for fn in glob.glob("*supabase*"):
    print(f"=== {fn} ===")
    with open(fn, "r", encoding="utf-8", errors="ignore") as f:
        print(f.read()[:500])
