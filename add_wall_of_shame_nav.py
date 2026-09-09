import os

site_dir = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"

nav_target = '<li><a href="/teams.html">Teams</a></li>'
nav_replacement = '<li><a href="/teams.html">Teams</a></li>\n                <li><a href="/wall-of-shame.html">Wall of Shame</a></li>'

updated_files = 0

for f in os.listdir(site_dir):
    if f.endswith(".html"):
        fpath = os.path.join(site_dir, f)
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
        
        if nav_target in content and 'href="/wall-of-shame.html"' not in content:
            new_content = content.replace(nav_target, nav_replacement)
            with open(fpath, 'w', encoding='utf-8') as file:
                file.write(new_content)
            updated_files += 1
            print(f"Added Wall of Shame nav to {f}")

print(f"\nSuccessfully updated {updated_files} HTML pages with Wall of Shame navigation link!")
