from rembg import remove
from PIL import Image
import os

input_path = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\assets\simtrax-logo.png"

try:
    if os.path.exists(input_path):
        input_img = Image.open(input_path)
        output_img = remove(input_img)
        output_img.save(input_path)
        print("Successfully removed the background from the SimTrax logo!")
    else:
        print("File not found at: " + input_path)
except Exception as e:
    print(f"Error: {e}")
