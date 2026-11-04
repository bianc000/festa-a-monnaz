// Map, Rooms, Walls, and Furniture of Kri's House in Monnaz

class House {
  constructor() {
    this.width = 1200;
    this.height = 900;

    // Define Rooms
    this.rooms = [
      {
        id: 'living_room',
        name: 'Salone di Kri',
        desc: 'Festa a tutto volume! DJ set, divani e dancefloor.',
        x: 40, y: 350, w: 460, h: 360,
        floorColor: '#2b1d14',
        type: 'party'
      },
      {
        id: 'kitchen',
        name: 'Cucina & Beer Pong',
        desc: 'Birre fresche nel frigo, patatine e tornei accesi.',
        x: 40, y: 60, w: 460, h: 250,
        floorColor: '#1e293b',
        type: 'party'
      },
      {
        id: 'hallway',
        name: 'Corridoio',
        desc: 'Passaggio centrale che collega tutta la villa di Monnaz.',
        x: 540, y: 60, w: 160, h: 650,
        floorColor: '#33271e',
        type: 'transit'
      },
      {
        id: 'bedroom',
        name: 'Camera da Letto Relax',
        desc: 'Stanza appartata, luce soffusa. Posto perfetto per restare soli!',
        x: 740, y: 60, w: 420, h: 280,
        floorColor: '#1e1b4b',
        type: 'private'
      },
      {
        id: 'bathroom',
        name: 'Bagno degli Ospiti',
        desc: 'C\'è sempre qualcuno che bussa alla porta.',
        x: 740, y: 380, w: 180, h: 160,
        floorColor: '#0f3a47',
        type: 'service'
      },
      {
        id: 'balcony',
        name: 'Terrazza Panoramica di Monnaz',
        desc: 'Aria fresca, cielo stellato e vista mozzafiato. Il posto più romantico!',
        x: 740, y: 580, w: 420, h: 260,
        floorColor: '#182438',
        type: 'private'
      },
      {
        id: 'garden',
        name: 'Giardino Esterno',
        desc: 'Prato fresco sotto le lucine da festa.',
        x: 40, y: 750, w: 460, h: 120,
        floorColor: '#143820',
        type: 'outdoor'
      }
    ];

    // Solid Walls (bounds that characters cannot walk through)
    this.walls = [
      // Outer boundaries
      { x: 30, y: 40, w: 1150, h: 20 },   // Top wall
      { x: 30, y: 880, w: 1150, h: 20 },  // Bottom wall
      { x: 20, y: 40, w: 20, h: 850 },   // Left wall
      { x: 1170, y: 40, w: 20, h: 850 }, // Right wall

      // Vertical dividing walls
      { x: 500, y: 50, w: 30, h: 260 }, // Wall between Kitchen and Hallway
      { x: 500, y: 400, w: 30, h: 480 }, // Wall between Living Room and Hallway
      // (Door gap around y=310-400 for Kitchen/Living to Hallway)

      { x: 700, y: 50, w: 30, h: 180 },  // Wall between Hallway and Bedroom
      { x: 700, y: 300, w: 30, h: 320 }, // Wall between Hallway and Bathroom
      { x: 700, y: 680, w: 30, h: 200 }, // Wall between Hallway and Balcony

      // Horizontal dividing walls
      { x: 30, y: 310, w: 480, h: 24 },  // Wall between Kitchen and Living Room
      { x: 30, y: 720, w: 480, h: 24 },  // Wall between Living Room and Garden
      { x: 730, y: 340, w: 440, h: 24 }, // Wall below Bedroom
      { x: 730, y: 540, w: 440, h: 24 }, // Wall above Balcony
      { x: 920, y: 360, w: 20, h: 190 }  // Wall next to Bathroom
    ];

    // Doors with interactive state
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
        name: 'Porta Terrazza Panoramica'
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
        name: 'Portafinestra Giardino'
      }
    ];

    // Furniture / Obstacles with collisions
    this.furniture = [
      // Kitchen
      { id: 'fridge', name: 'Frigorifero Monnaz', x: 60, y: 70, w: 50, h: 60, color: '#94a3b8', isInteractive: true, action: 'fridge' },
      { id: 'counter', name: 'Bancone Snack', x: 120, y: 70, w: 180, h: 50, color: '#64748b' },
      { id: 'beer_pong', name: 'Tavolo Beer Pong', x: 150, y: 170, w: 190, h: 70, color: '#dc2626', isInteractive: true, action: 'beer_pong' },
      
      // Living Room
      { id: 'dj_booth', name: 'Consolle DJ di Lollo', x: 60, y: 370, w: 130, h: 60, color: '#7c3aed', isInteractive: true, action: 'dj_booth' },
      { id: 'dancefloor', name: 'Pista da Ballo', x: 220, y: 380, w: 180, h: 140, color: '#38bdf8', isFloorDecor: true },
      { id: 'sofa1', name: 'Divano Grande', x: 80, y: 560, w: 160, h: 60, color: '#854d0e' },
      { id: 'coffee_table', name: 'Tavolino Cocktail', x: 100, y: 640, w: 120, h: 40, color: '#451a03' },
      { id: 'speaker_left', name: 'Cassa Audio XL', x: 50, y: 450, w: 30, h: 40, color: '#111' },
      { id: 'speaker_right', name: 'Cassa Audio XL', x: 450, y: 370, w: 30, h: 40, color: '#111' },

      // Bedroom
      { id: 'bed', name: 'Letto Matrimoniale', x: 920, y: 70, w: 160, h: 150, color: '#7e22ce' },
      { id: 'nightstand', name: 'Comodino con Lampada', x: 870, y: 70, w: 40, h: 40, color: '#d97706' },
      { id: 'guitar', name: 'Chitarra Acustica', x: 1100, y: 240, w: 30, h: 40, color: '#b45309', isInteractive: true, action: 'guitar' },

      // Bathroom
      { id: 'sink', name: 'Lavandino', x: 840, y: 390, w: 50, h: 40, color: '#38bdf8' },
      { id: 'toilet', name: 'Toilette', x: 850, y: 480, w: 40, h: 45, color: '#e2e8f0' },

      // Balcony
      { id: 'balcony_bench', name: 'Panchina Romantica', x: 920, y: 740, w: 120, h: 40, color: '#78350f' },
      { id: 'telescope', name: 'Telescopio Panoramico', x: 1100, y: 620, w: 40, h: 40, color: '#cbd5e1', isInteractive: true, action: 'telescope' },

      // Garden
      { id: 'garden_lights', name: 'Festone di Lucine', x: 70, y: 780, w: 380, h: 20, isFloorDecor: true }
    ];

    // Animated party lights
    this.lightPulse = 0;
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
    // Check against walls
    for (const w of this.walls) {
      if (
        x + radius > w.x &&
        x - radius < w.x + w.w &&
        y + radius > w.y &&
        y - radius < w.y + w.h
      ) {
        return true;
      }
    }

    // Check against closed doors
    for (const d of this.doors) {
      if (!d.isOpen) {
        if (
          x + radius > d.x &&
          x - radius < d.x + d.w &&
          y + radius > d.y &&
          y - radius < d.y + d.h
        ) {
          return true;
        }
      }
    }

    // Check against solid furniture
    for (const f of this.furniture) {
      if (f.isFloorDecor) continue;
      if (
        x + radius > f.x &&
        x - radius < f.x + f.w &&
        y + radius > f.y &&
        y - radius < f.y + f.h
      ) {
        return true;
      }
    }

    return false;
  }

  getInteractiveNear(x, y, maxDist = 55) {
    // Check interactive furniture
    for (const f of this.furniture) {
      if (!f.isInteractive) continue;
      const cx = f.x + f.w / 2;
      const cy = f.y + f.h / 2;
      const dist = Math.hypot(x - cx, y - cy);
      if (dist < maxDist) {
        return { type: 'furniture', item: f };
      }
    }

    // Check doors
    for (const d of this.doors) {
      const cx = d.x + d.w / 2;
      const cy = d.y + d.h / 2;
      const dist = Math.hypot(x - cx, y - cy);
      if (dist < maxDist) {
        return { type: 'door', item: d };
      }
    }

    return null;
  }

  render(ctx) {
    this.lightPulse += 0.05;

    // 1. Draw Room Floors
    for (const r of this.rooms) {
      ctx.fillStyle = r.floorColor;
      ctx.fillRect(r.x, r.y, r.w, r.h);

      // Floor grid / floor tiles texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const tileSize = 32;
      for (let tx = r.x; tx < r.x + r.w; tx += tileSize) {
        ctx.beginPath();
        ctx.moveTo(tx, r.y);
        ctx.lineTo(tx, r.y + r.h);
        ctx.stroke();
      }
      for (let ty = r.y; ty < r.y + r.h; ty += tileSize) {
        ctx.beginPath();
        ctx.moveTo(r.x, ty);
        ctx.lineTo(r.x + r.w, ty);
        ctx.stroke();
      }

      // Room Name Plate on floor
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.fillText(r.name.toUpperCase(), r.x + 14, r.y + 28);
    }

    // Special: Stars on Balcony & View of Monnaz
    const balc = this.rooms.find(r => r.id === 'balcony');
    if (balc) {
      // Starry sky on the edge
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(balc.x + balc.w - 120, balc.y, 120, balc.h);
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 25; i++) {
        const sx = balc.x + balc.w - 110 + (i * 29) % 100;
        const sy = balc.y + (i * 37) % (balc.h - 20);
        const twinkle = Math.sin(this.lightPulse * 2 + i) > 0 ? 2 : 1;
        ctx.fillRect(sx, sy, twinkle, twinkle);
      }
      // Railing
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(balc.x + balc.w - 120, balc.y);
      ctx.lineTo(balc.x + balc.w - 120, balc.y + balc.h);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px monospace';
      ctx.fillText('✨ VISTA SUL LAGO & MONNAZ ✨', balc.x + balc.w - 115, balc.y + 20);
    }

    // 2. Draw Furniture & Floor Decor
    for (const f of this.furniture) {
      if (f.id === 'dancefloor') {
        // Disco animated floor
        const pulseColor = `hsl(${(this.lightPulse * 40) % 360}, 75%, 35%)`;
        ctx.fillStyle = pulseColor;
        ctx.fillRect(f.x, f.y, f.w, f.h);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(f.x, f.y, f.w, f.h);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('🎶 DANCEFLOOR 🎶', f.x + 35, f.y + f.h / 2);
        continue;
      }

      if (f.id === 'garden_lights') {
        for (let lx = f.x; lx < f.x + f.w; lx += 24) {
          const glow = (Math.sin(this.lightPulse + lx) + 1) * 0.5;
          ctx.fillStyle = `rgba(251, 191, 36, ${0.4 + glow * 0.6})`;
          ctx.beginPath();
          ctx.arc(lx, f.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        continue;
      }

      // Standard solid furniture
      ctx.fillStyle = f.color || '#475569';
      ctx.fillRect(f.x, f.y, f.w, f.h);

      // Shading / Border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(f.x, f.y, f.w, f.h);

      // Labels on furniture
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.fillText(f.name, f.x + 4, f.y + 14);

      if (f.isInteractive) {
        // Glowing dot
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(f.x + f.w - 8, f.y + 8, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Draw Walls
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    for (const w of this.walls) {
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.strokeRect(w.x, w.y, w.w, w.h);
    }

    // 4. Draw Doors
    for (const d of this.doors) {
      if (d.isOpen) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.fillRect(d.x, d.y, d.w, d.h);
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(d.x, d.y, d.w, d.h);
        ctx.setLineDash([]);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px monospace';
        ctx.fillText('APERTA', d.x + 2, d.y + d.h / 2);
      } else {
        ctx.fillStyle = '#b45309';
        ctx.fillRect(d.x, d.y, d.w, d.h);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.strokeRect(d.x, d.y, d.w, d.h);
        ctx.fillStyle = '#fef08a';
        ctx.font = '9px monospace';
        ctx.fillText('CHIUSA', d.x + 2, d.y + d.h / 2);
      }
    }
  }
}

window.House = House;
