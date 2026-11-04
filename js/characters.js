// Characters, Sprites & NPC Behaviors for Festa a Monnaz

class CharacterManager {
  constructor(house) {
    this.house = house;
    this.spriteImages = {};
    this.loadAllSprites();

    // 1. Create Leon (Player)
    this.player = {
      id: 'leon',
      name: 'Leon',
      x: 120,
      y: 450,
      w: 28,
      h: 28,
      speed: 2.8,
      sprintSpeed: 4.2,
      vx: 0,
      vy: 0,
      dir: 'down',
      isMoving: false,
      isSprinting: false,
      walkFrame: 0,
      room: 'living_room'
    };

    // 2. Define all MS Members & Party Guests
    this.npcs = [
      {
        id: 'mari',
        name: 'Mari',
        role: 'target',
        x: 320,
        y: 420,
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
        x: 100,
        y: 160,
        dir: 'right',
        room: 'kitchen'
      },
      {
        id: 'maya',
        name: 'Maya',
        role: 'obstacle',
        x: 600,
        y: 200,
        dir: 'down',
        room: 'hallway',
        state: 'patrol', // patrol, chase, cling, distracted
        patrolTimer: 0,
        patrolTarget: { x: 600, y: 500 },
        distractTimer: 0,
        clingTimer: 0,
        speed: 1.8,
        chaseSpeed: 2.9
      },
      {
        id: 'lollo',
        name: 'Lollo',
        role: 'dj',
        x: 120,
        y: 350,
        dir: 'down',
        room: 'living_room'
      },
      {
        id: 'bubi',
        name: 'Bubi',
        role: 'friend',
        x: 320,
        y: 90,
        dir: 'left',
        room: 'kitchen'
      },
      {
        id: 'matti',
        name: 'Matti',
        role: 'friend',
        x: 390,
        y: 190,
        dir: 'left',
        room: 'kitchen'
      },
      {
        id: 'jelmo',
        name: 'Jelmo',
        role: 'friend',
        x: 390,
        y: 240,
        dir: 'left',
        room: 'kitchen'
      },
      {
        id: 'ento',
        name: 'Ento',
        role: 'friend',
        x: 80,
        y: 650,
        dir: 'right',
        room: 'living_room'
      },
      {
        id: 'roby',
        name: 'Roby',
        role: 'friend',
        x: 230,
        y: 650,
        dir: 'left',
        room: 'living_room'
      },
      {
        id: 'jona',
        name: 'Jona',
        role: 'friend',
        x: 620,
        y: 540,
        dir: 'down',
        room: 'hallway'
      },
      {
        id: 'pibe',
        name: 'Pibe',
        role: 'friend',
        x: 620,
        y: 420,
        dir: 'up',
        room: 'hallway'
      },
      {
        id: 'lindi',
        name: 'Lindi',
        role: 'friend',
        x: 420,
        y: 460,
        dir: 'left',
        room: 'living_room'
      },
      {
        id: 'ara',
        name: 'Ara',
        role: 'friend',
        x: 230,
        y: 810,
        dir: 'right',
        room: 'garden'
      }
    ];

    this.chipsOnFloor = null; // Distraction item dropped
    this.animTime = 0;
  }

  loadAllSprites() {
    const ids = ['leon', 'mari', 'kri', 'maya', 'ento', 'matti', 'jona', 'pibe', 'lollo', 'roby', 'lindi', 'bubi', 'jelmo', 'ara'];
    for (const id of ids) {
      const img = new Image();
      img.src = `assets/sprites/${id}.png`;
      this.spriteImages[id] = img;
    }
  }

  getNpc(id) {
    return this.npcs.find(n => n.id === id);
  }

