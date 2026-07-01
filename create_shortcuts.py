import os
import subprocess

def create_shortcut(target, name, workdir, icon=None):
    desktop = os.path.join(os.environ['USERPROFILE'], 'Desktop')
    shortcut_path = os.path.join(desktop, f"{name}.lnk")
    
    icon_line = f'$Shortcut.IconLocation = "{icon}"' if icon else ""
    
    # PowerShell command to create shortcut
    ps_cmd = f"""
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("{shortcut_path}")
    $Shortcut.TargetPath = "{target}"
    $Shortcut.WorkingDirectory = "{workdir}"
    {icon_line}
    $Shortcut.Save()
    """
    
    try:
        subprocess.run(["powershell", "-Command", ps_cmd], check=True)
        print(f"[+] Shortcut created successfully: {shortcut_path}")
    except Exception as e:
        print(f"[!] Error creating shortcut {name}: {e}")

if __name__ == "__main__":
    base_dir = r"C:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league"
    
    create_shortcut(
        target=os.path.join(base_dir, "GENERATE_SOCIAL_POST.bat"),
        name="Generate Weekly Social Post",
        workdir=base_dir,
        icon=os.path.join(base_dir, "assets", "bandit_icon.ico")
    )
    
    create_shortcut(
        target=os.path.join(base_dir, "AUTO_SYNC.bat"),
        name="League and Fantasy Sync",
        workdir=base_dir,
        icon=os.path.join(base_dir, "assets", "bandit_icon.ico")
    )

    create_shortcut(
        target=os.path.join(base_dir, "GENERATE_FANTASY_PROMO.bat"),
        name="Generate Fantasy League Promo",
        workdir=base_dir,
        icon=os.path.join(base_dir, "assets", "bandit_icon.ico")
    )
