import os
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
    print("=" * 60)
    print("      BRL FAN FANTASY LEAGUE PROMOTION GENERATOR")
    print("=" * 60)
    
    promo_text = """🔮 **BRL VIEWER FANTASY CHALLENGE - 100% FREE TO PLAY!** 🔮
👉 **https://banditracingleague.net/**

You don’t have to be behind the wheel to win the glory! Bandit Racing League has launched the official **Viewer Fantasy Challenge**, and it's open to anyone watching our live broadcasts!

🏆 **How It Works:**
1️⃣ **Pick Your Team:** Go to the website and choose your roster of 4 drivers before the green flag drops each Wednesday night.
2️⃣ **Watch Live:** Tune in to the SimTrax broadcasts and cheer your drivers on.
3️⃣ **Earn Points:** You earn fantasy points based on how your selected drivers finish, who gets the hard charger bonus, and who qualifies on pole!
4️⃣ **Climb the Ranks:** See your name rise on the live fantasy leaderboard and claim bragging rights as the ultimate crew chief!

⚡ **Why Play?**
* **Zero Entry Fee:** 100% free to play.
* **Easy to Join:** Just sign up with an email and submit your picks in seconds.
* **Interactive Dashboard:** Track live standings, driver performance histories, and your fantasy scoring trends.

Ready to test your predictions? Make your picks for the next race right now:
👉 **https://banditracingleague.net/**

#BanditRacingLeague #FantasyNASCAR #SimRacing #iRacing #Esports #NASCAR #FreeToPlay #FantasyLeague"""

    print("\n" + "-" * 50)
    print("FANTASY PROMOTIONAL POST TEXT:")
    print("-" * 50)
    try:
        print(promo_text)
    except UnicodeEncodeError:
        print(promo_text.encode('ascii', errors='replace').decode('ascii'))
    print("-" * 50)
    
    # 1. Copy Image to Desktop for Easy Upload
    base_dir = os.path.dirname(os.path.abspath(__file__))
    source_img = os.path.join(base_dir, "assets", "fantasy_league_promo.png")
    desktop = os.path.join(os.environ['USERPROFILE'], 'Desktop')
    dest_img = os.path.join(desktop, "BRL_Fantasy_Promo_Graphic.png")
    
    try:
        if os.path.exists(source_img):
            shutil.copy(source_img, dest_img)
            print(f"[+] SUCCESS: Copy of promo image saved to Desktop as: BRL_Fantasy_Promo_Graphic.png")
        else:
            print(f"[!] Warning: Source promo image not found at {source_img}")
    except Exception as e:
        print(f"[!] Error copying promo image: {e}")
        
    # 2. Copy Text to Clipboard
    try:
        copy_to_clipboard(promo_text)
        print("[+] SUCCESS: Promotional text copied to your clipboard!")
    except Exception as e:
        print(f"[!] Clipboard Error: {e}")
        print("Please copy the text manually from the window above.")
        
    # 3. Open Facebook URL
    fb_url = "https://www.facebook.com/profile.php?id=61585435839542"
    print(f"[+] Opening Facebook: {fb_url}")
    webbrowser.open(fb_url)
    print("=" * 60)

if __name__ == "__main__":
    main()
