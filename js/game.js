// ============================================================
// LEON & LA BELLA MARI - FESTA A MONNAZ (POKÉMON PERLA EDITION)
// Full Robust Engine: Tiles, Sprites, Anti-Freeze AI, Romance Quest
// ============================================================

// 1. SOUND SYSTEM (Web Audio API)
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.musicPlaying = false;
    this.bgmTimer = null;
    this.step = 0;
    this.isRomantic = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) this.stopBgm();
    else this.startBgm();
    return this.isMuted;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.12) {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  playBlip() { this.playTone(520, 'square', 0.04, 0.04); }
  playSelect() { this.playTone(720, 'triangle', 0.06, 0.08); }
  playDoor() { this.playTone(200, 'square', 0.08, 0.08); }

  playPokemonEncounter() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 440, t: 0.0, d: 0.08 },
        { f: 554.37, t: 0.08, d: 0.08 },
        { f: 659.25, t: 0.16, d: 0.08 },
        { f: 880, t: 0.24, d: 0.3 }
      ];
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.18, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch(e) {}
  }

  playHeart() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.07);
        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch(e) {}
  }

  playPickup() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 880, 783.99, 1174.66];
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.22);
      });
    } catch(e) {}
  }

  playVictory() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, d: 0.12, t: 0.0 },
        { f: 523.25, d: 0.12, t: 0.12 },
        { f: 523.25, d: 0.12, t: 0.24 },
        { f: 523.25, d: 0.25, t: 0.36 },
        { f: 415.30, d: 0.25, t: 0.61 },
        { f: 466.16, d: 0.25, t: 0.86 },
        { f: 523.25, d: 0.50, t: 1.11 }
      ];
      fanfare.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.2, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch(e) {}
  }

  startBgm() {
    if (this.musicPlaying || this.isMuted) return;
    this.musicPlaying = true;
    this.step = 0;
    this.bgmTimer = setInterval(() => {
      if (!this.musicPlaying || this.isMuted) return;
      this.tickBgm();
      this.step = (this.step + 1) % 16;
    }, 125);
  }

  stopBgm() {
    this.musicPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  tickBgm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.isRomantic) {
      const sinnohNight = [329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 440.00, 523.25];
      if (this.step % 2 === 0) {
        const nIdx = (this.step / 2) % sinnohNight.length;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(sinnohNight[nIdx], now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
      return;
    }

    if (this.step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.09);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }
    if (this.step % 2 === 1) {
      this.playTone(1300, 'square', 0.02, 0.02);
    }
  }

  setRomantic(romantic) { this.isRomantic = romantic; }
}

const soundSystem = new SoundSystem();

// 2. TILEMAP & VILLA LAYOUT
const HOUSE_DATA = {
  width: 1200,
  height: 900,
  rooms: [
    { id: 'living_room', name: 'Salone delle Feste', x: 40, y: 350, w: 460, h: 360, floor: 'wood_dark', carpet: { x: 100, y: 550, w: 180, h: 120, col: '#881337', brd: '#fbbf24' } },
    { id: 'kitchen', name: 'Cucina & Beer Pong', x: 40, y: 60, w: 460, h: 250, floor: 'checkers' },
    { id: 'hallway', name: 'Corridoio', x: 540, y: 60, w: 160, h: 650, floor: 'wood_light', carpet: { x: 570, y: 80, w: 100, h: 610, col: '#1e3a8a', brd: '#93c5fd' } },
    { id: 'bedroom', name: 'Camera da Letto Relax', x: 740, y: 60, w: 420, h: 280, floor: 'wood_warm', carpet: { x: 880, y: 160, w: 160, h: 120, col: '#581c87', brd: '#f472b6' } },
    { id: 'bathroom', name: 'Bagno della Villa', x: 740, y: 380, w: 180, h: 160, floor: 'tiles_blue' },
    { id: 'balcony', name: 'Terrazza Panoramica', x: 740, y: 580, w: 420, h: 260, floor: 'stone_deck' },
    { id: 'garden', name: 'Giardino di Sinnoh', x: 40, y: 750, w: 460, h: 120, floor: 'grass' }
  ],
  walls: [
    { x: 30, y: 40, w: 1150, h: 24 },
    { x: 30, y: 880, w: 1150, h: 24 },
    { x: 20, y: 40, w: 24, h: 850 },
    { x: 1170, y: 40, w: 24, h: 850 },
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
  ],
  doors: [
    { id: 'door_bedroom', room: 'bedroom', x: 700, y: 230, w: 28, h: 70, isOpen: false, name: 'Porta Camera' },
    { id: 'door_balcony', room: 'balcony', x: 700, y: 620, w: 28, h: 60, isOpen: true, name: 'Portafinestra Balcone' },
    { id: 'door_living', room: 'living_room', x: 500, y: 310, w: 28, h: 90, isOpen: true, name: 'Arco Salone' },
    { id: 'door_bathroom', room: 'bathroom', x: 700, y: 410, w: 28, h: 60, isOpen: false, name: 'Porta Bagno' },
    { id: 'door_garden', room: 'garden', x: 230, y: 710, w: 80, h: 24, isOpen: true, name: 'Uscita Giardino' }
  ],
  furniture: [
    { id: 'fridge', name: 'Frigorifero', x: 60, y: 70, w: 56, h: 70, type: 'fridge', isInteractive: true, action: 'fridge' },
    { id: 'sink', name: 'Bancone Bar', x: 120, y: 70, w: 160, h: 56, type: 'counter' },
    { id: 'beer_pong', name: 'Beer Pong Pokéball', x: 150, y: 160, w: 190, h: 76, type: 'beer_pong', isInteractive: true, action: 'beer_pong' },
    { id: 'dj_booth', name: 'Consolle DJ Lollo', x: 60, y: 370, w: 140, h: 64, type: 'dj', isInteractive: true, action: 'dj_booth' },
    { id: 'dancefloor', name: 'Pista di Ballo', x: 230, y: 380, w: 180, h: 140, type: 'dancefloor', isFloor: true },
    { id: 'sofa', name: 'Divano in Pelle', x: 80, y: 550, w: 160, h: 64, type: 'sofa' },
    { id: 'coffee_table', name: 'Tavolino Noce', x: 100, y: 630, w: 120, h: 44, type: 'table' },
    { id: 'bed', name: 'Letto Matrimoniale', x: 920, y: 70, w: 160, h: 150, type: 'bed' },
    { id: 'tv', name: 'TV & Console Wii', x: 760, y: 70, w: 80, h: 54, type: 'tv' },
    { id: 'bookshelf', name: 'Libreria di Sinnoh', x: 760, y: 150, w: 50, h: 80, type: 'bookshelf' },
    { id: 'telescope', name: 'Telescopio Astronomico', x: 1090, y: 610, w: 48, h: 48, type: 'telescope', isInteractive: true, action: 'telescope' },
    { id: 'bench', name: 'Panchina Balcone', x: 920, y: 730, w: 130, h: 48, type: 'bench' }
  ]
};

