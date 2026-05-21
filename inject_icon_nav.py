import os
import glob

directory = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

target_str1 = "<li><a href='/geezer-app.html'>Geezer App</a></li>"
replacement_str1 = '<li><a href="/geezer-app.html"><img src="assets/geezer-icon.png" alt="Geezer App" style="height: 24px; vertical-align: middle; filter: drop-shadow(0 0 5px rgba(0,255,0,0.5));"></a></li>'

target_str2 = '<li><a href=\'/geezer-app.html\' class="active">Geezer App</a></li>'
replacement_str2 = '<li><a href="/geezer-app.html" class="active"><img src="assets/geezer-icon.png" alt="Geezer App" style="height: 24px; vertical-align: middle; filter: drop-shadow(0 0 5px rgba(0,255,0,0.5));"></a></li>'

for file_path in html_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = content.replace(target_str1, replacement_str1).replace(target_str2, replacement_str2)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Replaced text with icon in: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")
