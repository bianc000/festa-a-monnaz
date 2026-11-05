// ============================================================
// LEON & LA BELLA MARI - FESTA A MONNAZ (POKÉMON PERLA EDITION)
// Accurate Sinnoh Tile Engine, Wide Accessible Doorways, Anti-Freeze AI
// Special MS roles: Beer Pong (Ara+Kri vs Matti+Jona), Bagno occupato da Bubi,
// Matti dà la birra, Jona dà le patatine, Ento dice "eh okay ma la Michi...",
// Jelmo, Pibe, Lindi e Roby danno consigli strategici!
// ============================================================

// 1. SOUND SYSTEM
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
  playDoor() { this.playTone(220, 'square', 0.08, 0.08); }

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

// 2. SINNOH VILLA MAP DATA WITH WIDE OPEN DOORWAYS
const VILLA_MAP = {
  w: 1040,
  h: 760,
  rooms: [
    { id: 'living', name: 'Salone delle Feste', x: 40, y: 350, w: 460, h: 360, type: 'wood' },
    { id: 'kitchen', name: 'Cucina & Beer Pong', x: 40, y: 50, w: 460, h: 260, type: 'checkers' },
    { id: 'hallway', name: 'Corridoio', x: 540, y: 50, w: 160, h: 660, type: 'wood' },
    { id: 'bedroom', name: 'Camera Relax (Stile Perla)', x: 740, y: 50, w: 260, h: 270, type: 'perla_room' },
    { id: 'bathroom', name: 'Bagno (Occupato da Bubi)', x: 740, y: 360, w: 180, h: 150, type: 'tiles' },
    { id: 'balcony', name: 'Terrazza Panoramica', x: 740, y: 550, w: 260, h: 160, type: 'stone' }
  ],
  walls: [
    { x: 30, y: 30, w: 980, h: 20 },
    { x: 30, y: 720, w: 980, h: 20 },
    { x: 20, y: 30, w: 20, h: 710 },
    { x: 1010, y: 30, w: 20, h: 710 },
    { x: 40, y: 310, w: 460, h: 24 },
    { x: 500, y: 40, w: 24, h: 100 },
    { x: 500, y: 220, w: 24, h: 100 },
    { x: 500, y: 320, w: 24, h: 130 },
    { x: 500, y: 530, w: 24, h: 190 },
    { x: 700, y: 40, w: 24, h: 100 },
    { x: 700, y: 220, w: 24, h: 110 },
    { x: 720, y: 320, w: 290, h: 24 },
    { x: 700, y: 330, w: 24, h: 60 },
    { x: 700, y: 460, w: 24, h: 70 },
    { x: 720, y: 520, w: 290, h: 24 },
    { x: 700, y: 530, w: 24, h: 50 },
    { x: 700, y: 660, w: 24, h: 60 }
  ],
  doorways: [
    { id: 'door_kitchen', name: 'Arco Cucina', x: 500, y: 140, w: 24, h: 80, matColor: '#cbd5e1' },
    { id: 'door_living', name: 'Arco Salone', x: 500, y: 450, w: 24, h: 80, matColor: '#f43f5e' },
    { id: 'door_bedroom', name: 'Porta Camera Relax', x: 700, y: 140, w: 24, h: 80, matColor: '#38bdf8', isBarriered: false },
    { id: 'door_bathroom', name: 'Porta Bagno (Bubi dentro)', x: 700, y: 390, w: 24, h: 70, matColor: '#0284c7' },
    { id: 'door_balcony', name: 'Uscita Terrazza', x: 700, y: 580, w: 24, h: 80, matColor: '#94a3b8', isBarriered: false }
  ]
};