  update(keys, gameState) {
    this.animTime += 0.05;

    // 1. Handle Player Movement
    const p = this.player;
    p.vx = 0;
    p.vy = 0;

    // Can't move if clinged by Maya
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

      // Diagonal speed normalize
      if (p.vx !== 0 && p.vy !== 0) {
        p.vx *= 0.7071;
        p.vy *= 0.7071;
      }

      // Try Move X
      if (p.vx !== 0) {
        const nextX = p.x + p.vx;
        if (!this.house.isColliding(nextX, p.y)) {
          p.x = nextX;
        }
      }

      // Try Move Y
      if (p.vy !== 0) {
        const nextY = p.y + p.vy;
        if (!this.house.isColliding(p.x, nextY)) {
          p.y = nextY;
        }
      }

      p.isMoving = (p.vx !== 0 || p.vy !== 0);
      if (p.isMoving) {
        p.walkFrame += 0.2;
      }
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
          const followSpeed = p.isSprinting ? 3.4 : 2.5;
          const nX = mari.x + Math.cos(angle) * followSpeed;
          const nY = mari.y + Math.sin(angle) * followSpeed;

          if (!this.house.isColliding(nX, mari.y)) mari.x = nX;
          if (!this.house.isColliding(mari.x, nY)) mari.y = nY;

          // Set direction
          if (Math.abs(p.x - mari.x) > Math.abs(p.y - mari.y)) {
            mari.dir = (p.x > mari.x) ? 'right' : 'left';
          } else {
            mari.dir = (p.y > mari.y) ? 'down' : 'up';
          }
        }
      }
    }

    // 3. Update all NPC rooms dynamically
    for (const n of this.npcs) {
      n.room = this.house.getRoomAt(n.x, n.y).id;
    }

    // 4. Update Maya (The Obstacle AI)
    if (maya) {
      this.updateMayaAI(maya, p, mari, gameState);
    }

    // 4. Subtle ambient movement for other NPCs (chatting, turning)
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

    // State 1: DISTRACTED (eating Bubi's chips)
    if (maya.state === 'distracted') {
      maya.distractTimer--;
      if (maya.distractTimer <= 0) {
        maya.state = 'patrol';
        gameState.showNotification("Maya ha finito le patatine e ricomincia a cercare Leon!");
      }
      return;
    }

    // State 2: CLING (Trapping Leon)
    if (maya.state === 'cling') {
      maya.clingTimer--;
      if (maya.clingTimer <= 0) {
        maya.state = 'patrol';
        maya.patrolTarget = { x: 100, y: 150 }; // sends her back toward kitchen
        gameState.closeDialogue();
        gameState.showNotification("Sei riuscito a scappare da Maya! Corri!");
      }
      return;
    }

    // Check if chips are nearby to distract Maya
    if (this.chipsOnFloor) {
      const distToChips = Math.hypot(this.chipsOnFloor.x - maya.x, this.chipsOnFloor.y - maya.y);
      if (distToChips < 70) {
        maya.state = 'distracted';
        maya.distractTimer = 400; // ~6-7 seconds
        this.chipsOnFloor = null;
        window.soundSystem.playHeart();
        gameState.showNotification("Maya si è fiondata sulle patatine! Sei libero per qualche secondo!");
        return;
      }
    }

    // Maya detection check
    const detectionRadius = 210;
    const canSeeLeon = (distToLeon < detectionRadius);

    if (canSeeLeon && !gameState.gameWon) {
      if (maya.state !== 'chase') {
        maya.state = 'chase';
        window.soundSystem.playAlert();
        gameState.showNotification("🚨 MAYA TI HA VISTO! SCAPPA O USA UNA DISTRAZIONE!");
      }

      // Chase Leon!
      const angle = Math.atan2(player.y - maya.y, player.x - maya.x);
      const spd = maya.chaseSpeed;
      const nX = maya.x + Math.cos(angle) * spd;
      const nY = maya.y + Math.sin(angle) * spd;

      if (!this.house.isColliding(nX, maya.y)) maya.x = nX;
      if (!this.house.isColliding(maya.x, nY)) maya.y = nY;

      // Update face direction
      maya.dir = (Math.abs(player.x - maya.x) > Math.abs(player.y - maya.y))
        ? (player.x > maya.x ? 'right' : 'left')
        : (player.y > maya.y ? 'down' : 'up');

      // Cling check: did Maya touch Leon?
      if (distToLeon < 32) {
        maya.state = 'cling';
        maya.clingTimer = 300; // ~5 seconds
        window.soundSystem.playMayaCatch();

        // If Mari was following, Mari abandons Leon!
        if (mari && mari.isFollowing) {
          mari.isFollowing = false;
          // Send Mari back to living room
          mari.x = 320;
          mari.y = 420;
          gameState.mariFollowing = false;
          gameState.triggerMayaInterruptDialogue();
        } else {
          gameState.triggerMayaClingDialogue();
        }
      }
    } else {
      // Normal Patrol mode
      maya.state = 'patrol';
      maya.patrolTimer--;

      if (maya.patrolTimer <= 0) {
        maya.patrolTimer = 180 + Math.random() * 120;
        // Pick a patrol room waypoint
        const patrolPoints = [
          { x: 260, y: 440 }, // living room dancefloor
          { x: 600, y: 150 }, // hallway north
          { x: 600, y: 600 }, // hallway south
          { x: 200, y: 180 }, // kitchen
          { x: 420, y: 600 }  // near sofa
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
      const dist = Math.hypot(x - n.x, y - n.y);
      if (dist < maxDist) {
        return n;
      }
    }
    return null;
  }

  // Count how many NPCs are in a given room
  getNpcCountInRoom(roomId) {
    let count = 0;
    for (const n of this.npcs) {
      if (n.room === roomId) count++;
    }
    return count;
  }

  render(ctx) {
    // 1. Draw dropped chips if any
    if (this.chipsOnFloor) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(this.chipsOnFloor.x, this.chipsOnFloor.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '10px monospace';
      ctx.fillText('🍟 PATATINE', this.chipsOnFloor.x - 22, this.chipsOnFloor.y - 12);
    }

    // 2. Render all NPCs
    for (const n of this.npcs) {
      this.drawCharacter(ctx, n);

      // Emotion / State bubbles
      if (n.id === 'mari') {
        if (n.isFollowing) {
          // Floating love heart
          ctx.fillStyle = '#ec4899';
          ctx.font = '16px monospace';
          const bounce = Math.sin(this.animTime * 4) * 4;
          ctx.fillText('❤️', n.x - 7, n.y - 28 + bounce);
        } else {
          // Sparkle aura
          ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
          ctx.font = '11px monospace';
          ctx.fillText('✨', n.x + 12, n.y - 20);
        }
      }

      if (n.id === 'maya') {
        if (n.state === 'chase') {
          // Metal gear alert exclamation
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 20px monospace';
          ctx.fillText('❗️', n.x - 5, n.y - 26);
        } else if (n.state === 'distracted') {
          ctx.fillStyle = '#fbbf24';
          ctx.font = '14px monospace';
          ctx.fillText('🍟 YUM!', n.x - 14, n.y - 26);
        } else if (n.state === 'cling') {
          ctx.fillStyle = '#ec4899';
          ctx.font = '14px monospace';
          ctx.fillText('💕 LEOOON!', n.x - 22, n.y - 26);
        }
      }
    }

    // 3. Render Player (Leon)
    this.drawCharacter(ctx, this.player);

    // Sprint dust/speed effect if sprinting
    if (this.player.isSprinting && this.player.isMoving) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y + 12, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawCharacter(ctx, char) {
    const img = this.spriteImages[char.id];
    const size = 32;
    const drawX = Math.round(char.x - size / 2);
    let drawY = Math.round(char.y - size / 2);

    // Subtle bobbing when moving or idle
    const bob = (char.isMoving || char.id === 'maya') ? Math.sin(this.animTime * 6) * 2 : 0;
    drawY += bob;

    if (img && img.complete && img.naturalWidth > 0) {
      // Draw actual PNG sprite
      ctx.drawImage(img, drawX, drawY, size, size);
    } else {
      // Fallback procedural placeholder
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX, drawY, size, size);
    }

    // Name tag above head
    ctx.font = 'bold 10px "Courier New", monospace';
    const tag = char.name;
    const textWidth = ctx.measureText(tag).width;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(char.x - textWidth / 2 - 3, drawY - 14, textWidth + 6, 12);

    // Color code names
    if (char.id === 'leon') ctx.fillStyle = '#60a5fa';
    else if (char.id === 'mari') ctx.fillStyle = '#f472b6';
    else if (char.id === 'maya') ctx.fillStyle = '#f87171';
    else ctx.fillStyle = '#f8fafc';

    ctx.fillText(tag, char.x - textWidth / 2, drawY - 4);
  }
}

window.CharacterManager = CharacterManager;