// 3. DIALOGUES DATA
const DIALOGUE_DATA = {
  mari: {
    speaker: 'Mari',
    title: 'La bella Mari ❤️',
    intro: (s) => {
      if (s.mariAlone) return "Leon... guardaci. Finalmente da soli sul balcone. La notte è magica, ma tu sei stato incredibile stasera.";
      if (s.mariFollowing) return "Ti sto seguendo, Leon! Portami in un posto tranquillo... lontano da Maya!";
      if (s.mariLove >= 100) return "Leon, sei stato dolcissimo stasera... c'è troppo casino qui nel salone. Ti andrebbe di mostrarmi la terrazza o un posto appartato?";
      return "Ciao Leon! Che bella festa stasera a Monnaz... la musica è forte, ma l'atmosfera è fantastica!";
    },
    choices: (s) => {
      if (s.mariLove >= 100 && !s.mariFollowing) {
        return [
          { text: "Certo Mari! Vieni con me, andiamo sulla terrazza!", action: 'follow', reply: "Arrivo con te! Fai strada tu, non farti intercettare da Maya!" }
        ];
      }
      if (s.mariFollowing) {
        return [
          { text: "Seguimi, quasi arrivati...", reply: "Ti seguo a ruota!" }
        ];
      }
      const opts = [
        { text: "Mari, sei incantevole stasera. Questo vestito viola spicca su tutta la festa.", bonus: 30, reply: "Grazie Leon! Sei sempre un vero gentiluomo, e quella maglietta Vitality ti sta davvero bene." },
        { text: "Leon & Mari: la coppia più forte di tutta MS, che ne pensi?", bonus: 20, reply: "Ahaha che sfacciato! Però ammetto che hai stile e mi fai ridere." }
      ];
      if (s.inventory.includes('drink')) {
        opts.unshift({ text: "Ti ho portato questo Cocktail Fragola & Menta fresco dal frigo!", bonus: 50, consume: 'drink', reply: "Mio dio, il mio cocktail preferito! Ma come facevi a saperlo? Leon, sei incredibile!" });
      }
      if (s.djRomance) {
        opts.push({ text: "Hai sentito la canzone romantica che ha messo Lollo per noi?", bonus: 30, reply: "È stupenda! Adoro questo genere di musica... mi fa venire voglia di andare a guardare le stelle." });
      }
      return opts;
    }
  },

  maya: {
    speaker: 'Maya',
    title: 'L\'incubo di Monnaz 👓',
    intro: () => "LEOOOON! Ma allora esisti! Ti cercavo! Ho fatto il test di affinità di Sinnoh e dice che siamo anime gemelle al 99%!",
    choices: (s) => {
      const opts = [
        { text: "Guarda Maya, un Bidoof dorato fuori dalla finestra!", action: 'escape_maya', reply: "DOVE?! Un Bidoof dorato?! *Maya si gira confusa cercandolo invano*" }
      ];
      if (s.inventory.includes('chips')) {
        opts.unshift({ text: "(Usa il pacchetto di patatine al tartufo di Bubi)", action: 'feed_maya', consume: 'chips', reply: "PATATINE AL TARTUFO! Slurp! *Maya si fionda a divorare le patatine*" });
      }
      return opts;
    }
  },

  kri: {
    speaker: 'Kri',
    title: 'Padrone di Casa & Barman',
    intro: () => "Leon, fratellone di MS! Benvenuto a Monnaz a casa mia! La festa è accesa!",
    choices: (s) => [
      { text: "Kri, hai visto la bella Mari?", reply: "Mari è nei paraggi della pista! Splende stasera. Ma occhio: Maya ha già chiesto di te tre volte!" },
      { text: "Dov'è il drink speciale di Mari?", reply: "Nel frigo in cucina! Prendilo pure. E se porti una birra a Lollo alla console, ti mette la traccia romantica!" }
    ]
  },

  lollo: {
    speaker: 'Lollo',
    title: 'DJ Resident Cuoripoli 🎧',
    intro: (s) => s.djRomance ? "La traccia lenta romantica sta suonando a palla per te e Mari, Leon!" : "Yo Leon! Se mi porti una birra fresca dal frigo metto su la playlist 'Notte Romantica a Monnaz'!",
    choices: (s) => {
      if (s.inventory.includes('beer')) {
        return [{ text: "Ecco la birra fresca, Lollo! Metti il pezzo lento!", consume: 'beer', action: 'set_romance', reply: "Grande bro! Cambio subito traccia: beat romantico per fare colpo su Mari!" }];
      }
      return [{ text: "Che musica stai mettendo?", reply: "Hit da ballare! Portami una birra dal frigo e parte la slow-dance!" }];
    }
  },

  bubi: {
    speaker: 'Bubi',
    title: 'Maestro Snack (MS) 🍟',
    intro: () => "Crunch crunch! Leon, queste patatine al tartufo sono divine. Vuoi un pacchetto?",
    choices: (s) => [
      { text: "Grazie Bubi, dammene uno! Mi servirà contro Maya.", action: 'give_chips', reply: "Tieni! Se Maya ti punta, lanciale per terra col tasto Q: non resiste al cibo!" }
    ]
  },

  ento: {
    speaker: 'Ento', title: 'Asso Allenatore MS 🧢',
    intro: () => "Bella Leon! Punta tutto sulla terrazza panoramica: la vista sul lago è micidiale. Chiudi la porta dietro di voi!",
    choices: () => [{ text: "Grazie del consiglio, Ento!", reply: "Forza Leon, tutta MS è con te!" }]
  },
  matti: {
    speaker: 'Matti', title: 'Campione Beer Pong 🕶️',
    intro: () => "Stasera si sboccia a Monnaz! Sto dominando al tavolo con Jelmo!",
    choices: () => [{ text: "Grande Matti, continua così!", reply: "Daje Leon, conquista Mari!" }]
  },
  jona: {
    speaker: 'Jona', title: 'Allenatore MS 👕',
    intro: () => "Leon! Se tieni premuto SHIFT scatti veloce e semini Maya in un attimo!",
    choices: () => [{ text: "Ottimo trucco!", reply: "Vai a prenderti Mari!" }]
  },
  pibe: {
    speaker: 'Pibe', title: 'Bomber di Sinnoh ⚽',
    intro: () => "Dribbling secco su Maya e assist per il gol con Mari! Come sul campo!",
    choices: () => [{ text: "Tattica perfetta!", reply: "Non farti marcare a uomo!" }]
  },
  roby: {
    speaker: 'Roby', title: 'Amico di Sinnoh 💚',
    intro: () => "Leon! Mari prima ha detto a Lindi che adora la vista delle stelle dal balcone...",
    choices: () => [{ text: "Ottima informazione, grazie Roby!", reply: "Falla tua, bro!" }]
  },
  lindi: {
    speaker: 'Lindi', title: 'Amica di Mari ✨',
    intro: () => "Leon! Mari ha scelto apposta questo vestito viola per la festa. Fai il galante!",
    choices: () => [{ text: "È la più bella di tutte.", reply: "Lo sappiamo tutti! Vai convinto!" }]
  },
  jelmo: {
    speaker: 'Jelmo', title: 'Scienziato MS 📊',
    intro: () => "Probabilità di successo con Mari: 94%. Probabilità di intercettazione di Maya nel corridoio: elevata.",
    choices: () => [{ text: "Prenderò la via della cucina!", reply: "Decisione tatticamente ottimale." }]
  },
  ara: {
    speaker: 'Ara', title: 'Fanciulla delle Feste 🌸',
    intro: () => "Che bella serata! Leon, se porti Mari sul balcone ricordati di chiudere la portafinestra!",
    choices: () => [{ text: "Sarà fatto!", reply: "Buona fortuna!" }]
  }
};