// 3. DIALOGUE CONTENT
const DIALOGUES = {
  mari: {
    speaker: 'Mari', title: 'La bella Mari ❤️',
    intro: (s) => {
      if (s.mariAlone) return "Leon... finalmente soli. La vista è da togliere il fiato, ma tu sei stato un vero eroe stasera.";
      if (s.mariFollowing) return "Ti sto seguendo, Leon! Portami in terrazza o in camera... spero che Maya non ci veda!";
      if (s.mariLove >= 100) return "Leon, sei stato dolcissimo stasera... c'è troppo chiasso qui nel salone. Mi porti in un posto appartato solo noi due?";
      return "Ciao Leon! Che bella festa stasera a casa di Kri... sei elegantissimo con quella maglia Vitality!";
    },
    choices: (s) => {
      if (s.mariLove >= 100 && !s.mariFollowing) {
        return [{ text: "Certo Mari! Andiamo subito!", action: 'follow', reply: "Arrivo con te! Fai strada tu!" }];
      }
      if (s.mariFollowing) return [{ text: "Seguimi, quasi arrivati...", reply: "Ti seguo a ruota!" }];
      const opts = [
        { text: "Mari, sei incantevole stasera. Questo vestito viola e magenta ti sta d'incanto.", bonus: 35, reply: "Grazie Leon! Sei sempre un vero gentiluomo, e i tuoi riccioli castani sono stupendi." },
        { text: "Leon & Mari: la coppia più bella che MS abbia mai visto!", bonus: 20, reply: "Ahaha che sfacciato! Però ammetto che mi fai battere forte il cuore." }
      ];
      if (s.inventory.includes('drink')) {
        opts.unshift({ text: "Ti ho portato il Cocktail Fragola & Menta fresco dal frigo!", bonus: 50, consume: 'drink', reply: "Mio dio, il mio cocktail preferito! Ma come facevi a saperlo? Sei magico!" });
      }
      if (s.djRomance) {
        opts.push({ text: "Senti la traccia lenta che ha messo DJ Lollo per noi?", bonus: 25, reply: "È bellissima! Mi fa venire voglia di andare a guardare le stelle." });
      }
      return opts;
    }
  },

  maya: {
    speaker: 'Maya', title: 'L\'incubo di Monnaz 👓',
    intro: () => "LEOOON! Ti ho preso! Il nostro legame astrale è al 100%! Guarda il mio maglione a pois!",
    choices: (s) => {
      const opts = [{ text: "Guarda Maya, un Bidoof dorato fuori dalla finestra!", action: 'escape_maya', reply: "DOVE?! Un Bidoof dorato?! *Maya si gira confusa cercandolo invano*" }];
      if (s.inventory.includes('chips')) {
        opts.unshift({ text: "(Lancia il pacchetto di patatine che ti ha dato Jona)", action: 'feed_maya', consume: 'chips', reply: "PATATINE AL TARTUFO! Slurp! *Maya si fionda a mangiare*" });
      }
      return opts;
    }
  },

  // BEER PONG MATCH: ARA & KRI VS MATTI & JONA!
  ara: {
    speaker: 'Ara', title: 'Campionessa Beer Pong (con Kri) 🌸',
    intro: () => "Ara: 'Vai Kri, mira dritto al bicchiere rosso! Dobbiamo assolutamente battere Matti e Jona!' Leon, non distrarci che siamo sul 4 pari in rimonta!",
    choices: () => [
      { text: "Forza Ara & Kri! Tifo per voi!", reply: "Ara: 'Grazie Leon! Se ti serve da bere chiedi a Matti che ha le birre, e Jona ha le patatine!'" }
    ]
  },

  kri: {
    speaker: 'Kri', title: 'Padrone di Casa (in coppia con Ara) 🔴',
    intro: () => "Kri: 'Leon, fratello! Io e Ara stiamo disputando la partita di Beer Pong del secolo contro Matti e Jona! Tutta Monnaz è con noi!'",
    choices: () => [
      { text: "Kri, che sfida accesa! Chi vince?", reply: "Kri: 'Siamo punto a punto! Se cerchi una birra per DJ Lollo chiedila a Matti, e nel frigo c'è il drink per Mari!'" }
    ]
  },

  matti: {
    speaker: 'Matti', title: 'Campione Beer Pong (con Jona) 🕶️',
    intro: (s) => s.inventory.includes('beer')
      ? "Matti: 'Leon, sono concentratissimo! Sto per fare il tiro decisivo contro Ara e Kri!'"
      : "Matti: 'LEOON! Sfida epica a Beer Pong con Jona contro Ara e Kri! Ho qui una cassa di birre gelate, te ne serve una per DJ Lollo?'",
    choices: (s) => {
      if (!s.inventory.includes('beer')) {
        return [{ text: "Matti, me ne daresti una per Lollo in consolle?", action: 'get_beer', reply: "Matti: 'Tieni questa birra ghiacciata, Leon! Ora lasciami tirare che devo battere Kri ed Ara!'" }];
      }
      return [{ text: "Forza Matti, fai centro!", reply: "Matti: 'Ci puoi scommettere, centro perfetto!'" }];
    }
  },

  jona: {
    speaker: 'Jona', title: 'Tattico Beer Pong (con Matti) 👕',
    intro: (s) => s.inventory.includes('chips')
      ? "Jona: 'Leon, usa quelle patatine se Maya ti punta! Io e Matti dobbiamo rimontare contro Ara e Kri!'"
      : "Jona: 'Leon! Gara tiratissima a Beer Pong con Matti contro Ara e Kri! Ho un pacchetto di patatine avanzato, prendilo tu per distrarre Maya!'",
    choices: (s) => {
      if (!s.inventory.includes('chips')) {
        return [{ text: "Jona, mi daresti quel pacchetto di patatine?", action: 'get_chips', reply: "Jona: 'Prendi pure, Leon! Se premi Q mentre Maya ti insegue, le butterai a terra e si bloccherà a mangiare!'" }];
      }
      return [{ text: "Forza Jona, batti Ara e Kri!", reply: "Jona: 'Stiamo studiando la traiettoria della pallina, siamo pronti!'" }];
    }
  },

  // BAGNO OCCUPATO DA BUBI
  bubi: {
    speaker: 'Bubi', title: 'Chiuso in Bagno 🚽',
    intro: () => "Bubi: 'OCCUPATOOO! Raga, sono Bubi, sto occupando il bagno per un po'! Bussate più tardi che ci vorrà del tempo!'",
    choices: () => [
      { text: "Bubi, fai presto!", reply: "Bubi: 'Ci provo, ma non garantisco nulla! Andate da Matti per la birra e da Jona per le patatine!'" }
    ]
  },

  // ENTO: ICONIC ONE-LINER
  ento: {
    speaker: 'Ento', title: 'Membro MS 🧢',
    intro: () => "eh okay ma la Michi...",
    choices: () => [
      { text: "...Cosa c'entra la Michi adesso, Ento?", reply: "eh okay ma la Michi..." }
    ]
  },

  // JELMO (LO SCIENZIATO MS) DA' CONSIGLI
  jelmo: {
    speaker: 'Jelmo', title: 'Scienziato di MS 📊',
    intro: () => "Jelmo (Scienziato MS): 'Leon. Secondo i miei calcoli algoritmici, hai il 96.4% di probabilità di successo con Mari se segui questo schema: 1) Offrile il cocktail dal frigo, 2) Prendi la birra da Matti e portala a Lollo, 3) Prendi le patatine da Jona per neutralizzare Maya, 4) Portala da sola sul balcone o in camera!'",
    choices: () => [
      { text: "Qual è il raggio visivo di Maya, Jelmo?", reply: "Jelmo: '180 pixel esatti. Se ti intercetta, stordiscila premendo [1] per guadagnare 10 secondi di campo libero.'" }
    ]
  },

  // PIBE DA' CONSIGLI
  pibe: {
    speaker: 'Pibe', title: 'Bomber di Sinnoh ⚽',
    intro: () => "Pibe: 'Leon! Ascolta il bomber: stasera devi fare come me in campo: finta di corpo su Maya e assist dritto per il cuore di Mari! Chiedi la birra a Matti e le patatine a Jona al Beer Pong!'",
    choices: () => [
      { text: "Pibe, dammi uno schema per isolare Mari!", reply: "Pibe: 'Una volta convinta Mari a seguirti, corri dritto verso la terrazza panoramica o la camera e attiva la barriera privacy! Maya resta in fuorigioco!'" }
    ]
  },

  // LINDI DA' CONSIGLI
  lindi: {
    speaker: 'Lindi', title: 'Amica di Mari ✨',
    intro: () => "Lindi: 'Leon! Ti do un consiglio prezioso da migliore amica di Mari: a lei piacciono i ragazzi gentili e attenti. Falle un complimento sul suo splendido vestito viola, portale il suo cocktail preferito dal frigo e poi invitala sul balcone a guardare le stelle!'",
    choices: () => [
      { text: "Grazie mille Lindi, seguirò il tuo consiglio!", reply: "Lindi: 'Fai il galante! Mari aspetta solo che tu faccia la prima mossa romantica!'" }
    ]
  },

  // ROBY DA' CONSIGLI
  roby: {
    speaker: 'Roby', title: 'Amico di Sinnoh 💚',
    intro: () => "Roby: 'Leon, consiglio d'oro: la camera relax e la terrazza panoramica sono i due posti migliori della villa per restare da soli con Mari! Ricordati che tutti gli accessi sono aperti e larghi, non rimarrai mai bloccato!'",
    choices: () => [
      { text: "Grazie Roby, dritta fondamentale!", reply: "Roby: 'Daje Leon, tutta la crew di MS tifa per te!'" }
    ]
  },

  lollo: {
    speaker: 'Lollo', title: 'DJ Resident Cuoripoli 🎧',
    intro: (s) => s.djRomance ? "Il pezzo lento sta suonando a palla per te e Mari, Leon!" : "Yo Leon! Chiedi una birra gelata a Matti al Beer Pong e portamela, così metto la slow dance!",
    choices: (s) => {
      if (s.inventory.includes('beer')) {
        return [{ text: "Ecco la birra fresca di Matti, Lollo! Metti il pezzo lento!", consume: 'beer', action: 'set_romance', reply: "Grande bro! Traccia romantica on fire per te e Mari!" }];
      }
      return [{ text: "Che musica c'è in consolle?", reply: "Hit da ballare! Vai da Matti a prendere una birra per far partire la slow dance!" }];
    }
  }
};

