with open('drivers.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the distracting 00 background watermark
content = content.replace('                    <div class="watermark-number">00</div>\n', '')
content = content.replace('<div class="watermark-number">00</div>', '')

# Increase the size limits for the custom number graphics
content = content.replace('min-height: 60px', 'min-height: 120px')
content = content.replace('max-height: 60px; max-width: 100px;', 'max-height: 120px; max-width: 200px;')

with open('drivers.html', 'w', encoding='utf-8') as f:
    f.write(content)