// 4. MAIN GAME ENGINE
class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 800;
    this.canvas.height = 560;

    this.keys = {};
    this.setupInput();

    // Cache-busting sprite loader
    this.sprites = {};
    this.loadSprites();

    // Game State
    this.initGame();

    // Camera
    this.camera = { x: 120, y: 450 };
    this.zoomMode = 'pokemon'; // 'pokemon' (DS close-up) or 'overview'

    // UI bindings
    this.bindUI();

    // Start Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));

    this.showToast("🎮 Benvenuto a Monnaz! Trova la bella Mari e resta da solo con lei!");
  }

  initGame() {
    this.state = {
      mariLove: 20,
      mariFollowing: false,
      mariAlone: false,
      djRomance: false,
      inventory: [],
      dialogueOpen: false,
      speaker: null,
      choices: [],
      won: false,
      startTime: Date.now()
    };

    this.aloneCountdown = 0;

    // Player (Leon)
    this.player = {
      x: 120, y: 450,
      w: 32, h: 40,
      speed: 3.0,
      sprintSpeed: 4.8,
      dir: 'down',
      isMoving: false,
      isSprinting: false,
      shieldTimer: 0 // invulnerability frames after escaping Maya
    };

    // Characters list
    this.npcs = [
      { id: 'mari', name: 'Mari', x: 320, y: 420, dir: 'down', room: 'living_room', isFollowing: false },
      { id: 'kri', name: 'Kri', x: 100, y: 160, dir: 'right', room: 'kitchen' },
      { id: 'maya', name: 'Maya', x: 600, y: 200, dir: 'down', room: 'hallway', state: 'patrol', timer: 120, confusedTimer: 0 },
      { id: 'lollo', name: 'Lollo', x: 120, y: 345, dir: 'down', room: 'living_room' },
      { id: 'bubi', name: 'Bubi', x: 320, y: 90, dir: 'left', room: 'kitchen' },
      { id: 'matti', name: 'Matti', x: 390, y: 180, dir: 'left', room: 'kitchen' },
      { id: 'jelmo', name: 'Jelmo', x: 390, y: 230, dir: 'left', room: 'kitchen' },
      { id: 'ento', name: 'Ento', x: 80, y: 640, dir: 'right', room: 'living_room' },
      { id: 'roby', name: 'Roby', x: 230, y: 640, dir: 'left', room: 'living_room' },
      { id: 'jona', name: 'Jona', x: 620, y: 530, dir: 'down', room: 'hallway' },
      { id: 'pibe', name: 'Pibe', x: 620, y: 410, dir: 'up', room: 'hallway' },
      { id: 'lindi', name: 'Lindi', x: 420, y: 450, dir: 'left', room: 'living_room' },
      { id: 'ara', name: 'Ara', x: 230, y: 800, dir: 'right', room: 'garden' }
    ];

    // Reset doors
    HOUSE_DATA.doors.forEach(d => {
      d.isOpen = (d.id === 'door_balcony' || d.id === 'door_living' || d.id === 'door_garden');
    });

    this.chipsFloor = null;
    this.closeDialogue();
    this.updateHUD();
    soundSystem.setRomantic(false);
  }

  loadSprites() {
    const v = Date.now();
    const ids = ['leon', 'mari', 'kri', 'maya', 'ento', 'matti', 'jona', 'pibe', 'lollo', 'roby', 'lindi', 'bubi', 'jelmo', 'ara'];
    ids.forEach(id => {
      const img = new Image();
      img.src = `assets/sprites/${id}.png?v=${v}`;
      this.sprites[id] = img;
    });

    // Battle Portraits
    this.portraits = {
      leon: new Image(),
      mari: new Image()
    };
    this.portraits.leon.src = `assets/sprites/leon_portrait.png?v=${v}`;
    this.portraits.mari.src = `assets/sprites/mari_portrait.png?v=${v}`;
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space' || e.code === 'KeyE') {
        this.handleAction();
      }
      if (e.code === 'Escape') {
        this.closeDialogue();
      }
      if (e.code === 'KeyQ' || e.code === 'KeyF') {
        this.throwChips();
      }
      if (this.state.dialogueOpen && (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3')) {
        const idx = parseInt(e.key) - 1;
        this.chooseOption(idx);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mobile touch
    const bindTouch = (id, code) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys[code] = true; });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys[code] = false; });
      el.addEventListener('mousedown', () => { this.keys[code] = true; });
      el.addEventListener('mouseup', () => { this.keys[code] = false; });
    };

    bindTouch('tUp', 'KeyW');
    bindTouch('tDown', 'KeyS');
    bindTouch('tLeft', 'KeyA');
    bindTouch('tRight', 'KeyD');
    bindTouch('tAction', 'Space');
    bindTouch('tSprint', 'ShiftLeft');
  }

  bindUI() {
    // Restart button
    document.getElementById('btnRestart').addEventListener('click', () => {
      this.initGame();
      this.showToast("🔄 Partita ricominciata daccapo!");
    });

    // Camera toggle
    document.getElementById('btnCamera').addEventListener('click', () => {
      this.zoomMode = (this.zoomMode === 'pokemon') ? 'overview' : 'pokemon';
      document.getElementById('btnCamera').textContent = (this.zoomMode === 'pokemon') ? '🎥 Zoom DS' : '🗺️ Panoramica';
    });

    // Audio toggle
    document.getElementById('btnAudio').addEventListener('click', () => {
      const isMuted = soundSystem.toggleMute();
      document.getElementById('btnAudio').textContent = isMuted ? '🔇 Audio: OFF' : '🔊 BGM: ON';
      document.getElementById('btnAudio').classList.toggle('btn-pink', !isMuted);
    });

    // Characters modal
    document.getElementById('btnChars').addEventListener('click', () => {
      this.showCharsModal();
    });
    document.getElementById('btnCloseModal').addEventListener('click', () => {
      document.getElementById('modalLayer').classList.add('hidden');
    });

    // Bag item click
    document.getElementById('slotChips').addEventListener('click', () => {
      this.throwChips();
    });

    // First click to start audio
    window.addEventListener('click', () => {
      soundSystem.init();
      if (!soundSystem.musicPlaying && !soundSystem.isMuted) soundSystem.startBgm();
    }, { once: true });
  }

  getRoomAt(x, y) {
    for (const r of HOUSE_DATA.rooms) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        return r;
      }
    }
    return { id: 'unknown', name: 'Villa di Kri' };
  }

  isSolid(x, y, rad = 14) {
    // Walls
    for (const w of HOUSE_DATA.walls) {
      if (x + rad > w.x && x - rad < w.x + w.w && y + rad > w.y && y - rad < w.y + w.h) return true;
    }
    // Closed doors
    for (const d of HOUSE_DATA.doors) {
      if (!d.isOpen) {
        if (x + rad > d.x && x - rad < d.x + d.w && y + rad > d.y && y - rad < d.y + d.h) return true;
      }
    }
    // Solid furniture
    for (const f of HOUSE_DATA.furniture) {
      if (f.isFloor) continue;
      if (x + rad > f.x && x - rad < f.x + f.w && y + rad > f.y && y - rad < f.y + f.h) return true;
    }
    return false;
  }

  handleAction() {
    if (this.state.dialogueOpen) {
      if (!this.state.choices || this.state.choices.length === 0) {
        this.closeDialogue();
      }
      return;
    }

    const p = this.player;

    // Check door nearby
    for (const d of HOUSE_DATA.doors) {
      const cx = d.x + d.w / 2;
      const cy = d.y + d.h / 2;
      if (Math.hypot(p.x - cx, p.y - cy) < 46) {
        d.isOpen = !d.isOpen;
        soundSystem.playDoor();
        this.showToast(`${d.name} ${d.isOpen ? 'APERTA' : 'CHIUSA'}`);
        return;
      }
    }

    // Check NPC nearby
    for (const n of this.npcs) {
      if (Math.hypot(p.x - n.x, p.y - n.y) < 50) {
        this.openDialogue(n.id);
        return;
      }
    }

    // Check furniture
    for (const f of HOUSE_DATA.furniture) {
      if (!f.isInteractive) continue;
      const cx = f.x + f.w / 2;
      const cy = f.y + f.h / 2;
      if (Math.hypot(p.x - cx, p.y - cy) < 50) {
        this.interactFurniture(f);
        return;
      }
    }
  }

  interactFurniture(f) {
    if (f.action === 'fridge') {
      soundSystem.playPickup();
      if (!this.state.inventory.includes('drink')) {
        this.state.inventory.push('drink');
        this.showToast("Hai preso: 'Cocktail Fragola & Menta' per Mari! 🍸");
      } else if (!this.state.inventory.includes('beer')) {
        this.state.inventory.push('beer');
        this.showToast("Hai preso: 'Birra Gelata' per DJ Lollo! 🍺");
      } else {
        this.showToast("Il frigo è pieno di bibite e ghiaccio.");
      }
      this.updateHUD();
    } else if (f.action === 'dj_booth') {
      this.openDialogue('lollo');
    } else if (f.action === 'beer_pong') {
      soundSystem.playBlip();
      this.showToast("Matti e Jelmo stanno giocando a Beer Pong!");
    } else if (f.action === 'telescope') {
      soundSystem.playBlip();
      this.showToast("Attraverso il telescopio si vede il Lago Verità!");
    }
  }

  throwChips() {
    if (this.state.inventory.includes('chips')) {
      const idx = this.state.inventory.indexOf('chips');
      this.state.inventory.splice(idx, 1);
      this.chipsFloor = { x: this.player.x, y: this.player.y };
      soundSystem.playPickup();
      this.showToast("🍟 Hai buttato a terra le patatine di Bubi!");
      this.updateHUD();
    } else {
      this.showToast("Non hai patatine! Parla con Bubi in cucina.");
    }
  }

  openDialogue(speakerId) {
    const data = DIALOGUE_DATA[speakerId];
    if (!data) return;

    this.state.dialogueOpen = true;
    this.state.speaker = speakerId;
    soundSystem.playSelect();

    const overlay = document.getElementById('dialogueWrap');
    const cutinRow = document.getElementById('cutinRow');
    const speakerEl = document.getElementById('diagSpeaker');
    const textEl = document.getElementById('diagText');
    const choicesEl = document.getElementById('diagChoices');

    overlay.classList.remove('hidden');

    // Show Battle Portraits when speaking with Mari!
    if (speakerId === 'mari' || this.state.mariAlone) {
      cutinRow.style.display = 'flex';
    } else {
      cutinRow.style.display = 'none';
    }

    speakerEl.textContent = `${data.speaker} - ${data.title}`;
    textEl.textContent = data.intro(this.state);

    const choices = data.choices(this.state);
    this.state.choices = choices;
    choicesEl.innerHTML = '';

    choices.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.className = 'pkmn-choice-btn';
      btn.textContent = `[${idx + 1}] ${c.text}`;
      btn.addEventListener('click', () => this.chooseOption(idx));
      choicesEl.appendChild(btn);
    });
  }

  chooseOption(idx) {
    const choice = this.state.choices[idx];
    if (!choice) return;

    soundSystem.playBlip();
    const textEl = document.getElementById('diagText');
    const choicesEl = document.getElementById('diagChoices');

    textEl.textContent = choice.reply;
    choicesEl.innerHTML = '<span style="font-size:12px;color:#64748b;font-weight:bold;">[Premi Spazio o Invio per continuare]</span>';
    this.state.choices = [];

    if (choice.bonus) {
      this.state.mariLove = Math.min(100, this.state.mariLove + choice.bonus);
      soundSystem.playHeart();
      this.updateHUD();
    }

    if (choice.consume) {
      const i = this.state.inventory.indexOf(choice.consume);
      if (i !== -1) this.state.inventory.splice(i, 1);
      this.updateHUD();
    }

    if (choice.action === 'follow') {
      this.state.mariFollowing = true;
      const mari = this.npcs.find(n => n.id === 'mari');
      if (mari) mari.isFollowing = true;
      soundSystem.playHeart();
      this.showToast("❤️ Mari ti sta seguendo! Portala da sola sul balcone o in camera!");
    } else if (choice.action === 'give_chips') {
      if (!this.state.inventory.includes('chips')) {
        this.state.inventory.push('chips');
        soundSystem.playPickup();
        this.showToast("Hai ottenuto il Sacchetto di Patatine di Bubi!");
        this.updateHUD();
      }
    } else if (choice.action === 'set_romance') {
      this.state.djRomance = true;
      soundSystem.playHeart();
      this.showToast("🎶 Lollo ha messo la slow dance per conquistare Mari!");
    } else if (choice.action === 'escape_maya') {
      // Free Leon!
      this.escapeMaya();
    } else if (choice.action === 'feed_maya') {
      this.distractMayaWithSnack();
    }
  }

  escapeMaya() {
    this.closeDialogue();
    // Move Leon away safely
    const pushDist = 70;
    const nx = (this.player.dir === 'left') ? this.player.x - pushDist : this.player.x + pushDist;
    if (!this.isSolid(nx, this.player.y)) this.player.x = nx;

    // Maya gets confused for 10 seconds!
    const maya = this.npcs.find(n => n.id === 'maya');
    if (maya) {
      maya.state = 'confused';
      maya.confusedTimer = 600; // ~10 seconds
    }
    this.player.shieldTimer = 240; // 4 seconds invulnerability
    soundSystem.playTone(600, 'sine', 0.15, 0.15);
    this.showToast("💨 Sei sfuggito a Maya! È confusa per qualche secondo!");
  }

  distractMayaWithSnack() {
    this.closeDialogue();
    const maya = this.npcs.find(n => n.id === 'maya');
    if (maya) {
      maya.state = 'confused';
      maya.confusedTimer = 500;
    }
    this.player.shieldTimer = 240;
    soundSystem.playHeart();
    this.showToast("🍟 Maya sta divorando le patatine! Corri!");
  }

  closeDialogue() {
    this.state.dialogueOpen = false;
    document.getElementById('dialogueWrap').classList.add('hidden');
  }

  showToast(msg) {
    const t = document.getElementById('gameToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('active');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => t.classList.remove('active'), 3500);
  }

  updateHUD() {
    const fill = document.getElementById('loveFill');
    const val = document.getElementById('loveVal');
    if (fill && val) {
      fill.style.width = `${this.state.mariLove}%`;
      val.textContent = `${this.state.mariLove}%`;
    }

    const room = this.getRoomAt(this.player.x, this.player.y);
    const roomEl = document.getElementById('roomBadge');
    if (roomEl) roomEl.textContent = room.name;

    // Slots
    document.getElementById('slotDrink').classList.toggle('active', this.state.inventory.includes('drink'));
    document.getElementById('slotBeer').classList.toggle('active', this.state.inventory.includes('beer'));
    document.getElementById('slotChips').classList.toggle('active', this.state.inventory.includes('chips'));

    // Maya Radar
    const maya = this.npcs.find(n => n.id === 'maya');
    const radar = document.getElementById('mayaRadar');
    if (maya && radar) {
      if (maya.state === 'confused') {
        radar.className = 'maya-indicator maya-confused';
        radar.textContent = '💫 Maya è confusa!';
      } else if (maya.state === 'chase') {
        radar.className = 'maya-indicator maya-hunt';
        radar.textContent = '❗️ MAYA TI INSEGUE!';
      } else {
        radar.className = 'maya-indicator maya-safe';
        radar.textContent = '🟢 Nessun pericolo';
      }
    }
  }

  updatePlayer() {
    if (this.state.dialogueOpen || this.state.won) {
      this.player.isMoving = false;
      return;
    }

    if (this.player.shieldTimer > 0) this.player.shieldTimer--;

    this.player.isSprinting = !!(this.keys['ShiftLeft'] || this.keys['ShiftRight']);
    const spd = this.player.isSprinting ? this.player.sprintSpeed : this.player.speed;
    let dx = 0, dy = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) { dy -= spd; this.player.dir = 'up'; }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) { dy += spd; this.player.dir = 'down'; }
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) { dx -= spd; this.player.dir = 'left'; }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) { dx += spd; this.player.dir = 'right'; }

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    if (dx !== 0 && !this.isSolid(this.player.x + dx, this.player.y)) this.player.x += dx;
    if (dy !== 0 && !this.isSolid(this.player.x, this.player.y + dy)) this.player.y += dy;

    this.player.isMoving = (dx !== 0 || dy !== 0);
  }

  updateNPCs() {
    // 1. Mari follows Leon
    const mari = this.npcs.find(n => n.id === 'mari');
    if (mari) {
      mari.room = this.getRoomAt(mari.x, mari.y).id;
      if (mari.isFollowing && !this.state.dialogueOpen) {
        const dist = Math.hypot(this.player.x - mari.x, this.player.y - mari.y);
        if (dist > 38) {
          const angle = Math.atan2(this.player.y - mari.y, this.player.x - mari.x);
          const spd = this.player.isSprinting ? 3.6 : 2.7;
          const nx = mari.x + Math.cos(angle) * spd;
          const ny = mari.y + Math.sin(angle) * spd;
          if (!this.isSolid(nx, mari.y)) mari.x = nx;
          if (!this.isSolid(mari.x, ny)) mari.y = ny;
          mari.dir = (Math.abs(this.player.x - mari.x) > Math.abs(this.player.y - mari.y))
            ? (this.player.x > mari.x ? 'right' : 'left') : (this.player.y > mari.y ? 'down' : 'up');
        }
      }
    }

    // 2. Maya AI (Free of infinite freezes)
    const maya = this.npcs.find(n => n.id === 'maya');
    if (maya) {
      maya.room = this.getRoomAt(maya.x, maya.y).id;

      // Confused state (safe window for player)
      if (maya.state === 'confused') {
        maya.confusedTimer--;
        if (maya.confusedTimer <= 0) {
          maya.state = 'patrol';
          maya.timer = 180;
        }
        return;
      }

      // Check dropped chips
      if (this.chipsFloor) {
        const dChips = Math.hypot(this.chipsFloor.x - maya.x, this.chipsFloor.y - maya.y);
        if (dChips < 80) {
          maya.state = 'confused';
          maya.confusedTimer = 480;
          this.chipsFloor = null;
          soundSystem.playHeart();
          this.showToast("🍟 Maya è occupata a mangiare patatine!");
          return;
        }
      }

      const distLeon = Math.hypot(this.player.x - maya.x, this.player.y - maya.y);

      // Can Maya spot Leon? Only if Leon is not shielded
      if (this.player.shieldTimer <= 0 && distLeon < 190 && !this.state.won) {
        if (maya.state !== 'chase') {
          maya.state = 'chase';
          soundSystem.playPokemonEncounter();
          this.triggerFlash();
          this.showToast("❗️ MAYA TI HA VISTO! SCAPPA O LANCIA PATATINE!");
        }

        // Chase
        const angle = Math.atan2(this.player.y - maya.y, this.player.x - maya.x);
        const spd = 2.6;
        const nx = maya.x + Math.cos(angle) * spd;
        const ny = maya.y + Math.sin(angle) * spd;
        if (!this.isSolid(nx, maya.y)) maya.x = nx;
        if (!this.isSolid(maya.x, ny)) maya.y = ny;

        // Caught check
        if (distLeon < 32 && !this.state.dialogueOpen) {
          // If Mari was following, Mari abandons
          if (mari && mari.isFollowing) {
            mari.isFollowing = false;
            mari.x = 320; mari.y = 420;
            this.state.mariFollowing = false;
            this.state.mariLove = Math.max(30, this.state.mariLove - 15);
            this.updateHUD();
            this.showToast("💔 Mari si è imbarazzata ed è tornata nel salone!");
          }
          this.openDialogue('maya');
        }
      } else {
        // Patrol
        maya.state = 'patrol';
        maya.timer--;
        if (maya.timer <= 0) {
          maya.timer = 180 + Math.random() * 120;
          maya.target = [
            { x: 260, y: 440 }, { x: 600, y: 150 }, { x: 600, y: 550 }, { x: 200, y: 180 }
          ][Math.floor(Math.random() * 4)];
        }
        if (maya.target) {
          const d = Math.hypot(maya.target.x - maya.x, maya.target.y - maya.y);
          if (d > 10) {
            const angle = Math.atan2(maya.target.y - maya.y, maya.target.x - maya.x);
            const nx = maya.x + Math.cos(angle) * 1.6;
            const ny = maya.y + Math.sin(angle) * 1.6;
            if (!this.isSolid(nx, maya.y)) maya.x = nx;
            if (!this.isSolid(maya.x, ny)) maya.y = ny;
          }
        }
      }
    }
  }

  triggerFlash() {
    const f = document.getElementById('screenFlash');
    if (f) {
      f.classList.add('active');
      setTimeout(() => f.classList.remove('active'), 200);
    }
  }

  checkWin() {
    if (this.state.won) return;

    const mari = this.npcs.find(n => n.id === 'mari');
    if (!mari || !mari.isFollowing) return;

    const pRoom = this.getRoomAt(this.player.x, this.player.y).id;
    const mRoom = this.getRoomAt(mari.x, mari.y).id;

    const isRomanticRoom = (pRoom === 'balcony' || pRoom === 'bedroom');

    if (isRomanticRoom && pRoom === mRoom) {
      // Check if any other NPC is in this room
      let someoneElse = false;
      for (const n of this.npcs) {
        if (n.id !== 'mari' && n.room === pRoom) {
          someoneElse = true;
          break;
        }
      }

      if (!someoneElse) {
        this.aloneCountdown++;
        soundSystem.setRomantic(true);

        if (this.aloneCountdown > 160) {
          this.triggerVictory(pRoom);
        }
      } else {
        this.aloneCountdown = 0;
        soundSystem.setRomantic(false);
      }
    } else {
      this.aloneCountdown = 0;
      soundSystem.setRomantic(false);
    }
  }

  triggerVictory(roomId) {
    this.state.won = true;
    this.state.mariAlone = true;
    soundSystem.playVictory();

    this.openDialogue('mari');
    const textEl = document.getElementById('diagText');
    const choicesEl = document.getElementById('diagChoices');

    const place = (roomId === 'balcony') ? 'sul balcone sotto il cielo stellato di Monnaz' : 'nella camera relax';
    textEl.textContent = `MARI: "Leon... finalmente soli ${place}. Sei stato incredibile stasera. Sei riuscito a conquistare il mio cuore!"`;

    choicesEl.innerHTML = `
      <button class="pkmn-choice-btn" id="btnEnd">
        💋 "Mari, sei la ragazza più bella di MS. Volevo solo te."
      </button>
    `;

    document.getElementById('btnEnd').addEventListener('click', () => {
      soundSystem.playHeart();
      this.closeDialogue();
      this.showToast("🎉 VITTORIA! LEON E MARI SONO UNA COPPIA!");
    });
  }

  showCharsModal() {
    const layer = document.getElementById('modalLayer');
    const content = document.getElementById('modalContent');
    layer.classList.remove('hidden');

    let html = '<div class="chars-grid">';
    this.npcs.forEach(n => {
      html += `
        <div class="char-card">
          <div class="char-img-wrap">
            <img src="assets/sprites/${n.id}.png?v=${Date.now()}" alt="${n.name}">
          </div>
          <div style="font-size:12px;font-weight:bold;color:#38bdf8;">${n.name}</div>
        </div>
      `;
    });
    html += '</div>';
    content.innerHTML = html;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Camera follow Leon
    this.camera.x += (this.player.x - this.camera.x) * 0.1;
    this.camera.y += (this.player.y - this.camera.y) * 0.1;

    this.ctx.save();
    if (this.zoomMode === 'pokemon') {
      const zoom = 1.6;
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(zoom, zoom);
      this.ctx.translate(-this.camera.x, -this.camera.y);
    } else {
      const fit = Math.min(this.canvas.width / 1200, this.canvas.height / 900);
      this.ctx.scale(fit, fit);
    }

    // Draw Villa Rooms & Floors
    this.drawVilla();

    // Draw Dropped Chips
    if (this.chipsFloor) {
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.beginPath();
      this.ctx.arc(this.chipsFloor.x, this.chipsFloor.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '10px monospace';
      this.ctx.fillText('🍟 PATATINE', this.chipsFloor.x - 24, this.chipsFloor.y - 12);
    }

    // Draw Characters
    this.npcs.forEach(n => this.drawCharacter(n));

    // Draw Player (with invulnerability flashing if shielded)
    if (this.player.shieldTimer <= 0 || Math.floor(Date.now() / 80) % 2 === 0) {
      this.drawCharacter(this.player, true);
    }

    // Tooltip for interactions
    if (!this.state.dialogueOpen && !this.state.won) {
      this.drawInteractionTip();
    }

    // Alone romance glow
    if (this.aloneCountdown > 0) {
      const alpha = Math.min(0.35, this.aloneCountdown / 200);
      this.ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
      this.ctx.fillRect(0, 0, HOUSE_DATA.width, HOUSE_DATA.height);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 18px monospace';
      this.ctx.fillText(`✨ MOMENTO ROMANTICO CON MARI! (${Math.ceil((160 - this.aloneCountdown) / 50)}s) ✨`, this.player.x - 200, this.player.y - 70);
    }

    this.ctx.restore();
  }

  drawVilla() {
    // Rooms
    HOUSE_DATA.rooms.forEach(r => {
      if (r.floor === 'wood_dark' || r.floor === 'wood_light' || r.floor === 'wood_warm') {
        this.ctx.fillStyle = (r.floor === 'wood_dark') ? '#422a1d' : (r.floor === 'wood_warm') ? '#6b4226' : '#855230';
        this.ctx.fillRect(r.x, r.y, r.w, r.h);
        // Planks
        this.ctx.strokeStyle = '#24160d';
        this.ctx.lineWidth = 1;
        for (let y = r.y; y < r.y + r.h; y += 16) {
          this.ctx.beginPath();
          this.ctx.moveTo(r.x, y);
          this.ctx.lineTo(r.x + r.w, y);
          this.ctx.stroke();
        }
      } else if (r.floor === 'checkers') {
        const sz = 24;
        for (let y = r.y; y < r.y + r.h; y += sz) {
          for (let x = r.x; x < r.x + r.w; x += sz) {
            this.ctx.fillStyle = ((x + y) / sz % 2 === 0) ? '#cbd5e1' : '#475569';
            this.ctx.fillRect(x, y, sz, sz);
          }
        }
      } else if (r.floor === 'tiles_blue') {
        this.ctx.fillStyle = '#1e3a8a';
        this.ctx.fillRect(r.x, r.y, r.w, r.h);
      } else if (r.floor === 'stone_deck') {
        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(r.x, r.y, r.w, r.h);
      } else if (r.floor === 'grass') {
        this.ctx.fillStyle = '#15803d';
        this.ctx.fillRect(r.x, r.y, r.w, r.h);
      }

      // Carpet
      if (r.carpet) {
        this.ctx.fillStyle = r.carpet.brd;
        this.ctx.fillRect(r.carpet.x - 4, r.carpet.y - 4, r.carpet.w + 8, r.carpet.h + 8);
        this.ctx.fillStyle = r.carpet.col;
        this.ctx.fillRect(r.carpet.x, r.carpet.y, r.carpet.w, r.carpet.h);
      }
    });

    // Balcony Landscape (Mt. Coronet & Lake Verity)
    const balc = HOUSE_DATA.rooms.find(rm => rm.id === 'balcony');
    if (balc) {
      const skyX = balc.x + balc.w - 130;
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(skyX, balc.y, 130, balc.h);
      // Mt Coronet
      this.ctx.fillStyle = '#1e293b';
      this.ctx.beginPath();
      this.ctx.moveTo(skyX, balc.y + balc.h);
      this.ctx.lineTo(skyX + 30, balc.y + 110);
      this.ctx.lineTo(skyX + 65, balc.y + 60);
      this.ctx.lineTo(skyX + 130, balc.y + 120);
      this.ctx.lineTo(skyX + 130, balc.y + balc.h);
      this.ctx.fill();
      // Stars
      this.ctx.fillStyle = '#fff';
      for (let i = 0; i < 20; i++) {
        const sx = skyX + 10 + (i * 31) % 110;
        const sy = balc.y + 8 + (i * 29) % (balc.h - 60);
        this.ctx.fillRect(sx, sy, 2, 2);
      }
    }

    // Furniture
    HOUSE_DATA.furniture.forEach(f => {
      if (f.type === 'dancefloor') {
        this.ctx.fillStyle = '#7c3aed';
        this.ctx.fillRect(f.x, f.y, f.w, f.h);
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(f.x, f.y, f.w, f.h);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 11px monospace';
        this.ctx.fillText('🎶 PISTA DI CUORIPOLI 🎶', f.x + 14, f.y + f.h / 2);
        return;
      }
      if (f.type === 'fridge') {
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillRect(f.x, f.y, f.w, f.h);
        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(f.x, f.y + 24, f.w, 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '9px monospace';
        this.ctx.fillText('FRIGO', f.x + 8, f.y + f.h - 8);
      } else if (f.type === 'beer_pong') {
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(f.x, f.y, f.w, f.h);
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.strokeRect(f.x, f.y, f.w, f.h);
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = '10px monospace';
        this.ctx.fillText('BEER PONG MS', f.x + 50, f.y + 42);
      } else if (f.type === 'dj') {
        this.ctx.fillStyle = '#3b0764';
        this.ctx.fillRect(f.x, f.y, f.w, f.h);
        this.ctx.strokeStyle = '#a855f7';
        this.ctx.strokeRect(f.x, f.y, f.w, f.h);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '9px monospace';
        this.ctx.fillText('DJ LOLLO', f.x + 44, f.y + f.h - 8);
      } else if (f.type === 'bed') {
        this.ctx.fillStyle = '#581c87';
        this.ctx.fillRect(f.x, f.y, f.w, f.h);
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.fillRect(f.x + 16, f.y + 12, 50, 32);
        this.ctx.fillRect(f.x + 94, f.y + 12, 50, 32);
      } else {
        this.ctx.fillStyle = '#78350f';
        this.ctx.fillRect(f.x, f.y, f.w, f.h);
      }

      if (f.isInteractive) {
        this.ctx.fillStyle = '#facc15';
        this.ctx.beginPath();
        this.ctx.arc(f.x + f.w - 8, f.y + 8, 4, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Walls
    HOUSE_DATA.walls.forEach(w => {
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fillRect(w.x, w.y, w.w, w.h);
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    // Doors
    HOUSE_DATA.doors.forEach(d => {
      this.ctx.fillStyle = d.isOpen ? '#059669' : '#78350f';
      this.ctx.fillRect(d.x, d.y, d.w, d.h);
      this.ctx.strokeStyle = d.isOpen ? '#34d399' : '#fef08a';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(d.x, d.y, d.w, d.h);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '9px monospace';
      this.ctx.fillText(d.isOpen ? 'APERTA' : 'CHIUSA', d.x + 1, d.y + d.h / 2);
    });
  }

  drawCharacter(c, isPlayer = false) {
    const img = isPlayer ? this.sprites['leon'] : this.sprites[c.id];
    const w = 32, h = 40;
    const drawX = Math.round(c.x - w / 2);
    const drawY = Math.round(c.y - h / 2);

    if (img && img.complete && img.naturalWidth > 0) {
      this.ctx.drawImage(img, drawX, drawY, w, h);
    } else {
      this.ctx.fillStyle = isPlayer ? '#0284c7' : '#ec4899';
      this.ctx.fillRect(drawX, drawY, w, h);
    }

    // Name tag
    const name = isPlayer ? 'Leon' : c.name;
    this.ctx.font = 'bold 10px monospace';
    const tw = this.ctx.measureText(name).width;
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.ctx.fillRect(c.x - tw / 2 - 3, drawY - 14, tw + 6, 12);
    this.ctx.fillStyle = (c.id === 'mari') ? '#f472b6' : isPlayer ? '#60a5fa' : (c.id === 'maya') ? '#ef4444' : '#fff';
    this.ctx.fillText(name, c.x - tw / 2, drawY - 4);

    // Emotion bubble
    if (c.id === 'mari' && c.isFollowing) {
      this.ctx.font = '16px monospace';
      this.ctx.fillText('💖', c.x - 8, drawY - 18);
    }
    if (c.id === 'maya') {
      if (c.state === 'confused') {
        this.ctx.font = '14px monospace';
        this.ctx.fillText('💫 ?', c.x - 12, drawY - 18);
      } else if (c.state === 'chase') {
        this.ctx.fillStyle = '#ef4444';
        this.ctx.font = 'bold 20px monospace';
        this.ctx.fillText('❗️', c.x - 6, drawY - 18);
      }
    }
  }

  drawInteractionTip() {
    const p = this.player;
    let tip = null;

    // Check doors
    for (const d of HOUSE_DATA.doors) {
      const cx = d.x + d.w / 2;
      const cy = d.y + d.h / 2;
      if (Math.hypot(p.x - cx, p.y - cy) < 46) {
        tip = `[E / Spazio] ${d.isOpen ? 'Chiudi' : 'Apri'} ${d.name}`;
        break;
      }
    }

    // Check NPC
    if (!tip) {
      for (const n of this.npcs) {
        if (Math.hypot(p.x - n.x, p.y - n.y) < 50) {
          tip = `[E / Spazio] Parla con ${n.name}`;
          break;
        }
      }
    }

    if (tip) {
      this.ctx.font = 'bold 11px monospace';
      const tw = this.ctx.measureText(tip).width;
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      this.ctx.fillRect(p.x - tw / 2 - 6, p.y - 46, tw + 12, 20);
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.strokeRect(p.x - tw / 2 - 6, p.y - 46, tw + 12, 20);
      this.ctx.fillStyle = '#fef08a';
      this.ctx.fillText(tip, p.x - tw / 2, p.y - 32);
    }
  }

  loop(currentTime) {
    this.updatePlayer();
    this.updateNPCs();
    this.checkWin();
    this.updateHUD();
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new GameEngine();
});
