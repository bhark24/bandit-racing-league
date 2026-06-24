import os
import subprocess

def create_shortcut(target, name, workdir):
    desktop = os.path.join(os.environ['USERPROFILE'], 'Desktop')
    shortcut_path = os.path.join(desktop, f"{name}.lnk")
    
    # PowerShell command to create shortcut
    ps_cmd = f"""
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("{shortcut_path}")
    $Shortcut.TargetPath = "{target}"
    $Shortcut.WorkingDirectory = "{workdir}"
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
        workdir=base_dir
    )
    
    create_shortcut(
        target=os.path.join(base_dir, "GENERATE_PROMO_POST.bat"),
        name="Generate Website Promo Post",
        workdir=base_dir
    )
    
    create_shortcut(
        target=os.path.join(base_dir, "AUTO_UPDATE.bat"),
        name="Update League and Fantasy",
        workdir=base_dir
    )
