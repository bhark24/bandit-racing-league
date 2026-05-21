from playwright.sync_api import sync_playwright
import os

html_path = os.path.abspath("overlay.html")
out_path = "perfect_car.png"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1024, 'height': 576})
    page.goto(f"file:///{html_path}")
    page.wait_for_timeout(2000) # Wait for fonts to load
    page.screenshot(path=out_path)
    browser.close()
