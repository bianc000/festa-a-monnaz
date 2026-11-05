import zlib, struct, os

def unfilter_scanlines(raw_data, w, h, bytes_per_pixel):
    stride = w * bytes_per_pixel
    unfiltered = bytearray(h * stride)
    src_idx = 0
    prev_row = bytearray(stride)
    
    for y in range(h):
        filter_type = raw_data[src_idx]
        src_idx += 1
        curr_row = bytearray(stride)
        
        for x in range(stride):
            raw_val = raw_data[src_idx + x]
            a = curr_row[x - bytes_per_pixel] if x >= bytes_per_pixel else 0
            b = prev_row[x]
            c = prev_row[x - bytes_per_pixel] if x >= bytes_per_pixel else 0
            
            if filter_type == 0: # None
                recon = raw_val
            elif filter_type == 1: # Sub
                recon = (raw_val + a) & 0xFF
            elif filter_type == 2: # Up
                recon = (raw_val + b) & 0xFF
            elif filter_type == 3: # Average
                recon = (raw_val + ((a + b) >> 1)) & 0xFF
            elif filter_type == 4: # Paeth
                p = a + b - c
                pa = abs(p - a)
                pb = abs(p - b)
                pc = abs(p - c)
                if pa <= pb and pa <= pc:
                    pr = a
                elif pb <= pc:
                    pr = b
                else:
                    pr = c
                recon = (raw_val + pr) & 0xFF
            else:
                recon = raw_val
            curr_row[x] = recon
            
        unfiltered[y * stride : (y + 1) * stride] = curr_row
        prev_row = curr_row
        src_idx += stride
        
    return unfiltered

def read_png_rgba(path):
    with open(path, 'rb') as f:
        data = f.read()
    idx = 8
    idat = bytearray()
    w, h, bit_depth, color_type = 0, 0, 0, 0
    while idx < len(data):
        length = struct.unpack('>I', data[idx:idx+4])[0]
        ctype = data[idx+4:idx+8]
        cdata = data[idx+8:idx+8+length]
        if ctype == b'IHDR':
            w, h, bit_depth, color_type, _, _, _ = struct.unpack('>IIBBBBB', cdata)
        elif ctype == b'IDAT':
            idat.extend(cdata)
        idx += 12 + length
    raw = zlib.decompress(bytes(idat))
    
    bpp = 4 if color_type == 6 else 3
    unfiltered = unfilter_scanlines(raw, w, h, bpp)
    
    pixels = []
    for y in range(h):
        for x in range(w):
            offset = (y * w + x) * bpp
            if bpp == 3:
                r, g, b = unfiltered[offset], unfiltered[offset+1], unfiltered[offset+2]
                a = 255
            else:
                r, g, b, a = unfiltered[offset], unfiltered[offset+1], unfiltered[offset+2], unfiltered[offset+3]
            pixels.append((r, g, b, a))
    return w, h, pixels

def save_png_rgba(path, w, h, pixels):
    raw_bytes = bytearray()
    for y in range(h):
        raw_bytes.append(0) # None filter
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

def process():
    in_path = '/Users/anthonybianco/.gemini/antigravity/scratch/festa-a-monnaz/assets/sprites/full_party.png'
    out_dir = '/Users/anthonybianco/.gemini/antigravity/scratch/festa-a-monnaz/assets/sprites'
    w, h, pixels = read_png_rgba(in_path)
    print(f"Loaded image: {w}x{h}")
    
    # Threshold background: JPEG compression around white is typically > 240
    # Also floodfill from exterior to avoid removing white parts inside eyes/teeth/shirts if any
    bg_mask = [False] * (w * h)
    
    # First, mark any pixel that is near-white (R>245, G>245, B>245)
    for i, (r, g, b, a) in enumerate(pixels):
        if r > 240 and g > 240 and b > 240:
            bg_mask[i] = True
            
    # Flood-fill from borders to mark true exterior background
    is_exterior = [False] * (w * h)
    queue = []
    
    for x in range(w):
        if bg_mask[x]: # top row
            is_exterior[x] = True
            queue.append((x, 0))
        bottom_idx = (h - 1) * w + x
        if bg_mask[bottom_idx]:
            is_exterior[bottom_idx] = True
            queue.append((x, h - 1))
            
    for y in range(h):
        left_idx = y * w
        if bg_mask[left_idx]:
            is_exterior[left_idx] = True
            queue.append((0, y))
        right_idx = y * w + (w - 1)
        if bg_mask[right_idx]:
            is_exterior[right_idx] = True
            queue.append((w - 1, y))
            
    while queue:
        cx, cy = queue.pop()
        for dx, dy in ((-1,0), (1,0), (0,-1), (0,1)):
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h:
                nidx = ny * w + nx
                if not is_exterior[nidx] and bg_mask[nidx]:
                    is_exterior[nidx] = True
                    queue.append((nx, ny))
                    
    # Make exterior pixels fully transparent
    rgba_pixels = []
    for i, (r, g, b, a) in enumerate(pixels):
        if is_exterior[i]:
            rgba_pixels.append((0, 0, 0, 0))
        else:
            rgba_pixels.append((r, g, b, 255))
            
    # Find bounding boxes:
    # Mari is on the left half (x < 500), Leon is on the right half (x >= 500)
    def get_bbox(min_x_limit, max_x_limit):
        min_x, max_x = w, 0
        min_y, max_y = h, 0
        found = False
        for y in range(h):
            for x in range(min_x_limit, max_x_limit):
                _, _, _, a = rgba_pixels[y * w + x]
                if a > 0:
                    found = True
                    if x < min_x: min_x = x
                    if x > max_x: max_x = x
                    if y < min_y: min_y = y
                    if y > max_y: max_y = y
        return (min_x, min_y, max_x, max_y) if found else None

    mari_bbox = get_bbox(0, 500)
    leon_bbox = get_bbox(500, w)
    
    print(f"Mari BBox: {mari_bbox}")
    print(f"Leon BBox: {leon_bbox}")
    
    def crop_and_save(bbox, filename):
        x1, y1, x2, y2 = bbox
        # Add slight padding
        x1 = max(0, x1 - 4)
        y1 = max(0, y1 - 4)
        x2 = min(w - 1, x2 + 4)
        y2 = min(h - 1, y2 + 4)
        
        crop_w = x2 - x1 + 1
        crop_h = y2 - y1 + 1
        crop_pixels = []
        for y in range(y1, y2 + 1):
            for x in range(x1, x2 + 1):
                crop_pixels.append(rgba_pixels[y * w + x])
                
        out_path = os.path.join(out_dir, filename)
        save_png_rgba(out_path, crop_w, crop_h, crop_pixels)
        print(f"Saved {out_path} ({crop_w}x{crop_h})")

    crop_and_save(mari_bbox, 'mari_portrait.png')
    crop_and_save(leon_bbox, 'leon_portrait.png')

if __name__ == '__main__':
    process()
