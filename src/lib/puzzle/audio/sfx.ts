/**
 * Sfx —— 程序化 WebAudio 音效（无资源文件）
 * - 惰性 AudioContext（首次用户手势内创建，规避 autoplay 限制）
 * - snap：短促三角波滑音 + 噪声咔哒
 * - complete：四音上行琶音
 * - 主 GainNode，静音用 linearRampToValueAtTime 1s 淡出（对齐 jigex）
 * - 静音状态 localStorage 持久化
 */
const MUTE_KEY = 'jw:muted';

class SfxEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private _muted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this._muted = localStorage.getItem(MUTE_KEY) === 'true';
      } catch {
        /* private browsing */
      }
    }
  }

  get muted() {
    return this._muted;
  }

  setMuted(m: boolean) {
    this._muted = m;
    try {
      localStorage.setItem(MUTE_KEY, String(m));
    } catch {
      /* ignore */
    }
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      if (m) {
        // jigex 式 1s 线性淡出
        this.master.gain.setValueAtTime(this.master.gain.value, t);
        this.master.gain.linearRampToValueAtTime(0, t + 1);
      } else {
        this.master.gain.setValueAtTime(this.master.gain.value, t);
        this.master.gain.linearRampToValueAtTime(1, t + 0.2);
      }
    }
  }

  /** 必须在用户手势调用链内首次调用 */
  ensureContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    try {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
    }
  }

  /** 吸附音：60ms 三角波 880→1320Hz + 噪声咔哒 */
  snap() {
    if (!this.ctx || !this.master || this._muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.05);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.22, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(og).connect(this.master);
    osc.start(t);
    osc.stop(t + 0.1);

    // 噪声咔哒（10ms）
    const len = Math.floor(ctx.sampleRate * 0.012);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.12, t);
    src.connect(ng).connect(this.master);
    src.start(t);
  }

  /** 完成音：C-E-G-C 上行琶音 */
  complete() {
    if (!this.ctx || !this.master || this._muted) return;
    const ctx = this.ctx;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const t0 = ctx.currentTime;
    notes.forEach((freq, i) => {
      const t = t0 + i * 0.12;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(g).connect(this.master!);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  }

  /** 拾取音：轻微的低频叩击 */
  pick() {
    if (!this.ctx || !this.master || this._muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.04);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + 0.07);
  }
}

export const sfx = new SfxEngine();
