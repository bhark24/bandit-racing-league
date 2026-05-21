import os
import glob
import re

directory = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

for file_path in html_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "geezer-icon.png" in content:
            continue
            
        # find the Rulebook link and insert the geezer icon before it
        new_content = re.sub(r'(<li><a href="[^"]*Rulebook[^"]*">Rulebook</a></li>|<li><a href="?#"?>Rulebook</a></li>)', 
                             r'<li><a href="/geezer-app.html"><img src="assets/geezer-icon.png" alt="Geezer App" style="height: 24px; vertical-align: middle; filter: drop-shadow(0 0 5px rgba(0,255,0,0.5));"></a></li>\n                \1', 
                             content)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Added Geezer Icon to nav in: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")
