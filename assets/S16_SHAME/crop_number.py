from PIL import Image
import os

source_path = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\assets\drivers numbers\Bill Harkins.png"
output_path = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\assets\S16_SHAME\number_12_custom.png"

if os.path.exists(source_path):
    img = Image.open(source_path).convert("RGBA")
    # Find the bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Crop to the bounding box
        cropped_img = img.crop(bbox)
        # Save as high-quality transparent PNG
        cropped_img.save(output_path, "PNG")
        print(f"[+] Cropped number 12 saved successfully to: {output_path}")
    else:
        # If no bbox (e.g. empty image), just copy the file
        img.save(output_path, "PNG")
        print(f"[+] Standalone number 12 copied successfully to: {output_path}")
else:
    print("[!] Source number 12 image not found.")
