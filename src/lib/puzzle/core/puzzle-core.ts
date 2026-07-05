/**
 * PuzzleCore —— 拼图主控（框架无关，无渲染依赖）
 * 移植自 jigsaw-engine.ts 的 Puzzle 类，减去 render/paintPiece/hitPiece；
 * 命中测试通过可插拔 alphaAt 钩子由渲染层提供。
 * 新增：FSM 状态、rotateGroup、事件发射、jigex 式散布集成。
 */
import { BOUNDS_PAD, DRAG_THRESHOLD, SNAP_FACTOR, SNAP_MIN } from './constants';
import { Utils } from './utils';
import { Group, groupBounds, pieceBounds } from './group';
import { buildPieces } from './knife';
import { ensureScatterCapacity, scatter } from './scatter';
import type { SubjectData } from './subject';
import type { Piece, PieceChoice, PuzzleEvents, SnapEvent } from './types';
import { PieceState } from './types';

/** 渲染层提供：世界坐标点在某块位图内的 alpha 是否超过命中阈值 */
export type AlphaAtFn = (piece: Piece, worldX: number, worldY: number) => boolean;

export class PuzzleCore {
  /** 世界尺寸（可能大于屏幕，配合视口缩放） */
  W = 0;
  H = 0;
  pieces: Piece[] = [];
  choice: PieceChoice | null = null;
  subject: SubjectData | null = null;
  seed = 0;
  zCounter = 0;
  moves = 0;
  complete = false;
  rotationEnabled = false;
  snapDistance = SNAP_MIN;
  events: PuzzleEvents = {};
  alphaAt: AlphaAtFn | null = null;

