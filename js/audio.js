// Pokemon Perla (Sinnoh) Web Audio Chiptune Synthesizer

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.musicPlaying = false;
    this.bgmTimer = null;
    this.tempo = 120;
    this.step = 0;
    this.isRomanticMode = false;
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
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.isMuted;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
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

  // Pokemon DS text typing blip
  playBlip() {
    this.playTone(520, 'square', 0.04, 0.04);
  }

  playSelect() {
    this.playTone(740, 'triangle', 0.06, 0.08);
  }

  // Classic Pokemon Trainer Spotted Encounter Sting! (Dun-dun-DUN!)
  playPokemonEncounter() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 440, t: 0.0, d: 0.1 },
        { f: 554.37, t: 0.09, d: 0.1 },
        { f: 659.25, t: 0.18, d: 0.1 },
        { f: 880, t: 0.27, d: 0.35 }
      ];
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.22, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch(e) {}
  }

  playMayaCatch() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [320, 290, 260, 200];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.18, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + (idx + 1) * 0.1);
      });
    } catch(e) {}
  }

  // Pokemon Level-Up / Love Affection Chime
  playHeart() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // Pokemon Level-Up jingle notes (G4, C5, E5, G5, C6)
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.16, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch(e) {}
  }

  playDoor() {
    this.playTone(220, 'square', 0.08, 0.08);
  }

  playPickup() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // Pokemon Item Get fanfare!
      const notes = [587.33, 880, 783.99, 1174.66];
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.09);
        gain.gain.setValueAtTime(0.18, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.25);
      });
    } catch(e) {}
  }

  // Pokemon Sinnoh Battle Victory Fanfare!
  playVictory() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, d: 0.12, t: 0.0 },
        { f: 523.25, d: 0.12, t: 0.12 },
        { f: 523.25, d: 0.12, t: 0.24 },
        { f: 523.25, d: 0.28, t: 0.36 },
        { f: 415.30, d: 0.28, t: 0.64 },
        { f: 466.16, d: 0.28, t: 0.92 },
        { f: 523.25, d: 0.50, t: 1.20 },
        { f: 466.16, d: 0.18, t: 1.70 },
        { f: 523.25, d: 0.80, t: 1.88 }
      ];
      fanfare.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.22, now + n.t);
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
    const intervalMs = (60 / this.tempo) * 1000 / 4;

    this.bgmTimer = setInterval(() => {
      if (!this.musicPlaying || this.isMuted) return;
      this.tickBgm();
      this.step = (this.step + 1) % 16;
    }, intervalMs);
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

    if (this.isRomanticMode) {
      // Pokemon Sinnoh Route 209 Night / Hearthome Night gentle arpeggios
      const sinnohNight = [329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 440.00, 523.25];
      if (this.step % 2 === 0) {
        const nIdx = (this.step / 2) % sinnohNight.length;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(sinnohNight[nIdx], now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      }
      return;
    }

    // Sinnoh Party BGM
    // Kick on 0, 4, 8, 12
    if (this.step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }

    // Hi-hat
    if (this.step % 2 === 1) {
      this.playTone(1400, 'square', 0.02, 0.02);
    }

    // Bassline
    const bass = [110, 110, 130.8, 110, 146.8, 130.8, 164.8, 130.8];
    if (this.step % 2 === 0) {
      const nIdx = Math.floor(this.step / 2) % bass.length;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(bass[nIdx], now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    }
  }

  setRomantic(romantic) {
    this.isRomanticMode = romantic;
  }
}

window.soundSystem = new SoundSystem();
