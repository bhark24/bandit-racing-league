import os
import re

def search_text_in_files(directory, pattern):
    results = []
    for root, dirs, files in os.walk(directory):
        if '.git' in root or '__pycache__' in root:
            continue
        for file in files:
            if not file.endswith('.html') and not file.endswith('.js'):
                continue
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    for line_no, line in enumerate(f, 1):
                        if pattern.lower() in line.lower():
                            results.append((file_path, line_no, line.strip()))
            except Exception as e:
                pass
    return results

print("Matches for 'NUMBER_IMAGES':")
for r in search_text_in_files(".", "NUMBER_IMAGES"):
    print(f"- {r[0]}:{r[1]}: {r[2].encode('ascii', errors='replace').decode('ascii')}")
