/**
 * SnapIndicator —— 吸附箭头提示（按 jigex 规格）
 * 吸附发生后：接缝两侧出现一对箭头，450ms 延迟登场，向内补间 15px（~500ms），
 * 同时 500ms 淡出后销毁。
 */
import { Container, Graphics } from 'pixi.js';
import { TweenRunner, easeInQuad } from './tween';
import type { SnapEvent } from '@/lib/puzzle/core/types';

const APPEAR_DELAY = 450;
const MOVE_DIST = 15;
const MOVE_MS = 500;
const FADE_MS = 500;
const OFFSET = 20; // 箭头离接缝的初始距离
const ARROW_SIZE = 12;

export class SnapIndicator {
  private layer: Container;
  private tweens: TweenRunner;
  private pending: ReturnType<typeof setTimeout>[] = [];

  constructor(layer: Container, tweens: TweenRunner) {
    this.layer = layer;
    this.tweens = tweens;
  }

  /** 在世界坐标接缝处播放一对箭头动画 */
  show(e: SnapEvent, scale = 1) {
    const timer = setTimeout(() => {
      this.spawn(e, scale);
    }, APPEAR_DELAY);
    this.pending.push(timer);
  }

  private spawn(e: SnapEvent, scale: number) {
    // horizontal = 左右相邻（竖直接缝）→ 箭头水平相向；否则垂直相向
    const s = Math.max(0.6, Math.min(2, 1 / scale)); // 视口缩放下保持视觉尺寸
    const mk = (dir: 1 | -1) => {
      const g = new Graphics();
      const a = ARROW_SIZE * s;
      // 朝 +x 的三角箭头，按方向/接缝走向旋转
      g.moveTo(a / 2, 0)
        .lineTo(-a / 2, -a * 0.6)
        .lineTo(-a / 2, a * 0.6)
        .closePath()
        .fill({ color: 0xffffff, alpha: 0.95 })
        .stroke({ color: 0x10202f, width: 1.5 * s, alpha: 0.8 });
      if (e.horizontal) {
        // 竖直接缝：左侧箭头朝右（dir=1 在左），右侧朝左
        g.position.set(e.jointX - dir * OFFSET * s, e.jointY);
        g.rotation = dir === 1 ? 0 : Math.PI;
      } else {
        // 水平接缝：上方箭头朝下，下方朝上
        g.position.set(e.jointX, e.jointY - dir * OFFSET * s);
        g.rotation = dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      }
      this.layer.addChild(g);
      // Pixi Container 的 x/y/alpha 是数值访问器，可直接补间
      const target: Record<string, number> = e.horizontal
        ? { x: g.x + dir * MOVE_DIST * s }
        : { y: g.y + dir * MOVE_DIST * s };
      const obj = g as unknown as Record<string, number>;
      this.tweens.to(obj, target, MOVE_MS, easeInQuad);
      this.tweens.to(obj, { alpha: 0 }, FADE_MS, easeInQuad, () => {
        if (!g.destroyed) g.destroy();
      });
    };
    mk(1);
    mk(-1);
  }

  destroy() {
    for (const t of this.pending) clearTimeout(t);
    this.pending = [];
  }
}
