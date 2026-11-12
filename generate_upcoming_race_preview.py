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

    print("=" * 72)
    print("   BRL LEGACY TOWING & TRAVIS AUTO SERVICE 140 AT PHOENIX PREVIEW")
    print("=" * 72)
    
    post_text = """🏁 **TONIGHT IN THE BANDIT RACING LEAGUE: THE LEGACY TOWING & TRAVIS AUTO SERVICE 140 AT PHOENIX RACEWAY!** 🏜️🔥
🚛 **Sponsored by Legacy Towing (Call 260-410-9407) & Travis Auto Service** 🔧
✨ **Season 16 Proudly Presented by Clear Low Communications** ✨
📺 **Watch Live on SimTrax YouTube:** https://www.youtube.com/watch?v=v5xJxuI5zyA
🌐 **SimTrax Broadcast Hub:** https://banditracingleague.net/simtrax.html
⏰ **Green Flag Broadcast:** Tonight (Wednesday, Nov 11) @ 9:00 PM EST!

We are down to the **FINAL 2 RACES** for the **Season 16 Bandit Racing League Championship**! Tonight, the Chase for the Championship storms into the Arizona desert for **Round 4 of 5**—the **Legacy Towing & Travis Auto Service 140** under the lights at **Phoenix Raceway**! 🏆🌵

🚨 **BREAKING GARAGE NEWS FLASH — #9 DYLAN MCDONALD SHUT DOWN FOR FINAL 2 RACES!** 🚨
Shockwaves hit the Bandit Racing League garage earlier today: **Dylan McDonald (#9 | Legacy Racing)**—who sits **5th in the Chase standings (2,170 pts)** and dominated earlier this season at Phoenix Raceway (leading 73 laps to win Race 15)—**will NOT make the final 2 races of Season 16**!
• His team has officially **shut down the #9 truck for the final two races** of the year.
• **Garage Rumor Mill:** Word around the paddock is that somebody in a different league may have tattled to the **iRacing Gods**, landing McDonald an official **iRacing time-out ("vacation")** right before the penultimate race of the Championship!
• Even wilder? With his own **Legacy Towing** banner on the marquee for tonight's 140-lapper, the defending Phoenix winner is parked on the sidelines—leaving the desert throne wide open tonight!

🏆 **2 RACES LEFT FOR THE SEASON 16 CHAMPIONSHIP — CHASE STANDINGS ENTERING PHOENIX:**
*(Penultimate Race Tonight at Phoenix -> Championship Finale Next Week at Homestead-Miami!)*
1️⃣ **#7 Benjamin I. Lacy (GFR Racing)** — **2,228 pts (Leader)** | Coming off a 58-pt Mid-Ohio clinic (Pole, 47/50 laps led); won the Pole & led 57 laps at Phoenix in Race 15!
2️⃣ **#93 Scott Sanderson (GFR Racing)** — **2,208 pts (-20)** | P3 & Stage 1 Winner at Mid-Ohio (54 pts, 2x); finished Top-5 at Phoenix earlier this season!
3️⃣ **#22 Joshua L. Adams (937 Racing)** — **2,182 pts (-46)** | 7 Poles in S16; looking to rebound and close the gap before Homestead!
4️⃣ **#8 Kevin Foster (GFR Racing)** — **2,173 pts (-55)** | 2x BRL Champion; back-to-back Top-5s at Kansas (P3) & Mid-Ohio (P5).
5️⃣ **#9 Dylan McDonald (Legacy Racing)** — **2,170 pts (-58)** | 🚨 *SHUT DOWN FOR FINAL 2 RACES (iRacing Time-Out)*
6️⃣ **#00 Jackson Knaak (ESR)** — **2,156 pts (-72)** | Started 3rd & finished 4th at Phoenix in Race 15!
7️⃣ **#47 Michael Rakes (937 Racing)** — **2,152 pts (-76)** | P5 at Kansas II & P7 at Mid-Ohio; moves into Top-6 contention with the #9 parked!
8️⃣ **#2 Nick Nickerson (GFR Racing)** — **2,137 pts (-91)** | 4x BRL Champion; Kansas II Winner & finished 2nd (Stage 1 Winner) at Phoenix in Race 15!
9️⃣ **#13 Johnathon Platt (GFR Racing)** — **2,113 pts (-115)** | 4 Stage Wins in Season 16.
🔟 **#31 Connor Gibson (ZeroFoxtrot)** — **2,112 pts (-116)** | Coming off a 42-point Top-10 run at Mid-Ohio!

⚙️ **TONIGHT'S RACE SPECS & DESERT STRATEGY:**
• **Track:** Phoenix Raceway (1.0-Mile Tri-Oval w/ Open Dogleg)
• **Distance:** 140 Laps (140.0 Miles) | **Stage Breaks:** Laps 42 & 84
• **Fuel & Tires:** 70% Fuel Cap | **3 Total Tire Sets (Start + 2 Pit)**
• **What to Watch:** Five-wide Chaos through the dogleg on restarts, flat-track brake management, and short-pitting strategy with only 2 pit tire sets! With Race 15 Phoenix winner Dylan McDonald out, look for **Benjamin Lacy (#7)**, **Nick Nickerson (#2)**, **Scott Sanderson (#93)**, **Jackson Knaak (#00)**, and Race 15 podium finisher **Brandon Jackson (#91)** to battle for control of the desert!

🔮 **VIEWER FANTASY LEAGUE — LOCK IN YOUR PICKS BEFORE GREEN FLAG!** 🔮
⚠️ *Fantasy Heads-Up: Do NOT pick the #9 truck tonight!* Pick your 4-driver lineup before 9:10 PM EST—100% FREE to play!
👉 **Submit Fantasy Picks:** https://banditracingleague.net/fantasy.html
📖 **Full Chase Hub & Standings:** https://banditracingleague.net/article_chase_preview.html

🗓️ **TONIGHT'S RACE SCHEDULE (WEDNESDAY, NOV 11):**
🕗 **Pit Gates / Practice:** 8:00 PM EST
⏱️ **Qualifying:** 8:50 PM EST
🟢 **Live SimTrax Broadcast:** 9:00 PM EST
▶️ **Set Reminder / Watch Live:** https://www.youtube.com/watch?v=v5xJxuI5zyA

Who takes the checkered flag in the **Legacy Towing & Travis Auto Service 140** at Phoenix tonight, and who locks themselves into striking distance for next week's Championship Finale? Drop your predictions in the comments! 👇

#BanditRacingLeague #PhoenixRaceway #LegacyTowing #TravisAutoService #ClearLowCommunications #SimTraxBroadcasting #ChaseForTheChampionship #iRacing #CraftsmanTrucks #SimRacing"""

    print("\n" + "-" * 68)
    print("GENERATED FACEBOOK PROMO POST:")
    print("-" * 68)
    print(post_text)
    print("-" * 68)
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")

    # Save text file on Desktop
    out_file_desktop = os.path.join(desktop, "brl_phoenix_facebook_post.txt")
    with open(out_file_desktop, "w", encoding="utf-8") as f:
        f.write(post_text)
    print(f"\n[+] SUCCESS: Saved post to Desktop: {out_file_desktop}")

    # Copy broadcast banner to Desktop for easy drag-and-drop into Facebook
    banner_src = os.path.join(base_dir, "assets", "BCast Banners", "phoenixs16.png")
    banner_desktop_path = os.path.join(desktop, "BRL_Phoenix_140_Facebook_Promo.png")
    if os.path.exists(banner_src):
        shutil.copy(banner_src, banner_desktop_path)
        print(f"[+] SUCCESS: Copied Phoenix broadcast banner to Desktop: {banner_desktop_path}")

    # Save to local workspace file
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

    print("=" * 72)

if __name__ == "__main__":
    main()
