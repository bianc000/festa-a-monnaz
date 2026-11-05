import zlib, struct, os

def hex_to_rgba(hex_str, alpha=255):
    hex_str = hex_str.lstrip('#')
    r, g, b = tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
    return (r, g, b, alpha)

def save_png(path, w, h, pixels):
    raw_bytes = bytearray()
    for y in range(h):
        raw_bytes.append(0)
        for x in range(w):
            r, g, b, a = pixels[y * w + x]
            raw_bytes.extend([r, g, b, a])
    compressed = zlib.compress(bytes(raw_bytes), 9)
    
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    png.extend(struct.pack('>I', len(ihdr)) + b'IHDR' + ihdr + struct.pack('>I', zlib.crc32(b'IHDR' + ihdr)))
    png.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', zlib.crc32(b'IDAT' + compressed)))
    png.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', zlib.crc32(b'IEND')))
    with open(path, 'wb') as f:
        f.write(png)

class Canvas:
    def __init__(self, w=32, h=40):
        self.w = w
        self.h = h
        self.pixels = [(0, 0, 0, 0)] * (w * h)
        
    def set(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.pixels[y * self.w + x] = c
            
    def rect(self, x1, y1, x2, y2, c):
        for y in range(min(y1, y2), max(y1, y2) + 1):
            for x in range(min(x1, x2), max(x1, x2) + 1):
                self.set(x, y, c)

    def outline_rect(self, x1, y1, x2, y2, c):
        for x in range(x1, x2 + 1):
            self.set(x, y1, c)
            self.set(x, y2, c)
        for y in range(y1, y2 + 1):
            self.set(x1, y, c)
            self.set(x2, y, c)

# Generate Gen 4 Pokemon Overworld Sprites (32x40)
def make_leon():
    c = Canvas(32, 40)
    outline = hex_to_rgba("#18181b")
    skin = hex_to_rgba("#fcd3a1")
    skin_sh = hex_to_rgba("#e0a36e")
    hair = hex_to_rgba("#5a341e")
    hair_high = hex_to_rgba("#7e4c2e")
    hair_dark = hex_to_rgba("#382012")
    shirt = hex_to_rgba("#1f1f24")
    shirt_high = hex_to_rgba("#32323a")
    logo = hex_to_rgba("#b67cfb") # VITALITY purple
    pants = hex_to_rgba("#2d3345")
    pants_sh = hex_to_rgba("#1e2230")
    shoes = hex_to_rgba("#18181b")
    shoes_white = hex_to_rgba("#e4e4e7")
    
    # Shadow
    c.rect(9, 37, 22, 39, hex_to_rgba("#000000", 70))
    
    # Shoes
    c.rect(10, 35, 14, 37, shoes)
    c.rect(17, 35, 21, 37, shoes)
    c.set(11, 36, shoes_white)
    c.set(18, 36, shoes_white)
    
    # Pants
    c.rect(10, 24, 14, 34, pants)
    c.rect(17, 24, 21, 34, pants)
    c.rect(13, 24, 18, 25, pants)
    c.rect(10, 24, 10, 34, pants_sh)
    c.rect(21, 24, 21, 34, pants_sh)
    
    # Shirt
    c.rect(9, 15, 22, 23, shirt)
    c.rect(11, 15, 20, 16, shirt_high)
    # VITALITY Logo on shirt
    c.rect(12, 18, 19, 19, logo)
    c.set(15, 20, logo)
    c.set(16, 20, logo)
    
    # Arms
    c.rect(7, 16, 8, 22, skin)
    c.rect(23, 16, 24, 22, skin)
    c.rect(7, 16, 8, 17, shirt)
    c.rect(23, 16, 24, 17, shirt)
    
    # Neck & Chin
    c.rect(14, 13, 17, 14, skin_sh)
    
    # Face
    c.rect(10, 6, 21, 13, skin)
    c.rect(10, 12, 21, 13, skin_sh)
    
    # Eyes & Smirk (from the drawing)
    c.set(12, 9, outline)
    c.set(13, 9, outline)
    c.set(18, 9, outline)
    c.set(19, 9, outline)
    c.set(13, 10, hex_to_rgba("#ffffff"))
    c.set(18, 10, hex_to_rgba("#ffffff"))
    # Smirk with teeth
    c.rect(14, 11, 17, 11, outline)
    c.set(15, 11, hex_to_rgba("#ffffff"))
    
    # Curly Wild Hair (exact like drawing!)
    # Base curls
    c.rect(8, 2, 23, 6, hair)
    # Curly bumps
    for bx, by in [(7,4), (6,3), (8,1), (11,0), (14,1), (17,0), (20,1), (23,2), (24,4), (24,6), (7,6)]:
        c.set(bx, by, hair_high)
        c.set(bx-1, by, hair_dark)
    c.rect(8, 6, 10, 9, hair)
    c.rect(21, 6, 23, 9, hair)
    c.rect(11, 2, 20, 4, hair_high)
    return c

def make_mari():
    c = Canvas(32, 40)
    skin = hex_to_rgba("#fce1cb")
    skin_sh = hex_to_rgba("#e6b797")
    hair = hex_to_rgba("#452319")
    hair_high = hex_to_rgba("#673627")
    hair_dark = hex_to_rgba("#2b130c")
    dress = hex_to_rgba("#432845")      # Deep purple from uploaded art
    dress_light = hex_to_rgba("#5b385e")
    dress_band = hex_to_rgba("#88446b") # Magenta/pink waist & hem bands
    shoes = hex_to_rgba("#382339")
    
    # Shadow
    c.rect(9, 37, 22, 39, hex_to_rgba("#000000", 70))
    
    # Shoes / Heels
    c.rect(11, 36, 14, 37, shoes)
    c.rect(17, 36, 20, 37, shoes)
    
    # Bare Legs
    c.rect(12, 30, 14, 35, skin)
    c.rect(17, 30, 19, 35, skin)
    
    # Purple Dress Flared Skirt
    c.rect(9, 21, 22, 29, dress)
    c.rect(8, 26, 23, 29, dress)
    # Magenta trim at bottom of dress
    c.rect(8, 29, 23, 30, dress_band)
    # Waist sash / band
    c.rect(11, 20, 20, 21, dress_band)
    
    # Dress Bodice
    c.rect(10, 14, 21, 19, dress)
    c.rect(12, 14, 19, 18, dress_light)
    
    # Arms with 3/4 sleeves
    c.rect(8, 15, 9, 20, dress)
    c.set(8, 20, dress_band)
    c.set(9, 20, dress_band)
    c.rect(8, 21, 9, 24, skin) # hand
    c.rect(22, 15, 23, 20, dress)
    c.set(22, 20, dress_band)
    c.set(23, 20, dress_band)
    c.rect(22, 21, 23, 24, skin)
    
    # Neck & Collar
    c.rect(13, 12, 18, 13, skin)
    c.set(12, 14, dress)
    c.set(19, 14, dress)
    
    # Face
    c.rect(11, 6, 20, 12, skin)
    c.rect(11, 11, 20, 12, skin_sh)
    
    # Eyes (pretty anime / Pokemon Gen 4 style)
    c.rect(12, 8, 14, 10, hex_to_rgba("#2b130c"))
    c.rect(17, 8, 19, 10, hex_to_rgba("#2b130c"))
    c.set(13, 8, hex_to_rgba("#ffffff"))
    c.set(18, 8, hex_to_rgba("#ffffff"))
    c.set(13, 9, hex_to_rgba("#7e3d2a"))
    c.set(18, 9, hex_to_rgba("#7e3d2a"))
    # Rosy cheeks
    c.set(11, 10, hex_to_rgba("#f48ba1", 180))
    c.set(20, 10, hex_to_rgba("#f48ba1", 180))
    # Sweet smile
    c.set(15, 11, hex_to_rgba("#c4586d"))
    c.set(16, 11, hex_to_rgba("#c4586d"))
    
    # Long Wavy Brown Hair (cascading over shoulders like art)
    c.rect(9, 2, 22, 5, hair)
    c.rect(11, 1, 20, 2, hair_high)
    # Side bangs
    c.rect(9, 5, 11, 11, hair)
    c.rect(20, 5, 22, 11, hair)
    # Flowing waves down back & shoulders
    c.rect(7, 9, 9, 25, hair)
    c.rect(22, 9, 24, 25, hair)
    c.rect(7, 23, 9, 26, hair_high)
    c.rect(22, 23, 24, 26, hair_high)
    return c

def make_maya():
    c = Canvas(32, 40)
    skin = hex_to_rgba("#fce4b8")
    skin_sh = hex_to_rgba("#dbb97f")
    hair = hex_to_rgba("#4a3227")
    hair_high = hex_to_rgba("#6d4c3d")
    sweater = hex_to_rgba("#6d28d9") # Loud purple
    dots = hex_to_rgba("#facc15")    # Yellow polka dots
    skirt = hex_to_rgba("#047857")   # Green skirt
    shoes = hex_to_rgba("#b45309")
    
    # Shadow
    c.rect(9, 37, 22, 39, hex_to_rgba("#000000", 70))
    c.rect(10, 35, 14, 37, shoes)
    c.rect(17, 35, 21, 37, shoes)
    c.rect(11, 28, 14, 34, skin)
    c.rect(17, 28, 20, 34, skin)
    # Skirt
    c.rect(9, 23, 22, 28, skirt)
    # Oversized Sweater
    c.rect(8, 14, 23, 23, sweater)
    # Polka dots
    c.set(10, 16, dots); c.set(14, 18, dots); c.set(18, 16, dots); c.set(21, 19, dots); c.set(12, 21, dots); c.set(16, 22, dots)
    c.rect(6, 15, 8, 21, sweater)
    c.rect(23, 15, 25, 21, sweater)
    c.rect(6, 21, 7, 23, skin)
    c.rect(24, 21, 25, 23, skin)
    # Face & Giant Round Glasses
    c.rect(10, 6, 21, 13, skin)
    c.outline_rect(10, 7, 14, 10, hex_to_rgba("#111111"))
    c.outline_rect(17, 7, 21, 10, hex_to_rgba("#111111"))
    c.set(15, 8, hex_to_rgba("#111111"))
    c.set(16, 8, hex_to_rgba("#111111"))
    c.set(12, 8, hex_to_rgba("#ffffff")) # glass shine
    c.set(19, 8, hex_to_rgba("#ffffff"))
    c.set(12, 9, hex_to_rgba("#000000"))
    c.set(19, 9, hex_to_rgba("#000000"))
    # Goofy big smile
    c.rect(13, 11, 18, 12, hex_to_rgba("#ffffff"))
    c.set(14, 11, hex_to_rgba("#999999"))
    c.set(16, 11, hex_to_rgba("#999999"))
    # Messy pigtails
    c.rect(9, 2, 22, 6, hair)
    c.rect(5, 3, 8, 7, hair)
    c.rect(23, 3, 26, 7, hair)
    c.set(6, 2, dots)
    c.set(25, 2, dots)
    return c

out_dir = '/Users/anthonybianco/.gemini/antigravity/scratch/festa-a-monnaz/assets/sprites'
save_png(os.path.join(out_dir, 'leon.png'), 32, 40, make_leon().pixels)
save_png(os.path.join(out_dir, 'mari.png'), 32, 40, make_mari().pixels)
save_png(os.path.join(out_dir, 'maya.png'), 32, 40, make_maya().pixels)
print("Saved Leon, Mari, Maya overworld sprites (32x40)")
