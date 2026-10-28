import os
import re
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TIMESTAMP = int(time.time())

META_TAGS = f'''    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">'''

PWA_HEAD_TAGS = '''    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">'''

SKIP_PWA_FILES = {
    'social_graphic.html',
    'story_graphic.html',
    'scrape_league.html',
    'simhub.html',
    'srh_gateway_363216.html',
    'bandit-roster.html',
    'geezer-app-preview.html'
}

def process_html_file(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    original_content = content

    # 1. Ensure meta cache control headers exist in <head>
    if 'http-equiv="Cache-Control"' not in content and 'HTTP-EQUIV="CACHE-CONTROL"' not in content.upper():
        head_match = re.search(r'(<head[^>]*>)', content, re.IGNORECASE)
        if head_match:
            content = content[:head_match.end()] + '\n' + META_TAGS + content[head_match.end():]

    # 1b. Ensure PWA manifest & apple-touch-icon and brl_app.js exist on public pages
    if filename not in SKIP_PWA_FILES:
        if 'rel="manifest"' not in content:
            head_close = re.search(r'(</head>)', content, re.IGNORECASE)
            if head_close:
                content = content[:head_close.start()] + PWA_HEAD_TAGS + '\n' + content[head_close.start():]
        if 'brl_app.js' not in content:
            body_close = re.search(r'(</body>)', content, re.IGNORECASE)
            if body_close:
                script_tag = f'    <script src="brl_app.js?v={TIMESTAMP}"></script>\n'
                content = content[:body_close.start()] + script_tag + content[body_close.start():]

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

    # 4. Add/update cache-busting version parameter to manifest.json
    content = re.sub(
        r'(href=)(["\'])([^"\']*manifest\.json(?:\?[^"\']*)?)\2',
        lambda m: f'{m.group(1)}{m.group(2)}{m.group(3).split("?")[0]}?v={TIMESTAMP}{m.group(2)}',
        content,
        flags=re.IGNORECASE
    )

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def detect_changed_targets():
    import subprocess
    try:
        res = subprocess.run(
            ['git', 'status', '--porcelain'],
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
            timeout=5
        )
        lines = [line.strip() for line in res.stdout.splitlines() if line.strip()]
        changed = [line.split()[-1].replace('\\', '/') for line in lines]
        return changed
    except Exception:
        return []

def auto_push_website_alert(changed_files):
    if not changed_files:
        return
    try:
        import send_brl_notification
        low = [f.lower() for f in changed_files]

        if any('teams_data.js' in f or 'teams.html' in f for f in low):
            send_brl_notification.push_brl_notification(
                "🏁 Franchise Teams & Economy Updated!",
                "New franchise team roster, garage, or financial ledger updates have been posted on banditracingleague.net.",
                target_url="/teams.html",
                category="team_alert"
            )
        elif any('roster_data.js' in f or 'drivers.html' in f for f in low):
            send_brl_notification.push_brl_notification(
                "🏎️ Official Driver Roster Updated!",
                "Driver cards and car number assignments have been updated on banditracingleague.net.",
                target_url="/drivers.html",
                category="driver_alert"
            )
        elif any('standings.html' in f or 'results.html' in f for f in low):
            send_brl_notification.push_brl_notification(
                "🏆 Standings & Race Results Updated!",
                "Official Bandit Racing League standings and race results have been updated!",
                target_url="/standings.html",
                category="website_update"
            )
        elif any('fantasy' in f for f in low):
            send_brl_notification.push_brl_notification(
                "🎰 Fantasy League & Championship Odds Updated!",
                "Check the latest Fantasy standings, weekly picks, and SimTrax Sportsbook odds!",
                target_url="/fantasy.html",
                category="website_update"
            )
        elif any('wall-of-shame' in f for f in low):
            send_brl_notification.push_brl_notification(
                "🚨 Wall of Shame Updated!",
                "New incident write-ups and videos have been posted to the BRL Wall of Shame!",
                target_url="/wall-of-shame.html",
                category="website_update"
            )
        elif any('season17.html' in f or 'rulebook.html' in f for f in low):
            send_brl_notification.push_brl_notification(
                "🤠 Season 17 Hub & Rulebook Updated!",
                "New Season 17 attractions, poll updates, or rulebook revisions are now live!",
                target_url="/season17.html",
                category="website_update"
            )
        else:
            send_brl_notification.push_brl_notification(
                "🔄 Bandit Racing League Website Updated!",
                "Fresh news and updates have been published on banditracingleague.net. Tap to view!",
                target_url="/index.html",
                category="website_update"
            )
    except Exception as e:
        print(f"  [!] Note: Auto-notification skipped ({e})")

def main():
    changed_before = detect_changed_targets()
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
    auto_push_website_alert(changed_before)

if __name__ == '__main__':
    main()
