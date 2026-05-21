import os

def replace_in_file(filepath, old_text, new_text):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old_text, new_text)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('index.html', 'assets/numbers/', 'assets/drivers numbers/')
replace_in_file('drivers.html', 'assets/numbers/', 'assets/drivers numbers/')

replace_in_file('index.html', 'TransDaytona.png', 'Daytona_Clean.png')
replace_in_file('index.html', 'filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(153, 255, 51, 0.8));', 'filter: drop-shadow(0 0 8px rgba(153, 255, 51, 0.8));')
