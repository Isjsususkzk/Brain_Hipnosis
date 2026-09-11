export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying = false;

  constructor() {
    // AudioContext will be created on first user interaction
  }

  init(): void {
    this.getContext();
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playAmbientDrone() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const ctx = this.getContext();
    
    // Low frequency drone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = 55;
    gain1.gain.value = 0.08;
    osc1.connect(gain1);
    gain1.connect(this.masterGain!);
    osc1.start();
    this.oscillators.push(osc1);

    // Subtle detuned second oscillator
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = 57;
    gain2.gain.value = 0.05;
    osc2.connect(gain2);
    gain2.connect(this.masterGain!);
    osc2.start();
    this.oscillators.push(osc2);

    // Slow LFO modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfo.start();
    this.oscillators.push(lfo);
  }

  playDistortedAmbience() {
    if (!this.isPlaying) {
      this.playAmbientDrone();
    }

    const ctx = this.getContext();

    // Add distorted noise
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 10;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.15;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    noise.start();

    // Eerie high tone
    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'sawtooth';
    highOsc.frequency.value = 4000;
    highGain.gain.value = 0.01;
    highOsc.connect(highGain);
    highGain.connect(this.masterGain!);
    highOsc.start();
    this.oscillators.push(highOsc);

    // Modulate the high tone
    const lfo2 = ctx.createOscillator();
    const lfo2Gain = ctx.createGain();
    lfo2.frequency.value = 0.05;
    lfo2Gain.gain.value = 500;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(highOsc.frequency);
    lfo2.start();
    this.oscillators.push(lfo2);
  }

  playStinger() {
    const ctx = this.getContext();

    // Sharp dissonant chord
    const frequencies = [130.81, 138.59, 185.0, 277.18]; // C3, C#3, F#3, C#4
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 === 0 ? 'sawtooth' : 'square';
      osc.frequency.value = freq;
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    });

    // Impact noise
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
    }
    const impact = ctx.createBufferSource();
    impact.buffer = buffer;
    const impactGain = ctx.createGain();
    impactGain.gain.value = 0.4;
    impact.connect(impactGain);
    impactGain.connect(this.masterGain!);
    impact.start();
  }

  playGlitchSound() {
    const ctx = this.getContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 100 + Math.random() * 2000;
    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  playWhisper() {
    const ctx = this.getContext();

    // Filtered noise that sounds like whispering
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * Math.sin(t * 3) * 0.3;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 5;

    const gain = ctx.createGain();
    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    source.start();
  }

  setVolume(vol: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  }

  dispose() {
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    if (this.ctx) {
      this.ctx.close();
    }
  }
}
