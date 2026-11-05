// Main Game Engine & Controller for Festa a Monnaz (Pokemon Perla Edition)

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set 960x640 resolution for crisp DS pixel aspect
    this.canvas.width = 960;
    this.canvas.height = 640;

    this.house = new House();
    this.characters = new CharacterManager(this.house);
    
    this.keys = {};
    this.setupInput();

    this.state = {
      mariInterest: 20,
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

    // Camera Mode: 'pokemon' (zoomed following Leon) or 'overview' (whole house)
    this.zoomMode = 'pokemon';
    this.camera = { x: 120, y: 450 };

    this.aloneTimer = 0;
    this.confessionTriggered = false;
    this.toastTimer = null;

    this.setupUI();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));

    setTimeout(() => {
      this.showNotification("Festa a Monnaz! Trova la bella Mari e cerca di restare da solo con lei!");
    }, 1000);
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (e.code === 'Space' || e.code === 'KeyE') {
        this.handleInteract();
      }

      if (e.code === 'Escape') {
        this.closeDialogue();
      }

      if (this.state.dialogueActive && (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3')) {
        const idx = parseInt(e.key) - 1;
        if (this.state.currentChoices && this.state.currentChoices[idx]) {
          this.selectChoice(idx);
        }
      }

      if (e.code === 'KeyQ' || e.code === 'KeyF') {
        this.useChips();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

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
    // Camera toggle button
    const cameraBtn = document.getElementById('cameraBtn');
    if (cameraBtn) {
      cameraBtn.addEventListener('click', () => {
        this.zoomMode = (this.zoomMode === 'pokemon') ? 'overview' : 'pokemon';
        cameraBtn.textContent = (this.zoomMode === 'pokemon') 
          ? '🎥 Vista: Zoom Pokémon (DS)' 
          : '🗺️ Vista: Villa Intera';
        cameraBtn.classList.toggle('btn-pink', this.zoomMode === 'pokemon');
      });
    }

    // Audio button
    const audioBtn = document.getElementById('audioBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.soundSystem.toggleMute();
        audioBtn.textContent = isMuted ? '🔇 BGM: OFF' : '🔊 BGM Pokémon: ON';
        audioBtn.classList.toggle('btn-pink', !isMuted);
      });
    }

    // Sprites Modal
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

    // Quick chip click
    const slot3 = document.getElementById('slot3');
    if (slot3) {
      slot3.style.cursor = 'pointer';
      slot3.addEventListener('click', () => {
        if (this.state.inventory.includes('chips_bubi')) {
          this.useChips();
        }
      });
    }

    window.addEventListener('click', () => {
      window.soundSystem.init();
      if (!window.soundSystem.musicPlaying && !window.soundSystem.isMuted) {
        window.soundSystem.startBgm();
      }
    }, { once: true });
  }

  handleInteract() {
    if (this.state.dialogueActive) {
      if (!this.state.currentChoices || this.state.currentChoices.length === 0) {
        this.closeDialogue();
      }
      return;
    }

    const p = this.characters.player;

    // 1. Check nearby doors first
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

    // 3. Check interactive furniture
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
        this.showNotification("Il frigo di Kri è pieno di bibite e Poffin di Sinnoh.");
      }
    } else if (f.action === 'dj_booth') {
      this.openDialogue('lollo');
    } else if (f.action === 'beer_pong') {
      window.soundSystem.playBlip();
      this.showNotification("Matti e Jelmo stanno disputando la finale di Beer Pong Pokéball!");
    } else if (f.action === 'guitar') {
      window.soundSystem.playHeart();
      this.showNotification("Una chitarra classica di Cuoripoli. Atmosfera romantica e intima.");
    } else if (f.action === 'telescope') {
      window.soundSystem.playBlip();
      this.showNotification("Attraverso il telescopio si scorgono le acque scintillanti del Lago Verità!");
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

  triggerPokemonTrainerSpot(trainerName, message) {
    const flash = document.getElementById('pokemonFlash');
    if (flash) {
      flash.classList.add('active');
      setTimeout(() => flash.classList.remove('active'), 250);
    }
    this.showNotification(message);
  }

  openDialogue(speakerId) {
    const data = DIALOGUES[speakerId];
    if (!data) return;

    this.state.dialogueActive = true;
    this.state.currentSpeaker = speakerId;
    window.soundSystem.playSelect();

    const overlay = document.getElementById('dialogueOverlay');
    const cutinLayer = document.getElementById('trainerCutinLayer');
    const leonImg = document.getElementById('trainerPortraitLeon');
    const mariImg = document.getElementById('trainerPortraitMari');
    const nameEl = document.getElementById('dialogueName');
    const textEl = document.getElementById('dialogueText');
    const choicesEl = document.getElementById('dialogueChoices');

    overlay.classList.remove('hidden');

    // Show Battle Cut-in Sprites when talking to Mari!
    if (speakerId === 'mari' || this.state.mariAloneWithLeon) {
      cutinLayer.style.display = 'flex';
      leonImg.style.display = 'block';
      mariImg.style.display = 'block';
      // Force reload images with timestamp
      mariImg.src = `assets/sprites/mari_portrait.png?v=${Date.now()}`;
      leonImg.src = `assets/sprites/leon_portrait.png?v=${Date.now()}`;
    } else {
      cutinLayer.style.display = 'none';
    }

    nameEl.textContent = `${data.speaker} - ${data.title || ''}`;

    let introText = (typeof data.intro === 'function') ? data.intro(this.state) : (data.intro || '');
    if (data.getIntro) introText = data.getIntro(this.state);
    textEl.textContent = introText;

    let choices = (typeof data.choices === 'function') ? data.choices(this.state) : (data.choices || []);
    if (data.getChoices) choices = data.getChoices(this.state);
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

    textEl.textContent = choice.reply;
    choicesEl.innerHTML = '<span style="font-size:12px; color:#64748b; font-weight:bold;">[Premi Spazio o Invio per continuare]</span>';
    this.state.currentChoices = [];

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
      this.showNotification("❤️ Mari ti sta seguendo! Portala in una stanza appartata senza farti beccare!");
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
      this.showNotification("🎶 Lollo ha lanciato il pezzo lento romantico a Monnaz! Mari ne sarà entusiasta!");
    } else if (choice.action === 'distract_maya') {
      const maya = this.characters.getNpc('maya');
      if (maya) {
        maya.state = 'distracted';
        maya.distractTimer = 420;
        this.closeDialogue();
        this.showNotification("Maya è occupata a divorare le patatine!");
      }
    }
  }

  triggerMayaClingDialogue() {
    this.state.mayaDodges++;
    this.openDialogue('maya');
    const textEl = document.getElementById('dialogueText');
    textEl.textContent = "MAYA: LEON! Non mi scappi! Ho fatto il test di affinità di Sinnoh e siamo compatibili al 99%! Ti devo raccontare di quella volta che ho sfidato un Bidoof!";
  }

  triggerMayaInterruptDialogue() {
    this.state.mariInterest = Math.max(30, this.state.mariInterest - 20);
    this.updateHud();
    this.openDialogue('maya');
    const textEl = document.getElementById('dialogueText');
    textEl.textContent = "MAYA: Leon! Ti ho beccato! Cosa fai con Mari?! \nMARI: Oh cielo... Leon, vi lascio tranquilli, torno dagli altri nel salone!";
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
    const fillEl = document.getElementById('meterFill');
    const valEl = document.getElementById('meterVal');
    if (fillEl && valEl) {
      fillEl.style.width = `${this.state.mariInterest}%`;
      valEl.textContent = `${this.state.mariInterest}%`;
    }

    const p = this.characters.player;
    const room = this.house.getRoomAt(p.x, p.y);
    const roomEl = document.getElementById('currentRoomText');
    if (roomEl) roomEl.textContent = room.name;

    const maya = this.characters.getNpc('maya');
    const mayaStatusEl = document.getElementById('mayaStatusText');
    if (maya && mayaStatusEl) {
      const dist = Math.hypot(p.x - maya.x, p.y - maya.y);
      if (maya.state === 'cling') {
        mayaStatusEl.className = 'maya-status maya-alert';
        mayaStatusEl.textContent = '🚨 BLOCCATO DA MAYA!';
      } else if (maya.state === 'chase' || dist < 200) {
        mayaStatusEl.className = 'maya-status maya-warning';
        mayaStatusEl.textContent = '⚠️ MAYA TI INSEGUE!';
      } else if (maya.state === 'distracted') {
        mayaStatusEl.className = 'maya-status maya-safe';
        mayaStatusEl.textContent = '🍟 Maya mangia patatine';
      } else {
        mayaStatusEl.className = 'maya-status maya-safe';
        mayaStatusEl.textContent = '🟢 Nessun pericolo';
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

    if (!mari || !mari.isFollowing) return;

    const currentRoom = this.house.getRoomAt(p.x, p.y);
    const mariRoom = this.house.getRoomAt(mari.x, mari.y);

    const isPrivate = (currentRoom.id === 'balcony' || currentRoom.id === 'bedroom');

    if (isPrivate && currentRoom.id === mariRoom.id) {
      let intruderFound = false;
      for (const npc of this.characters.npcs) {
        if (npc.id !== 'mari' && npc.room === currentRoom.id) {
          intruderFound = true;
          break;
        }
      }

      if (!intruderFound) {
        this.aloneTimer++;
        window.soundSystem.setRomantic(true);

        if (this.aloneTimer > 180 && !this.confessionTriggered) {
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

    const overlay = document.getElementById('dialogueOverlay');
    const cutinLayer = document.getElementById('trainerCutinLayer');
    const nameEl = document.getElementById('dialogueName');
    const textEl = document.getElementById('dialogueText');
    const choicesEl = document.getElementById('dialogueChoices');

    this.state.dialogueActive = true;
    overlay.classList.remove('hidden');
    cutinLayer.style.display = 'flex';

    nameEl.textContent = 'Mari ❤️ La più bella di MS';
    
    const locationName = (room.id === 'balcony') ? 'sul balcone con vista sul Lago Verità' : 'nella quiete della stanza';
    textEl.textContent = `Mari: "Leon... guardaci. Finalmente da soli ${locationName}. La notte è magica, ma tu sei stato incredibile stasera. Sei riuscito a seminarli tutti... per me."`;

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
        <div style="display: flex; gap: 20px; justify-content: center; align-items: flex-end;">
          <img src="assets/sprites/leon_portrait.png" style="height: 180px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));">
          <div style="font-size: 48px; animation: pulse 1s infinite;">💖</div>
          <img src="assets/sprites/mari_portrait.png" style="height: 180px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));">
        </div>
        <h2 style="color: #f472b6; font-size: 22px;">Missione Compiuta alla Festa di Monnaz!</h2>
        <p style="font-size: 14px; line-height: 1.6; max-width: 600px; color: #e2e8f0;">
          Leon e la bella Mari sono rimasti da soli sotto il cielo stellato di Monnaz! Tutta la crew di <strong>MS</strong> sta applaudendo dalla finestra, mentre Maya sta ancora cercando Leon per il corridoio!
        </p>
        <div style="background: #1e293b; padding: 14px 24px; border-radius: 8px; border: 2px solid #38bdf8; text-align: left; width: 100%; max-width: 440px;">
          <div style="margin-bottom: 6px;">⏱️ <strong>Tempo impiegato:</strong> ${elapsedSecs} secondi</div>
          <div style="margin-bottom: 6px;">👓 <strong>Ostacolo Maya schivato con successo!</strong></div>
          <div style="margin-bottom: 6px;">🍸 <strong>Cocktail di Kri servito a perfezione!</strong></div>
          <div style="color: #fbbf24;">🏆 <strong>Titolo sbloccato:</strong> Campione di Sinnoh & Conquistatore di Monnaz</div>
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
    title.textContent = '👥 Membri MS & Sprite Ufficiali Pokémon Perla';

    const chars = [
      { id: 'leon', name: 'Leon', role: 'Protagonista Giocabile (MS)', desc: 'T-shirt Vitality nera e riccioli castani. Determinato a conquistare Mari.' },
      { id: 'mari', name: 'Mari', role: 'La più bella di MS ❤️', desc: 'Abito viola elegante e capelli ondulati. Obiettivo romantico del gioco.' },
      { id: 'kri', name: 'Kri', role: 'Padrone di Casa & Barman', desc: 'Ospita la leggendaria festa nella villa di Monnaz.' },
      { id: 'maya', name: 'Maya', role: 'Festaiola Ostacolo 👓', desc: 'Insegue Leon con il suo maglione a pois fosforescenti!' },
      { id: 'ento', name: 'Ento', role: 'Asso Allenatore MS', desc: 'Hoodie verde e consigli tattici per seminare Maya.' },
      { id: 'matti', name: 'Matti', role: 'Campione Beer Pong Sinnoh', desc: 'Occhiali da sole e re dei bicchieri Pokéball.' },
      { id: 'jona', name: 'Jona', role: 'Allenatore MS', desc: 'Polo blu navy nei pressi del corridoio.' },
      { id: 'pibe', name: 'Pibe', role: 'Bomber di Sinnoh ⚽', desc: 'Maglia albiceleste e dribbling su Maya.' },
      { id: 'lollo', name: 'Lollo', role: 'DJ Resident Cuoripoli 🎧', desc: 'In consolle per lanciare la traccia lenta romantica.' },
      { id: 'roby', name: 'Roby', role: 'Amico di Sinnoh 💚', desc: 'Verde smeraldo, fa il tifo per Leon.' },
      { id: 'lindi', name: 'Lindi', role: 'Amica di Mari ✨', desc: 'Chic ed elegante, ti svela cosa piace a Mari.' },
      { id: 'bubi', name: 'Bubi', role: 'Maestro Poffin & Snack 🍟', desc: 'Fornisce le patatine al tartufo per distrarre Maya!' },
      { id: 'jelmo', name: 'Jelmo', role: 'Scienziato Pokémon MS 📊', desc: 'Calcola le traiettorie di sicurezza della villa.' },
      { id: 'ara', name: 'Ara', role: 'Fanciulla delle Feste 🌸', desc: 'Vestito pesca corallo, sorridente nel giardino.' }
    ];

    let gridHtml = `
      <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">
        🎮 <em>Sprite ufficiali in stile Pokémon Perla (Gen 4). I ritratti originali di Leon e Mari sono attivi nei dialoghi!</em>
      </div>
      <div class="sprites-grid">
    `;

    for (const c of chars) {
      gridHtml += `
        <div class="sprite-card">
          <div class="sprite-preview-wrap">
            <img src="assets/sprites/${c.id}.png?v=${Date.now()}" alt="${c.name}">
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

    this.characters.update(this.keys, this.state);
    this.checkWinCondition();
    this.updateHud();

    // Smooth Camera Follow
    const p = this.characters.player;
    this.camera.x += (p.x - this.camera.x) * 0.1;
    this.camera.y += (p.y - this.camera.y) * 0.1;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    if (this.zoomMode === 'pokemon') {
      const zoom = 1.7; // Pokemon DS close-up scale!
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(zoom, zoom);
      this.ctx.translate(-this.camera.x, -this.camera.y);
    } else {
      // Overview fit scale
      const overviewScale = Math.min(this.canvas.width / 1200, this.canvas.height / 900);
      this.ctx.scale(overviewScale, overviewScale);
    }

    this.house.render(this.ctx);
    this.characters.render(this.ctx);

    // Interaction prompt tooltip
    if (!this.state.dialogueActive && !this.state.gameWon) {
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
        this.ctx.fillRect(p.x - tw / 2 - 8, p.y - 48, tw + 16, 22);
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(p.x - tw / 2 - 8, p.y - 48, tw + 16, 22);

        this.ctx.fillStyle = '#fef08a';
        this.ctx.fillText(promptText, p.x - tw / 2, p.y - 33);
      }
    }

    // Romance alone overlay
    if (this.aloneTimer > 0) {
      const alpha = Math.min(0.4, this.aloneTimer / 240);
      this.ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
      this.ctx.fillRect(0, 0, this.house.width, this.house.height);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 20px monospace';
      this.ctx.fillText(`✨ MOMENTO ROMANTICO: DA SOLI CON MARI! (${Math.ceil((180 - this.aloneTimer) / 60)}s) ✨`, p.x - 240, p.y - 80);
    }

    this.ctx.restore();

    requestAnimationFrame((t) => this.loop(t));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
