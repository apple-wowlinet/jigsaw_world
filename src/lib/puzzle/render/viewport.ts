/**
 * Viewport —— 手写 pan/zoom 容器（不用 pixi-viewport，避免与拼块拖拽冲突）
 * - 滚轮缩放锚定光标（0.5×–4×）
 * - 双指捏合缩放
 * - 空白处拖拽平移（由 input.ts 判定后调用 panBy）
 * - toWorld() 屏幕 → 世界坐标
 * - 世界可大于屏幕（散布区），平移范围被限制在世界边界内（含少量弹性余量）
 */
import type { Container } from 'pixi.js';

export const ZOOM_MIN = 0.2;
export const ZOOM_MAX = 4;

export class Viewport {
  /** 被变换的根容器（camera 的逆） */
  root: Container;
  /** 屏幕尺寸 */
  screenW = 0;
  screenH = 0;
  /** 世界尺寸 */
  worldW = 0;
  worldH = 0;
  scale = 1;
  x = 0; // root.position
  y = 0;
  minScale = ZOOM_MIN;

  constructor(root: Container) {
    this.root = root;
  }

  resize(screenW: number, screenH: number, worldW: number, worldH: number) {
    this.screenW = screenW;
    this.screenH = screenH;
    this.worldW = worldW;
    this.worldH = worldH;
    // 最小缩放：世界完整可见（再留 5% 余量），但不小于 ZOOM_MIN
    const fit = Math.min(screenW / worldW, screenH / worldH) * 0.95;
    this.minScale = Math.min(1, Math.max(ZOOM_MIN, fit));
    this.clampPan();
    this.apply();
  }

  /** 初始视图：世界居中、恰好完整可见 */
  fitWorld() {
    const fit = Math.min(this.screenW / this.worldW, this.screenH / this.worldH);
    this.scale = Math.min(1, fit);
    this.x = (this.screenW - this.worldW * this.scale) / 2;
    this.y = (this.screenH - this.worldH * this.scale) / 2;
    this.clampPan();
    this.apply();
  }

  toWorld(sx: number, sy: number) {
    return { x: (sx - this.x) / this.scale, y: (sy - this.y) / this.scale };
  }

  toScreen(wx: number, wy: number) {
    return { x: wx * this.scale + this.x, y: wy * this.scale + this.y };
  }

  /** 缩放并保持屏幕点 (sx, sy) 对应的世界点不动 */
  zoomAt(sx: number, sy: number, factor: number) {
    const w = this.toWorld(sx, sy);
    this.scale = Math.min(ZOOM_MAX, Math.max(this.minScale, this.scale * factor));
    this.x = sx - w.x * this.scale;
    this.y = sy - w.y * this.scale;
    this.clampPan();
    this.apply();
  }

  panBy(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    this.clampPan();
    this.apply();
  }

  /** 平移约束：世界边缘不越过屏幕中线（世界小于屏幕时居中） */
  private clampPan() {
    const ww = this.worldW * this.scale;
    const wh = this.worldH * this.scale;
    if (ww <= this.screenW) {
      this.x = (this.screenW - ww) / 2;
    } else {
      this.x = Math.min(0, Math.max(this.screenW - ww, this.x));
    }
    if (wh <= this.screenH) {
      this.y = (this.screenH - wh) / 2;
    } else {
      this.y = Math.min(0, Math.max(this.screenH - wh, this.y));
    }
  }

  private apply() {
    this.root.scale.set(this.scale);
    this.root.position.set(this.x, this.y);
  }
}
