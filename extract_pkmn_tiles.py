import zlib, struct, os

def unfilter_scanlines(raw_data, w, h, bpp):
    stride = w * bpp
    unfiltered = bytearray(h * stride)
    src_idx = 0
    prev_row = bytearray(stride)
    for y in range(h):
        filter_type = raw_data[src_idx]
        src_idx += 1
        curr_row = bytearray(stride)
        for x in range(stride):
            raw_val = raw_data[src_idx + x]
            a = curr_row[x - bpp] if x >= bpp else 0
            b = prev_row[x]
            c = prev_row[x - bpp] if x >= bpp else 0
            if filter_type == 0: recon = raw_val
            elif filter_type == 1: recon = (raw_val + a) & 0xFF
            elif filter_type == 2: recon = (raw_val + b) & 0xFF
            elif filter_type == 3: recon = (raw_val + ((a + b) >> 1)) & 0xFF
            elif filter_type == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                recon = (raw_val + pr) & 0xFF
            else: recon = raw_val
            curr_row[x] = recon
        unfiltered[y * stride : (y + 1) * stride] = curr_row
        prev_row = curr_row
        src_idx += stride
    return unfiltered

def read_png(path):
    with open(path, 'rb') as f: data = f.read()
    idx = 8
    idat = bytearray()
    w, h = 0, 0
    while idx < len(data):
        length = struct.unpack('>I', data[idx:idx+4])[0]
        ctype = data[idx+4:idx+8]
        cdata = data[idx+8:idx+8+length]
        if ctype == b'IHDR':
            w, h, _, color_type = struct.unpack('>IIBB', cdata[:10])
        elif ctype == b'IDAT':
            idat.extend(cdata)
        idx += 12 + length
    bpp = 4 if color_type == 6 else 3
    raw = zlib.decompress(bytes(idat))
    unfiltered = unfilter_scanlines(raw, w, h, bpp)
    pixels = []
    for y in range(h):
        for x in range(w):
            offset = (y * w + x) * bpp
            if bpp == 4:
                pixels.append((unfiltered[offset], unfiltered[offset+1], unfiltered[offset+2], unfiltered[offset+3]))
            else:
                pixels.append((unfiltered[offset], unfiltered[offset+1], unfiltered[offset+2], 255))
    return w, h, pixels

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
    with open(path, 'wb') as f: f.write(png)

def crop(src_pixels, sw, sh, x1, y1, x2, y2):
    cw = x2 - x1 + 1
    ch = y2 - y1 + 1
    res = []
    for y in range(y1, y2 + 1):
        for x in range(x1, x2 + 1):
            res.append(src_pixels[y * sw + x])
    return cw, ch, res

ref_path = '/Users/anthonybianco/.gemini/antigravity/scratch/festa-a-monnaz/assets/sprites/pokemon_bedroom_ref.png'
out_dir = '/Users/anthonybianco/.gemini/antigravity/scratch/festa-a-monnaz/assets/sprites'

w, h, px = read_png(ref_path)
print(f"Read ref: {w}x{h}")

# In 200x150:
# TV & Wii: approx x: 50 to 100, y: 35 to 70
# PC desk: approx x: 20 to 52, y: 35 to 80
# Rug: approx x: 50 to 115, y: 90 to 130
# Bed: approx x: 140 to 175, y: 100 to 142
# Stairs: approx x: 130 to 180, y: 45 to 80
# Plant: approx x: 18 to 38, y: 108 to 142
# Window & Clock: approx x: 80 to 120, y: 10 to 45

crops = {
    'pkmn_tv.png': (53, 36, 100, 68),
    'pkmn_pc_desk.png': (20, 36, 52, 78),
    'pkmn_rug.png': (54, 93, 115, 130),
    'pkmn_bed.png': (142, 100, 172, 142),
    'pkmn_stairs.png': (132, 46, 178, 76),
    'pkmn_plant.png': (20, 108, 37, 142),
    'pkmn_window.png': (82, 10, 120, 45)
}

for name, (x1, y1, x2, y2) in crops.items():
    cw, ch, cpx = crop(px, w, h, x1, y1, x2, y2)
    save_png(os.path.join(out_dir, name), cw, ch, cpx)
    print(f"Saved {name}: {cw}x{ch}")
