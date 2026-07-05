/**
 * Tween —— 共享 Ticker 上的极简补间引擎
 * 供吸附回弹（120ms）、组旋转（150ms）、吸附箭头动画使用。
 */

export type EaseFn = (t: number) => number;

export const easeOutQuad: EaseFn = (t) => t * (2 - t);
export const easeInQuad: EaseFn = (t) => t * t;
export const easeLinear: EaseFn = (t) => t;

interface TweenItem {
  obj: Record<string, number>;
  from: Record<string, number>;
  to: Record<string, number>;
  duration: number;
  elapsed: number;
  ease: EaseFn;
  onDone?: () => void;
  dead: boolean;
}

export class TweenRunner {
  private items: TweenItem[] = [];

  /** 每帧驱动（dtMs = 毫秒） */
  update(dtMs: number) {
    if (!this.items.length) return;
    let hasDead = false;
    for (const it of this.items) {
      if (it.dead) continue;
      it.elapsed += dtMs;
      const t = Math.min(1, it.elapsed / it.duration);
      const k = it.ease(t);
      for (const key in it.to) {
        it.obj[key] = it.from[key] + (it.to[key] - it.from[key]) * k;
      }
      if (t >= 1) {
        it.dead = true;
        hasDead = true;
        it.onDone?.();
      }
    }
    if (hasDead) this.items = this.items.filter((i) => !i.dead);
  }

  /**
   * 补间 obj 的若干数值属性到目标值。
   * 返回取消函数（取消时不触发 onDone）。
   */
  to(
    obj: Record<string, number>,
    target: Record<string, number>,
    duration: number,
    ease: EaseFn = easeOutQuad,
    onDone?: () => void
  ): () => void {
    const from: Record<string, number> = {};
    for (const key in target) from[key] = obj[key];
    const item: TweenItem = {
      obj,
      from,
      to: { ...target },
      duration: Math.max(1, duration),
      elapsed: 0,
      ease,
      onDone,
      dead: false,
    };
    this.items.push(item);
    return () => {
      item.dead = true;
    };
  }

  /** 立即终止某对象上的所有补间（跳到当前值，不触发 onDone） */
  kill(obj: object) {
    for (const it of this.items) {
      if (it.obj === obj) it.dead = true;
    }
  }

  clear() {
    this.items = [];
  }

  get active() {
    return this.items.length > 0;
  }
}
