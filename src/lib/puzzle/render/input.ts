/**
 * InputController —— 统一指针输入
 * - pointerdown：z 降序 alpha 命中 → 拖块；空白 → 平移视口
 * - 双指捏合缩放；滚轮缩放锚定光标
 * - 3px 拖动阈值（core 内判定）
 * - 旋转：R / Shift+R / 右键 / 触屏双击
 */
import { sfx } from '@/lib/puzzle/audio/sfx';
import type { Piece } from '@/lib/puzzle/core/types';
import type { PuzzleGame } from './pixi-renderer';

interface PointerInfo {
  id: number;
  sx: number;
  sy: number;
}

const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DIST = 24;

export class InputController {
  private canvas: HTMLCanvasElement;
  private game: PuzzleGame;
  private pointers = new Map<number, PointerInfo>();
  private mode: 'idle' | 'drag' | 'pan' | 'pinch' = 'idle';
  private dragBefore: Map<Piece, { x: number; y: number }> | null = null;
  private pinchDist = 0;
  private lastTap = { time: 0, x: 0, y: 0 };
  private hoverPiece: Piece | null = null;

  private onPointerDown = (e: PointerEvent) => this.pointerDown(e);
  private onPointerMove = (e: PointerEvent) => this.pointerMove(e);
  private onPointerUp = (e: PointerEvent) => this.pointerUp(e);
  private onWheel = (e: WheelEvent) => this.wheel(e);
  private onKeyDown = (e: KeyboardEvent) => this.keyDown(e);
  private onContextMenu = (e: Event) => e.preventDefault();

  constructor(canvas: HTMLCanvasElement, game: PuzzleGame) {
    this.canvas = canvas;
    this.game = game;
  }

  attach() {
    const c = this.canvas;
    c.addEventListener('pointerdown', this.onPointerDown);
    c.addEventListener('pointermove', this.onPointerMove);
    c.addEventListener('pointerup', this.onPointerUp);
    c.addEventListener('pointercancel', this.onPointerUp);
    c.addEventListener('wheel', this.onWheel, { passive: false });
    c.addEventListener('contextmenu', this.onContextMenu);
    window.addEventListener('keydown', this.onKeyDown);
  }

  destroy() {
    const c = this.canvas;
    c.removeEventListener('pointerdown', this.onPointerDown);
    c.removeEventListener('pointermove', this.onPointerMove);
    c.removeEventListener('pointerup', this.onPointerUp);
    c.removeEventListener('pointercancel', this.onPointerUp);
    c.removeEventListener('wheel', this.onWheel);
    c.removeEventListener('contextmenu', this.onContextMenu);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private screenPoint(e: PointerEvent | WheelEvent | MouseEvent) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  /* ---------------- pointer ---------------- */

  private pointerDown(e: PointerEvent) {
    if (this.game.paused) return;
    sfx.ensureContext(); // 首次手势创建 AudioContext
    const sp = this.screenPoint(e);
    this.canvas.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { id: e.pointerId, sx: sp.x, sy: sp.y });

    // 第二根手指 → 捏合缩放（放弃当前拖块/平移）
    if (this.pointers.size === 2) {
      this.cancelDrag();
      this.mode = 'pinch';
      this.pinchDist = this.pointerDistance();
      return;
    }
    if (this.pointers.size > 2) return;

    // 右键 → 旋转命中块
    if (e.button === 2) {
      const w = this.game.viewport.toWorld(sp.x, sp.y);
      const piece = this.game.core.pick(w.x, w.y);
      if (piece) this.game.rotateGroupAnimated(piece, 1);
      this.pointers.delete(e.pointerId);
      return;
    }
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const w = this.game.viewport.toWorld(sp.x, sp.y);
    const piece = this.game.core.pointerDown(w.x, w.y);
    if (piece) {
      this.mode = 'drag';
      this.hoverPiece = piece;
      this.dragBefore = null;
      sfx.pick();
      // 触屏双击旋转
      if (e.pointerType === 'touch') {
        const now = performance.now();
        if (
          now - this.lastTap.time < DOUBLE_TAP_MS &&
          Math.hypot(sp.x - this.lastTap.x, sp.y - this.lastTap.y) < DOUBLE_TAP_DIST
        ) {
          this.game.rotateGroupAnimated(piece, 1);
        }
        this.lastTap = { time: now, x: sp.x, y: sp.y };
      }
    } else {
      this.mode = 'pan';
    }
  }

