import shutil, os

uploaded_img = r"C:\Users\Bill\.gemini\antigravity\brain\2ab45583-866e-49ad-9a35-75e9206ab90b\media__1788992746347.png"
dst1 = r"assets\truck images\Wes_Fuller_Kansas_paint.png"
dst2 = r"assets\truck images\truck_image_wes_fuller.png"

if os.path.exists(uploaded_img):
    shutil.copyfile(uploaded_img, dst1)
    shutil.copyfile(uploaded_img, dst2)
    print(f"Successfully copied uploaded image to {dst1} and {dst2}.")
    print("New size:", os.path.getsize(dst1), "bytes.")
else:
    print("Error: uploaded image not found at", uploaded_img)
