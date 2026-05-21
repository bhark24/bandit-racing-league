import qrcode
from PIL import Image

try:
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=4)
    qr.add_data('https://discord.gg/zXjvS9en')
    qr.make(fit=True)

    img = qr.make_image(fill_color="#00ff00", back_color="#111111").convert('RGB')
    
    # Save it to the assets folder
    output_path = r"c:\Users\Bill\.gemini\antigravity\scratch\bandit_racing_league\assets\discord-qr.png"
    img.save(output_path)
    print(f"Successfully generated QR code at: {output_path}")

except Exception as e:
    print(f"Error: {e}")
