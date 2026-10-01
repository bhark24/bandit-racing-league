import os, time

app_dir = r"C:\Users\Bill\.gemini\antigravity"
recent_files = []

now = time.time()
for root, dirs, files in os.walk(app_dir):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            fp = os.path.join(root, f)
            try:
                mtime = os.path.getmtime(fp)
                if now - mtime < 600: # past 10 mins
                    recent_files.append((mtime, fp, os.path.getsize(fp)))
            except:
                pass

recent_files.sort(reverse=True)
print("Recent image files:")
for mtime, fp, size in recent_files[:15]:
    print(f"{size} bytes | {fp}")
