import os
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(BASE_DIR, "facebook_profile.html")
out_assets_path = os.path.join(BASE_DIR, "assets", "facebook_profile_picture.png")
out_brain_path = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\facebook_profile_picture.png"
out_desktop_path = r"C:\Users\Bill\Desktop\facebook_profile_picture.png"

print("Launching Playwright for profile picture generation...")
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1000, 'height': 1000})
    url = f"file:///{html_path.replace(os.sep, '/')}"
    page.goto(url)
    print("Waiting for page assets...")
    page.wait_for_timeout(2000)
    
    print(f"Taking screenshot to {out_assets_path}...")
    page.screenshot(path=out_assets_path)
    print(f"Taking screenshot to {out_brain_path}...")
    page.screenshot(path=out_brain_path)
    print(f"Taking screenshot to {out_desktop_path}...")
    page.screenshot(path=out_desktop_path)
    browser.close()
print("Success!")
