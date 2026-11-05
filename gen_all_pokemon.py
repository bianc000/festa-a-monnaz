import zlib, struct, os
from gen_pokemon_overworld import Canvas, save_png, hex_to_rgba

def make_char(hair_c, hair_high, skin_c, torso_c, torso_high, pants_c, shoes_c, style="trainer"):
    c = Canvas(32, 40)
    skin = hex_to_rgba(skin_c)
    skin_sh = hex_to_rgba(skin_c)
    skin_sh = (max(0, skin[0]-25), max(0, skin[1]-30), max(0, skin[2]-35), 255)
    hair = hex_to_rgba(hair_c)
    hair_h = hex_to_rgba(hair_high)
    torso = hex_to_rgba(torso_c)
    torso_h = hex_to_rgba(torso_high)
    pants = hex_to_rgba(pants_c)
    shoes = hex_to_rgba(shoes_c)
    outline = hex_to_rgba("#18181b")

    # Shadow
    c.rect(9, 37, 22, 39, hex_to_rgba("#000000", 70))
    # Shoes
    c.rect(10, 35, 14, 37, shoes)
    c.rect(17, 35, 21, 37, shoes)

    if style == "dress":
        c.rect(11, 28, 14, 34, skin)
        c.rect(17, 28, 20, 34, skin)
        c.rect(9, 21, 22, 28, torso)
        c.rect(8, 26, 23, 29, torso_h)
    else:
        c.rect(10, 24, 14, 34, pants)
        c.rect(17, 24, 21, 34, pants)
        c.rect(13, 24, 18, 25, pants)

    # Torso
    c.rect(9, 15, 22, 23, torso)
    c.rect(11, 15, 20, 17, torso_h)
    # Arms
    c.rect(7, 16, 8, 22, torso)
    c.rect(23, 16, 24, 22, torso)
    c.rect(7, 21, 8, 23, skin)
    c.rect(23, 21, 24, 23, skin)

    # Neck
    c.rect(13, 13, 18, 14, skin_sh)
    # Face
    c.rect(10, 6, 21, 13, skin)
    c.rect(10, 11, 21, 13, skin_sh)
    # Eyes
    c.set(12, 9, outline); c.set(13, 9, outline)
    c.set(18, 9, outline); c.set(19, 9, outline)
    c.set(13, 10, hex_to_rgba("#ffffff"))
    c.set(18, 10, hex_to_rgba("#ffffff"))
    # Smile
    c.set(15, 11, hex_to_rgba("#c4586d"))
    c.set(16, 11, hex_to_rgba("#c4586d"))

    # Hair
    c.rect(9, 2, 22, 5, hair)
    c.rect(11, 1, 20, 2, hair_h)
    c.rect(9, 5, 10, 9, hair)
    c.rect(21, 5, 22, 9, hair)

    if style == "cap": # Ento
        cap = hex_to_rgba("#1f2937")
        c.rect(9, 2, 22, 5, cap)
        c.rect(7, 5, 10, 6, cap)
    elif style == "sunglasses": # Matti
        c.rect(11, 8, 20, 10, hex_to_rgba("#111122"))
        c.set(13, 8, hex_to_rgba("#38bdf8"))
        c.set(18, 8, hex_to_rgba("#38bdf8"))
    elif style == "headphones": # Lollo
        hp = hex_to_rgba("#7c3aed")
        c.rect(8, 11, 10, 13, hp)
        c.rect(21, 11, 23, 13, hp)
        c.rect(10, 12, 21, 13, hp)
    elif style == "cup": # Kri
        c.rect(6, 19, 8, 22, hex_to_rgba("#ef4444"))
    elif style == "chips": # Bubi
        c.rect(6, 18, 8, 22, hex_to_rgba("#f59e0b"))

    return c

out_dir = '/Users/anthonybianco/.gemini/antigravity/scratch/festa-a-monnaz/assets/sprites'

chars = [
    ("kri", "#4a3525", "#6b4a35", "#fcd3a1", "#dc2626", "#ef4444", "#1e3a8a", "#ffffff", "cup"),
    ("ento", "#3e2723", "#5d3a33", "#fcd3a1", "#15803d", "#22c55e", "#334155", "#0284c7", "cap"),
    ("matti", "#5d4037", "#7d564a", "#fcd3a1", "#ea580c", "#fb923c", "#1e293b", "#ffffff", "sunglasses"),
    ("jona", "#2d3748", "#4a5568", "#fcd3a1", "#1e40af", "#3b82f6", "#b45309", "#451a03", "trainer"),
    ("pibe", "#1a202c", "#374151", "#e0bb95", "#38bdf8", "#7dd3fc", "#0f172a", "#facc15", "trainer"),
    ("lollo", "#4b5563", "#6b7280", "#fcd3a1", "#4c1d95", "#6d28d9", "#18181b", "#e11d48", "headphones"),
    ("roby", "#b45309", "#d97706", "#fce0bd", "#059669", "#10b981", "#374151", "#ffffff", "trainer"),
    ("lindi", "#fbbf24", "#fde047", "#fce0bd", "#0d9488", "#14b8a6", "#f0fdfa", "#0f766e", "dress"),
    ("bubi", "#78350f", "#92400e", "#fcd3a1", "#f59e0b", "#fbbf24", "#4b5563", "#1f2937", "chips"),
    ("jelmo", "#111827", "#1f2937", "#fcd3a1", "#475569", "#64748b", "#1e293b", "#0f172a", "trainer"),
    ("ara", "#3b1e08", "#583015", "#fce0bd", "#fb7185", "#fda4af", "#be185d", "#ffffff", "dress")
]

for cid, hc, hch, sk, tc, tch, pc, sc, st in chars:
    save_png(os.path.join(out_dir, f"{cid}.png"), 32, 40, make_char(hc, hch, sk, tc, tch, pc, sc, st).pixels)
    print(f"Updated Gen 4 Pokemon sprite for {cid}")
