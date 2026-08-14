import os
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
    print("=" * 60)
    print("        BRL GATEWAY RACE PROMOTION POST GENERATOR")
    print("=" * 60)
    
    post_text = """🏁 **BANDIT RACING LEAGUE - GATEWAY PREVIEW** 🏁
📺 Live Broadcast: SimTrax Broadcasting
🛠️ Sponsor: Gateway Short Track Showdown

The battle heats up on the short track! This Wednesday, August 19th, the Bandit Racing League returns to action for Turn 9 at Gateway (World Wide Technology Raceway)! 🏆

We are headed to the challenging 1.25-mile oval for 160 laps of close-quarters racing under the lights in the Craftsman Trucks—and the championship chase is entering its final stages.

🔥 **CHAMPIONSHIP STANDINGS SHUFFLE!** 🔥
Following the historic, closest-ever 0.2ms finish at Michigan, the standings have tightened up:
🥇 Benjamin I Lacy — 334 pts
🥈 Scott Sanderson — 313 pts
🥉 Kevin Foster — 285 pts
4. Joshua L Adams — 273 pts
5. Dylan McDonald — 271 pts

With Benjamin Lacy holding a 21-point lead over Scott Sanderson at the top, the fight for the crown is entering a critical phase!

Gateway is a unique driver's track where turns 1-2 and turns 3-4 feature completely different banking and radii, requiring a compromised setup and precise driving. With only 1 Fast Repair and Stage breaks on the horizon, one single mistake can derail a driver's championship hopes!

🔮 **VIEWER FANTASY CHALLENGE - FREE TO PLAY!** 🔮
Don't forget to head over to the fantasy league to place your picks for this week's race! Pick your team of 4 drivers before the green flag drops.
👉 Submit your picks here: https://banditracingleague.net/fantasy.html

🗓️ **RACE DETAILS** 🗓️
📍 Track: Gateway Motorsports Park
🏁 Distance: 160 Laps (Craftsman Trucks)
📅 Date: Wednesday, August 19th
⏰ Time: 9:00 PM EST
📺 Broadcast: Live on SimTrax Broadcasting

Who is your pick to conquer Gateway? Let us know in the comments! 👇

#BanditRacingLeague #iRacing #Esports #SimRacing #NASCAR #CraftsmanTrucks #Gateway #ChampionshipChase"""

    print("\n" + "-" * 50)
    print("GENERATED SOCIAL POST:")
    print("-" * 50)
    try:
        print(post_text)
    except UnicodeEncodeError:
        print(post_text.encode('ascii', errors='replace').decode('ascii'))
    print("-" * 50)
    
    # Save text file on Desktop and in Assets folder
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    out_file_desktop = os.path.join(desktop, "brl_upcoming_facebook_post.txt")
    with open(out_file_desktop, "w", encoding="utf-8") as f:
        f.write(post_text)
    print(f"\n[+] SUCCESS: Saved text file to Desktop: brl_upcoming_facebook_post.txt")
    
    scratch_dir = r"C:\Users\Bill\.gemini\antigravity\scratch"
    out_file_assets = os.path.join(scratch_dir, "bandit_racing_league", "assets", "brl_upcoming_facebook_post.txt")
    os.makedirs(os.path.dirname(out_file_assets), exist_ok=True)
    with open(out_file_assets, "w", encoding="utf-8") as f:
        f.write(post_text)
    print(f"[+] SUCCESS: Saved text file to Assets: {out_file_assets}")
    
    # Copy to Clipboard
    try:
        copy_to_clipboard(post_text)
        print("[+] SUCCESS: Promotional text copied to your clipboard!")
    except Exception as e:
        print(f"[!] Clipboard Error: {e}")
        print("Please copy the text manually from the window above.")
        
    # Open Facebook
    fb_url = "https://www.facebook.com/profile.php?id=61585435839542"
    print(f"[+] Opening Facebook: {fb_url}")
    webbrowser.open(fb_url)
    print("=" * 60)

if __name__ == "__main__":
    main()
