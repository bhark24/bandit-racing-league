from PIL import Image

try:
    img = Image.open("assets/tracks/Track Logos/daytona-international-speedway-logo-png-transparent-white.png")
    img.thumbnail((800, 800))
    img.save("assets/tracks/Track Logos/Daytona_Clean.png", "PNG")
    print("Success")
except Exception as e:
    print(f"Error: {e}")