// 4. MAIN GAME CONTROLLER
class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 800;
    this.canvas.height = 560;

    this.keys = {};
    this.setupInput();

    this.loadAssets();
    this.initGame();

    this.camera = { x: 120, y: 450 };
    this.zoomMode = 'pokemon';

    this.bindUI();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));

    this.showToast("🎮 Benvenuto a Monnaz! Ara & Kri sfidano Matti & Jona a Beer Pong! Bagno occupato da Bubi!");
  }

  loadAssets() {
    const v = Date.now();
    this.sprites = {};
    const ids = ['leon', 'mari', 'kri', 'maya', 'ento', 'matti', 'jona', 'pibe', 'lollo', 'roby', 'lindi', 'bubi', 'jelmo', 'ara'];
    ids.forEach(id => {
      const img = new Image();
      img.src = `assets/sprites/${id}.png?v=${v}`;
      this.sprites[id] = img;
    });

    this.portraits = {
      leon: new Image(),
      mari: new Image()
    };
    this.portraits.leon.src = `assets/sprites/leon_portrait.png?v=${v}`;
    this.portraits.mari.src = `assets/sprites/mari_portrait.png?v=${v}`;

    this.pkmn = {
      floor: new Image(),
      wall: new Image(),
      tv: new Image(),
      pc_desk: new Image(),
      rug: new Image(),
      bed: new Image(),
      stairs: new Image(),
      plant: new Image(),
      window: new Image()
    };
    this.pkmn.floor.src = `assets/sprites/pkmn_floor.png?v=${v}`;
    this.pkmn.wall.src = `assets/sprites/pkmn_wall.png?v=${v}`;
    this.pkmn.tv.src = `assets/sprites/pkmn_tv.png?v=${v}`;
    this.pkmn.pc_desk.src = `assets/sprites/pkmn_pc_desk.png?v=${v}`;
    this.pkmn.rug.src = `assets/sprites/pkmn_rug.png?v=${v}`;
    this.pkmn.bed.src = `assets/sprites/pkmn_bed.png?v=${v}`;
    this.pkmn.stairs.src = `assets/sprites/pkmn_stairs.png?v=${v}`;
    this.pkmn.plant.src = `assets/sprites/pkmn_plant.png?v=${v}`;
    this.pkmn.window.src = `assets/sprites/pkmn_window.png?v=${v}`;
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

    // Leon
    this.player = {
      x: 120, y: 450,
      w: 32, h: 40,
      speed: 3.2,
      sprintSpeed: 4.8,
      dir: 'down',
      isMoving: false,
      isSprinting: false,
      shieldTimer: 0
    };

    // EXACT ROLES & POSITIONS:
    // Kitchen Beer Pong: Ara & Kri (left side) VS Matti & Jona (right side)
    // Bagno: Bubi occupato dentro!
    // Salone: Mari, Lollo (DJ), Ento, Roby, Lindi
    // Hallway: Jelmo (Scienziato), Pibe, Maya (Obstacle)
    this.npcs = [
      { id: 'mari', name: 'Mari', x: 300, y: 420, dir: 'down', room: 'living', isFollowing: false },
      
      // Beer Pong Match in Kitchen
      { id: 'ara', name: 'Ara', x: 135, y: 160, dir: 'right', room: 'kitchen' },
      { id: 'kri', name: 'Kri', x: 135, y: 220, dir: 'right', room: 'kitchen' },
      { id: 'matti', name: 'Matti', x: 375, y: 160, dir: 'left', room: 'kitchen' }, // Gives Beer!
      { id: 'jona', name: 'Jona', x: 375, y: 220, dir: 'left', room: 'kitchen' },   // Gives Chips!

      // Bagno occupato da Bubi!
      { id: 'bubi', name: 'Bubi', x: 810, y: 420, dir: 'down', room: 'bathroom' },

      // Living room
      { id: 'lollo', name: 'Lollo', x: 120, y: 345, dir: 'down', room: 'living' },
      { id: 'ento', name: 'Ento', x: 90, y: 640, dir: 'right', room: 'living' }, // "eh okay ma la Michi..."
      { id: 'roby', name: 'Roby', x: 230, y: 640, dir: 'left', room: 'living' },  // Gives advice
      { id: 'lindi', name: 'Lindi', x: 420, y: 450, dir: 'left', room: 'living' }, // Gives advice

      // Hallway
      { id: 'jelmo', name: 'Jelmo', x: 620, y: 430, dir: 'left', room: 'hallway' }, // Scienziato MS gives advice!
      { id: 'pibe', name: 'Pibe', x: 620, y: 550, dir: 'up', room: 'hallway' },     // Bomber gives advice!
      { id: 'maya', name: 'Maya', x: 620, y: 200, dir: 'down', room: 'hallway', state: 'patrol', timer: 120, confusedTimer: 0 }
    ];

    VILLA_MAP.doorways.forEach(d => d.isBarriered = false);

    this.chipsFloor = null;
    this.closeDialogue();
    this.updateHUD();
    soundSystem.setRomantic(false);
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space' || e.code === 'KeyE') this.handleAction();
      if (e.code === 'Escape') this.closeDialogue();
      if (e.code === 'KeyQ' || e.code === 'KeyF') this.throwChips();
      if (this.state.dialogueOpen && (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3')) {
        this.chooseOption(parseInt(e.key) - 1);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

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
    document.getElementById('btnRestart').addEventListener('click', () => {
      this.initGame();
      this.showToast("🔄 Partita riavviata dall'inizio!");
    });

    document.getElementById('btnCamera').addEventListener('click', () => {
      this.zoomMode = (this.zoomMode === 'pokemon') ? 'overview' : 'pokemon';
      document.getElementById('btnCamera').textContent = (this.zoomMode === 'pokemon') ? '🎥 Zoom DS' : '🗺️ Panoramica';
    });

    document.getElementById('btnAudio').addEventListener('click', () => {
      const isMuted = soundSystem.toggleMute();
      document.getElementById('btnAudio').textContent = isMuted ? '🔇 Audio: OFF' : '🔊 BGM: ON';
      document.getElementById('btnAudio').classList.toggle('btn-pink', !isMuted);
    });

    document.getElementById('btnChars').addEventListener('click', () => this.showCharsModal());
    document.getElementById('btnCloseModal').addEventListener('click', () => {
      document.getElementById('modalLayer').classList.add('hidden');
    });

    document.getElementById('slotChips').addEventListener('click', () => this.throwChips());

    window.addEventListener('click', () => {
      soundSystem.init();
      if (!soundSystem.musicPlaying && !soundSystem.isMuted) soundSystem.startBgm();
    }, { once: true });
  }

  getRoomAt(x, y) {
    for (const r of VILLA_MAP.rooms) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        return r;
      }
    }
    return { id: 'unknown', name: 'Villa di Kri' };
  }

  isSolid(x, y, rad = 12) {
    for (const w of VILLA_MAP.walls) {
      if (x + rad > w.x && x - rad < w.x + w.w && y + rad > w.y && y - rad < w.y + w.h) {
        return true;
      }
    }
    for (const d of VILLA_MAP.doorways) {
      if (d.isBarriered) {
        if (x + rad > d.x && x - rad < d.x + d.w && y + rad > d.y && y - rad < d.y + d.h) {
          return true;
        }
      }
    }
    // Furniture bounds
    const solidItems = [
      { x: 60, y: 70, w: 56, h: 60 },   // Fridge
      { x: 170, y: 150, w: 180, h: 70 },// Beer Pong Table
      { x: 60, y: 370, w: 140, h: 60 }, // DJ Booth
      { x: 80, y: 550, w: 160, h: 60 }, // Sofa
      { x: 750, y: 60, w: 60, h: 40 },  // PC Desk
      { x: 820, y: 60, w: 70, h: 40 },  // TV
      { x: 910, y: 60, w: 70, h: 60 },  // Stairs
      { x: 910, y: 160, w: 60, h: 80 }  // Bed
    ];
    for (const f of solidItems) {
      if (x + rad > f.x && x - rad < f.x + f.w && y + rad > f.y && y - rad < f.y + f.h) {
        return true;
      }
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

    // 1. Check Doorway Barrier Toggle (Bedroom & Balcony)
    for (const d of VILLA_MAP.doorways) {
      if (d.id === 'door_bedroom' || d.id === 'door_balcony') {
        const cx = d.x + d.w / 2;
        const cy = d.y + d.h / 2;
        if (Math.hypot(p.x - cx, p.y - cy) < 48) {
          d.isBarriered = !d.isBarriered;
          soundSystem.playDoor();
          this.showToast(`${d.name}: ${d.isBarriered ? 'BARRIERA PRIVACY CHIUSA' : 'ACCESSO APERTO'}`);
          return;
        }
      }
      if (d.id === 'door_bathroom') {
        const cx = d.x + d.w / 2;
        const cy = d.y + d.h / 2;
        if (Math.hypot(p.x - cx, p.y - cy) < 55) {
          this.openDialogue('bubi');
          return;
        }
      }
    }

    // 2. Check nearby NPC to talk
    for (const n of this.npcs) {
      if (Math.hypot(p.x - n.x, p.y - n.y) < 50) {
        this.openDialogue(n.id);
        return;
      }
    }

    // 3. Check Fridge (Contains Cocktail for Mari!)
    if (Math.hypot(p.x - 90, p.y - 100) < 55) {
      soundSystem.playPickup();
      if (!this.state.inventory.includes('drink')) {
        this.state.inventory.push('drink');
        this.showToast("Hai preso dal frigo: 'Cocktail Fragola & Menta' per Mari! 🍸");
      } else {
        this.showToast("Hai già il cocktail per Mari nel tuo inventario.");
      }
      this.updateHUD();
      return;
    }

    // 4. Check DJ Booth
    if (Math.hypot(p.x - 130, p.y - 400) < 55) {
      this.openDialogue('lollo');
      return;
    }
  }

  throwChips() {
    if (this.state.inventory.includes('chips')) {
      const idx = this.state.inventory.indexOf('chips');
      this.state.inventory.splice(idx, 1);
      this.chipsFloor = { x: this.player.x, y: this.player.y };
      soundSystem.playPickup();
      this.showToast("🍟 Hai buttato a terra le patatine di Jona!");
      this.updateHUD();
    } else {
      this.showToast("Non hai patatine! Chiedile a Jona al tavolo del Beer Pong.");
    }
  }

  openDialogue(speakerId) {
    const data = DIALOGUES[speakerId];
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
      this.showToast("❤️ Mari ti sta seguendo! Portala in una stanza tranquilla senza farti beccare!");
    } else if (choice.action === 'get_beer') {
      if (!this.state.inventory.includes('beer')) {
        this.state.inventory.push('beer');
        soundSystem.playPickup();
        this.showToast("Hai preso la Birra Gelata da Matti per DJ Lollo! 🍺");
        this.updateHUD();
      }
    } else if (choice.action === 'get_chips') {
      if (!this.state.inventory.includes('chips')) {
        this.state.inventory.push('chips');
        soundSystem.playPickup();
        this.showToast("Hai preso il Sacchetto di Patatine da Jona! 🍟");
        this.updateHUD();
      }
    } else if (choice.action === 'set_romance') {
      this.state.djRomance = true;
      soundSystem.playHeart();
      this.showToast("🎶 Lollo ha messo la slow dance per conquistare Mari!");
    } else if (choice.action === 'escape_maya') {
      this.escapeMaya();
    } else if (choice.action === 'feed_maya') {
      this.feedMaya();
    }
  }

  escapeMaya() {
    this.closeDialogue();
    const pushDist = 80;
    const nx = (this.player.dir === 'left') ? this.player.x - pushDist : this.player.x + pushDist;
    if (!this.isSolid(nx, this.player.y)) this.player.x = nx;

    const maya = this.npcs.find(n => n.id === 'maya');
    if (maya) {
      maya.state = 'confused';
      maya.confusedTimer = 600;
    }
    this.player.shieldTimer = 240;
    soundSystem.playTone(600, 'sine', 0.15, 0.15);
    this.showToast("💨 Sei sfuggito a Maya! È confusa per qualche secondo!");
  }

  feedMaya() {
    this.closeDialogue();
    const maya = this.npcs.find(n => n.id === 'maya');
    if (maya) {
      maya.state = 'confused';
      maya.confusedTimer = 500;
    }
    this.player.shieldTimer = 240;
    soundSystem.playHeart();
    this.showToast("🍟 Maya sta divorando le patatine di Jona! Corri!");
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

    document.getElementById('slotDrink').classList.toggle('active', this.state.inventory.includes('drink'));
    document.getElementById('slotBeer').classList.toggle('active', this.state.inventory.includes('beer'));
    document.getElementById('slotChips').classList.toggle('active', this.state.inventory.includes('chips'));

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
          const spd = this.player.isSprinting ? 3.6 : 2.8;
          const nx = mari.x + Math.cos(angle) * spd;
          const ny = mari.y + Math.sin(angle) * spd;
          if (!this.isSolid(nx, mari.y)) mari.x = nx;
          if (!this.isSolid(mari.x, ny)) mari.y = ny;
          mari.dir = (Math.abs(this.player.x - mari.x) > Math.abs(this.player.y - mari.y))
            ? (this.player.x > mari.x ? 'right' : 'left') : (this.player.y > mari.y ? 'down' : 'up');
        }
      }
    }

    // 2. Maya AI
    const maya = this.npcs.find(n => n.id === 'maya');
    if (maya) {
      maya.room = this.getRoomAt(maya.x, maya.y).id;

      if (maya.state === 'confused') {
        maya.confusedTimer--;
        if (maya.confusedTimer <= 0) {
          maya.state = 'patrol';
          maya.timer = 180;
        }
        return;
      }

      if (this.chipsFloor) {
        const dChips = Math.hypot(this.chipsFloor.x - maya.x, this.chipsFloor.y - maya.y);
        if (dChips < 80) {
          maya.state = 'confused';
          maya.confusedTimer = 480;
          this.chipsFloor = null;
          soundSystem.playHeart();
          this.showToast("🍟 Maya è occupata a mangiare le patatine di Jona!");
          return;
        }
      }

      const distLeon = Math.hypot(this.player.x - maya.x, this.player.y - maya.y);

      if (this.player.shieldTimer <= 0 && distLeon < 180 && !this.state.won) {
        if (maya.state !== 'chase') {
          maya.state = 'chase';
          soundSystem.playPokemonEncounter();
          this.triggerFlash();
          this.showToast("❗️ MAYA TI HA VISTO! SCAPPA O LANCIA PATATINE!");
        }

        const angle = Math.atan2(this.player.y - maya.y, this.player.x - maya.x);
        const spd = 2.5;
        const nx = maya.x + Math.cos(angle) * spd;
        const ny = maya.y + Math.sin(angle) * spd;
        if (!this.isSolid(nx, maya.y)) maya.x = nx;
        if (!this.isSolid(maya.x, ny)) maya.y = ny;

        if (distLeon < 32 && !this.state.dialogueOpen) {
          if (mari && mari.isFollowing) {
            mari.isFollowing = false;
            mari.x = 300; mari.y = 420;
            this.state.mariFollowing = false;
            this.state.mariLove = Math.max(30, this.state.mariLove - 15);
            this.updateHUD();
            this.showToast("💔 Mari si è imbarazzata ed è tornata nel salone!");
          }
          this.openDialogue('maya');
        }
      } else {
        maya.state = 'patrol';
        maya.timer--;
        if (maya.timer <= 0) {
          maya.timer = 180 + Math.random() * 120;
          maya.target = [
            { x: 260, y: 440 }, { x: 620, y: 150 }, { x: 620, y: 550 }, { x: 200, y: 180 }
          ][Math.floor(Math.random() * 4)];
        }
        if (maya.target) {
          const d = Math.hypot(maya.target.x - maya.x, maya.target.y - maya.y);
          if (d > 10) {
            const angle = Math.atan2(maya.target.y - maya.y, maya.target.x - maya.x);
            const nx = maya.x + Math.cos(angle) * 1.5;
            const ny = maya.y + Math.sin(angle) * 1.5;
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

    const place = (roomId === 'balcony') ? 'sul balcone sotto le stelle di Monnaz' : 'nella camera relax';
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

    this.camera.x += (this.player.x - this.camera.x) * 0.1;
    this.camera.y += (this.player.y - this.camera.y) * 0.1;

    this.ctx.save();
    if (this.zoomMode === 'pokemon') {
      const zoom = 1.6;
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(zoom, zoom);
      this.ctx.translate(-this.camera.x, -this.camera.y);
    } else {
      const fit = Math.min(this.canvas.width / 1040, this.canvas.height / 760);
      this.ctx.scale(fit, fit);
    }

    this.drawVilla();

    if (this.chipsFloor) {
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.beginPath();
      this.ctx.arc(this.chipsFloor.x, this.chipsFloor.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '10px monospace';
      this.ctx.fillText('🍟 PATATINE', this.chipsFloor.x - 24, this.chipsFloor.y - 12);
    }

    this.npcs.forEach(n => this.drawCharacter(n));

    if (this.player.shieldTimer <= 0 || Math.floor(Date.now() / 80) % 2 === 0) {
      this.drawCharacter(this.player, true);
    }

    if (!this.state.dialogueOpen && !this.state.won) {
      this.drawInteractionTip();
    }

    if (this.aloneCountdown > 0) {
      const alpha = Math.min(0.35, this.aloneCountdown / 200);
      this.ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
      this.ctx.fillRect(0, 0, VILLA_MAP.w, VILLA_MAP.h);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 18px monospace';
      this.ctx.fillText(`✨ MOMENTO ROMANTICO CON MARI! (${Math.ceil((160 - this.aloneCountdown) / 50)}s) ✨`, this.player.x - 200, this.player.y - 70);
    }

    this.ctx.restore();
  }

  drawVilla() {
    // 1. Rooms
    VILLA_MAP.rooms.forEach(r => {
      if (r.type === 'wood' || r.type === 'perla_room') {
        if (this.pkmn.floor && this.pkmn.floor.complete) {
          const pat = this.ctx.createPattern(this.pkmn.floor, 'repeat');
          this.ctx.fillStyle = pat;
        } else {
          this.ctx.fillStyle = '#855230';
        }
        this.ctx.fillRect(r.x, r.y, r.w, r.h);
      } else if (r.type === 'checkers') {
        const sz = 24;
        for (let y = r.y; y < r.y + r.h; y += sz) {
          for (let x = r.x; x < r.x + r.w; x += sz) {
            this.ctx.fillStyle = ((x + y) / sz % 2 === 0) ? '#cbd5e1' : '#475569';
            this.ctx.fillRect(x, y, sz, sz);
          }
        }
      } else if (r.type === 'tiles') {
        this.ctx.fillStyle = '#1e3a8a';
        this.ctx.fillRect(r.x, r.y, r.w, r.h);
      } else if (r.type === 'stone') {
        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(r.x, r.y, r.w, r.h);
      }

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      this.ctx.fillRect(r.x + 8, r.y + 6, r.name.length * 7 + 14, 18);
      this.ctx.fillStyle = '#fef08a';
      this.ctx.font = 'bold 10px monospace';
      this.ctx.fillText(r.name.toUpperCase(), r.x + 14, r.y + 19);
    });

    // 2. Camera Relax: EXACT Pokemon Perla Bedroom Furniture (from reference image)
    const bedRoom = VILLA_MAP.rooms.find(rm => rm.id === 'bedroom');
    if (bedRoom) {
      if (this.pkmn.window && this.pkmn.window.complete) this.ctx.drawImage(this.pkmn.window, 840, 42, 50, 42);
      if (this.pkmn.bed && this.pkmn.bed.complete) this.ctx.drawImage(this.pkmn.bed, 920, 160, 50, 70);
      if (this.pkmn.pc_desk && this.pkmn.pc_desk.complete) this.ctx.drawImage(this.pkmn.pc_desk, 750, 60, 54, 70);
      if (this.pkmn.tv && this.pkmn.tv.complete) this.ctx.drawImage(this.pkmn.tv, 820, 60, 70, 48);
      if (this.pkmn.stairs && this.pkmn.stairs.complete) this.ctx.drawImage(this.pkmn.stairs, 910, 60, 70, 46);
      if (this.pkmn.rug && this.pkmn.rug.complete) this.ctx.drawImage(this.pkmn.rug, 800, 140, 95, 60);
      if (this.pkmn.plant && this.pkmn.plant.complete) this.ctx.drawImage(this.pkmn.plant, 750, 240, 26, 52);
    }

    // 2b. Bagno Fixtures: Water Closet (WC) e Lavandino per Bubi!
    const bathRoom = VILLA_MAP.rooms.find(rm => rm.id === 'bathroom');
    if (bathRoom) {
      // Lavandino con specchio
      this.ctx.fillStyle = '#64748b';
      this.ctx.fillRect(760, 365, 34, 10);
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.fillRect(762, 375, 30, 22);
      this.ctx.strokeStyle = '#94a3b8';
      this.ctx.strokeRect(762, 375, 30, 22);
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.fillRect(770, 381, 14, 10);

      // WC in ceramica bianca
      this.ctx.fillStyle = '#e2e8f0';
      this.ctx.fillRect(835, 365, 26, 16);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.ellipse(848, 392, 12, 15, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#cbd5e1';
      this.ctx.stroke();
    }

    // 3. Salone & Cucina Decor
    if (this.pkmn.rug && this.pkmn.rug.complete) this.ctx.drawImage(this.pkmn.rug, 120, 560, 120, 76);
    if (this.pkmn.tv && this.pkmn.tv.complete) this.ctx.drawImage(this.pkmn.tv, 360, 560, 80, 55);
    if (this.pkmn.plant && this.pkmn.plant.complete) this.ctx.drawImage(this.pkmn.plant, 450, 360, 30, 58);

    // Dancefloor
    this.ctx.fillStyle = '#7c3aed';
    this.ctx.fillRect(230, 380, 180, 140);
    this.ctx.strokeStyle = '#fbbf24';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(230, 380, 180, 140);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 11px monospace';
    this.ctx.fillText('🎶 PISTA DI CUORIPOLI 🎶', 244, 450);

    // DJ Booth
    this.ctx.fillStyle = '#3b0764';
    this.ctx.fillRect(60, 370, 140, 60);
    this.ctx.strokeStyle = '#a855f7';
    this.ctx.strokeRect(60, 370, 140, 60);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '9px monospace';
    this.ctx.fillText('DJ LOLLO (MS)', 90, 405);

    // Beer Pong Table (Ara + Kri VS Matti + Jona!)
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(170, 150, 180, 70);
    this.ctx.strokeStyle = '#fbbf24';
    this.ctx.strokeRect(170, 150, 180, 70);

    // Red Pokeball cups on Ara & Kri side
    this.ctx.fillStyle = '#ef4444';
    for (let i = 0; i < 6; i++) {
      this.ctx.beginPath();
      this.ctx.arc(185 + (i % 3) * 14, 165 + Math.floor(i / 3) * 16, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    // Blue cups on Matti & Jona side
    this.ctx.fillStyle = '#3b82f6';
    for (let i = 0; i < 6; i++) {
      this.ctx.beginPath();
      this.ctx.arc(305 + (i % 3) * 14, 165 + Math.floor(i / 3) * 16, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.font = '9px monospace';
    this.ctx.fillText('ARA+KRI vs MATTI+JONA', 188, 190);

    // Fridge (Drink per Mari!)
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.fillRect(60, 70, 56, 60);
    this.ctx.fillStyle = '#334155';
    this.ctx.fillRect(60, 94, 56, 2);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '9px monospace';
    this.ctx.fillText('FRIGO', 70, 120);

    // Balcony Landscape
    const balc = VILLA_MAP.rooms.find(rm => rm.id === 'balcony');
    if (balc) {
      const skyX = balc.x + balc.w - 110;
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(skyX, balc.y, 110, balc.h);
      this.ctx.fillStyle = '#1e293b';
      this.ctx.beginPath();
      this.ctx.moveTo(skyX, balc.y + balc.h);
      this.ctx.lineTo(skyX + 25, balc.y + 70);
      this.ctx.lineTo(skyX + 55, balc.y + 40);
      this.ctx.lineTo(skyX + 110, balc.y + 90);
      this.ctx.lineTo(skyX + 110, balc.y + balc.h);
      this.ctx.fill();
      this.ctx.fillStyle = '#fff';
      for (let i = 0; i < 16; i++) {
        const sx = skyX + 8 + (i * 27) % 94;
        const sy = balc.y + 6 + (i * 23) % (balc.h - 50);
        this.ctx.fillRect(sx, sy, 2, 2);
      }
      this.ctx.fillStyle = '#78350f';
      this.ctx.fillRect(balc.x + 20, balc.y + 110, 80, 36);
    }

    // Walls
    VILLA_MAP.walls.forEach(w => {
      if (this.pkmn.wall && this.pkmn.wall.complete) {
        const pat = this.ctx.createPattern(this.pkmn.wall, 'repeat');
        this.ctx.fillStyle = pat;
      } else {
        this.ctx.fillStyle = '#cebe94';
      }
      this.ctx.fillRect(w.x, w.y, w.w, w.h);
      this.ctx.strokeStyle = '#6b5a3e';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    // Doorway thresholds & mats
    VILLA_MAP.doorways.forEach(d => {
      this.ctx.fillStyle = d.matColor || '#cbd5e1';
      this.ctx.fillRect(d.x - 4, d.y + 4, d.w + 8, d.h - 8);
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(d.x - 4, d.y + 4, d.w + 8, d.h - 8);

      if (d.isBarriered) {
        this.ctx.fillStyle = '#dc2626';
        this.ctx.fillRect(d.x, d.y, d.w, d.h);
        this.ctx.fillStyle = '#fef08a';
        this.ctx.font = 'bold 9px monospace';
        this.ctx.fillText('BLOCCATA', d.x - 8, d.y + d.h / 2);
      }
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

    const name = isPlayer ? 'Leon' : c.name;
    this.ctx.font = 'bold 10px monospace';
    const tw = this.ctx.measureText(name).width;
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.ctx.fillRect(c.x - tw / 2 - 3, drawY - 14, tw + 6, 12);
    this.ctx.fillStyle = (c.id === 'mari') ? '#f472b6' : isPlayer ? '#60a5fa' : (c.id === 'maya') ? '#ef4444' : '#fff';
    this.ctx.fillText(name, c.x - tw / 2, drawY - 4);

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

    // Check Doorway Barrier (Bedroom & Balcony)
    for (const d of VILLA_MAP.doorways) {
      if (d.id === 'door_bedroom' || d.id === 'door_balcony') {
        const cx = d.x + d.w / 2;
        const cy = d.y + d.h / 2;
        if (Math.hypot(p.x - cx, p.y - cy) < 48) {
          tip = `[E / Spazio] ${d.isBarriered ? 'Togli Barriera' : 'Chiudi Barriera Privacy'}`;
          break;
        }
      }
      if (d.id === 'door_bathroom') {
        const cx = d.x + d.w / 2;
        const cy = d.y + d.h / 2;
        if (Math.hypot(p.x - cx, p.y - cy) < 55) {
          tip = `[E / Spazio] Bussa al Bagno (Occupato da Bubi!)`;
          break;
        }
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

    // Check Fridge
    if (!tip && Math.hypot(p.x - 90, p.y - 100) < 55) {
      tip = `[E / Spazio] Apri Frigorifero (Cocktail per Mari)`;
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
