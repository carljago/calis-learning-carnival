/**
 * AudioManager - Sound effects using Web Audio API + TTS
 */
const AudioManager = {
  _ctx: null,
  _enabled: true,
  _volume: 0.7,

  /** Initialize audio context (must be called after user interaction) */
  init() {
    if (!this._ctx) {
      try {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not available');
      }
    }
    const settings = window.CarnivalUtils ? CarnivalUtils.getSettings() : {};
    this._enabled = settings.soundEnabled !== false;
    this._volume = settings.volume || 0.7;
  },

  /** Resume audio context (needed after user gesture) */
  resume() {
    if (this._ctx && this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
  },

  setVolume(v) { this._volume = Math.max(0, Math.min(1, v)); },
  setEnabled(b) { this._enabled = b; },

  /** Play a named sound effect */
  play(name) {
    if (!this._enabled || !this._ctx) return;
    this.resume();

    const sounds = {
      correct: () => this._playTone([523, 659, 784], 0.12, 'sine'),
      incorrect: () => this._playTone([200, 180], 0.15, 'triangle'),
      starEarned: () => this._playTone([880, 1047, 1319, 1568], 0.08, 'sine'),
      mmEarned: () => {
        this._playTone([523, 659, 784, 1047], 0.1, 'sine');
        setTimeout(() => this._playTone([1047, 1319, 1568], 0.08, 'sine'), 300);
      },
      buttonPress: () => this._playTone([600], 0.05, 'sine'),
      celebration: () => {
        const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
        notes.forEach((n, i) => {
          setTimeout(() => this._playTone([n], 0.08, 'sine'), i * 60);
        });
      },
      whoosh: () => this._playSweep(800, 200, 0.2)
    };

    if (sounds[name]) sounds[name]();
  },

  /** Play a sequence of tones */
  _playTone(freqs, duration, type) {
    if (!this._ctx) return;
    freqs.forEach((freq, i) => {
      const osc = this._ctx.createOscillator();
      const gain = this._ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.value = this._volume * 0.3;
      gain.gain.exponentialRampToValueAtTime(0.001, this._ctx.currentTime + (i * duration) + duration);
      osc.connect(gain);
      gain.connect(this._ctx.destination);
      osc.start(this._ctx.currentTime + i * duration);
      osc.stop(this._ctx.currentTime + (i * duration) + duration + 0.05);
    });
  },

  /** Play a frequency sweep (for whoosh) */
  _playSweep(startFreq, endFreq, duration) {
    if (!this._ctx) return;
    const osc = this._ctx.createOscillator();
    const gain = this._ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = startFreq;
    osc.frequency.exponentialRampToValueAtTime(endFreq, this._ctx.currentTime + duration);
    gain.gain.value = this._volume * 0.2;
    gain.gain.exponentialRampToValueAtTime(0.001, this._ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this._ctx.destination);
    osc.start();
    osc.stop(this._ctx.currentTime + duration + 0.05);
  },

  /** Speak text using Web Speech API. Returns a Promise that resolves when speech ends. */
  speak(text) {
    if (!this._enabled || !('speechSynthesis' in window)) {
      return Promise.resolve();
    }
    window.speechSynthesis.cancel();
    return new Promise(resolve => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.85;
      utter.pitch = 1.1;
      utter.volume = this._volume;
      utter.onend = resolve;
      utter.onerror = resolve;
      window.speechSynthesis.speak(utter);
      // Safety timeout in case onend never fires
      setTimeout(resolve, 3000);
    });
  }
};

window.AudioManager = AudioManager;
