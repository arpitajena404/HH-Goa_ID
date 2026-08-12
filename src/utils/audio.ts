// Web Audio API Synth Engine for Cyberpunk / Goa Beach Vibes
// Auto-plays by default on page load / first interaction, and plays continuously until paused via speaker button.

export interface TrackInfo {
  id: string;
  name: string;
  genre: string;
  bpm: number;
}

export const CURRENT_TRACK: TrackInfo = {
  id: 'goa-lofi',
  name: 'Goa Sunset Lo-Fi',
  genre: 'Lo-Fi Chillhop',
  bpm: 84,
};

// Note frequencies map
const NOTE_FREQ: Record<string, number> = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'Gb4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50
};

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public musicEnabled: boolean = true;
  public musicVolume: number = 0.7; // Rich, audible default volume
  private userPaused: boolean = false;
  
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private activeVoices: Set<AudioNode> = new Set();

  private schedulerTimer: number | null = null;
  private currentStep: number = 0;
  private nextNoteTime: number = 0;
  private isPlaying: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAndPlay = () => {
        if (!this.userPaused) {
          this.startMusic();
        }
      };

      // 1. Immediate trigger on construct
      unlockAndPlay();

      // 2. Immediate trigger on load events
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        unlockAndPlay();
      } else {
        window.addEventListener('DOMContentLoaded', unlockAndPlay, { once: true });
        window.addEventListener('load', unlockAndPlay, { once: true });
      }

      // 3. User activation events (Chrome / Safari / Firefox Autoplay unlock)
      const activationEvents = [
        'click',
        'pointerdown',
        'mousedown',
        'touchstart',
        'touchend',
        'keydown',
        'scroll',
        'wheel',
        'focus',
      ];

      const onActivation = () => {
        if (!this.userPaused) {
          if (!this.ctx) {
            this.init();
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().then(() => {
              if (!this.isPlaying && !this.userPaused) {
                this.startMusic();
              }
            }).catch(() => {});
          } else if (!this.isPlaying) {
            this.startMusic();
          }
        }
      };

      activationEvents.forEach((evt) => {
        window.addEventListener(evt, onActivation, { passive: true });
        document.addEventListener(evt, onActivation, { passive: true });
      });
    }
  }

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    });
  }

  public init(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // SFX Gain
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // BGM Gain
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        // Noise Buffer for Drums & Ambiance
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buffer;

        this.ctx.onstatechange = () => {
          if (this.ctx?.state === 'running' && !this.isPlaying && !this.userPaused) {
            this.startMusic();
          }
        };
      }
    }

    return this.ctx;
  }

  // --- Background Music Engine ---

  public async startMusic() {
    this.userPaused = false;
    this.musicEnabled = true;
    this.enabled = true;
    this.isPlaying = true;

    this.init();
    if (!this.ctx) {
      this.notify();
      return;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
    }

    if (this.bgmGain) {
      this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }

    // Always reset note scheduling relative to current time to avoid past-scheduling bug
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.currentStep = 0;

    this.startScheduler();
    this.notify();
  }

  public stopMusic() {
    this.userPaused = true;
    this.isPlaying = false;
    this.musicEnabled = false;
    this.enabled = false;

    if (this.schedulerTimer !== null) {
      window.clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }

    if (this.ctx) {
      try {
        if (this.bgmGain) {
          this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime);
          this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        if (this.masterGain) {
          this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
          this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }

        // Stop and disconnect all active voices
        this.activeVoices.forEach((node) => {
          try {
            if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
              (node as AudioScheduledSourceNode).stop();
            }
            node.disconnect();
          } catch {
            // ignore
          }
        });
        this.activeVoices.clear();

        // Suspend AudioContext to guarantee zero hardware audio output
        if (this.ctx.state === 'running') {
          this.ctx.suspend().catch(() => {});
        }
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public toggleMusic() {
    if (this.isPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Lookahead Scheduler
  private startScheduler() {
    if (this.schedulerTimer !== null) {
      window.clearInterval(this.schedulerTimer);
    }

    const lookahead = 25.0; // ms
    const scheduleAheadTime = 0.2; // seconds

    this.schedulerTimer = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || this.userPaused) return;

      // Resync if currentTime jumped forward while AudioContext was unlocking/resuming
      if (this.nextNoteTime < this.ctx.currentTime) {
        this.nextNoteTime = this.ctx.currentTime + 0.02;
      }

      while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
        this.scheduleStep(this.currentStep, this.nextNoteTime);
        this.advanceStep();
      }
    }, lookahead);
  }

  private advanceStep() {
    const secondsPerBeat = 60.0 / CURRENT_TRACK.bpm;
    const stepDuration = secondsPerBeat / 4; // 16th note steps

    this.nextNoteTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % 64; // 4 bars loop (64 steps)
  }

  // Procedural Music Step Synthesizer (Goa Sunset Lo-Fi Beats)
  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.bgmGain || !this.isPlaying || this.userPaused) return;

    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // Rich Soulful Chords
    const chords = [
      ['D3', 'F3', 'A3', 'C4', 'E4'], // Dm9
      ['G2', 'Bb3', 'D4', 'F4', 'A4'], // Gm9
      ['C3', 'E3', 'G3', 'Bb3', 'D4'], // C9
      ['F2', 'A3', 'C4', 'E4', 'A4'], // Fmaj9
    ];

    if (stepInBar === 0) {
      const currentChord = chords[bar % chords.length];
      currentChord.forEach((noteName, idx) => {
        this.playElectricPianoNote(NOTE_FREQ[noteName] || 440, time + idx * 0.02, 1.8, 0.22);
      });
    } else if (stepInBar === 10) {
      const currentChord = chords[bar % chords.length];
      currentChord.slice(1).forEach((noteName, idx) => {
        this.playElectricPianoNote(NOTE_FREQ[noteName] || 440, time + idx * 0.015, 0.9, 0.15);
      });
    }

    // Warm Deep Bass
    const bassNotes = ['D2', 'G2', 'C2', 'F2'];
    if (stepInBar === 0 || stepInBar === 6 || stepInBar === 12) {
      const note = bassNotes[bar % bassNotes.length];
      this.playSubBass(NOTE_FREQ[note] || 73.42, time, 0.38, 0.32);
    }

    // Chill Pentatonic Melody
    const melodyPattern = [
      'A4', '', 'C5', '', 'E5', 'D5', '', 'A4',
      '', 'G4', 'E4', '', 'D4', '', 'C4', ''
    ];
    const melNote = melodyPattern[stepInBar];
    if (melNote && NOTE_FREQ[melNote]) {
      this.playSoftLead(NOTE_FREQ[melNote], time, 0.3, 0.16);
    }

    // 808 Style Drums: Kick, Snare & Hi-Hats
    if (stepInBar === 0 || stepInBar === 8 || (stepInBar === 14 && bar % 2 === 1)) {
      this.playKick(time, 0.38);
    }
    if (stepInBar === 4 || stepInBar === 12) {
      this.playSnare(time, 0.24);
    }
    if (stepInBar % 2 === 0) {
      this.playHiHat(time, stepInBar % 4 === 0 ? 0.12 : 0.07);
    }
  }

  // --- Synthesizer Instruments with Voice Tracking ---

  private registerVoice(node: AudioScheduledSourceNode, duration: number) {
    this.activeVoices.add(node);
    setTimeout(() => {
      this.activeVoices.delete(node);
    }, (duration + 0.1) * 1000);
  }

  private playElectricPianoNote(freq: number, time: number, duration: number, vol = 0.22) {
    if (!this.ctx || !this.bgmGain || !this.isPlaying || this.userPaused) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc2.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 2.005, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, time);
    filter.frequency.exponentialRampToValueAtTime(350, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration);
    osc2.stop(time + duration);

    this.registerVoice(osc, duration);
    this.registerVoice(osc2, duration);
  }

  private playSubBass(freq: number, time: number, duration: number, vol = 0.32) {
    if (!this.ctx || !this.bgmGain || !this.isPlaying || this.userPaused) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);

    this.registerVoice(osc, duration);
  }

  private playSoftLead(freq: number, time: number, duration: number, vol = 0.16) {
    if (!this.ctx || !this.bgmGain || !this.isPlaying || this.userPaused) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);

    this.registerVoice(osc, duration);
  }

  private playKick(time: number, vol = 0.38) {
    if (!this.ctx || !this.bgmGain || !this.isPlaying || this.userPaused) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.12);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + 0.14);

    this.registerVoice(osc, 0.14);
  }

  private playSnare(time: number, vol = 0.24) {
    if (!this.ctx || !this.bgmGain || !this.noiseBuffer || !this.isPlaying || this.userPaused) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, time);
    filter.Q.setValueAtTime(1.5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    noise.start(time);
    noise.stop(time + 0.12);

    this.registerVoice(noise, 0.12);
  }

  private playHiHat(time: number, vol = 0.12) {
    if (!this.ctx || !this.bgmGain || !this.noiseBuffer || !this.isPlaying || this.userPaused) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    noise.start(time);
    noise.stop(time + 0.04);

    this.registerVoice(noise, 0.04);
  }

  // --- Sound Effects (SFX) ---

  playBeep(freq = 880, duration = 0.08, type: OscillatorType = 'sine') {
    if (!this.enabled || this.userPaused) return;
    try {
      this.init();
      if (!this.ctx || !this.sfxGain) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  playClick() {
    this.playBeep(1200, 0.04, 'triangle');
  }

  playToggle() {
    this.playBeep(640, 0.06, 'sine');
  }

  playRandomize() {
    if (!this.enabled || this.userPaused) return;
    try {
      this.init();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      [440, 660, 880, 1100].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + i * 0.04);
        gain.gain.setValueAtTime(0.03, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.06);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.06);
      });
    } catch {
      // ignore
    }
  }

  playSuccess() {
    if (!this.enabled || this.userPaused) return;
    try {
      this.init();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        gain.gain.setValueAtTime(0.07, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.15);
      });
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundManager();
