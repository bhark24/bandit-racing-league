from PIL import Image
import os

source_path = r"C:\Users\Bill\.gemini\antigravity\brain\1a56f90d-0b29-49e3-8288-0c94833c786b\number_12_flat_geezer_1786253592339.jpg"
output_path = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\assets\numbers\number_12_geezer.png"

if os.path.exists(source_path):
    img = Image.open(source_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If the pixel is very black, make it transparent
        brightness = max(r, g, b)
        if brightness < 35:
            new_data.append((0, 0, 0, 0))
        elif brightness < 70:
            # Fade edges
            factor = (brightness - 35) / 35.0
            new_data.append((r, g, b, int(255 * factor)))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    
    # Crop to bounding box
    bbox = img.getbbox()
    if bbox:
        cropped_img = img.crop(bbox)
        cropped_img.save(output_path, "PNG")
        print(f"[+] Flattened custom number 12 PNG saved to: {output_path}")
    else:
        img.save(output_path, "PNG")
        print(f"[+] Flattened custom number 12 saved to: {output_path}")
else:
    print("[!] Source flat number 12 image not found.")
