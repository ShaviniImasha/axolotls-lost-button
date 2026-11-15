export type SoundEffect =
  | 'bubble'
  | 'found'
  | 'treasure'
  | 'clue'
  | 'correct'
  | 'incorrect'
  | 'chestUnlock'
  | 'buttonFound'
  | 'hint'
  | 'timeUp';

export class AudioService {
  private static instance: AudioService;
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private ambienceOsc: OscillatorNode | null = null;
  private ambienceLfo: OscillatorNode | null = null;
  private ambienceGain: GainNode | null = null;
  private ambiencePlaying: boolean = false;

  private constructor() {
    try {
      const stored = window.localStorage.getItem('axolotl_muted');
      if (stored !== null) {
        this.muted = JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      window.localStorage.setItem('axolotl_muted', JSON.stringify(muted));
    } catch {
      // ignore
    }
    if (muted) {
      this.stopOceanAmbience();
    }
  }

  public startOceanAmbience(): void {
    if (this.muted || this.ambiencePlaying) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const masterGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      lfoGain.gain.setValueAtTime(25, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, ctx.currentTime);

      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 1);

      osc.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc.start();
      lfo.start();

      this.ambienceOsc = osc;
      this.ambienceLfo = lfo;
      this.ambienceGain = masterGain;
      this.ambiencePlaying = true;
    } catch {
      // Ignore audio policy errors
    }
  }

  public stopOceanAmbience(): void {
    if (!this.ambiencePlaying || !this.ctx || !this.ambienceGain) return;
    try {
      const now = this.ctx.currentTime;
      this.ambienceGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      setTimeout(() => {
        try {
          this.ambienceOsc?.stop();
          this.ambienceLfo?.stop();
          this.ambienceOsc?.disconnect();
          this.ambienceLfo?.disconnect();
          this.ambienceGain?.disconnect();
        } catch {}
        this.ambienceOsc = null;
        this.ambienceLfo = null;
        this.ambienceGain = null;
        this.ambiencePlaying = false;
      }, 550);
    } catch {
      this.ambiencePlaying = false;
    }
  }

  public setAmbienceEnabled(enabled: boolean): void {
    if (enabled && !this.muted) {
      this.startOceanAmbience();
    } else {
      this.stopOceanAmbience();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  private getAudioContext(): AudioContext | null {
    if (this.muted) return null;
    try {
      if (!this.ctx && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public play(effect: SoundEffect): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    switch (effect) {
      case 'bubble':
        this.playBubble(ctx);
        break;
      case 'found':
        this.playTones(ctx, [659, 880], 0.08, 'sine');
        break;
      case 'treasure':
        this.playTones(ctx, [523, 659, 784, 1046], 0.07, 'triangle');
        break;
      case 'clue':
        this.playTones(ctx, [440, 554, 659, 830], 0.09, 'sine');
        break;
      case 'correct':
        this.playTones(ctx, [587, 740, 880, 1174], 0.09, 'triangle');
        break;
      case 'incorrect':
        this.playTones(ctx, [330, 246], 0.15, 'sawtooth', 0.02);
        break;
      case 'chestUnlock':
        this.playTones(ctx, [392, 523, 659, 784, 1046, 1318], 0.1, 'sine');
        break;
      case 'buttonFound':
        this.playFanfare(ctx);
        break;
      case 'hint':
        this.playTones(ctx, [880, 1174, 1480], 0.06, 'sine', 0.02);
        break;
      case 'timeUp':
        this.playTones(ctx, [440, 392, 349, 293], 0.12, 'sine', 0.03);
        break;
    }
  }

  private playBubble(ctx: AudioContext): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  private playTones(
    ctx: AudioContext,
    freqs: number[],
    stepDuration: number,
    type: OscillatorType = 'sine',
    volume = 0.035,
  ): void {
    const now = ctx.currentTime;
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * stepDuration;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + stepDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + stepDuration + 0.01);
    });
  }

  private playFanfare(ctx: AudioContext): void {
    const notes = [523, 659, 784, 1046, 1318, 1568];
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.045, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.26);
    });
  }
}

export const audioService = AudioService.getInstance();

