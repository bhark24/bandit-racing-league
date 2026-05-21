import os
import glob
import re

directory = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

simtrax_link = '<li><a href="/simtrax.html"><img src="assets/simtrax-logo.png" alt="SimTrax Broadcasting" style="height: 42px; vertical-align: middle; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2));"></a></li>'

for file_path in html_files:
    if os.path.basename(file_path) == "simtrax.html":
        continue
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "simtrax.html" in content:
            continue
            
        # find the Geezer App link and append Simtrax link right after it
        new_content = re.sub(
            r'(<li><a href="/geezer-app\.html"[^>]*><img src="assets/geezer-icon\.png"[^>]*></a></li>)',
            r'\1\n                ' + simtrax_link,
            content
        )
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Added SimTrax nav link to: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")
