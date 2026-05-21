import os
import glob

directory = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
html_files = glob.glob(os.path.join(directory, "*.html"))

target_str = '<div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">\n                <div class="qr-container">'
replacement_str = '<div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">\n                <a href="/apply.html" class="btn-secondary">Apply to League</a>\n                <div class="qr-container">'

target_str2 = '<div class="nav-actions">\n                <a href="https://discord.gg/zXjvS9en"'
replacement_str2 = '<div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">\n                <a href="/apply.html" class="btn-secondary">Apply to League</a>\n                <a href="https://discord.gg/zXjvS9en"'

for file_path in html_files:
    if os.path.basename(file_path) == "apply.html":
        continue
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = content.replace(target_str, replacement_str).replace(target_str2, replacement_str2)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Injected Apply button into: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")
