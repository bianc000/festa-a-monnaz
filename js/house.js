// Pokemon Perla (Gen 4 Sinnoh) House & Tileset Engine

class House {
  constructor() {
    this.width = 1200;
    this.height = 900;

    // Rooms (Sinnoh Villa in Monnaz)
    this.rooms = [
      {
        id: 'living_room',
        name: 'Salone delle Feste (Sinnoh Villa)',
        desc: 'Musica a tutto volume, pista da ballo stile Gara Pokémon di Cuoripoli!',
        x: 40, y: 350, w: 460, h: 360,
        floorType: 'wood_dark',
        carpet: { x: 100, y: 550, w: 180, h: 120, color: '#881337', border: '#fbbf24' }
      },
      {
        id: 'kitchen',
        name: 'Cucina & Zona Poffin',
        desc: 'Bancone in marmo, frigo ben fornito e torneo di Beer Pong!',
        x: 40, y: 60, w: 460, h: 250,
        floorType: 'checkers',
        carpet: null
      },
      {
        id: 'hallway',
        name: 'Corridoio Principale',
        desc: 'Collega le ali della villa. Attento a Maya che fa la ronda!',
        x: 540, y: 60, w: 160, h: 650,
        floorType: 'wood_light',
        carpet: { x: 570, y: 80, w: 100, h: 610, color: '#1e3a8a', border: '#93c5fd' }
      },
      {
        id: 'bedroom',
        name: 'Camera Relax (Stile Villa di Evopoli)',
        desc: 'Letto accogliente, TV con Nintendo e luce soffusa. Il posto perfetto per restare soli!',
        x: 740, y: 60, w: 420, h: 280,
        floorType: 'wood_warm',
        carpet: { x: 880, y: 160, w: 160, h: 120, color: '#581c87', border: '#f472b6' }
      },
      {
        id: 'bathroom',
        name: 'Bagno della Villa',
        desc: 'Piastrelle azzurre e specchio illuminato.',
        x: 740, y: 380, w: 180, h: 160,
        floorType: 'tiles_blue',
        carpet: null
      },
      {
        id: 'balcony',
        name: 'Terrazza Panoramica sul Lago Verità',
        desc: 'Brezza notturna, silhouette del Monte Corona e stelle scintillanti. Atmosfera 100% romantica!',
        x: 740, y: 580, w: 420, h: 260,
        floorType: 'stone_deck',
        carpet: null
      },
      {
        id: 'garden',
        name: 'Giardino Fiorito di Sinnoh',
        desc: 'Erba soffice, siepi curate e lucine calde sospese.',
        x: 40, y: 750, w: 460, h: 120,
        floorType: 'sinnoh_grass',
        carpet: null
      }
    ];

    // Solid Walls
    this.walls = [
      { x: 30, y: 40, w: 1150, h: 24 },
      { x: 30, y: 880, w: 1150, h: 24 },
      { x: 20, y: 40, w: 24, h: 850 },
      { x: 1170, y: 40, w: 24, h: 850 },

      // Dividers
      { x: 500, y: 50, w: 30, h: 260 },
      { x: 500, y: 400, w: 30, h: 480 },

      { x: 700, y: 50, w: 30, h: 180 },
      { x: 700, y: 300, w: 30, h: 320 },
      { x: 700, y: 680, w: 30, h: 200 },

      { x: 30, y: 310, w: 480, h: 24 },
      { x: 30, y: 720, w: 480, h: 24 },
      { x: 730, y: 340, w: 440, h: 24 },
      { x: 730, y: 540, w: 440, h: 24 },
      { x: 920, y: 360, w: 24, h: 190 }
    ];

    // Doors with Pokemon-style door mat indicators
    this.doors = [
      {
        id: 'door_bedroom',
        room: 'bedroom',
        x: 700, y: 230, w: 28, h: 70,
        isOpen: false,
        name: 'Porta Camera Relax'
      },
      {
        id: 'door_balcony',
        room: 'balcony',
        x: 700, y: 620, w: 28, h: 60,
        isOpen: true,
        name: 'Portafinestra Terrazza'
      },
      {
        id: 'door_living',
        room: 'living_room',
        x: 500, y: 310, w: 28, h: 90,
        isOpen: true,
        name: 'Arco Salone'
      },
      {
        id: 'door_bathroom',
        room: 'bathroom',
        x: 700, y: 410, w: 28, h: 60,
        isOpen: false,
        name: 'Porta Bagno'
      },
      {
        id: 'door_garden',
        room: 'garden',
        x: 230, y: 710, w: 80, h: 24,
        isOpen: true,
        name: 'Uscita Giardino'
      }
    ];

    // Rich Pokemon Perla Furniture
    this.furniture = [
      // Kitchen
      { id: 'fridge', name: 'Frigo Sinnoh', x: 60, y: 70, w: 56, h: 70, type: 'fridge', isInteractive: true, action: 'fridge' },
      { id: 'kitchen_sink', name: 'Lavello & Fornelli', x: 120, y: 70, w: 160, h: 56, type: 'counter' },
      { id: 'beer_pong', name: 'Tavolo Beer Pong Pokéball', x: 150, y: 160, w: 190, h: 76, type: 'beer_pong', isInteractive: true, action: 'beer_pong' },
      { id: 'kitchen_plant', name: 'Pianta in Vaso', x: 440, y: 70, w: 40, h: 48, type: 'plant' },

      // Living Room
      { id: 'dj_booth', name: 'Consolle DJ Cuoripoli', x: 60, y: 370, w: 140, h: 64, type: 'dj', isInteractive: true, action: 'dj_booth' },
      { id: 'dancefloor', name: 'Pedana Gara Pokémon', x: 230, y: 380, w: 180, h: 140, type: 'dancefloor', isFloorDecor: true },
      { id: 'sofa1', name: 'Divano in Pelle Marrone', x: 80, y: 550, w: 160, h: 64, type: 'sofa' },
      { id: 'coffee_table', name: 'Tavolino in Noce', x: 100, y: 630, w: 120, h: 44, type: 'table' },
      { id: 'bookshelf_living', name: 'Libreria di Sinnoh', x: 430, y: 560, w: 60, h: 90, type: 'bookshelf' },
      { id: 'plant_living', name: 'Ficus da Interno', x: 60, y: 650, w: 36, h: 46, type: 'plant' },

      // Bedroom
      { id: 'bed', name: 'Letto Matrimoniale Pokémon', x: 920, y: 70, w: 160, h: 150, type: 'bed' },
      { id: 'nightstand', name: 'Comodino Lampada Pokéball', x: 865, y: 70, w: 46, h: 46, type: 'nightstand' },
      { id: 'tv_console', name: 'Mobile TV & Console Wii', x: 760, y: 70, w: 80, h: 54, type: 'tv' },
      { id: 'guitar', name: 'Chitarra di Cuoripoli', x: 1110, y: 240, w: 32, h: 44, type: 'guitar', isInteractive: true, action: 'guitar' },
      { id: 'bookshelf_bed', name: 'Scaffale Guide Pokémon', x: 760, y: 150, w: 50, h: 80, type: 'bookshelf' },

      // Bathroom
      { id: 'sink', name: 'Lavabo con Specchiera', x: 830, y: 385, w: 60, h: 48, type: 'bathroom_sink' },
      { id: 'toilet', name: 'Sanitario', x: 840, y: 475, w: 44, h: 50, type: 'toilet' },

      // Balcony
      { id: 'balcony_bench', name: 'Panchina in Legno Sinnoh', x: 920, y: 730, w: 130, h: 48, type: 'bench' },
      { id: 'telescope', name: 'Telescopio Astronomico', x: 1090, y: 610, w: 48, h: 48, type: 'telescope', isInteractive: true, action: 'telescope' },
      { id: 'balcony_lights', name: 'Lanterne di Cuoripoli', x: 760, y: 580, w: 360, h: 20, type: 'lanterns', isFloorDecor: true },

      // Garden
      { id: 'garden_flowers', name: 'Aiuola di Fiori Sinnoh', x: 60, y: 780, w: 420, h: 60, type: 'flowers', isFloorDecor: true }
    ];

    this.animTime = 0;
  }

