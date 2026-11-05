// Characters, Sprites & NPC Behaviors for Festa a Monnaz (Pokemon Perla Style)

class CharacterManager {
  constructor(house) {
    this.house = house;
    this.spriteImages = {};
    this.portraits = {};
    this.loadAllSprites();

    // 1. Leon (Protagonist)
    this.player = {
      id: 'leon',
      name: 'Leon',
      x: 120,
      y: 450,
      w: 32,
      h: 40,
      speed: 2.9,
      sprintSpeed: 4.5,
      vx: 0,
      vy: 0,
      dir: 'down',
      isMoving: false,
      isSprinting: false,
      walkFrame: 0,
      room: 'living_room'
    };

    // 2. All MS Members & Guests (Pokemon Gen 4 Sinnoh Trainer Overworld)
    this.npcs = [
      {
        id: 'mari',
        name: 'Mari',
        role: 'target',
        title: 'La bella Mari ❤️',
        x: 320,
        y: 420,
        w: 32,
        h: 40,
        dir: 'down',
        room: 'living_room',
        isFollowing: false,
        followTarget: null,
        heartFloat: 0
      },
      {
        id: 'kri',
        name: 'Kri',
        role: 'host',
        title: 'Padrone di Casa & Barman',
        x: 100,
        y: 160,
        w: 32,
        h: 40,
        dir: 'right',
        room: 'kitchen'
      },
      {
        id: 'maya',
        name: 'Maya',
        role: 'obstacle',
        title: 'Festaiola Maya 👓',
        x: 600,
        y: 200,
        w: 32,
        h: 40,
        dir: 'down',
        room: 'hallway',
        state: 'patrol', // patrol, chase, cling, distracted
        patrolTimer: 0,
        patrolTarget: { x: 600, y: 500 },
        distractTimer: 0,
        clingTimer: 0,
        speed: 1.9,
        chaseSpeed: 3.1
      },
      {
        id: 'lollo',
        name: 'Lollo',
        role: 'dj',
        title: 'DJ Resident Cuoripoli 🎧',
        x: 120,
        y: 345,
        w: 32,
        h: 40,
        dir: 'down',
        room: 'living_room'
      },
      {
        id: 'bubi',
        name: 'Bubi',
        role: 'friend',
        title: 'Maestro Poffin & Snack 🍟',
        x: 320,
        y: 90,
        w: 32,
        h: 40,
        dir: 'left',
        room: 'kitchen'
      },
      {
        id: 'matti',
        name: 'Matti',
        role: 'friend',
        title: 'Campione Beer Pong Sinnoh 🕶️',
        x: 390,
        y: 180,
        w: 32,
        h: 40,
        dir: 'left',
        room: 'kitchen'
      },
      {
        id: 'jelmo',
        name: 'Jelmo',
        role: 'friend',
        title: 'Scienziato Pokémon MS 📊',
        x: 390,
        y: 230,
        w: 32,
        h: 40,
        dir: 'left',
        room: 'kitchen'
      },
      {
        id: 'ento',
        name: 'Ento',
        role: 'friend',
        title: 'Asso Allenatore MS 🧢',
        x: 80,
        y: 640,
        w: 32,
        h: 40,
        dir: 'right',
        room: 'living_room'
      },
      {
        id: 'roby',
        name: 'Roby',
        role: 'friend',
        title: 'Amico di Sinnoh 💚',
        x: 230,
        y: 640,
        w: 32,
        h: 40,
        dir: 'left',
        room: 'living_room'
      },
      {
        id: 'jona',
        name: 'Jona',
        role: 'friend',
        title: 'Allenatore MS 👕',
        x: 620,
        y: 530,
        w: 32,
        h: 40,
        dir: 'down',
        room: 'hallway'
      },
      {
        id: 'pibe',
        name: 'Pibe',
        role: 'friend',
        title: 'Bomber di Sinnoh ⚽',
        x: 620,
        y: 410,
        w: 32,
        h: 40,
        dir: 'up',
        room: 'hallway'
      },
      {
        id: 'lindi',
        name: 'Lindi',
        role: 'friend',
        title: 'Amica di Mari ✨',
        x: 420,
        y: 450,
        w: 32,
        h: 40,
        dir: 'left',
        room: 'living_room'
      },
      {
        id: 'ara',
        name: 'Ara',
        role: 'friend',
        title: 'Fanciulla delle Feste 🌸',
        x: 230,
        y: 800,
        w: 32,
        h: 40,
        dir: 'right',
        room: 'garden'
      }
    ];

    this.chipsOnFloor = null;
    this.animTime = 0;
  }

