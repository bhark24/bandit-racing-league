from playwright.sync_api import sync_playwright
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(BASE_DIR, "atlanta_broadcast_banner_new.html")
out_desktop_path = r"C:\Users\Bill\Desktop\atlanta_broadcast_banner.png"
out_brain_path = r"C:\Users\Bill\.gemini\antigravity\brain\9ba04bcf-37da-404f-858c-21209e2562f2\atlanta_broadcast_banner.png"

print(f"Opening browser to take screenshot of {html_path}")
with sync_playwright() as p:
    browser = p.chromium.launch()
    # Open viewport at exact 1024x576 resolution to match template
    page = browser.new_page(viewport={'width': 1024, 'height': 576})
    url = f"file:///{html_path.replace(os.sep, '/')}"
    page.goto(url)
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(3000)  # Wait for fonts and high-res images to settle
    
    # Save screenshots
    page.screenshot(path=out_desktop_path)
    page.screenshot(path=out_brain_path)
    
    print(f"Successfully generated new Atlanta broadcast banner!")
    print(f"Desktop path: {out_desktop_path}")
    print(f"Brain path: {out_brain_path}")
    browser.close()
