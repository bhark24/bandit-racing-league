from PIL import Image, ImageDraw, ImageFont
import os

output_path = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\assets\numbers\number_12_geezer.png"

# Create a transparent canvas (800x800)
img = Image.new("RGBA", (800, 800), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Load font
font_path = r"C:\Windows\Fonts\impact.ttf"
if not os.path.exists(font_path):
    font_path = "arial.ttf"
    
font = ImageFont.truetype(font_path, 400)

text = "12"

# Get text bounding box
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

# Center the text
x = (800 - text_width) // 2
y = (800 - text_height) // 2 - 50 # adjust vertical offset

# Draw text with stroke (neon green outline, silver/grey fill)
# stroke_width of 18 creates a solid visible outline
draw.text((x, y), text, fill=(190, 190, 190, 255), font=font, 
          stroke_width=18, stroke_fill=(57, 255, 20, 255))

# Apply affine shear transform to slant the number for a racing look
# (1, -0.25, 0, 0, 1, 0) shears the x-axis by -0.25
sheared = img.transform((800, 800), Image.AFFINE, (1, -0.25, 100, 0, 1, 0), resample=Image.BICUBIC)

# Crop to bounding box of content
bbox_cropped = sheared.getbbox()
if bbox_cropped:
    final_img = sheared.crop(bbox_cropped)
    # Add a tiny padding around the number
    padding = 10
    padded_img = Image.new("RGBA", (final_img.size[0] + padding*2, final_img.size[1] + padding*2), (0, 0, 0, 0))
    padded_img.paste(final_img, (padding, padding))
    padded_img.save(output_path, "PNG")
    print(f"[+] Custom racing number 12 generated successfully at: {output_path}")
else:
    sheared.save(output_path, "PNG")
    print(f"[+] Custom racing number 12 saved at: {output_path}")
