import os
import re
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TIMESTAMP = int(time.time())

META_TAGS = f'''    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">'''

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    original_content = content

    # 1. Ensure meta cache control headers exist in <head>
    if 'http-equiv="Cache-Control"' not in content and 'HTTP-EQUIV="CACHE-CONTROL"' not in content.upper():
        head_match = re.search(r'(<head[^>]*>)', content, re.IGNORECASE)
        if head_match:
            content = content[:head_match.end()] + '\n' + META_TAGS + content[head_match.end():]

    # 2. Add/update cache-busting version parameter to local CSS files
    def replace_css(match):
        prefix = match.group(1)
        quote = match.group(2)
        url = match.group(3)
        if url.startswith('http://') or url.startswith('https://') or url.startswith('//'):
            return match.group(0)
        clean_url = url.split('?')[0]
        return f'{prefix}{quote}{clean_url}?v={TIMESTAMP}{quote}'

    content = re.sub(r'(href=)(["\'])([^"\']+\.css(?:\?[^"\']*)?)\2', replace_css, content, flags=re.IGNORECASE)

    # 3. Add/update cache-busting version parameter to local JS files
    def replace_js(match):
        prefix = match.group(1)
        quote = match.group(2)
        url = match.group(3)
        if url.startswith('http://') or url.startswith('https://') or url.startswith('//'):
            return match.group(0)
        clean_url = url.split('?')[0]
        return f'{prefix}{quote}{clean_url}?v={TIMESTAMP}{quote}'

    content = re.sub(r'(src=)(["\'])([^"\']+\.js(?:\?[^"\']*)?)\2', replace_js, content, flags=re.IGNORECASE)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print(f"[*] Applying cache-busting version v={TIMESTAMP} to all site HTML files...")
    updated_count = 0
    for root, dirs, files in os.walk(BASE_DIR):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in ('.git', 'scratch', '__pycache__', 'node_modules')]
        for file in files:
            if file.endswith('.html'):
                full_path = os.path.join(root, file)
                if process_html_file(full_path):
                    updated_count += 1
                    rel_path = os.path.relpath(full_path, BASE_DIR)
                    print(f"  [+] Updated cache-busting headers/links in {rel_path}")

    print(f"[+] Complete! Updated {updated_count} HTML files with version string v={TIMESTAMP}.")

if __name__ == '__main__':
    main()
