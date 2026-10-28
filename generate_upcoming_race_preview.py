import os
import sys
import shutil
import ctypes
import webbrowser
from ctypes import wintypes

def copy_to_clipboard(text):
    CF_UNICODETEXT = 13
    GMEM_MOVEABLE = 0x0002
    
    user32 = ctypes.windll.user32
    kernel32 = ctypes.windll.kernel32
    
    kernel32.GlobalAlloc.argtypes = [wintypes.UINT, ctypes.c_size_t]
    kernel32.GlobalAlloc.restype = wintypes.HGLOBAL
    
    kernel32.GlobalLock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalLock.restype = wintypes.LPVOID
    
    kernel32.GlobalUnlock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalUnlock.restype = wintypes.BOOL
    
    user32.OpenClipboard.argtypes = [wintypes.HWND]
    user32.OpenClipboard.restype = wintypes.BOOL
    
    user32.SetClipboardData.argtypes = [wintypes.UINT, wintypes.HANDLE]
    user32.SetClipboardData.restype = wintypes.HANDLE
    
    user32.CloseClipboard.argtypes = []
    user32.CloseClipboard.restype = wintypes.BOOL
    
    user32.EmptyClipboard.argtypes = []
    user32.EmptyClipboard.restype = wintypes.BOOL
    
    data = text.encode('utf-16-le') + b'\x00\x00'
    
    if not user32.OpenClipboard(None):
        raise RuntimeError("Failed to open clipboard.")
        
    try:
        user32.EmptyClipboard()
        h_mem = kernel32.GlobalAlloc(GMEM_MOVEABLE, len(data))
        if not h_mem:
            raise MemoryError("Failed to allocate memory.")
            
        ptr = kernel32.GlobalLock(h_mem)
        if not ptr:
            raise RuntimeError("Failed to lock memory.")
            
        try:
            ctypes.memmove(ptr, data, len(data))
        finally:
            kernel32.GlobalUnlock(h_mem)
            
        if not user32.SetClipboardData(CF_UNICODETEXT, h_mem):
            raise RuntimeError("Failed to write to clipboard.")
    finally:
        user32.CloseClipboard()

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    print("=" * 70)
    print("   BRL THE WENDY JO MEMORIAL 110 (KANSAS CHASE ROUND 2) PREVIEW")
    print("=" * 70)
    
    post_text = """🏁 **TONIGHT IN THE BANDIT RACING LEAGUE: THE WENDY JO MEMORIAL 110 AT KANSAS SPEEDWAY!** 🏁
✨ **Presented by JoKa Creations 3D Printing & Clear Low Communications** ✨
📺 **Watch Live on SimTrax YouTube:** https://www.youtube.com/watch?v=Mvniqkv6ycU
🌐 **SimTrax Broadcast Hub:** https://banditracingleague.net/simtrax.html
⏰ **Green Flag Broadcast:** Tonight (Wednesday, Oct 28) @ 9:00 PM EST!

The **Season 16 Chase for the Championship** storms into **Round 2 of 5** tonight under the lights at **Kansas Speedway** for **The Wendy Jo Memorial 110**! 🏆🔥

Honoring the memory of **Wendy Jo Jackson (1975–2020)** and proudly presented by **JoKa Creations 3D Printing** alongside official Season 16 presenting sponsor **Clear Low Communications**, 110 high-speed laps (165 miles) await on Kansas Speedway's progressive-banked (17–20°) 1.5-mile tri-oval!

⚙️ **TONIGHT'S RACE SPECS & STRATEGY CHALLENGE:**
• **Distance:** 110 Laps (165.0 Miles) | **Stage Breaks:** Laps 33 & 66
• **Fuel & Tires:** 70% Fuel Cap | **3 Total Tire Sets (Start + 2 Pit)**
• **Track Dynamic:** High-line momentum inches off the outside wall vs. fuel mileage and tire preservation! When we visited Kansas in Race 11, **Michael Rakes (#47 | 937 Racing)** pulled off a fuel-strategy masterclass to win over 2x Champion **Kevin Foster (#8)** while points leader **Benjamin Lacy (#7)** led a race-high 40 laps!

🏆 **SEASON 16 CHASE STANDINGS ENTERING ROUND 2 (ONLY 3 PTS SEPARATE 1ST & 2ND!):**
*5 Playoff Veterans (The Old Guard) vs. 5 First-Time Contenders (The New Blood) — No Eliminations!*
1️⃣ **#7 Benjamin I. Lacy (GFR)** — **2,119 pts (Leader)** | Led 40 Laps (P5) in Kansas 1
2️⃣ **#93 Scott Sanderson (GFR)** — **2,116 pts (-3)** | Cut Lacy's lead from 25 to 3 pts at Talladega!
3️⃣ **#22 Joshua L. Adams (937 Racing)** — **2,102 pts (-17)** | 6 Poles, Led 14 Laps (P8) in Kansas 1
4️⃣ **#9 Dylan McDonald (Legacy Racing)** — **2,095 pts (-24)** | +3 Spots at Dega (53 pts & Stg 1 Win)
5️⃣ **#2 Nick Nickerson (GFR)** — **2,086 pts (-33)** | 4x BRL Champ, Led 13 Laps (P6) in Kansas 1
6️⃣ **#8 Kevin Foster (GFR)** — **2,085* pts (-34)** | 2x BRL Champ, Finished P2 in Kansas 1
7️⃣ **#00 Jackson Knaak (ESR)** — **2,085 pts (-34)** | P2 by 0.010s at Dega, Led 5 Laps in Kansas 1
8️⃣ **#47 Michael Rakes (937 Racing)** — **2,081 pts (-38)** | 🏆 Defending Race 11 Kansas Winner!
9️⃣ **#13 Johnathon Platt (GFR)** — **2,075 pts (-44)** | Dega Stage 2 Winner (11 Laps Led, P8)
🔟 **#31 Connor Gibson (ZeroFoxtrot)** — **2,054 pts (-65)** | Finished P7 in Kansas 1

🔥 **PLUS:** Fresh off his historic **1st career BRL win in his 162nd start** (by 0.0105 seconds at Talladega!), **#15 Matt Crockett (Roundy Motorsports)** rolls into Kansas where he scored his previous career-best finish (P2)!

🔮 **VIEWER FANTASY LEAGUE — LOCK IN YOUR PICKS BEFORE 9:10 PM EST!** 🔮
Pick your 4-driver lineup before the green flag drops—100% FREE to play!
👉 **Submit Fantasy Picks:** https://banditracingleague.net/fantasy.html
📖 **Full 10-Driver Chase Scouting Report:** https://banditracingleague.net/article_chase_preview.html

🗓️ **TONIGHT'S RACE SCHEDULE (WEDNESDAY, OCT 28):**
🕗 **Pit Gates / Practice:** 8:00 PM EST
⏱️ **Qualifying:** 8:50 PM EST
🟢 **Live SimTrax Broadcast:** 9:00 PM EST
▶️ **Set Reminder / Watch Live:** https://www.youtube.com/watch?v=Mvniqkv6ycU

Who takes the checkered flag in **The Wendy Jo Memorial 110** at Kansas tonight? Drop your predictions in the comments! 👇

#BanditRacingLeague #WendyJoMemorial110 #JoKaCreations #ClearLowCommunications #SimTraxBroadcasting #KansasSpeedway #iRacing #CraftsmanTrucks #SimRacing #NASCAR #SimRacerHub"""

    print("\n" + "-" * 65)
    print("GENERATED FACEBOOK PROMO POST:")
    print("-" * 65)
    print(post_text)
    print("-" * 65)
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")

    # Save text file on Desktop
    out_file_desktop = os.path.join(desktop, "brl_kansas_facebook_post.txt")
    with open(out_file_desktop, "w", encoding="utf-8") as f:
        f.write(post_text)
    print(f"\n[+] SUCCESS: Saved post to Desktop: {out_file_desktop}")

    # Copy broadcast banner image to Desktop for easy Facebook upload
    banner_src = os.path.join(base_dir, "assets", "BCast Banners", "yt_Mvniqkv6ycU.jpg")
    banner_dest = os.path.join(desktop, "BRL_Wendy_Jo_Memorial_110_Kansas_Promo.jpg")
    if os.path.exists(banner_src):
        shutil.copy(banner_src, banner_dest)
        print(f"[+] SUCCESS: Saved broadcast banner to Desktop: {banner_dest}")

    # Save to local workspace files
    out_file_local = os.path.join(base_dir, "facebook_promo_post.txt")
    with open(out_file_local, "w", encoding="utf-8") as f:
        f.write(post_text)
    print(f"[+] SUCCESS: Saved post to workspace: {out_file_local}")
    
    # Copy to Clipboard
    try:
        copy_to_clipboard(post_text)
        print("[+] SUCCESS: Preview post copied to your clipboard!")
    except Exception as e:
        print(f"[!] Clipboard Note: {e}")

    # Open Facebook
    fb_url = "https://www.facebook.com/profile.php?id=61585435839542"
    print(f"[+] Opening Facebook League Page: {fb_url}")
    try:
        webbrowser.open(fb_url)
    except Exception as e:
        print(f"[!] Could not open browser: {e}")

    print("=" * 70)

if __name__ == "__main__":
    main()
