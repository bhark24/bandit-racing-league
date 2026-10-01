import glob, os

files = glob.glob("assets/*logo*") + glob.glob("assets/*.svg")
print("Found logo files in assets:")
for f in sorted(files):
    print(f, os.path.getsize(f) if os.path.exists(f) else "Missing")