  drag: {
    piece: Piece;
    group: Group;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null = null;

  /** 参考图（成品区）在世界中的矩形（居中） */
  get previewRect() {
    const sw = this.subject?.width ?? 0;
    const sh = this.subject?.height ?? 0;
    return {
      x: this.W / 2 - sw / 2,
      y: this.H / 2 - sh / 2,
      w: sw,
      h: sh,
    };
  }

  /** 初始化：切图 + 计算世界尺寸 + 散开 */
  init(
    subject: SubjectData,
    choice: PieceChoice,
    seed: number,
    boardW: number,
    boardH: number,
    rotationEnabled = false
  ) {
    this.subject = subject;
    this.choice = choice;
    this.seed = seed;
    this.rotationEnabled = rotationEnabled;
    this.pieces = buildPieces(subject, choice, seed);
    this.snapDistance = Math.max(SNAP_MIN, Math.round(choice.size * SNAP_FACTOR));
    const world = ensureScatterCapacity(
      boardW,
      boardH,
      subject.width,
      subject.height,
      this.pieces
    );
    this.W = world.W;
    this.H = world.H;
    this.complete = false;
    this.moves = 0;
    this.zCounter = 0;
    this.scatter(false);
  }

  /**
   * 散布。partial = true 时只散布未动的单块（不打乱玩家进度）。
   * 旋转模式下给被散布的块赋随机量化角度。
   */
  scatter(partial: boolean) {
    let toScatter: Piece[];
    let fixed: Piece[];
    if (partial) {
      toScatter = this.pieces.filter(
        (p) => !p.hasMoved && (!p.group || p.group.pieces.length === 1)
      );
      fixed = this.pieces.filter((p) => toScatter.indexOf(p) === -1);
    } else {
      toScatter = this.pieces;
      fixed = [];
      for (const p of this.pieces) p.group = null;
    }
    for (const p of toScatter) {
      if (!p.group || p.group.pieces.length !== 1) p.group = new Group([p]);
      p.angle = this.rotationEnabled ? 90 * Math.floor(Math.random() * 4) : 0;
      p.hasMoved = false;
      p.state = PieceState.FREE;
      p.z = ++this.zCounter;
    }
    scatter({
      pieces: toScatter,
      fixed,
      W: this.W,
      H: this.H,
      subjectW: this.subject!.width,
      subjectH: this.subject!.height,
    });
  }

  /* ---------------- 拾取与拖拽 ---------------- */

  pick(worldX: number, worldY: number): Piece | null {
    if (!this.alphaAt) return null;
    const sorted = this.pieces.slice().sort((a, b) => b.z - a.z);
    for (const p of sorted) {
      const b = pieceBounds(p);
      if (
        worldX < b.x ||
        worldX > b.x + b.w ||
        worldY < b.y ||
        worldY > b.y + b.h
      )
        continue;
      if (this.alphaAt(p, worldX, worldY)) return p;
    }
    return null;
  }

  pointerDown(worldX: number, worldY: number): Piece | null {
    if (this.complete) return null;
    const piece = this.pick(worldX, worldY);
    if (!piece) return null;
    this.raiseGroup(piece.group!);
    piece.state = PieceState.HOLDING;
    this.drag = {
      piece,
      group: piece.group!,
      offsetX: worldX - piece.x,
      offsetY: worldY - piece.y,
      startX: worldX,
      startY: worldY,
      moved: false,
    };
    return piece;
  }

  pointerMove(worldX: number, worldY: number): boolean {
    if (!this.drag) return false;
    const d = this.drag;
    const tx = worldX - d.offsetX,
      ty = worldY - d.offsetY;
    const dx = tx - d.piece.x,
      dy = ty - d.piece.y;
    if (dx || dy) this.translateGroup(d.group, dx, dy);
    if (
      !d.moved &&
      Utils.hypot(worldX - d.startX, worldY - d.startY) > DRAG_THRESHOLD
    ) {
      d.moved = true;
      d.piece.state = PieceState.DRAGGING;
    }
    return true;
  }

  /** 抬起：返回本次是否发生了有效移动（供步数/音效判断） */
  pointerUp(): boolean {
    if (!this.drag) return false;
    const d = this.drag;
    this.drag = null;
    d.piece.state = PieceState.FREE;
    if (d.moved) {
      this.moves++;
      for (const p of d.group.pieces) p.hasMoved = true;
      this.snapGroup(d.group);
      this.events.onMove?.();
      this.events.onProgress?.(this.percent());
      return true;
    }
    return false;
  }

  /* ---------------- 分组操作 ---------------- */

  raiseGroup(group: Group) {
    let z = ++this.zCounter * 10;
    for (const p of group.pieces) p.z = z++;
  }

  translateGroup(group: Group, dx: number, dy: number, clamp = true) {
    for (const p of group.pieces) {
      p.x += dx;
      p.y += dy;
    }
    if (clamp) this.keepInBounds(group);
  }

  keepInBounds(group: Group) {
    const b = groupBounds(group.pieces);
    let dx = 0,
      dy = 0;
    if (b.x < BOUNDS_PAD) dx = BOUNDS_PAD - b.x;
    if (b.x + b.w > this.W - BOUNDS_PAD) dx = this.W - BOUNDS_PAD - (b.x + b.w);
    if (b.y < BOUNDS_PAD) dy = BOUNDS_PAD - b.y;
    if (b.y + b.h > this.H - BOUNDS_PAD) dy = this.H - BOUNDS_PAD - (b.y + b.h);
    if (dx || dy)
      for (const p of group.pieces) {
        p.x += dx;
        p.y += dy;
      }
  }

  /**
   * 组绕 pivot 块旋转 ±90°（量化）。模型即时更新，渲染层负责补间。
   */
  rotateGroup(group: Group, pivot: Piece, dir: 1 | -1) {
    if (!this.rotationEnabled || this.complete) return;
    const deg = dir * 90;
    for (const p of group.pieces) {
      const rel = Utils.rotate(p.x - pivot.x, p.y - pivot.y, deg);
      p.x = pivot.x + rel.x;
      p.y = pivot.y + rel.y;
      p.angle = (((p.angle + deg) % 360) + 360) % 360;
      p.hasMoved = true;
    }
    this.keepInBounds(group);
    // 拖拽中旋转后指针偏移需重算（pivot 位置不变，其余块位置变了）
    this.events.onMove?.();
  }

  /* ---------------- 吸附与合并 ---------------- */

  findSnap(group: Group) {
    let best: {
      piece: Piece;
      other: Piece;
      dx: number;
      dy: number;
      err: number;
    } | null = null;
    for (const piece of group.pieces) {
      for (const other of piece.neighbors) {
        if (!other || other.group === group) continue;
        if (piece.angle !== other.angle) continue;
        const expected = Utils.rotate(
          piece.refX - other.refX,
          piece.refY - other.refY,
          piece.angle
        );
        const dx = expected.x - (piece.x - other.x);
        const dy = expected.y - (piece.y - other.y);
        const err = Utils.hypot(dx, dy);
        if (err <= this.snapDistance && (!best || err < best.err)) {
          best = { piece, other, dx, dy, err };
        }
      }
    }
    return best;
  }

  snapGroup(group: Group): Group {
    let active = group;
    let joins = 0;
    let firstSnap: SnapEvent | null = null;
    while (true) {
      const snap = this.findSnap(active);
      if (!snap) break;
      this.translateGroup(active, snap.dx, snap.dy, false);
      if (!firstSnap) {
        firstSnap = {
          piece: snap.piece,
          other: snap.other,
          jointX: (snap.piece.x + snap.other.x) / 2,
          jointY: (snap.piece.y + snap.other.y) / 2,
          horizontal: snap.piece.row === snap.other.row, // 左右相邻 = 竖直接缝
        };
      }
      const og = snap.other.group!;
      if (active.pieces.length >= og.pieces.length) active.absorb(og);
      else {
        og.absorb(active);
        active = og;
      }
      this.raiseGroup(active);
      for (const p of active.pieces) p.hasMoved = true;
      joins++;
    }
    if (joins) {
      if (firstSnap) this.events.onSnap?.(firstSnap);
      this.events.onProgress?.(this.percent());
    }
    if (!this.complete && active.pieces.length === this.pieces.length) {
      this.complete = true;
      this.events.onComplete?.();
    }
    return active;
  }

  percent() {
    if (this.complete) return 100;
    let max = 0;
    const groups = new Map<Group, number>();
    for (const p of this.pieces) {
      const g = p.group;
      if (!g) continue;
      const n = (groups.get(g) || 0) + 1;
      groups.set(g, n);
      if (n > max) max = n;
    }
    return this.pieces.length > 1
      ? Math.round(((max - 1) / (this.pieces.length - 1)) * 99)
      : 0;
  }

  uniqueGroups(): Group[] {
    const set = new Set<Group>();
    for (const p of this.pieces) if (p.group) set.add(p.group);
    return [...set];
  }
}
