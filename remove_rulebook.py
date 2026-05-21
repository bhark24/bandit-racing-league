import os
import glob
import re

directory = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

for file_path in html_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Remove the Rulebook list item from the nav
        # This matches <li><a href="#">Rulebook</a></li> or <li><a href="/rulebook.html">Rulebook</a></li> with any leading whitespace
        new_content = re.sub(r'\s*<li><a href="[^"]*">Rulebook</a></li>', '', content)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Removed Rulebook from: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")
