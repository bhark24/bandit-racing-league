from playwright.sync_api import sync_playwright
import os

html_path = os.path.abspath("story_graphic.html")
out_path = "final_facebook_story_graphic.png"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1080, 'height': 1350})
    page.goto(f"file://{html_path}")
    
    # Wait for web fonts to load
    page.evaluate("document.fonts.ready")
    
    page.screenshot(path=out_path)
    browser.close()

print(f"Successfully generated {out_path}")
