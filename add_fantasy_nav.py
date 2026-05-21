import os
import glob
import re

directory = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

for file_path in html_files:
    filename = os.path.basename(file_path)
    if filename == "fantasy.html":
        # fantasy.html already has its custom active link
        continue
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "fantasy.html" in content:
            print(f"Fantasy link already present in: {filename}")
            continue
            
        # Find the geezer icon link and insert the fantasy league link before it
        pattern = r'(<li><a href="/geezer-app.html"(?:\s+class="active")?>)'
        if re.search(pattern, content):
            new_content = re.sub(pattern, r'<li><a href="/fantasy.html">Fantasy League</a></li>\n                \1', content)
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Added Fantasy League to nav in: {filename}")
        else:
            print(f"Warning: Geezer link not found in: {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")
