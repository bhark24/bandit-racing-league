with open("drivers.html", "r", encoding="utf-8") as f:
    content = f.read()

import re
pos = content.find("getDriverImgPath")
if pos != -1:
    print("Found getDriverImgPath in drivers.html:")
    start = max(0, pos - 50)
    end = min(len(content), pos + 500)
    print(content[start:end].encode('ascii', errors='replace').decode('ascii'))
else:
    print("getDriverImgPath function not found")
