import os
import glob

directory = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

target1 = "<li><a href='/drivers.html'>Drivers</a></li>"
replacement1 = '<li><a href=\'/drivers.html\'>Drivers</a></li>\n                <li><a href="/geezer-app.html"><img src="assets/geezer-icon.png" alt="Geezer App" style="height: 24px; vertical-align: middle; filter: drop-shadow(0 0 5px rgba(0,255,0,0.5));"></a></li>'

target2 = "<li><a href='/drivers'>Drivers</a></li>"
replacement2 = '<li><a href=\'/drivers\'>Drivers</a></li>\n                <li><a href="/geezer-app.html"><img src="assets/geezer-icon.png" alt="Geezer App" style="height: 24px; vertical-align: middle; filter: drop-shadow(0 0 5px rgba(0,255,0,0.5));"></a></li>'

for file_path in html_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "geezer-icon.png" in content:
            continue
            
        new_content = content.replace(target1, replacement1).replace(target2, replacement2)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Added Geezer Icon to nav in: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")
