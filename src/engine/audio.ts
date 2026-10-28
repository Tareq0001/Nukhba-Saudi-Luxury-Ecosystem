// ==========================================
// NUKHBA Procedural Web Audio Engine
// Zero external sound files - 100% synthesized
// ==========================================

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  
  // Engine Rev state
  private revOsc1: OscillatorNode | null = null;
  private revOsc2: OscillatorNode | null = null;
  private revNoise: AudioBufferSourceNode | null = null;
  private revFilter: BiquadFilterNode | null = null;
  private revGain: GainNode | null = null;
  private isRevving: boolean = false;

  constructor() {
    const saved = localStorage.getItem('nukhba_audio_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('nukhba_audio_muted', String(this.isMuted));
    if (this.isMuted && this.isRevving) {
      this.stopEngineRev();
    }
    return this.isMuted;
  }

  /**
   * Tactile Luxury Mechanical Click
   */
  public playClick(type: 'subtle' | 'luxury' | 'gold' = 'luxury') {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const now = ctx.currentTime;

    if (type === 'gold') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'luxury') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else {
      // subtle
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.02);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
  }

  /**
   * Resonant Golden Chime (Confirmation / Add to Dossier)
   */
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [528, 1056, 1584]; // Solfeggio 528Hz Love/Miracle frequency & harmonics
    const gains = [0.15, 0.08, 0.04];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    });
  }

  /**
   * Wooden Gavel Strike for Royal Equine Auction
   */
  public playGavel() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Transient click
    const oscClick = ctx.createOscillator();
    const gainClick = ctx.createGain();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(1400, now);
    oscClick.frequency.exponentialRampToValueAtTime(80, now + 0.03);
    gainClick.gain.setValueAtTime(0.35, now);
    gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    oscClick.connect(gainClick);
    gainClick.connect(ctx.destination);
    oscClick.start(now);
    oscClick.stop(now + 0.05);

    // Deep wooden resonance
    const oscWood = ctx.createOscillator();
    const gainWood = ctx.createGain();
    const filterWood = ctx.createBiquadFilter();

    oscWood.type = 'sine';
    oscWood.frequency.setValueAtTime(115, now);
    oscWood.frequency.exponentialRampToValueAtTime(45, now + 0.35);

    filterWood.type = 'bandpass';
    filterWood.frequency.setValueAtTime(130, now);
    filterWood.Q.setValueAtTime(4.5, now);

    gainWood.gain.setValueAtTime(0.4, now);
    gainWood.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    oscWood.connect(filterWood);
    filterWood.connect(gainWood);
    gainWood.connect(ctx.destination);

    oscWood.start(now);
    oscWood.stop(now + 0.4);

    // Subtle table echo slap
    setTimeout(() => {
      if (this.isMuted) return;
      const tNow = ctx.currentTime;
      const echoOsc = ctx.createOscillator();
      const echoGain = ctx.createGain();
      echoOsc.type = 'sine';
      echoOsc.frequency.setValueAtTime(90, tNow);
      echoGain.gain.setValueAtTime(0.12, tNow);
      echoGain.gain.exponentialRampToValueAtTime(0.001, tNow + 0.18);
      echoOsc.connect(echoGain);
      echoGain.connect(ctx.destination);
      echoOsc.start(tNow);
      echoOsc.stop(tNow + 0.2);
    }, 70);
  }

  /**
   * Horlogerie Escapement Tick (Tick-Tock)
   */
  public playEscapementTick(highPitch: boolean = false) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    const baseFreq = highPitch ? 2400 : 1850;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.015);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  /**
   * Mithmar Dyno V12 Engine Synthesizer
   */
  public startEngineRev(rpm: number = 2500) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    if (this.isRevving) {
      this.updateEngineRpm(rpm);
      return;
    }

    const now = ctx.currentTime;
    this.isRevving = true;

    // Calculate engine fundamental (V12 has 6 firings per revolution)
    // At 3000 RPM = 50 rev/sec * 6 = 300 Hz
    const f0 = (rpm / 60) * 4;

    this.revOsc1 = ctx.createOscillator();
    this.revOsc1.type = 'sawtooth';
    this.revOsc1.frequency.setValueAtTime(f0, now);

    this.revOsc2 = ctx.createOscillator();
    this.revOsc2.type = 'triangle';
    this.revOsc2.frequency.setValueAtTime(f0 * 0.5, now);

    // Noise buffer for exhaust air turbulence
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.revNoise = ctx.createBufferSource();
    this.revNoise.buffer = noiseBuffer;
    this.revNoise.loop = true;

    this.revFilter = ctx.createBiquadFilter();
    this.revFilter.type = 'lowpass';
    this.revFilter.frequency.setValueAtTime(Math.min(3500, f0 * 4.5), now);
    this.revFilter.Q.setValueAtTime(3.5, now);

    this.revGain = ctx.createGain();
    this.revGain.gain.setValueAtTime(0.01, now);
    this.revGain.gain.linearRampToValueAtTime(0.18, now + 0.08);

    this.revOsc1.connect(this.revFilter);
    this.revOsc2.connect(this.revFilter);
    this.revNoise.connect(this.revFilter);
    this.revFilter.connect(this.revGain);
    this.revGain.connect(ctx.destination);

    this.revOsc1.start(now);
    this.revOsc2.start(now);
    this.revNoise.start(now);
  }

  public updateEngineRpm(rpm: number) {
    if (!this.isRevving || !this.ctx || !this.revOsc1 || !this.revOsc2 || !this.revFilter) return;
    const now = this.ctx.currentTime;
    const f0 = (rpm / 60) * 4;

    this.revOsc1.frequency.linearRampToValueAtTime(f0, now + 0.05);
    this.revOsc2.frequency.linearRampToValueAtTime(f0 * 0.5, now + 0.05);
    this.revFilter.frequency.linearRampToValueAtTime(Math.min(4500, f0 * 5), now + 0.05);
  }

  public stopEngineRev() {
    if (!this.isRevving || !this.ctx || !this.revGain) return;
    const now = this.ctx.currentTime;

    // Decay down with overrun crackle
    this.revGain.gain.linearRampToValueAtTime(0.001, now + 0.25);

    setTimeout(() => {
      try {
        this.revOsc1?.stop();
        this.revOsc2?.stop();
        this.revNoise?.stop();
        this.revOsc1?.disconnect();
        this.revOsc2?.disconnect();
        this.revNoise?.disconnect();
        this.revFilter?.disconnect();
        this.revGain?.disconnect();
      } catch {
        // ignore
      }
      this.revOsc1 = null;
      this.revOsc2 = null;
      this.revNoise = null;
      this.revFilter = null;
      this.revGain = null;
      this.isRevving = false;
    }, 280);

    // Procedural exhaust pops on throttle liftoff!
    this.playExhaustCrackles();
  }

  private playExhaustCrackles() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const popCount = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < popCount; i++) {
      const delay = 80 + i * (50 + Math.random() * 60);
      setTimeout(() => {
        if (this.isMuted) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140 + Math.random() * 80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.04);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);

        gain.gain.setValueAtTime(0.1 + Math.random() * 0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      }, delay);
    }
  }
}

export const sound = new AudioEngine();