  loadAllSprites() {
    const v = Date.now(); // Cache-buster so browser NEVER reuses old cached sprites
    const ids = ['leon', 'mari', 'kri', 'maya', 'ento', 'matti', 'jona', 'pibe', 'lollo', 'roby', 'lindi', 'bubi', 'jelmo', 'ara'];
    for (const id of ids) {
      const img = new Image();
      img.src = `assets/sprites/${id}.png?v=${v}`;
      this.spriteImages[id] = img;
    }

    // High-Res Trainer Battle Portraits (Extracted from user's artwork)
    const portraits = ['mari_portrait', 'leon_portrait'];
    for (const pid of portraits) {
      const pimg = new Image();
      pimg.src = `assets/sprites/${pid}.png?v=${v}`;
      this.portraits[pid] = pimg;
    }
  }

  getNpc(id) {
    return this.npcs.find(n => n.id === id);
  }

  update(keys, gameState) {
    this.animTime += 0.05;

    // 1. Handle Leon's Movement
    const p = this.player;
    p.vx = 0;
    p.vy = 0;

    const maya = this.getNpc('maya');
    const isTrapped = (maya && maya.state === 'cling');

    if (!isTrapped && !gameState.dialogueActive && !gameState.gameWon) {
      p.isSprinting = !!(keys['ShiftLeft'] || keys['ShiftRight'] || keys['sprint']);
      const currentSpeed = p.isSprinting ? p.sprintSpeed : p.speed;

      if (keys['ArrowUp'] || keys['KeyW'] || keys['up']) {
        p.vy -= currentSpeed;
        p.dir = 'up';
      }
      if (keys['ArrowDown'] || keys['KeyS'] || keys['down']) {
        p.vy += currentSpeed;
        p.dir = 'down';
      }
      if (keys['ArrowLeft'] || keys['KeyA'] || keys['left']) {
        p.vx -= currentSpeed;
        p.dir = 'left';
      }
      if (keys['ArrowRight'] || keys['KeyD'] || keys['right']) {
        p.vx += currentSpeed;
        p.dir = 'right';
      }

      if (p.vx !== 0 && p.vy !== 0) {
        p.vx *= 0.7071;
        p.vy *= 0.7071;
      }

      if (p.vx !== 0) {
        const nextX = p.x + p.vx;
        if (!this.house.isColliding(nextX, p.y)) p.x = nextX;
      }
      if (p.vy !== 0) {
        const nextY = p.y + p.vy;
        if (!this.house.isColliding(p.x, nextY)) p.y = nextY;
      }

      p.isMoving = (p.vx !== 0 || p.vy !== 0);
      if (p.isMoving) p.walkFrame += 0.22;
    } else {
      p.isMoving = false;
    }

    p.room = this.house.getRoomAt(p.x, p.y).id;

    // 2. Update Mari
    const mari = this.getNpc('mari');
    if (mari) {
      if (mari.isFollowing) {
        mari.heartFloat += 0.08;
        const distToPlayer = Math.hypot(p.x - mari.x, p.y - mari.y);
        const desiredDist = 38;

        if (distToPlayer > desiredDist) {
          const angle = Math.atan2(p.y - mari.y, p.x - mari.x);
          const followSpeed = p.isSprinting ? 3.5 : 2.6;
          const nX = mari.x + Math.cos(angle) * followSpeed;
          const nY = mari.y + Math.sin(angle) * followSpeed;

          if (!this.house.isColliding(nX, mari.y)) mari.x = nX;
          if (!this.house.isColliding(mari.x, nY)) mari.y = nY;

          mari.dir = (Math.abs(p.x - mari.x) > Math.abs(p.y - mari.y))
            ? (p.x > mari.x ? 'right' : 'left')
            : (p.y > mari.y ? 'down' : 'up');
        }
      }
    }

    // 3. Update all NPC rooms
    for (const n of this.npcs) {
      n.room = this.house.getRoomAt(n.x, n.y).id;
    }

    // 4. Update Maya AI (The Pokemon Rival / Clinger)
    if (maya) {
      this.updateMayaAI(maya, p, mari, gameState);
    }

    // Ambient turns
    for (const n of this.npcs) {
      if (n.id === 'maya' || n.id === 'mari') continue;
      if (Math.random() < 0.005) {
        const dirs = ['up', 'down', 'left', 'right'];
        n.dir = dirs[Math.floor(Math.random() * dirs.length)];
      }
    }
  }

