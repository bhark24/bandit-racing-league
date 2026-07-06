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
    print("        BRL CHARLOTTE RACE PROMOTION POST GENERATOR")
    print("=" * 60)
    
    post_text = """🏁 **BANDIT RACING LEAGUE - CHARLOTTE 120 PREVIEW** 🏁
📺 Live Broadcast: SimTrax Broadcasting
🛠️ Sponsor: Matco Tools by Patrick Morrison

The Bandits are BACK! After having last week off to celebrate America's 250th birthday, the Bandit Racing League returns to action this Wednesday, July 8th, for the **Matco Tools 120** at Charlotte Motor Speedway! 🇺🇸🏆

We are headed to the high-speed, high-banked 1.5-mile quad-oval for 120 laps under the lights in the Craftsman Trucks—and the championship battle is red-hot. 

🔥 **POINTS LEAD TIE!** 🔥
We enter Charlotte with a dead tie at the top of the standings after Johnathon Platt's dominant redemption win at Atlanta:
🥇 Johnathon Platt — 85 pts
🥇 Scott Sanderson — 85 pts
🥉 Bob Berry — 76 pts
4. Kevin Foster — 73 pts
5. Wes Fuller — 67 pts

With Platt and Sanderson locked in a dead heat, who will break the tie and take sole possession of the championship lead? Charlotte is known for intense drafting, tire wear, and dramatic late-race restarts. Every point, lap led, and qualifying position will be crucial!

🔮 **VIEWER FANTASY CHALLENGE - FREE TO PLAY!** 🔮
Don't forget to head over to the fantasy league to place your picks for this week's race! Pick your team of 4 drivers before the green flag drops this Wednesday night.
👉 Submit your picks here: https://banditracingleague.net/fantasy.html

💼 **SPONSOR SPOTLIGHT** 💼
A huge shoutout to this week's race sponsor, **Matco Tools by Patrick Morrison**! Thank you for supporting the Bandit Racing League! 🛠️⚡

🗓️ **RACE DETAILS** 🗓️
📍 Track: Charlotte Motor Speedway
🏁 Distance: 120 Laps (Craftsman Trucks)
📅 Date: Wednesday, July 8th
⏰ Time: 9:00 PM EST
📺 Broadcast: Live on SimTrax Broadcasting

Who is your pick to break the tie and win under the lights? Let us know in the comments! 👇

#BanditRacingLeague #iRacing #Esports #SimRacing #NASCAR #CraftsmanTrucks #CharlotteMotorSpeedway #MatcoTools #ChampionshipChase"""

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
