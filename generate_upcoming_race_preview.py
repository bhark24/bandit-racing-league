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
    print("      BRL VIVA LAS VEGAS 110 RACE PREVIEW GENERATOR")
    print("=" * 65)
    
    post_text = """🏁 **BANDIT RACING LEAGUE — UPCOMING AT LAS VEGAS MOTOR SPEEDWAY!** 🏁
📺 **Live Broadcast:** SimTrax Broadcasting | ⏰ **9:00 PM Eastern Standard Time (EST)**
📍 **Track:** Las Vegas Motor Speedway (1.5-Mile Tri-Oval)
🏁 **Event:** Viva Las Vegas 110 (Craftsman Trucks • 110 Laps)

The high-stakes strategy duel moves to Las Vegas Motor Speedway on Wednesday, September 23rd! 🏆

Drivers face a massive tactical dilemma under warm daytime desert temperatures: a **70% Fuel Cap (12.6 gal max)**, **1 Fast Repair**, and a **strict 2-Tire Set Limit** for 110 laps (~55 laps per set). With 3 green-flag pit stops required and only 1 tire change allowed, pit strategy and tire conservation will decide who takes victory lane in the neon desert!

🔥 **DRIVER SPOTLIGHT: WES FULLER (#35)** 🔥
Title Town Racing owner/driver **Wes Fuller** wheels his crisp #35 Ram Craftsman Truck into the desert heat! Will Fuller beat the high rollers in Vegas?

🏆 **CHAMPIONSHIP HUNT & STRATEGY BATTLE** 🏆
• Points leader Benjamin Lacy (#7) and Darlington winner Nick Nickerson (#2) lead the GFR Racing attack!
• Scott Sanderson (#93) and 937 Racing are charging hard for the crown!

🔮 **VIEWER FANTASY LEAGUE — FREE TO PLAY!** 🔮
Lock in your 4-driver fantasy team before 9:15 PM Eastern Standard Time (EST)!
👉 **Submit Picks:** https://banditracingleague.net/fantasy.html

📊 **INTERACTIVE TELEMETRY & WALL OF SHAME HUB:**
Catch up on past race incidents, SVG track maps, and stewards reports:
👉 **Wall of Shame Hub:** https://banditracingleague.net/wall-of-shame.html

🗓️ **RACE NIGHT SCHEDULE** 🗓️
⏰ **Practice/Qualifying:** 8:30 PM Eastern Standard Time (EST)
🏁 **Green Flag:** 9:00 PM Eastern Standard Time (EST)
📺 **Watch Live on SimTrax:** https://banditracingleague.net/simtrax.html

Who takes the checkered flag at Las Vegas Motor Speedway? Drop your picks in the comments! 👇

#BanditRacingLeague #iRacing #LasVegas #VivaLasVegas110 #SimRacing #NASCAR #CraftsmanTrucks #SimTrax #Esports #SimRacerHub"""

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
