import zlib
import struct
import os

def hex_to_rgba(hex_str, alpha=255):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 6:
        r, g, b = tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
        return (r, g, b, alpha)
    elif len(hex_str) == 8:
        return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4, 6))
    return (0, 0, 0, 0)

def create_png(width, height, pixel_data):
    raw_bytes = bytearray()
    for y in range(height):
        raw_bytes.append(0)
        for x in range(width):
            r, g, b, a = pixel_data[y * width + x]
            raw_bytes.extend([r, g, b, a])
            
    compressed = zlib.compress(bytes(raw_bytes), 9)
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', len(ihdr_data)))
    png.extend(b'IHDR')
    png.extend(ihdr_data)
    png.extend(struct.pack('>I', ihdr_crc))
    
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png.extend(struct.pack('>I', len(compressed)))
    png.extend(b'IDAT')
    png.extend(compressed)
    png.extend(struct.pack('>I', idat_crc))
    
    iend_crc = zlib.crc32(b'IEND')
    png.extend(struct.pack('>I', 0))
    png.extend(b'IEND')
    png.extend(struct.pack('>I', iend_crc))
    
    return bytes(png)

class PixelCanvas:
    def __init__(self, w=32, h=32):
        self.w = w
        self.h = h
        self.pixels = [(0, 0, 0, 0)] * (w * h)
        
    def set(self, x, y, color):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.pixels[y * self.w + x] = color
            
    def rect(self, x1, y1, x2, y2, color):
        for y in range(min(y1, y2), max(y1, y2) + 1):
            for x in range(min(x1, x2), max(x1, x2) + 1):
                self.set(x, y, color)
                
    def outline_rect(self, x1, y1, x2, y2, color):
        for x in range(x1, x2 + 1):
            self.set(x, y1, color)
            self.set(x, y2, color)
        for y in range(y1, y2 + 1):
            self.set(x1, y, color)
            self.set(x2, y, color)

