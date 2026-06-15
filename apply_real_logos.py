import os
from PIL import Image

# Path Configurations
BASE_DIR = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
TEMP_MEDIA_DIR = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\.tempmediaStorage"

# Original Logo Paths
LOGO_BANDIT = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\media__1781492311973.png"
LOGO_GEEZER = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\media__1781492385839.png"
LOGO_NUM12 = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\media__1781492481186.png"
LOGO_SIMTRAX = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\media__1781492535077.jpg"
LOGO_JOKA = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\media__1781492580595.jpg"

# Base Mockup Image
MOCKUP_REAR = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\truck_mockup_rear_1781492704801.png"
OUT_PATH = r"C:\Users\Bill\Desktop\truck_mockup_rear_real_logos.png"
OUT_BRAIN_PATH = r"C:\Users\Bill\.gemini\antigravity\brain\22aa0b7a-2c33-47f8-af7a-3f462eaf2ee6\truck_mockup_rear_real_logos.png"

def overlay_logo(base_img, logo_path, size, angle, position, is_jpg_black_bg=False):
    if not os.path.exists(logo_path):
        print(f"Warning: Logo {logo_path} not found.")
        return base_img
        
    logo = Image.open(logo_path)
    
    # Handle black background JPGs by converting black to transparent
    if is_jpg_black_bg:
        logo = logo.convert("RGBA")
        datas = logo.getdata()
        newData = []
        for item in datas:
            # If color is close to black, make it transparent
            if item[0] < 25 and item[1] < 25 and item[2] < 25:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)
        logo.putdata(newData)
    else:
        logo = logo.convert("RGBA")
        
    # Resize logo
    logo = logo.resize(size, Image.Resampling.LANCZOS)
    
    # Rotate logo
    if angle != 0:
        logo = logo.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
        
    # Create temp transparent layer to paste
    temp_layer = Image.new("RGBA", base_img.size, (0, 0, 0, 0))
    # Calculate offset so position is the center of the pasted logo
    offset_x = position[0] - logo.width // 2
    offset_y = position[1] - logo.height // 2
    temp_layer.paste(logo, (offset_x, offset_y))
    
    return Image.alpha_composite(base_img, temp_layer)

def main():
    if not os.path.exists(MOCKUP_REAR):
        print(f"Error: Base mockup {MOCKUP_REAR} not found.")
        return
        
    base_img = Image.open(MOCKUP_REAR).convert("RGBA")
    
    # 1. Overlay SimTrax Broadcasting Logo on Tailgate
    print("[*] Placing SimTrax logo...")
    base_img = overlay_logo(
        base_img=base_img,
        logo_path=LOGO_SIMTRAX,
        size=(245, 190),
        angle=-1,
        position=(260, 580),
        is_jpg_black_bg=True
    )
    
    # 2. Overlay JoKa Creations Logo on Bedside
    print("[*] Placing JoKa Creations logo...")
    base_img = overlay_logo(
        base_img=base_img,
        logo_path=LOGO_JOKA,
        size=(130, 115),
        angle=-12,
        position=(555, 630),
        is_jpg_black_bg=True
    )
    
    # 3. Overlay Number 12 on Roof
    print("[*] Placing #12 on Roof...")
    base_img = overlay_logo(
        base_img=base_img,
        logo_path=LOGO_NUM12,
        size=(140, 95),
        angle=-12,
        position=(535, 365)
    )
    
    # 4. Overlay Number 12 on Door
    print("[*] Placing #12 on Door...")
    base_img = overlay_logo(
        base_img=base_img,
        logo_path=LOGO_NUM12,
        size=(75, 55),
        angle=-11,
        position=(810, 530)
    )
    
    # 5. Overlay Number 12 on Rear Bumper (lower left)
    print("[*] Placing #12 on Bumper...")
    base_img = overlay_logo(
        base_img=base_img,
        logo_path=LOGO_NUM12,
        size=(30, 20),
        angle=0,
        position=(418, 725)
    )
    
    # 6. Overlay Geezer App Logo on Rear Quarter Panel
    print("[*] Placing Geezer logo...")
    base_img = overlay_logo(
        base_img=base_img,
        logo_path=LOGO_GEEZER,
        size=(105, 48),
        angle=-10,
        position=(680, 520)
    )
    
    # Save output
    base_img.convert("RGB").save(OUT_PATH)
    base_img.convert("RGB").save(OUT_BRAIN_PATH)
    print(f"[+] Composite mockup generated at {OUT_PATH}")

if __name__ == "__main__":
    main()