  updateMayaAI(maya, player, mari, gameState) {
    maya.room = this.house.getRoomAt(maya.x, maya.y).id;
    const distToLeon = Math.hypot(player.x - maya.x, player.y - maya.y);

    if (maya.state === 'distracted') {
      maya.distractTimer--;
      if (maya.distractTimer <= 0) {
        maya.state = 'patrol';
        gameState.showNotification("Maya ha finito le patatine e riprende la caccia a Leon!");
      }
      return;
    }

    if (maya.state === 'cling') {
      maya.clingTimer--;
      if (maya.clingTimer <= 0) {
        maya.state = 'patrol';
        maya.patrolTarget = { x: 100, y: 150 };
        gameState.closeDialogue();
        gameState.showNotification("Ti sei liberato da Maya! Corri verso la terrazza!");
      }
      return;
    }

    if (this.chipsOnFloor) {
      const distToChips = Math.hypot(this.chipsOnFloor.x - maya.x, this.chipsOnFloor.y - maya.y);
      if (distToChips < 70) {
        maya.state = 'distracted';
        maya.distractTimer = 420;
        this.chipsOnFloor = null;
        window.soundSystem.playHeart();
        gameState.showNotification("🍟 Maya si è avventata sulle patatine di Bubi!");
        return;
      }
    }

    // Detection Radius
    const detectionRadius = 220;
    const canSeeLeon = (distToLeon < detectionRadius);

    if (canSeeLeon && !gameState.gameWon) {
      if (maya.state !== 'chase') {
        maya.state = 'chase';
        window.soundSystem.playPokemonEncounter();
        gameState.triggerPokemonTrainerSpot("Festaiola Maya", "❗️ Maya ti ha intercettato con lo sguardo!");
      }

      const angle = Math.atan2(player.y - maya.y, player.x - maya.x);
      const spd = maya.chaseSpeed;
      const nX = maya.x + Math.cos(angle) * spd;
      const nY = maya.y + Math.sin(angle) * spd;

      if (!this.house.isColliding(nX, maya.y)) maya.x = nX;
      if (!this.house.isColliding(maya.x, nY)) maya.y = nY;

      maya.dir = (Math.abs(player.x - maya.x) > Math.abs(player.y - maya.y))
        ? (player.x > maya.x ? 'right' : 'left')
        : (player.y > maya.y ? 'down' : 'up');

      if (distToLeon < 34) {
        maya.state = 'cling';
        maya.clingTimer = 320;
        window.soundSystem.playMayaCatch();

        if (mari && mari.isFollowing) {
          mari.isFollowing = false;
          mari.x = 320;
          mari.y = 420;
          gameState.mariFollowing = false;
          gameState.triggerMayaInterruptDialogue();
        } else {
          gameState.triggerMayaClingDialogue();
        }
      }
    } else {
      maya.state = 'patrol';
      maya.patrolTimer--;

      if (maya.patrolTimer <= 0) {
        maya.patrolTimer = 180 + Math.random() * 120;
        const patrolPoints = [
          { x: 260, y: 440 },
          { x: 600, y: 150 },
          { x: 600, y: 600 },
          { x: 200, y: 180 },
          { x: 420, y: 600 }
        ];
        maya.patrolTarget = patrolPoints[Math.floor(Math.random() * patrolPoints.length)];
      }

      const pDist = Math.hypot(maya.patrolTarget.x - maya.x, maya.patrolTarget.y - maya.y);
      if (pDist > 10) {
        const angle = Math.atan2(maya.patrolTarget.y - maya.y, maya.patrolTarget.x - maya.x);
        const nX = maya.x + Math.cos(angle) * maya.speed;
        const nY = maya.y + Math.sin(angle) * maya.speed;
        if (!this.house.isColliding(nX, maya.y)) maya.x = nX;
        if (!this.house.isColliding(maya.x, nY)) maya.y = nY;
      }
    }
  }

