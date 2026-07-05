/**
 * Utils —— 工具函数（原样移植自 jigsaw-engine.ts）
 */
export const Utils = {
  // 种子化随机数（Mulberry32）—— 同种子同序列，保证切图可复现
  rng(seed: number) {
    let s = (seed >>> 0) || 1;
    return function () {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },
  // 2D 向量旋转（角度制）—— 用于吸附几何/组旋转
  rotate(x: number, y: number, deg: number) {
    const r = (deg * Math.PI) / 180;
    const c = Math.cos(r),
      s = Math.sin(r);
    return { x: x * c - y * s, y: x * s + y * c };
  },
  clamp(v: number, lo: number, hi: number) {
    return v < lo ? lo : v > hi ? hi : v;
  },
  hypot(x: number, y: number) {
    return Math.sqrt(x * x + y * y);
  },
  // 加载 url 为 HTMLImageElement
  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = src;
    });
  },
  // 用时格式化 mm:ss
  fmtTime(sec: number) {
    const m = Math.floor(sec / 60),
      s = sec % 60;
    return m + ':' + (s < 10 ? '0' + s : s);
  },
};
