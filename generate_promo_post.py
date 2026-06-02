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
    print("        BRL WEBSITE LAUNCH PROMOTION GENERATOR")
    print("=" * 60)
    
    promo_text = """🚀 **THE NEW BANDIT RACING LEAGUE WEBSITE IS OFFICIALLY LIVE!** 🚀

We are thrilled to announce the launch of our brand new league home! Designed from the ground up to bring you closer to the action, the new site is your ultimate hub for everything BRL:

🏁 **What’s New?**
📊 **Live Driver Statistics & Profiles:** Track your progress and view detailed stats for every driver in the league.
💼 **Franchise Team Standings:** Follow the battle for the Team Championship, complete with live budgets and team rosters.
🔮 **Viewer Participation Fantasy League:** FREE and open to anyone watching our live broadcasts! You don't have to be a driver to play—just tune in, submit your weekly picks during the stream, climb the standings, and see if you can out-predict the competition!
🗓️ **Interactive Race Calendars:** Never miss a green flag with countdowns, schedules, and official track info.

Check it out right now:
👉 https://banditracingleague.net/

Tell us what you think in the comments! What is your favorite new feature? 👇

#BanditRacingLeague #SimRacing #iRacing #WebsiteLaunch #ChampionshipChase"""

    print("\n" + "-" * 50)
    print("PROMOTIONAL POST TEXT:")
    print("-" * 50)
    try:
        print(promo_text)
    except UnicodeEncodeError:
        print(promo_text.encode('ascii', errors='replace').decode('ascii'))
    print("-" * 50)
    
    # Copy to Clipboard
    try:
        copy_to_clipboard(promo_text)
        print("\n[+] SUCCESS: Promotional text copied to your clipboard!")
    except Exception as e:
        print(f"\n[!] Clipboard Error: {e}")
        print("Please copy the text manually from the window above.")
        
    print("\n[i] Note: The launch promotion graphic has been saved to your BRL directory as:")
    print("    website_launch_promo.png")
    
    # Open Facebook
    fb_url = "https://www.facebook.com/BanditRacingLeague/posts"
    print(f"\n[+] Opening Facebook: {fb_url}")
    webbrowser.open(fb_url)
    print("=" * 60)

if __name__ == "__main__":
    main()