  dropChips(x, y) {
    this.chipsOnFloor = { x, y };
  }

  getNpcNear(x, y, maxDist = 48) {
    for (const n of this.npcs) {
      if (Math.hypot(x - n.x, y - n.y) < maxDist) {
        return n;
      }
    }
    return null;
  }

  render(ctx) {
    // 1. Chips on floor
    if (this.chipsOnFloor) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(this.chipsOnFloor.x, this.chipsOnFloor.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('🍟 PATATINE', this.chipsOnFloor.x - 26, this.chipsOnFloor.y - 14);
    }

    // 2. Render all NPCs
    for (const n of this.npcs) {
      this.drawPokemonCharacter(ctx, n);

      if (n.id === 'mari') {
        if (n.isFollowing) {
          ctx.fillStyle = '#ec4899';
          ctx.font = '18px monospace';
          const bounce = Math.sin(this.animTime * 5) * 4;
          ctx.fillText('💖', n.x - 9, n.y - 32 + bounce);
        } else {
          ctx.fillStyle = '#fbcfe8';
          ctx.font = '13px monospace';
          ctx.fillText('✨', n.x + 14, n.y - 24);
        }
      }

      if (n.id === 'maya') {
        if (n.state === 'chase') {
          // Classic Pokemon Trainer Exclamation Mark !
          ctx.fillStyle = '#dc2626';
          ctx.font = 'bold 24px monospace';
          const pulse = Math.sin(this.animTime * 8) * 3;
          ctx.fillText('❗', n.x - 6, n.y - 32 + pulse);
        } else if (n.state === 'distracted') {
          ctx.fillStyle = '#fbbf24';
          ctx.font = '14px monospace';
          ctx.fillText('🍟 DELIZIA!', n.x - 24, n.y - 30);
        } else if (n.state === 'cling') {
          ctx.fillStyle = '#ec4899';
          ctx.font = '14px monospace';
          ctx.fillText('💕 LEOOON!', n.x - 24, n.y - 30);
        }
      }
    }

    // 3. Render Leon
    this.drawPokemonCharacter(ctx, this.player);

    if (this.player.isSprinting && this.player.isMoving) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y + 16, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPokemonCharacter(ctx, char) {
    const img = this.spriteImages[char.id];
    const w = 32;
    const h = 40;
    const drawX = Math.round(char.x - w / 2);
    let drawY = Math.round(char.y - h / 2);

    // Pokemon Perla step bob
    const bob = (char.isMoving || char.id === 'maya') ? Math.sin(this.animTime * 7) * 2 : 0;
    drawY += bob;

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, drawX, drawY, w, h);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX, drawY, w, h);
    }

    // Pokemon Style Trainer Name Box
    ctx.font = 'bold 10px "Courier New", monospace';
    const tag = char.name;
    const textWidth = ctx.measureText(tag).width;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(char.x - textWidth / 2 - 4, drawY - 14, textWidth + 8, 13);
    ctx.strokeStyle = (char.id === 'mari') ? '#f472b6' : (char.id === 'leon') ? '#60a5fa' : (char.id === 'maya') ? '#ef4444' : '#fbbf24';
    ctx.lineWidth = 1;
    ctx.strokeRect(char.x - textWidth / 2 - 4, drawY - 14, textWidth + 8, 13);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(tag, char.x - textWidth / 2, drawY - 4);
  }
}

window.CharacterManager = CharacterManager;
