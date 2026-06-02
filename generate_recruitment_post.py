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
    print("      BRL IRACING RECRUITMENT POST GENERATOR")
    print("=" * 60)
    
    recruitment_text = """🏁 **BANDIT RACING LEAGUE - NOW RECRUITING FOR SEASON 16!** 🏁
🏆 **16 Seasons of Established Sim Racing Legacy — Completely FREE to Join!**

Looking for highly competitive, clean, and organized oval racing? The Bandit Racing League (BRL) is officially enlisting drivers for our upcoming season running the **iRacing Craftsman Trucks**!

🟢 **Season Starts:** Wednesday, June 13th!
🟢 **License Requirement:** Oval C 1.0 or higher.
💰 **Entry Fee:** $0 (Completely Free!)

📺 **PROFESSIONAL BROADCASTS:**
Every race is broadcasted live by the pros at **SimTrax Broadcasting**! Get the real racing treatment with live commentary, scoring tickers, and full video coverage of the action.

📅 **WEEKLY LEAGUE SCHEDULE:**
• 🏎️ **Tuesday Nights (Practice & Mock Races):**
  - Hosted practice sessions open at 8:00 PM EST, featuring a 1/2 distance mock race to dial in setups and racecraft.
• 🏆 **Wednesday Nights (Official Race Nights):**
  - Pit Gates Open: 8:00 PM EST
  - Green Flag (Race Start): 9:15 PM EST

🛠️ **EXCLUSIVE LEAGUE TECHNOLOGY:**
All Bandit Racing League members get free access to our custom-built performance and utility software:
- **Free Driver & Spotter Web Apps:** Telemetry dashboards, strategy planners, and live spotter views to help you and your crew chief find the edge on track.

🔗 **HOW TO JOIN:**
Ready to claim your spot on the grid? Head over to our website to sign up and submit your league application:
👉 https://banditracingleague.net/

Find your new home in one of the most established leagues on iRacing. Join the Bandits today!

#iRacing #SimRacing #CraftsmanTrucks #BanditRacingLeague #iracingleague #SimTraxBroadcasting"""

    print("\n" + "-" * 50)
    print("RECRUITMENT POST TEXT:")
    print("-" * 50)
    try:
        print(recruitment_text)
    except UnicodeEncodeError:
        print(recruitment_text.encode('ascii', errors='replace').decode('ascii'))
    print("-" * 50)
    
    # Copy to Clipboard
    try:
        copy_to_clipboard(recruitment_text)
        print("\n[+] SUCCESS: Recruitment post text copied to your clipboard!")
    except Exception as e:
        print(f"\n[!] Clipboard Error: {e}")
        print("Please copy the text manually from the window above.")
        
    print("\n[i] Note: The custom recruitment graphic has been saved to your directory as:")
    print("    recruitment_banner.png")
    
    # Open Facebook Groups Feed (where iRacing groups usually live)
    fb_url = "https://www.facebook.com/groups/feed/"
    print(f"\n[+] Opening Facebook Groups Feed: {fb_url}")
    webbrowser.open(fb_url)
    print("=" * 60)

if __name__ == "__main__":
    main()
