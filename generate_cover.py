import os
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(BASE_DIR, "facebook_cover.html")
out_assets_path = os.path.join(BASE_DIR, "assets", "facebook_cover_photo.png")
out_brain_path = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\facebook_cover_photo.png"

print("Launching Playwright for cover photo generation...")
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1640, 'height': 608})
    url = f"file:///{html_path.replace(os.sep, '/')}"
    page.goto(url)
    print("Waiting for fonts and images to load...")
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(3000)
    
    print(f"Taking screenshot to {out_assets_path}...")
    page.screenshot(path=out_assets_path)
    print(f"Taking screenshot to {out_brain_path}...")
    page.screenshot(path=out_brain_path)
    browser.close()
print("Success!")
