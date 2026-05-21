import os
import glob

directory = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

target_str = '<img src="assets/geezer-icon.png" alt="Geezer App" style="height: 24px;'
replacement_str = '<img src="assets/geezer-icon.png" alt="Geezer App" style="height: 42px;'

for file_path in html_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = content.replace(target_str, replacement_str)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Resized Geezer icon in: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")
