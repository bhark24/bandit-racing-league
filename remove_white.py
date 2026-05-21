from PIL import Image
import sys

def make_white_transparent(image_path, output_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # If pixel is white (or very close to it), make it transparent
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

make_white_transparent("assets/tracks/Track Logos/Daytona White trans.png", "assets/tracks/Track Logos/DaytonaWhite_nobg.png")