  getRoomAt(x, y) {
    for (const r of this.rooms) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        return r;
      }
    }
    return { id: 'unknown', name: 'Villa di Kri', desc: 'Monnaz' };
  }

  isColliding(x, y, radius = 14) {
    for (const w of this.walls) {
      if (x + radius > w.x && x - radius < w.x + w.w && y + radius > w.y && y - radius < w.y + w.h) {
        return true;
      }
    }
    for (const d of this.doors) {
      if (!d.isOpen) {
        if (x + radius > d.x && x - radius < d.x + d.w && y + radius > d.y && y - radius < d.y + d.h) {
          return true;
        }
      }
    }
    for (const f of this.furniture) {
      if (f.isFloorDecor) continue;
      if (x + radius > f.x && x - radius < f.x + f.w && y + radius > f.y && y - radius < f.y + f.h) {
        return true;
      }
    }
    return false;
  }

  getInteractiveNear(x, y, maxDist = 55) {
    for (const d of this.doors) {
      const cx = d.x + d.w / 2;
      const cy = d.y + d.h / 2;
      if (Math.hypot(x - cx, y - cy) < maxDist) {
        return { type: 'door', item: d };
      }
    }
    for (const f of this.furniture) {
      if (!f.isInteractive) continue;
      const cx = f.x + f.w / 2;
      const cy = f.y + f.h / 2;
      if (Math.hypot(x - cx, y - cy) < maxDist) {
        return { type: 'furniture', item: f };
      }
    }
    return null;
  }

  render(ctx) {
    this.animTime += 0.04;

    // 1. Draw Sinnoh Rooms & Floors
    for (const r of this.rooms) {
      this.drawRoomFloor(ctx, r);
      if (r.carpet) {
        this.drawCarpet(ctx, r.carpet);
      }
    }

    // 2. Balcony Night Landscape (Sinnoh Mt. Coronet & Lake Verity silhouette)
    const balc = this.rooms.find(rm => rm.id === 'balcony');
    if (balc) {
      this.drawBalconySky(ctx, balc);
    }

    // 3. Draw Furniture with Sinnoh details
    for (const f of this.furniture) {
      this.drawFurnitureItem(ctx, f);
    }

    // 4. Draw Sinnoh Wall Trims & Wainscoting
    this.drawWalls(ctx);

    // 5. Draw Doors with Pokemon mats
    this.drawDoors(ctx);
  }

  drawRoomFloor(ctx, r) {
    if (r.floorType === 'wood_dark' || r.floorType === 'wood_light' || r.floorType === 'wood_warm') {
      const base = (r.floorType === 'wood_dark') ? '#422a1d' : (r.floorType === 'wood_warm') ? '#6b4226' : '#855230';
      const plankHighlight = (r.floorType === 'wood_dark') ? '#543727' : '#99613a';
      const plankShadow = '#24160d';

      ctx.fillStyle = base;
      ctx.fillRect(r.x, r.y, r.w, r.h);

      // Plank seams (horizontal 16px planks with staggered vertical joints)
      const plankH = 16;
      const plankW = 48;
      ctx.lineWidth = 1;

      for (let y = r.y; y < r.y + r.h; y += plankH) {
        ctx.strokeStyle = plankShadow;
        ctx.beginPath();
        ctx.moveTo(r.x, y);
        ctx.lineTo(r.x + r.w, y);
        ctx.stroke();

        ctx.strokeStyle = plankHighlight;
        ctx.beginPath();
        ctx.moveTo(r.x, y + 1);
        ctx.lineTo(r.x + r.w, y + 1);
        ctx.stroke();

        const offset = ((y - r.y) / plankH) % 2 * (plankW / 2);
        for (let x = r.x + offset; x < r.x + r.w; x += plankW) {
          ctx.strokeStyle = plankShadow;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + plankH);
          ctx.stroke();
        }
      }
    } else if (r.floorType === 'checkers') {
      // Sinnoh Kitchen Checkers
      const tileSize = 24;
      for (let y = r.y; y < r.y + r.h; y += tileSize) {
        for (let x = r.x; x < r.x + r.w; x += tileSize) {
          const isEven = (Math.floor((x - r.x)/tileSize) + Math.floor((y - r.y)/tileSize)) % 2 === 0;
          ctx.fillStyle = isEven ? '#cbd5e1' : '#475569';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }
    } else if (r.floorType === 'tiles_blue') {
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      for (let tx = r.x; tx < r.x + r.w; tx += 20) {
        for (let ty = r.y; ty < r.y + r.h; ty += 20) {
          ctx.strokeRect(tx, ty, 20, 20);
        }
      }
    } else if (r.floorType === 'stone_deck') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = '#475569';
      for (let ty = r.y; ty < r.y + r.h; ty += 18) {
        ctx.strokeRect(r.x, ty, r.w, 18);
      }
    } else if (r.floorType === 'sinnoh_grass') {
      // Sinnoh lush grass
      ctx.fillStyle = '#15803d';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      // Grass tufts
      ctx.fillStyle = '#22c55e';
      for (let gy = r.y + 10; gy < r.y + r.h - 10; gy += 24) {
        for (let gx = r.x + 14; gx < r.x + r.w - 14; gx += 28) {
          ctx.fillRect(gx, gy, 4, 6);
          ctx.fillRect(gx - 2, gy + 2, 8, 4);
        }
      }
    }

    // Room Name Banner (Sinnoh style badge on floor)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(r.x + 10, r.y + 8, r.name.length * 8 + 16, 20);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillText(`✨ ${r.name.toUpperCase()}`, r.x + 16, r.y + 22);
  }

  drawCarpet(ctx, c) {
    // Outer border with gold fringe
    ctx.fillStyle = c.border;
    ctx.fillRect(c.x - 4, c.y - 4, c.w + 8, c.h + 8);
    // Inner velvet
    ctx.fillStyle = c.color;
    ctx.fillRect(c.x, c.y, c.w, c.h);
    // Diamond center pattern
    ctx.strokeStyle = c.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x + 8, c.y + 8, c.w - 16, c.h - 16);
  }

  drawBalconySky(ctx, balc) {
    const skyX = balc.x + balc.w - 140;
    const skyW = 140;

    // Gradient Sinnoh night sky
    const skyGrad = ctx.createLinearGradient(skyX, balc.y, skyX, balc.y + balc.h);
    skyGrad.addColorStop(0, '#09091f');
    skyGrad.addColorStop(0.6, '#1e1b4b');
    skyGrad.addColorStop(1, '#064e3b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(skyX, balc.y, skyW, balc.h);

    // Stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 30; i++) {
      const sx = skyX + 10 + (i * 37) % (skyW - 20);
      const sy = balc.y + 8 + (i * 23) % (balc.h - 80);
      const twinkle = Math.sin(this.animTime * 3 + i) > 0.2 ? 2 : 1;
      ctx.fillRect(sx, sy, twinkle, twinkle);
    }

    // Mt. Coronet Silhouette
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(skyX, balc.y + balc.h);
    ctx.lineTo(skyX + 30, balc.y + 110);
    ctx.lineTo(skyX + 65, balc.y + 60); // Peak
    ctx.lineTo(skyX + 100, balc.y + 130);
    ctx.lineTo(skyX + skyW, balc.y + 90);
    ctx.lineTo(skyX + skyW, balc.y + balc.h);
    ctx.closePath();
    ctx.fill();

    // Lake Verity reflection
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(skyX, balc.y + balc.h - 35, skyW, 35);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(skyX + 20, balc.y + balc.h - 22, 60, 2);
    ctx.fillRect(skyX + 50, balc.y + balc.h - 14, 70, 2);

    // Balcony Railing
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(skyX, balc.y);
    ctx.lineTo(skyX, balc.y + balc.h);
    ctx.stroke();

    for (let ry = balc.y + 10; ry < balc.y + balc.h; ry += 20) {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(skyX - 4, ry);
      ctx.lineTo(skyX + 4, ry);
      ctx.stroke();
    }
  }

  drawFurnitureItem(ctx, f) {
    if (f.type === 'dancefloor') {
      // Hearthome Contest Dancefloor
      const pulseHue = (this.animTime * 60) % 360;
      ctx.fillStyle = `hsl(${pulseHue}, 85%, 28%)`;
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(f.x, f.y, f.w, f.h);

      // Dancefloor spotlight disco circles
      for (let i = 0; i < 4; i++) {
        const cx = f.x + 45 + (i % 2) * 90;
        const cy = f.y + 35 + Math.floor(i / 2) * 70;
        ctx.fillStyle = `rgba(254, 240, 138, ${0.2 + Math.sin(this.animTime * 3 + i) * 0.15})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillText('🎶 PISTA DI CUORIPOLI 🎶', f.x + 14, f.y + f.h / 2 + 4);
      return;
    }

    if (f.type === 'fridge') {
      // Pokemon Center style metallic fridge
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(f.x, f.y + 26, f.w, 2); // Split top freezer
      // Handles
      ctx.fillStyle = '#334155';
      ctx.fillRect(f.x + f.w - 10, f.y + 10, 4, 12);
      ctx.fillRect(f.x + f.w - 10, f.y + 36, 4, 20);
      // Magnet
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(f.x + 12, f.y + 8, 8, 8);
      ctx.fillStyle = '#fff';
      ctx.font = '9px monospace';
      ctx.fillText('FRIGO', f.x + 8, f.y + f.h - 8);
    } else if (f.type === 'counter') {
      // Marble Countertop with sink
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(f.x, f.y, f.w, f.h);
      // Sink
      ctx.fillStyle = '#475569';
      ctx.fillRect(f.x + 16, f.y + 10, 40, 34);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(f.x + 20, f.y + 14, 32, 26);
      // Stove burners
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(f.x + 90, f.y + 28, 14, 0, Math.PI * 2);
      ctx.arc(f.x + 130, f.y + 28, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (f.type === 'beer_pong') {
      // Red & Blue Pokeball cups
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(f.x, f.y, f.w, f.h);

      // Red cups (Pokeball style) on left
      for (let i = 0; i < 6; i++) {
        const cx = f.x + 20 + (i % 3) * 14;
        const cy = f.y + 22 + Math.floor(i / 3) * 18;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Blue cups on right
      for (let i = 0; i < 6; i++) {
        const cx = f.x + f.w - 48 + (i % 3) * 14;
        const cy = f.y + 22 + Math.floor(i / 3) * 18;
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px monospace';
      ctx.fillText('BEER PONG MS', f.x + 50, f.y + 42);
    } else if (f.type === 'dj') {
      ctx.fillStyle = '#3b0764';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.strokeStyle = '#a855f7';
      ctx.strokeRect(f.x, f.y, f.w, f.h);
      // Turntables
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(f.x + 35, f.y + 32, 20, 0, Math.PI * 2);
      ctx.arc(f.x + 105, f.y + 32, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(f.x + 35, f.y + 32, 6, 0, Math.PI * 2);
      ctx.arc(f.x + 105, f.y + 32, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '9px monospace';
      ctx.fillText('DJ LOLLO', f.x + 46, f.y + f.h - 6);
    } else if (f.type === 'bed') {
      // Sinnoh Luxury Bed
      ctx.fillStyle = '#581c87';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      // Pillows
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(f.x + 16, f.y + 12, 50, 32);
      ctx.fillRect(f.x + 94, f.y + 12, 50, 32);
      // Duvet fold
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(f.x, f.y + 50, f.w, f.h - 50);
      ctx.strokeStyle = '#fbbf24';
      ctx.strokeRect(f.x + 6, f.y + 56, f.w - 12, f.h - 62);
    } else if (f.type === 'tv') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      // TV Screen
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(f.x + 6, f.y + 6, f.w - 12, 28);
      // Wii console on bottom shelf
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(f.x + 14, f.y + 38, 20, 8);
    } else if (f.type === 'bookshelf') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      // Colorful books
      const bColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];
      for (let by = f.y + 8; by < f.y + f.h - 10; by += 24) {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(f.x + 4, by + 18, f.w - 8, 4);
        for (let bx = f.x + 6; bx < f.x + f.w - 10; bx += 8) {
          ctx.fillStyle = bColors[(bx + by) % bColors.length];
          ctx.fillRect(bx, by, 6, 18);
        }
      }
    } else if (f.type === 'plant') {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(f.x + 8, f.y + 24, f.w - 16, f.h - 24); // Pot
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 14, 16, 0, Math.PI * 2);
      ctx.fill();
    } else if (f.type === 'sofa') {
      ctx.fillStyle = '#713f12';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(f.x + 6, f.y + 10, f.w - 12, f.h - 20);
    } else if (f.type === 'table') {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      // Cups on table
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(f.x + 20, f.y + 12, 10, 10);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(f.x + 80, f.y + 12, 10, 10);
    } else if (f.type === 'bench') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.strokeStyle = '#92400e';
      for (let by = f.y + 6; by < f.y + f.h; by += 10) {
        ctx.strokeRect(f.x, by, f.w, 4);
      }
    } else if (f.type === 'telescope') {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(f.x + 24, f.y + 24, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(f.x + 20, f.y + 8, 8, 32);
    }

    if (f.isInteractive) {
      // Sinnoh Sparkling Item / Poké-Icon indicator
      const pulse = Math.sin(this.animTime * 5) * 2;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(f.x + f.w - 8, f.y + 8, 4 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(f.x + f.w - 9, f.y + 7, 2, 2);
    }
  }

  drawWalls(ctx) {
    // Pokemon Gen 4 Dual-tone Walls (wood wainscot bottom, patterned wallpaper top)
    for (const w of this.walls) {
      // Base Wall
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(w.x, w.y, w.w, w.h);

      // Crown moulding top
      ctx.fillStyle = '#475569';
      ctx.fillRect(w.x, w.y, w.w, 4);

      // Wooden wainscoting bottom
      ctx.fillStyle = '#78350f';
      ctx.fillRect(w.x, w.y + w.h - 6, w.w, 6);

      // Border outline
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(w.x, w.y, w.w, w.h);
    }
  }

  drawDoors(ctx) {
    for (const d of this.doors) {
      // Doormat (Sinnoh style welcome mat)
      ctx.fillStyle = d.isOpen ? '#059669' : '#b45309';
      ctx.fillRect(d.x - 4, d.y + 4, d.w + 8, d.h - 8);

      if (d.isOpen) {
        ctx.strokeStyle = '#34d399';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(d.x, d.y, d.w, d.h);
        ctx.setLineDash([]);
        ctx.fillStyle = '#a7f3d0';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('APERTA', d.x + 1, d.y + d.h / 2);
      } else {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(d.x, d.y, d.w, d.h);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.strokeRect(d.x, d.y, d.w, d.h);
        // Doorknob
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(d.x + 8, d.y + d.h / 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('CHIUSA', d.x + 1, d.y + d.h / 2 + 10);
      }
    }
  }
}

window.House = House;