def draw_base_human(c, skin="#F5D0A9", skin_shadow="#DDB088", 
                    hair_color="#4A2E18", hair_style="short",
                    torso_color="#3366CC", torso_accent=None,
                    legs_color="#223355", shoes_color="#111111",
                    gender="male", accessory=None):
    
    sk = hex_to_rgba(skin)
    sk_sh = hex_to_rgba(skin_shadow)
    hr = hex_to_rgba(hair_color)
    hr_light = hex_to_rgba(hair_color)
    # brighten slightly for highlight
    hr_high = (min(255, hr[0]+40), min(255, hr[1]+40), min(255, hr[2]+40), 255)
    tr = hex_to_rgba(torso_color)
    tr_sh = (max(0, tr[0]-40), max(0, tr[1]-40), max(0, tr[2]-40), 255)
    lg = hex_to_rgba(legs_color)
    sh = hex_to_rgba(shoes_color)
    eye = hex_to_rgba("#1A1A24")
    eye_white = hex_to_rgba("#FFFFFF")
    mouth = hex_to_rgba("#B85D5D")
    shadow_ground = hex_to_rgba("#000000", 60)

    # 1. Ground shadow
    c.rect(10, 30, 21, 31, shadow_ground)

    # 2. Shoes
    c.rect(11, 28, 14, 29, sh)
    c.rect(17, 28, 20, 29, sh)
    
    # 3. Legs / Pants / Skirt
    if hair_style == "dress" or accessory == "dress":
        c.rect(11, 20, 20, 24, tr) # dress bottom
        c.rect(12, 25, 14, 27, sk) # bare legs
        c.rect(17, 25, 19, 27, sk)
    else:
        c.rect(11, 20, 14, 27, lg)
        c.rect(17, 20, 20, 27, lg)
        c.rect(13, 20, 18, 21, lg) # crotch/belt

    # 4. Torso / Shirt
    c.rect(10, 13, 21, 19, tr)
    # Shading on sides
    c.rect(10, 13, 10, 19, tr_sh)
    c.rect(21, 13, 21, 19, tr_sh)

    # Arms
    c.rect(8, 14, 9, 19, tr)
    c.rect(22, 14, 23, 19, tr)
    # Hands
    c.rect(8, 20, 9, 21, sk)
    c.rect(22, 20, 23, 21, sk)

    # Accent or tie/necklace/stripe
    if torso_accent:
        acc_c = hex_to_rgba(torso_accent)
        c.rect(15, 13, 16, 19, acc_c)

    # 5. Neck
    c.rect(14, 11, 17, 12, sk_sh)

    # 6. Head / Face
    c.rect(11, 5, 20, 11, sk)
    c.rect(11, 10, 20, 11, sk_sh) # chin shadow

    # Eyes & Eyebrows
    if accessory == "glasses_big":
        # Maya glasses
        c.outline_rect(11, 6, 15, 9, hex_to_rgba("#111111"))
        c.outline_rect(16, 6, 20, 9, hex_to_rgba("#111111"))
        c.rect(13, 7, 14, 8, eye)
        c.rect(17, 7, 18, 8, eye)
        c.set(12, 7, eye_white)
        c.set(19, 7, eye_white)
        # Bridge
        c.set(15, 7, hex_to_rgba("#111111"))
        c.set(16, 7, hex_to_rgba("#111111"))
    elif accessory == "sunglasses":
        # Matti sunglasses
        c.rect(11, 6, 20, 8, hex_to_rgba("#111122"))
        c.set(13, 6, hex_to_rgba("#5588FF"))
        c.set(18, 6, hex_to_rgba("#5588FF"))
    else:
        # Standard eyes
        c.rect(12, 7, 13, 8, eye)
        c.rect(18, 7, 19, 8, eye)
        c.set(12, 7, eye_white)
        c.set(18, 7, eye_white)
        # Eyebrows
        c.rect(12, 5, 14, 5, hr)
        c.rect(17, 5, 19, 5, hr)

    # Blush for girls
    if gender == "female":
        blush = hex_to_rgba("#FF99AA", 180)
        c.set(11, 9, blush)
        c.set(20, 9, blush)

    # Mouth
    if accessory == "maya_braces":
        c.rect(14, 10, 17, 10, hex_to_rgba("#DDDDDD")) # shiny braces
        c.set(15, 10, hex_to_rgba("#FF0055"))
    else:
        c.rect(15, 10, 16, 10, mouth)

    # 7. Hair Styles
    if hair_style == "quiff": # Leon
        c.rect(10, 2, 21, 5, hr)
        c.rect(11, 1, 18, 2, hr_high)
        c.rect(9, 4, 10, 8, hr)
        c.rect(21, 4, 22, 7, hr)
    elif hair_style == "long_wavy": # Mari / Ara
        c.rect(10, 3, 21, 5, hr)
        c.rect(12, 2, 19, 3, hr_high)
        c.rect(8, 4, 10, 16, hr) # flowing down left
        c.rect(21, 4, 23, 16, hr) # flowing down right
        c.set(8, 17, hr)
        c.set(23, 17, hr)
    elif hair_style == "bob": # Lindi
        c.rect(10, 3, 21, 5, hr)
        c.rect(9, 4, 10, 12, hr)
        c.rect(21, 4, 22, 12, hr)
    elif hair_style == "curly": # Kri
        c.rect(9, 2, 22, 5, hr)
        c.set(8, 3, hr)
        c.set(23, 3, hr)
        c.set(10, 1, hr_high)
        c.set(15, 1, hr_high)
        c.set(20, 1, hr_high)
        c.rect(9, 5, 10, 7, hr)
        c.rect(21, 5, 22, 7, hr)
    elif hair_style == "cap_backward": # Ento
        cap_c = hex_to_rgba("#222222")
        c.rect(10, 2, 21, 5, cap_c)
        c.rect(8, 5, 11, 6, cap_c) # backward flap
        c.rect(9, 6, 10, 8, hr)
        c.rect(21, 6, 22, 8, hr)
    elif hair_style == "messy": # Bubi
        c.rect(9, 2, 22, 5, hr)
        c.set(9, 1, hr)
        c.set(14, 1, hr)
        c.set(18, 1, hr)
        c.rect(9, 5, 10, 8, hr)
        c.rect(21, 5, 22, 8, hr)
    elif hair_style == "slick": # Jelmo
        c.rect(10, 3, 21, 5, hr)
        c.rect(11, 2, 20, 3, hr)
        c.rect(10, 5, 10, 7, hr)
        c.rect(21, 5, 21, 7, hr)
    elif hair_style == "maya_buns": # Maya
        c.rect(10, 3, 21, 5, hr)
        # two messy buns/pigtails
        c.rect(6, 2, 9, 5, hr)
        c.rect(22, 2, 25, 5, hr)
        c.set(7, 1, hex_to_rgba("#FF00FF")) # hair ties
        c.set(24, 1, hex_to_rgba("#FF00FF"))
    else: # default short
        c.rect(10, 3, 21, 5, hr)
        c.rect(11, 2, 20, 3, hr_high)
        c.rect(9, 5, 10, 7, hr)
        c.rect(21, 5, 22, 7, hr)

    # 8. Extra accessories
    if accessory == "red_cup": # Kri
        c.rect(7, 18, 9, 21, hex_to_rgba("#EE2222"))
    elif accessory == "headphones": # Lollo DJ
        hp_c = hex_to_rgba("#9922EE")
        c.rect(9, 11, 10, 13, hp_c)
        c.rect(21, 11, 22, 13, hp_c)
        c.rect(11, 12, 20, 13, hp_c)
    elif accessory == "sparkles": # Mari
        sp_c = hex_to_rgba("#FFF59D")
        c.set(5, 5, sp_c)
        c.set(4, 6, sp_c)
        c.set(6, 6, sp_c)
        c.set(5, 7, sp_c)
        c.set(26, 8, sp_c)
        c.set(25, 9, sp_c)
        c.set(27, 9, sp_c)
        c.set(26, 10, sp_c)
    elif accessory == "chips_bag": # Bubi
        c.rect(6, 17, 9, 21, hex_to_rgba("#FFAA00"))
    elif accessory == "maya_sweater": # Maya
        # Polka dots on sweater
        c.set(12, 15, hex_to_rgba("#FFFF00"))
        c.set(18, 15, hex_to_rgba("#FFFF00"))
        c.set(15, 17, hex_to_rgba("#FFFF00"))

