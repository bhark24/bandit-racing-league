import os
import sys
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

    print("=" * 65)
    print("      BRL TONIGHT'S KANSAS SPEEDWAY RACE PREVIEW GENERATOR")
    print("=" * 65)
    
    post_text = """🏁 **BANDIT RACING LEAGUE — TONIGHT AT KANSAS SPEEDWAY!** 🏁
📺 **Live Broadcast:** SimTrax Broadcasting | ⏰ **9:00 PM EST**
📍 **Track:** Kansas Speedway (1.5-Mile D-Shaped Tri-Oval)
🏁 **Event:** Kansas Speedway Tri-Oval Showdown (Craftsman Trucks)

The high-speed drafting action moves to Kansas Speedway TONIGHT, Wednesday, September 9th! 🏆

Fresh off an intense Darlington duel where Nick Nickerson tamed the "Lady in Black", the Bandit Racing League heads to the sweeping 1.5-mile tri-oval of Kansas Speedway. With multiple racing grooves, heavy tire degradation, and 3-wide draft battles exiting Turn 4, tonight is set to be an absolute thriller!

🔥 **DRIVER SPOTLIGHT: WES FULLER (#35)** 🔥
Title Town Racing owner/driver **Wes Fuller** hits his home track in Kansas City sporting his brand new #35 Ram Craftsman Truck paint scheme! Will the hometown hero conquer Kansas tonight?

🏆 **CHAMPIONSHIP HUNT & TEAM ECONOMY BATTLE** 🏆
• GFR Racing leads the Team Championship, but 937 Racing and ZeroFoxtrot are charging hard!
• With only 1 Fast Repair per truck and Stage Checkered Flags on the line, execution and strategy are everything.

🔮 **VIEWER FANTASY LEAGUE — FREE TO PLAY!** 🔮
Lock in your 4-driver fantasy team before 9:00 PM EST! Race along live with the stream and climb the leaderboards:
👉 **Submit Picks:** https://banditracingleague.net/fantasy.html

📊 **INTERACTIVE TELEMETRY & WALL OF SHAME HUB:**
Catch up on past race incidents, SVG track maps, and stewards reports:
👉 **Wall of Shame Hub:** https://banditracingleague.net/wall-of-shame.html

🗓️ **RACE NIGHT SCHEDULE** 🗓️
⏰ **Practice/Qualifying:** 8:30 PM EST
🏁 **Green Flag:** 9:00 PM EST
📺 **Watch Live on SimTrax:** https://banditracingleague.net/simtrax.html

Who takes the checkered flag tonight at Kansas? Drop your picks in the comments! 👇

#BanditRacingLeague #iRacing #KansasSpeedway #SimRacing #NASCAR #CraftsmanTrucks #SimTrax #Esports #SimRacerHub"""

    print("\n" + "-" * 55)
    print("GENERATED FACEBOOK PROMO POST:")
    print("-" * 55)
    print(post_text)
    print("-" * 55)
    
    # Save text file on Desktop
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    out_file_desktop = os.path.join(desktop, "brl_kansas_facebook_post.txt")
    with open(out_file_desktop, "w", encoding="utf-8") as f:
        f.write(post_text)
    print(f"\n[+] SUCCESS: Saved post to Desktop: {out_file_desktop}")

    # Save to local workspace files
    cwd = os.getcwd()
    out_file_local = os.path.join(cwd, "facebook_promo_post.txt")
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

    print("=" * 65)

if __name__ == "__main__":
    main()
