import os

p1 = "assets/truck images/Wes_Fuller_Kansas_paint.png"
p2 = "assets/truck images/truck_image_wes_fuller.png"

print("P1 exists:", os.path.exists(p1), "Size:", os.path.getsize(p1) if os.path.exists(p1) else 0)
print("P2 exists:", os.path.exists(p2), "Size:", os.path.getsize(p2) if os.path.exists(p2) else 0)