def generate_all_characters():
    out_dir = "/Users/anthonybianco/.gemini/antigravity/scratch/festa-a-monnaz/assets/sprites"
    os.makedirs(out_dir, exist_ok=True)
    
    chars = [
        {
            "id": "leon",
            "name": "Leon",
            "skin": "#F5D0A9", "skin_shadow": "#DDB088",
            "hair_color": "#2C1B10", "hair_style": "quiff",
            "torso_color": "#1E3A8A", "torso_accent": "#FFFFFF", # Navy stylish jacket over white tee
            "legs_color": "#1E293B", "shoes_color": "#0F172A",
            "gender": "male", "accessory": None
        },
        {
            "id": "mari",
            "name": "Mari",
            "skin": "#FFE0BD", "skin_shadow": "#ECC0A0",
            "hair_color": "#8B5A2B", "hair_style": "long_wavy",
            "torso_color": "#EC4899", "torso_accent": "#F472B6", # Stunning pink cocktail dress
            "legs_color": "#EC4899", "shoes_color": "#F43F5E",
            "gender": "female", "accessory": "sparkles"
        },
        {
            "id": "kri",
            "name": "Kri",
            "skin": "#F5D0A9", "skin_shadow": "#DDB088",
            "hair_color": "#4A3525", "hair_style": "curly",
            "torso_color": "#DC2626", "torso_accent": None, # Red host polo
            "legs_color": "#2563EB", "shoes_color": "#FFFFFF",
            "gender": "male", "accessory": "red_cup"
        },
        {
            "id": "maya",
            "name": "Maya",
            "skin": "#F3E5AB", "skin_shadow": "#D4C28D",
            "hair_color": "#5D4037", "hair_style": "maya_buns",
            "torso_color": "#7C3AED", "torso_accent": None, # Purple loud sweater
            "legs_color": "#059669", "shoes_color": "#D97706",
            "gender": "female", "accessory": "glasses_big"
        },
        {
            "id": "ento",
            "name": "Ento",
            "skin": "#FADBB7", "skin_shadow": "#DEB78E",
            "hair_color": "#3E2723", "hair_style": "cap_backward",
            "torso_color": "#15803D", "torso_accent": None, # Green hoodie
            "legs_color": "#334155", "shoes_color": "#0284C7",
            "gender": "male", "accessory": None
        },
        {
            "id": "matti",
            "name": "Matti",
            "skin": "#FADBB7", "skin_shadow": "#DEB78E",
            "hair_color": "#5D4037", "hair_style": "short",
            "torso_color": "#EA580C", "torso_accent": "#FED7AA", # Orange tee
            "legs_color": "#1E293B", "shoes_color": "#FFFFFF",
            "gender": "male", "accessory": "sunglasses"
        },
        {
            "id": "jona",
            "name": "Jona",
            "skin": "#F5D0A9", "skin_shadow": "#DDB088",
            "hair_color": "#2D3748", "hair_style": "short",
            "torso_color": "#1E40AF", "torso_accent": None, # Classic navy
            "legs_color": "#B45309", "shoes_color": "#451A03", # Khakis
            "gender": "male", "accessory": None
        },
        {
            "id": "pibe",
            "name": "Pibe",
            "skin": "#E0BB95", "skin_shadow": "#C49A72",
            "hair_color": "#1A202C", "hair_style": "quiff",
            "torso_color": "#38BDF8", "torso_accent": "#FFFFFF", # Albiceleste / sporty
            "legs_color": "#0F172A", "shoes_color": "#FACC15",
            "gender": "male", "accessory": None
        },
        {
            "id": "lollo",
            "name": "Lollo",
            "skin": "#F5D0A9", "skin_shadow": "#DDB088",
            "hair_color": "#4B5563", "hair_style": "short",
            "torso_color": "#4C1D95", "torso_accent": "#A78BFA", # DJ purple hoodie
            "legs_color": "#18181B", "shoes_color": "#E11D48",
            "gender": "male", "accessory": "headphones"
        },
        {
            "id": "roby",
            "name": "Roby",
            "skin": "#FFE0BD", "skin_shadow": "#ECC0A0",
            "hair_color": "#B45309", "hair_style": "short",
            "torso_color": "#059669", "torso_accent": None, # Emerald green
            "legs_color": "#374151", "shoes_color": "#FFFFFF",
            "gender": "male", "accessory": None
        },
        {
            "id": "lindi",
            "name": "Lindi",
            "skin": "#FFE0BD", "skin_shadow": "#ECC0A0",
            "hair_color": "#FBBF24", "hair_style": "bob", # Chic blonde bob
            "torso_color": "#0D9488", "torso_accent": "#F0FDFA", # Mint teal chic top
            "legs_color": "#F8FAFC", "shoes_color": "#0F766E",
            "gender": "female", "accessory": "dress"
        },
        {
            "id": "bubi",
            "name": "Bubi",
            "skin": "#F5D0A9", "skin_shadow": "#DDB088",
            "hair_color": "#78350F", "hair_style": "messy",
            "torso_color": "#F59E0B", "torso_accent": None, # Yellow party tee
            "legs_color": "#4B5563", "shoes_color": "#1F2937",
            "gender": "male", "accessory": "chips_bag"
        },
        {
            "id": "jelmo",
            "name": "Jelmo",
            "skin": "#F5D0A9", "skin_shadow": "#DDB088",
            "hair_color": "#111827", "hair_style": "slick",
            "torso_color": "#475569", "torso_accent": "#0F172A", # Charcoal sleek jacket
            "legs_color": "#1E293B", "shoes_color": "#0F172A",
            "gender": "male", "accessory": None
        },
        {
            "id": "ara",
            "name": "Ara",
            "skin": "#FFE0BD", "skin_shadow": "#ECC0A0",
            "hair_color": "#3B1E08", "hair_style": "long_wavy",
            "torso_color": "#FB7185", "torso_accent": "#FFE4E6", # Coral party dress
            "legs_color": "#FB7185", "shoes_color": "#BE185D",
            "gender": "female", "accessory": "dress"
        }
    ]

    for ch in chars:
        canvas = PixelCanvas(32, 32)
        draw_base_human(
            canvas,
            skin=ch["skin"],
            skin_shadow=ch["skin_shadow"],
            hair_color=ch["hair_color"],
            hair_style=ch["hair_style"],
            torso_color=ch["torso_color"],
            torso_accent=ch["torso_accent"],
            legs_color=ch["legs_color"],
            shoes_color=ch["shoes_color"],
            gender=ch["gender"],
            accessory=ch["accessory"]
        )
        if ch["id"] == "maya":
            # Add polka dots on maya sweater
            acc_c = hex_to_rgba("#FACC15")
            canvas.set(12, 15, acc_c)
            canvas.set(19, 15, acc_c)
            canvas.set(15, 18, acc_c)
            canvas.set(13, 17, acc_c)
            canvas.set(18, 17, acc_c)

        filepath = os.path.join(out_dir, f"{ch['id']}.png")
        with open(filepath, "wb") as f:
            f.write(create_png(32, 32, canvas.pixels))
        print(f"Generated sprite for {ch['name']} -> {filepath}")

if __name__ == "__main__":
    generate_all_characters()