  private pointerMove(e: PointerEvent) {
    const info = this.pointers.get(e.pointerId);
    if (!info) {
      // 无按下状态时记录 hover（供 R 键旋转）
      if (this.mode === 'idle') {
        const sp = this.screenPoint(e);
        const w = this.game.viewport.toWorld(sp.x, sp.y);
        this.hoverPiece = this.game.core.pick(w.x, w.y);
      }
      return;
    }
    const sp = this.screenPoint(e);

    if (this.mode === 'pinch' && this.pointers.size >= 2) {
      info.sx = sp.x;
      info.sy = sp.y;
      const d = this.pointerDistance();
      if (this.pinchDist > 0 && d > 0) {
        const center = this.pointerCenter();
        this.game.viewport.zoomAt(center.x, center.y, d / this.pinchDist);
      }
      this.pinchDist = d;
      return;
    }

    if (this.mode === 'drag') {
      const w = this.game.viewport.toWorld(sp.x, sp.y);
      this.game.core.pointerMove(w.x, w.y);
    } else if (this.mode === 'pan') {
      this.game.viewport.panBy(sp.x - info.sx, sp.y - info.sy);
    }
    info.sx = sp.x;
    info.sy = sp.y;
  }

  private pointerUp(e: PointerEvent) {
    this.pointers.delete(e.pointerId);
    if (this.mode === 'pinch') {
      if (this.pointers.size < 2) {
        this.mode = this.pointers.size === 1 ? 'pan' : 'idle';
        this.pinchDist = 0;
      }
      return;
    }
    if (this.mode === 'drag') {
      // 记录 up 前位置以做吸附回弹动画
      const group = this.game.core.drag?.group;
      const before = group
        ? new Map(group.pieces.map((p) => [p, { x: p.x, y: p.y }]))
        : null;
      this.game.core.pointerUp();
      if (before) this.game.animateModelJump(before);
    }
    if (this.pointers.size === 0) this.mode = 'idle';
  }

  private cancelDrag() {
    if (this.game.core.drag) {
      // 视为原地放下（不算 move）
      this.game.core.drag.moved = false;
      this.game.core.pointerUp();
    }
  }

  /* ---------------- wheel / keyboard ---------------- */

  private wheel(e: WheelEvent) {
    if (this.game.paused) return;
    e.preventDefault();
    const sp = this.screenPoint(e);
    const factor = Math.pow(1.1, -e.deltaY / 100);
    this.game.viewport.zoomAt(sp.x, sp.y, factor);
  }

  private keyDown(e: KeyboardEvent) {
    if (this.game.paused) return;
    if (e.key !== 'r' && e.key !== 'R') return;
    // 优先旋转正在拖的组，否则悬停块
    const target = this.game.core.drag?.piece ?? this.hoverPiece;
    if (!target) return;
    e.preventDefault();
    this.game.rotateGroupAnimated(target, e.shiftKey ? -1 : 1);
    // 拖拽中旋转后，重算指针偏移，避免块瞬移
    const d = this.game.core.drag;
    if (d && d.piece === target) {
      // pivot 位置不变，无需处理 offset（offset 相对 pivot 块）
    }
  }

  /* ---------------- helpers ---------------- */

  private pointerDistance() {
    const pts = [...this.pointers.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].sx - pts[1].sx, pts[0].sy - pts[1].sy);
  }

  private pointerCenter() {
    const pts = [...this.pointers.values()];
    return {
      x: (pts[0].sx + pts[1].sx) / 2,
      y: (pts[0].sy + pts[1].sy) / 2,
    };
  }
}
