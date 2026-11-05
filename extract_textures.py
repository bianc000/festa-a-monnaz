from extract_pkmn_tiles import read_png, save_png, crop
import os

ref_path = '/Users/anthonybianco/.gemini/antigravity/scratch/festa-a-monnaz/assets/sprites/pokemon_bedroom_ref.png'
out_dir = '/Users/anthonybianco/.gemini/antigravity/scratch/festa-a-monnaz/assets/sprites'

w, h, px = read_png(ref_path)

# Crop floor tile: clean planks around x=60-91, y=80-95 (32x16)
cw, ch, cpx = crop(px, w, h, 60, 80, 91, 95)
save_png(os.path.join(out_dir, 'pkmn_floor.png'), cw, ch, cpx)
print(f"Saved pkmn_floor.png: {cw}x{ch}")

# Crop wall tile: vertical slats around x=130-161, y=25-48 (32x24)
cw, ch, cpx = crop(px, w, h, 130, 25, 161, 48)
save_png(os.path.join(out_dir, 'pkmn_wall.png'), cw, ch, cpx)
print(f"Saved pkmn_wall.png: {cw}x{ch}")
