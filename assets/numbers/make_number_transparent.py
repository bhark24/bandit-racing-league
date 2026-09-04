from PIL import Image, ImageOps
import os

source_path = r"C:\Users\Bill\.gemini\antigravity\brain\1a56f90d-0b29-49e3-8288-0c94833c786b\number_12_render_1786253071207.jpg"
output_path = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\assets\numbers\number_12_geezer.png"

if os.path.exists(source_path):
    img = Image.open(source_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        # Calculate brightness/intensity to isolate black background
        brightness = max(r, g, b)
        
        # If the pixel is very dark black, make it transparent
        if brightness < 30:
            new_data.append((0, 0, 0, 0))
        elif brightness < 60:
            # Smooth transition for anti-aliasing edges
            factor = (brightness - 30) / 30.0
            new_data.append((r, g, b, int(255 * factor)))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    
    # Crop to bounding box
    bbox = img.getbbox()
    if bbox:
        cropped_img = img.crop(bbox)
        cropped_img.save(output_path, "PNG")
        print(f"[+] Transparent and cropped number 12 saved to: {output_path}")
    else:
        img.save(output_path, "PNG")
        print(f"[+] Transparent number 12 saved to: {output_path}")
else:
    print("[!] Source image not found.")
