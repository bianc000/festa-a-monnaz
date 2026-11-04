// Main Game Engine & Controller for Festa a Monnaz

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set internal resolution (1200x900)
    this.canvas.width = 1200;
    this.canvas.height = 900;

    this.house = new House();
    this.characters = new CharacterManager(this.house);
    
    // Input state
    this.keys = {};
    this.setupInput();

    // Game Progression State
    this.state = {
      mariInterest: 20, // starts at 20%
      mariFollowing: false,
      mariAloneWithLeon: false,
      djRomance: false,
      inventory: [],
      dialogueActive: false,
      currentSpeaker: null,
      currentChoices: [],
      gameWon: false,
      startTime: Date.now(),
      mayaDodges: 0,
      aloneSeconds: 0
    };

    // Romance alone countdown
    this.aloneTimer = 0;
    this.confessionTriggered = false;

    // Camera / Viewport
    this.camera = { x: 0, y: 0 };

    // Notification toast timer
    this.toastTimer = null;

    // Setup UI hooks
    this.setupUI();

    // Start loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));

    // Welcome notification
    setTimeout(() => {
      this.showNotification("Festa a Monnaz! Trova la bella Mari e cerca di restare da solo con lei!");
    }, 1000);
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Interaction key: Space or KeyE
      if (e.code === 'Space' || e.code === 'KeyE') {
        this.handleInteract();
      }

      // Close dialogue with Escape or Space if no choices
      if (e.code === 'Escape') {
        this.closeDialogue();
      }

      // Quick numbers for dialogue choices (1, 2, 3)
      if (this.state.dialogueActive && (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3')) {
        const idx = parseInt(e.key) - 1;
        if (this.state.currentChoices && this.state.currentChoices[idx]) {
          this.selectChoice(idx);
        }
      }

      // Quick hotkey to throw Bubi's chips if owned
      if (e.code === 'KeyQ' || e.code === 'KeyF') {
        this.useChips();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mobile / Touch controls
    const bindTouch = (id, keyName) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys[keyName] = true; });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys[keyName] = false; });
      el.addEventListener('mousedown', () => { this.keys[keyName] = true; });
      el.addEventListener('mouseup', () => { this.keys[keyName] = false; });
    };

    bindTouch('btnUp', 'up');
    bindTouch('btnDown', 'down');
    bindTouch('btnLeft', 'left');
    bindTouch('btnRight', 'right');
    bindTouch('btnAction', 'Space');
    bindTouch('btnSprint', 'sprint');
  }

  setupUI() {
    // Audio button
    const audioBtn = document.getElementById('audioBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.soundSystem.toggleMute();
        audioBtn.textContent = isMuted ? '🔇 Audio: OFF' : '🔊 Audio: ON';
        audioBtn.classList.toggle('btn-pink', !isMuted);
      });
    }

    // Sprites Modal toggle
    const spritesBtn = document.getElementById('spritesBtn');
    const spritesModal = document.getElementById('spritesModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (spritesBtn && spritesModal) {
      spritesBtn.addEventListener('click', () => {
        this.populateSpritesModal();
        spritesModal.classList.remove('hidden');
      });
      closeModalBtn.addEventListener('click', () => {
        spritesModal.classList.add('hidden');
      });
    }

    // Click inventory slots to use/drop
    const slot3 = document.getElementById('slot3');
    if (slot3) {
      slot3.style.cursor = 'pointer';
      slot3.addEventListener('click', () => {
        if (this.state.inventory.includes('chips_bubi')) {
          this.useChips();
        }
      });
    }

    // First user click to enable audio
    window.addEventListener('click', () => {
      window.soundSystem.init();
      if (!window.soundSystem.musicPlaying && !window.soundSystem.isMuted) {
        window.soundSystem.startBgm();
      }
    }, { once: true });
  }

  handleInteract() {
    if (this.state.dialogueActive) {
      // If prompt has choices, do nothing until choice is clicked
      if (!this.state.currentChoices || this.state.currentChoices.length === 0) {
        this.closeDialogue();
      }
      return;
    }

    const p = this.characters.player;

    // 1. Check nearby door first if close (so player can close doors when fleeing or alone!)
    const interactiveDoor = this.house.getInteractiveNear(p.x, p.y, 45);
    if (interactiveDoor && interactiveDoor.type === 'door') {
      const door = interactiveDoor.item;
      door.isOpen = !door.isOpen;
      window.soundSystem.playDoor();
      this.showNotification(`${door.name} ${door.isOpen ? 'APERTA' : 'CHIUSA'}`);
      return;
    }

    // 2. Check nearby NPC to talk
    const npc = this.characters.getNpcNear(p.x, p.y, 50);
    if (npc) {
      this.openDialogue(npc.id);
      return;
    }

    // 3. Check nearby interactive furniture
    if (interactiveDoor && interactiveDoor.type === 'furniture') {
      this.handleFurnitureAction(interactiveDoor.item);
      return;
    }
  }

  handleFurnitureAction(f) {
    if (f.action === 'fridge') {
      window.soundSystem.playPickup();
      if (!this.state.inventory.includes('drink_mari')) {
        this.state.inventory.push('drink_mari');
        this.updateInventoryUI();
        this.showNotification("Hai preso dal frigo: 'Cocktail Fragola & Menta' per Mari! 🍓🍸");
      } else if (!this.state.inventory.includes('beer')) {
        this.state.inventory.push('beer');
        this.updateInventoryUI();
        this.showNotification("Hai preso dal frigo: 'Birra Gelata' per Lollo! 🍺");
      } else {
        this.showNotification("Il frigo di Kri è pieno di ghiaccio e bottiglie.");
      }
    } else if (f.action === 'dj_booth') {
      this.openDialogue('lollo');
    } else if (f.action === 'beer_pong') {
      window.soundSystem.playBlip();
      this.showNotification("Matti e Jelmo stanno disputando una finale agguerrita di Beer Pong!");
    } else if (f.action === 'guitar') {
      window.soundSystem.playHeart();
      this.showNotification("Una chitarra classica appoggiata al muro. Atmosfera romantica e intima.");
    } else if (f.action === 'telescope') {
      window.soundSystem.playBlip();
      this.showNotification("Guardando attraverso il telescopio si vedono le luci soffuse del villaggio di Monnaz.");
    }
  }

  useChips() {
    const idx = this.state.inventory.indexOf('chips_bubi');
    if (idx !== -1) {
      this.state.inventory.splice(idx, 1);
      this.updateInventoryUI();
      const p = this.characters.player;
      this.characters.dropChips(p.x, p.y);
      window.soundSystem.playPickup();
      this.showNotification("Hai lanciato le patatine di Bubi a terra per attirare Maya!");
    } else {
      this.showNotification("Non hai patatine nell'inventario! Parla con Bubi in cucina.");
    }
  }

  openDialogue(speakerId) {
    const data = DIALOGUES[speakerId];
    if (!data) return;

    this.state.dialogueActive = true;
    this.state.currentSpeaker = speakerId;
    window.soundSystem.playSelect();

    const overlay = document.getElementById('dialogueOverlay');
    const avatarImg = document.getElementById('dialogueAvatar');
    const nameEl = document.getElementById('dialogueName');
    const textEl = document.getElementById('dialogueText');
    const choicesEl = document.getElementById('dialogueChoices');

    overlay.classList.remove('hidden');
    avatarImg.src = `assets/sprites/${data.avatar}.png`;
    nameEl.textContent = `${data.speaker} - ${data.title || ''}`;

    // Compute dialogue text and dynamic choices
    let introText = (typeof data.intro === 'function') ? data.intro(this.state) : (data.intro || '');
    if (data.getIntro) {
      introText = data.getIntro(this.state);
    }
    textEl.textContent = introText;

    // Get choices
    let choices = (typeof data.choices === 'function') ? data.choices(this.state) : (data.choices || []);
    if (data.getChoices) {
      choices = data.getChoices(this.state);
    }
    this.state.currentChoices = choices;

    choicesEl.innerHTML = '';
    choices.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = `[${idx + 1}] ${c.text}`;
      btn.addEventListener('click', () => this.selectChoice(idx));
      choicesEl.appendChild(btn);
    });
  }

  selectChoice(idx) {
    const choice = this.state.currentChoices[idx];
    if (!choice) return;

    window.soundSystem.playBlip();
    const textEl = document.getElementById('dialogueText');
    const choicesEl = document.getElementById('dialogueChoices');

    // Show reply
    textEl.textContent = choice.reply;
    choicesEl.innerHTML = '<span class="dialogue-prompt">[Premi Spazio o Invio per continuare]</span>';
    this.state.currentChoices = [];

    // Handle effects & rewards
    if (choice.bonus) {
      this.state.mariInterest = Math.min(100, this.state.mariInterest + choice.bonus);
      this.updateHud();
      window.soundSystem.playHeart();
    }

    if (choice.consumeItem) {
      const itemIdx = this.state.inventory.indexOf(choice.consumeItem);
      if (itemIdx !== -1) {
        this.state.inventory.splice(itemIdx, 1);
        this.updateInventoryUI();
      }
    }

    if (choice.action === 'start_follow') {
      this.state.mariFollowing = true;
      const mari = this.characters.getNpc('mari');
      if (mari) mari.isFollowing = true;
      window.soundSystem.playHeart();
      this.showNotification("❤️ Mari ti sta seguendo! Portala in una stanza tranquilla senza farti beccare!");
    } else if (choice.action === 'give_chips') {
      if (!this.state.inventory.includes('chips_bubi')) {
        this.state.inventory.push('chips_bubi');
        this.updateInventoryUI();
        window.soundSystem.playPickup();
        this.showNotification("Hai ottenuto il 'Sacchetto di Patatine al Tartufo' di Bubi!");
      }
    } else if (choice.action === 'set_dj_romance') {
      this.state.djRomance = true;
      window.soundSystem.playHeart();
      this.showNotification("🎶 Lollo ha lanciato il disco romantico a Monnaz! Mari ne sarà entusiasta!");
    } else if (choice.action === 'distract_maya') {
      const maya = this.characters.getNpc('maya');
      if (maya) {
        maya.state = 'distracted';
        maya.distractTimer = 400;
        this.closeDialogue();
        this.showNotification("Maya è occupata a divorare le patatine!");
      }
    }
  }

  triggerMayaClingDialogue() {
    this.state.mayaDodges++;
    const overlay = document.getElementById('dialogueOverlay');
    const avatarImg = document.getElementById('dialogueAvatar');
    const nameEl = document.getElementById('dialogueName');
    const textEl = document.getElementById('dialogueText');
    const choicesEl = document.getElementById('dialogueChoices');

    this.state.dialogueActive = true;
    overlay.classList.remove('hidden');
    avatarImg.src = `assets/sprites/maya.png`;
    nameEl.textContent = "Maya - L'incubo di Monnaz 👓";
    textEl.textContent = "LEON! Non mi scappi! Ti ho visto che guardavi Mari, ma lei non capisce il nostro legame cosmico! Ascolta questa storia sul mio pappagallo...";
    choicesEl.innerHTML = '<span class="dialogue-prompt" style="color:#ef4444;">[Maya ti sta bloccando per qualche secondo! Aspetta di liberarti!]</span>';
    this.state.currentChoices = [];
  }

  triggerMayaInterruptDialogue() {
    this.state.mariInterest = Math.max(30, this.state.mariInterest - 20);
    this.updateHud();
    this.openDialogue('maya');
    const textEl = document.getElementById('dialogueText');
    textEl.textContent = "MAYA: Leon! Eccoti! Sei con Mari?! \nMARI: Oh cielo... Leon, vi lascio tranquilli, torno dagli altri nel salone!";
  }

  closeDialogue() {
    this.state.dialogueActive = false;
    const overlay = document.getElementById('dialogueOverlay');
    overlay.classList.add('hidden');
  }

  showNotification(msg) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('active');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 3800);
  }

  updateHud() {
    // Mari meter
    const fillEl = document.getElementById('meterFill');
    const valEl = document.getElementById('meterVal');
    if (fillEl && valEl) {
      fillEl.style.width = `${this.state.mariInterest}%`;
      valEl.textContent = `${this.state.mariInterest}%`;
    }

    // Current room
    const p = this.characters.player;
    const room = this.house.getRoomAt(p.x, p.y);
    const roomEl = document.getElementById('currentRoomText');
    if (roomEl) {
      roomEl.textContent = room.name;
    }

    // Maya radar status
    const maya = this.characters.getNpc('maya');
    const mayaStatusEl = document.getElementById('mayaStatusText');
    if (maya && mayaStatusEl) {
      const dist = Math.hypot(p.x - maya.x, p.y - maya.y);
      if (maya.state === 'cling') {
        mayaStatusEl.className = 'maya-status maya-alert';
        mayaStatusEl.textContent = '🚨 BLOCCATO DA MAYA!';
      } else if (maya.state === 'chase' || dist < 190) {
        mayaStatusEl.className = 'maya-status maya-warning';
        mayaStatusEl.textContent = '⚠️ MAYA TI INSEGUE!';
      } else if (maya.state === 'distracted') {
        mayaStatusEl.className = 'maya-status maya-safe';
        mayaStatusEl.textContent = '🍟 Maya distratta dalle patatine';
      } else {
        mayaStatusEl.className = 'maya-status maya-safe';
        mayaStatusEl.textContent = '🟢 Nessun pericolo immediato';
      }
    }
  }

  updateInventoryUI() {
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');

    const slots = [slot1, slot2, slot3];
    slots.forEach(s => {
      s.className = 'inventory-slot';
      s.textContent = '';
      s.title = '';
    });

    this.state.inventory.forEach((item, idx) => {
      if (idx < 3) {
        const s = slots[idx];
        s.classList.add('has-item');
        if (item === 'drink_mari') {
          s.textContent = '🍸';
          s.title = 'Cocktail Fragola & Menta per Mari';
        } else if (item === 'beer') {
          s.textContent = '🍺';
          s.title = 'Birra gelata per DJ Lollo';
        } else if (item === 'chips_bubi') {
          s.textContent = '🍟';
          s.title = 'Patatine di Bubi (Premi Q o F per lanciare!)';
        }
      }
    });
  }

  checkWinCondition() {
    if (this.state.gameWon) return;

    const p = this.characters.player;
    const mari = this.characters.getNpc('mari');
    const maya = this.characters.getNpc('maya');

    if (!mari || !mari.isFollowing) return;

    const currentRoom = this.house.getRoomAt(p.x, p.y);
    const mariRoom = this.house.getRoomAt(mari.x, mari.y);

    // Eligible private rooms: 'balcony' or 'bedroom'
    const isPrivate = (currentRoom.id === 'balcony' || currentRoom.id === 'bedroom');

    if (isPrivate && currentRoom.id === mariRoom.id) {
      // Check if ANY other NPC is in this room
      let intruderFound = false;
      for (const npc of this.characters.npcs) {
        if (npc.id !== 'mari' && npc.room === currentRoom.id) {
          intruderFound = true;
          break;
        }
      }

      if (!intruderFound) {
        // Leon and Mari are strictly alone!
        this.aloneTimer++;

        // Shift background music to romantic mode
        window.soundSystem.setRomantic(true);

        if (this.aloneTimer > 180 && !this.confessionTriggered) { // ~3 seconds uninterrupted
          this.triggerRomanticClimax(currentRoom);
        }
      } else {
        this.aloneTimer = 0;
        window.soundSystem.setRomantic(false);
      }
    } else {
      this.aloneTimer = 0;
      window.soundSystem.setRomantic(false);
    }
  }

  triggerRomanticClimax(room) {
    this.confessionTriggered = true;
    this.state.gameWon = true;
    this.state.mariAloneWithLeon = true;
    window.soundSystem.playVictory();

    // Trigger Final Romantic Dialogue
    const overlay = document.getElementById('dialogueOverlay');
    const avatarImg = document.getElementById('dialogueAvatar');
    const nameEl = document.getElementById('dialogueName');
    const textEl = document.getElementById('dialogueText');
    const choicesEl = document.getElementById('dialogueChoices');

    this.state.dialogueActive = true;
    overlay.classList.remove('hidden');
    avatarImg.src = `assets/sprites/mari.png`;
    nameEl.textContent = 'Mari ❤️ La più bella di MS';
    
    const locationName = (room.id === 'balcony') ? 'sul balcone panoramico di Monnaz' : 'nella quiete della stanza';
    textEl.textContent = `Mari: "Leon... guardaci. Finalmente da soli ${locationName}. La vista è magica, ma tu sei stato incredibile stasera. Sei riuscito a seminarli tutti... per me."`;

    choicesEl.innerHTML = `
      <button class="choice-btn" id="kissBtn">
        💋 "Mari, sei la ragazza più bella che MS abbia mai visto. Volevo solo te."
      </button>
    `;

    document.getElementById('kissBtn').addEventListener('click', () => {
      window.soundSystem.playHeart();
      this.showVictoryModal();
    });
  }

  showVictoryModal() {
    this.closeDialogue();
    const modal = document.getElementById('spritesModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    title.innerHTML = '🎉 VITTORIA! LEON HA CONQUISTATO LA BELLA MARI! 🎉';
    
    const elapsedSecs = Math.round((Date.now() - this.state.startTime) / 1000);
    body.innerHTML = `
      <div style="text-align: center; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div style="font-size: 54px; animation: pulse 1s infinite;">💖 💑 🥂</div>
        <h2 style="color: #f472b6; font-size: 22px;">Missione Compiuta alla Festa di Monnaz!</h2>
        <p style="font-size: 14px; line-height: 1.6; max-width: 600px; color: #e2e8f0;">
          Leon e la bella Mari sono rimasti da soli sotto il cielo stellato di Monnaz! Tutta la crew di <strong>MS</strong> (Kri, Ento, Matti, Jona, Pibe, Lollo, Roby, Lindi, Bubi, Jelmo e Ara) sta applaudendo dalla finestra, mentre Maya sta ancora cercando Leon per il corridoio!
        </p>
        <div style="background: #1e293b; padding: 14px 24px; border-radius: 8px; border: 1px solid #3b82f6; text-align: left; width: 100%; max-width: 440px;">
          <div style="margin-bottom: 6px;">⏱️ <strong>Tempo impiegato:</strong> ${elapsedSecs} secondi</div>
          <div style="margin-bottom: 6px;">👓 <strong>Ostacolo Maya schivato con successo!</strong></div>
          <div style="margin-bottom: 6px;">🍸 <strong>Cocktail di Kri servito a perfezione!</strong></div>
          <div style="color: #fbbf24;">🏆 <strong>Titolo sbloccato:</strong> Il Conquistatore di Monnaz</div>
        </div>
        <button class="btn btn-pink" style="font-size: 14px; padding: 10px 20px; margin-top: 10px;" onclick="location.reload()">
          🔄 Gioca di Nuovo
        </button>
      </div>
    `;
    modal.classList.remove('hidden');
  }

  populateSpritesModal() {
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    title.textContent = '👥 Membri MS & Personaggi della Festa a Monnaz';

    const chars = [
      { id: 'leon', name: 'Leon', role: 'Protagonista Giocabile (MS)', desc: 'Determinato a conquistare Mari stasera.' },
      { id: 'mari', name: 'Mari', role: 'La più bella di MS ❤️', desc: 'Elegante, simpatica e radiosa in abito rosa.' },
      { id: 'kri', name: 'Kri', role: 'Padrone di Casa (MS)', desc: 'Ospita la leggendaria festa a Monnaz.' },
      { id: 'maya', name: 'Maya', role: 'L\'Ostacolo Principale 👓', desc: 'Insegue Leon ovunque con il suo maglione a pois!' },
      { id: 'ento', name: 'Ento', role: 'Membro MS', desc: 'Chill hoodie verde e consigli strategici.' },
      { id: 'matti', name: 'Matti', role: 'Membro MS', desc: 'Party animal con occhiali da sole e re del beer pong.' },
      { id: 'jona', name: 'Jona', role: 'Membro MS', desc: 'Tall & cool in polo blu scuro.' },
      { id: 'pibe', name: 'Pibe', role: 'Membro MS', desc: 'Bomber in maglia albiceleste, esperto di dribbling.' },
      { id: 'lollo', name: 'Lollo', role: 'DJ di MS 🎧', desc: 'Controlla la consolle del salone.' },
      { id: 'roby', name: 'Roby', role: 'Membro MS', desc: 'Amico fidato in verde smeraldo.' },
      { id: 'lindi', name: 'Lindi', role: 'Membro MS', desc: 'Chic ed elegante, amica fidata di Mari.' },
      { id: 'bubi', name: 'Bubi', role: 'Membro MS', desc: 'Fornitore ufficiale di patatine al tartufo.' },
      { id: 'jelmo', name: 'Jelmo', role: 'Membro MS', desc: 'Mente analitica e calcolo delle traiettorie.' },
      { id: 'ara', name: 'Ara', role: 'Membro MS', desc: 'Sorriso solare e vestito pesca corallo.' }
    ];

    let gridHtml = `
      <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">
        💡 <em>Tutti gli sprite sono salvati in <code>assets/sprites/</code>. Puoi sostituire ogni file PNG in qualsiasi momento con le tue immagini personalizzate e compariranno subito nel gioco!</em>
      </div>
      <div class="sprites-grid">
    `;

    for (const c of chars) {
      gridHtml += `
        <div class="sprite-card">
          <div class="sprite-preview-wrap">
            <img src="assets/sprites/${c.id}.png" alt="${c.name}">
          </div>
          <div class="sprite-card-name">${c.name}</div>
          <div class="sprite-card-role">${c.role}</div>
          <div style="font-size: 10px; color: #cbd5e1; margin-top: 4px;">${c.desc}</div>
        </div>
      `;
    }
    gridHtml += '</div>';
    body.innerHTML = gridHtml;
  }

  loop(currentTime) {
    const dt = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update
    this.characters.update(this.keys, this.state);
    this.checkWinCondition();
    this.updateHud();

    // Render
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.house.render(this.ctx);
    this.characters.render(this.ctx);

    // Render interaction prompt tooltip if near something
    if (!this.state.dialogueActive && !this.state.gameWon) {
      const p = this.characters.player;
      let promptText = null;

      const doorNear = this.house.getInteractiveNear(p.x, p.y, 45);
      if (doorNear && doorNear.type === 'door') {
        promptText = `[E] ${doorNear.item.isOpen ? 'Chiudi' : 'Apri'} ${doorNear.item.name}`;
      } else {
        const npcNear = this.characters.getNpcNear(p.x, p.y, 50);
        if (npcNear) {
          promptText = `[E] Parla con ${npcNear.name}`;
        } else if (doorNear && doorNear.type === 'furniture') {
          promptText = `[E] Usa ${doorNear.item.name}`;
        }
      }

      if (promptText) {
        this.ctx.font = 'bold 12px "Courier New", monospace';
        const tw = this.ctx.measureText(promptText).width;
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        this.ctx.fillRect(p.x - tw / 2 - 8, p.y - 44, tw + 16, 22);
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(p.x - tw / 2 - 8, p.y - 44, tw + 16, 22);

        this.ctx.fillStyle = '#facc15';
        this.ctx.fillText(promptText, p.x - tw / 2, p.y - 29);
      }
    }

    // Alone romance overlay effect
    if (this.aloneTimer > 0) {
      const alpha = Math.min(0.35, this.aloneTimer / 250);
      this.ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 20px monospace';
      this.ctx.fillText(`✨ MOMENTO ROMANTICO: DA SOLI CON MARI! (${Math.ceil((180 - this.aloneTimer) / 60)}s) ✨`, 260, 40);
    }

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Instantiate on window load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
