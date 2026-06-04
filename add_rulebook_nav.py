import os
import glob
import re

directory = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

rulebook_link = '<li><a href="/rulebook.html">Rulebook</a></li>'

for file_path in html_files:
    fname = os.path.basename(file_path)
    if fname == "rulebook.html":
        continue
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "nav-links" not in content:
            continue
            
        if "rulebook.html" in content:
            print(f"Skipping (already contains rulebook): {fname}")
            continue
            
        # Try cascading fallback replacements
        success = False
        
        # 1. Try after Merch
        if re.search(r'<li><a href="/merch\.html"', content):
            new_content = re.sub(
                r'(<li><a href="/merch\.html"(?:\s+class="active")?>Merch</a></li>)',
                rf'\1\n                {rulebook_link}',
                content
            )
            success = True
        # 2. Try after Teams
        elif re.search(r'<li><a href="/teams\.html"', content):
            new_content = re.sub(
                r'(<li><a href="/teams\.html"(?:\s+class="active")?>Teams</a></li>)',
                rf'\1\n                {rulebook_link}',
                content
            )
            success = True
        # 3. Try after Drivers
        elif re.search(r'<li><a href="/drivers\.html"', content):
            new_content = re.sub(
                r'(<li><a href="/drivers\.html"(?:\s+class="active")?>Drivers</a></li>)',
                rf'\1\n                {rulebook_link}',
                content
            )
            success = True
            
        if success and new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Added Rulebook nav to: {fname}")
        else:
            print(f"Could not insert Rulebook nav item in: {fname}")
            
    except Exception as e:
        print(f"Error processing {fname}: {e}")
