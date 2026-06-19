export class AudioManager {
  private audioCtx: AudioContext | null = null;
  private musicInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {}
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.08) {
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playJump() { this.playTone(400, 0.1); setTimeout(() => this.playTone(800, 0.1), 50); }
  playCoin() { this.playTone(988, 0.05); setTimeout(() => this.playTone(1319, 0.15), 50); }
  playStomp() { this.playTone(150, 0.1); }
  playDeath() { this.playTone(400, 0.1); setTimeout(() => this.playTone(200, 0.3), 100); }
  playPowerup() { 
    this.playTone(523, 0.08); setTimeout(() => this.playTone(659, 0.08), 80); 
    setTimeout(() => this.playTone(784, 0.08), 160); setTimeout(() => this.playTone(1047, 0.15), 240); 
  }
  playFlag() {
    this.playTone(523, 0.1); setTimeout(() => this.playTone(659, 0.1), 100); 
    setTimeout(() => this.playTone(784, 0.1), 200); setTimeout(() => this.playTone(1047, 0.2), 300);
  }

  startMusic(track: 'title' | 'overworld' | 'underground' | 'castle' | 'boss' | 'end') {
    this.stopMusic();
    if (!this.audioCtx) return;
    
    let notes: number[] = [];
    let tempo = 250;

    if (track === 'title') {
      notes = [523, 659, 784, 659, 523, 659, 784, 1047, 784, 659, 523, 659, 784, 659, 523, 392];
      tempo = 200;
    } else if (track === 'overworld') {
      notes = [392, 523, 659, 523, 587, 659, 0, 523, 392, 523, 659, 523, 587, 784, 0, 659];
      tempo = 250;
    } else if (track === 'underground') {
      notes = [131, 131, 0, 131, 165, 0, 131, 196, 0, 131, 165, 0, 131, 131, 0, 131];
      tempo = 300;
    } else if (track === 'castle') {
      // Scary, deep, slow
      notes = [110, 0, 110, 0, 130, 0, 110, 0, 98, 0, 98, 0, 110, 0, 0, 0];
      tempo = 400;
    } else if (track === 'boss') {
      // Frantic and fast
      notes = [261, 311, 261, 311, 261, 311, 261, 311, 233, 277, 233, 277, 233, 277, 233, 277];
      tempo = 100;
    } else if (track === 'end') {
      notes = [523, 659, 784, 1047, 784, 659, 523, 659, 784, 1047, 1319, 1047, 784, 659, 523, 392];
      tempo = 150;
    }

    let i = 0;
    this.musicInterval = setInterval(() => {
      if (this.audioCtx && this.audioCtx.state === 'running') {
        const n = notes[i % notes.length];
        if (n > 0) {
          this.playTone(n, tempo / 1000, track === 'underground' ? 'sawtooth' : 'triangle', 0.06);
        }
      }
      i++;
    }, tempo);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}