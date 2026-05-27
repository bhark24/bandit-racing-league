import os
import glob

directory = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

target_str = '<a href="#" class="btn-primary">Join Discord</a>'
replacement_str = '<a href="https://discord.gg/HSvP4UG2st" target="_blank" class="btn-primary">Join Discord</a>'

target_str2 = '<a href="#" class="btn-primary">JOIN DISCORD</a>'
replacement_str2 = '<a href="https://discord.gg/HSvP4UG2st" target="_blank" class="btn-primary">JOIN DISCORD</a>'

for file_path in html_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = content.replace(target_str, replacement_str).replace(target_str2, replacement_str2)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated Discord link in: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")
