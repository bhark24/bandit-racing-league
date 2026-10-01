import shutil, os

src = "assets/truck images/Wes_Fuller_Kansas_paint.png"
dst = "assets/truck images/truck_image_wes_fuller.png"

if os.path.exists(src):
    shutil.copyfile(src, dst)
    print(f"Successfully copied {src} to {dst}. New size: {os.path.getsize(dst)} bytes.")
else:
    print(f"Error: {src} does not exist.")
