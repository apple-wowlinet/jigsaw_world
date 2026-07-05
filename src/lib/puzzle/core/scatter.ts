/**
 * Scatter —— jigex-prog.js 布局方案（L1946–1980 反混淆移植，格点化实现）
 *
 * jigex 布局的四要素，全部保留：
 *   1. 回字形螺旋序：格心序列沿外圈 → 内圈螺旋展开（jigex 四方向行走的轨迹）；
 *   2. 中心保护（硬约束）：与参考图保护区（外扩 avg/4，对应 jigex boxTop
 *      quarter-size 检测）相交的格子直接不存在，碎块结构上到不了参考图；
 *   3. 邻居退避：候选位置若与已放置的拼图相邻块过近（< 成品偏移 × 1.5）
 *      则跳过——散布结果不会出现「看起来已经拼好」的邻居对
 *      （jigex 由散布序列 + 行走碰撞共同保证，此处显式化）;
 *   4. 抖动：放置后 ±avg×0.0625（jigex 同款），违反任一约束则放弃抖动。
 *
 * 与 jigex 行走器的实现差异（工程加固）：
 *   - jigex 假设档位永远放得下（放不下会死循环/报 "Laid wrong number"），
 *     我们用 ensureScatterCapacity 预扩世界保证容量（配合视口缩放）；
 *   - 格距取「最大块碰撞盒 + 2px」而非平均值：任意两块放在相邻格心
 *     物理上不可能重叠——零重叠是结构保证，不是概率结果；
 *   - 兜底扫描游标连续推进（不回头），极端情况下块间可轻叠但绝不压参考图。
 */
import { MARGIN } from './constants';
import { Utils } from './utils';
import { pieceBounds } from './group';
import type { Piece } from './types';

/** 拼块在当前角度下：外接框尺寸 + 外接框中心相对锚点的偏移 */
function boundsInfo(p: Piece) {
  const b = pieceBounds(p);
  return {
    w: b.w,
    h: b.h,
    offX: b.x + b.w / 2 - p.x,
    offY: b.y + b.h / 2 - p.y,
  };
}

/** 不透明碰撞半尺寸：外接框半边收缩 MARGIN，再留 1px 间隙 */
const shrink = (v: number) => Math.max(4, v - MARGIN + 1);

/**
 * 网格参数。格距 = 最大块碰撞盒 + 2px：相邻格心距离 ≥ 任意两块
 * 碰撞半宽之和，同格不复用 ⇒ 零重叠结构保证。
 * avg 仅用于保护区外扩与抖动幅度（对齐 jigex 语义）。
 */
function gridOf(W: number, H: number, pieces: Piece[]) {
  let maxCW = 0,
    maxCH = 0,
    sumW = 0,
    sumH = 0;
  for (const p of pieces) {
    const b = pieceBounds(p);
    maxCW = Math.max(maxCW, shrink(b.w / 2) * 2);
    maxCH = Math.max(maxCH, shrink(b.h / 2) * 2);
    sumW += b.w;
    sumH += b.h;
  }
  const avgW = sumW / pieces.length;
  const avgH = sumH / pieces.length;
  const needW = maxCW + 2;
  const needH = maxCH + 2;
  const cols = Math.max(1, Math.floor(W / needW));
  const rows = Math.max(1, Math.floor(H / needH));
  return { avgW, avgH, cols, rows, stepW: W / cols, stepH: H / rows };
}

/** 中心保护区：参考图矩形外扩 avg/4 */
function guardOf(
  W: number,
  H: number,
  subjectW: number,
  subjectH: number,
  avgW: number,
  avgH: number
) {
  return {
    left: W / 2 - subjectW / 2 - avgW / 4,
    right: W / 2 + subjectW / 2 + avgW / 4,
    top: H / 2 - subjectH / 2 - avgH / 4,
    bottom: H / 2 + subjectH / 2 + avgH / 4,
  };
}

type Guard = ReturnType<typeof guardOf>;

/** 生成螺旋格心序列（外圈 → 内圈），跳过与保护区相交的格子 */
function spiralCells(
  W: number,
  H: number,
  g: ReturnType<typeof gridOf>,
  guard: Guard
) {
  const { cols, rows, stepW, stepH } = g;
  const cells: { x: number; y: number; used: boolean }[] = [];
  const cellFree = (x: number, y: number) =>
    !(
      x + stepW / 2 > guard.left &&
      x - stepW / 2 < guard.right &&
      y + stepH / 2 > guard.top &&
      y - stepH / 2 < guard.bottom
    );
  let top = 0,
    bottom = rows - 1,
    left = 0,
    right = cols - 1;
  const push = (c: number, r: number) => {
    const x = (c + 0.5) * stepW;
    const y = (r + 0.5) * stepH;
    if (cellFree(x, y)) cells.push({ x, y, used: false });
  };
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) push(c, top);
    top++;
    if (top <= bottom) {
      for (let r = top; r <= bottom; r++) push(right, r);
      right--;
    }
    if (top <= bottom) {
      for (let c = right; c >= left; c--) push(c, bottom);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) push(left, r);
      left++;
    }
  }
  return cells;
}

/**
 * 世界容量预检：可用格数（不与保护区相交）≥ 块数 × 1.3，
 * 不足则按比例放大世界（配合视口缩放，世界可以大于屏幕）。
 */
export function ensureScatterCapacity(
  boardW: number,
  boardH: number,
  subjectW: number,
  subjectH: number,
  pieces: Piece[]
): { W: number; H: number } {
  let W = boardW,
    H = boardH;
  for (let i = 0; i < 64; i++) {
    const g = gridOf(W, H, pieces);
    const guard = guardOf(W, H, subjectW, subjectH, g.avgW, g.avgH);
    const cells = spiralCells(W, H, g, guard);
    if (cells.length >= pieces.length * 1.3) break;
    W *= 1.08;
    H *= 1.08;
  }
  return { W: Math.round(W), H: Math.round(H) };
}

/**
 * 均匀盒版本的容量预估（无需真实 Piece 数组）——
 * 供 subject 尺寸优化器在切图前快速评估世界扩容程度。
 * 与 ensureScatterCapacity 同构：格距 = 盒尺寸 + 2px，保护区外扩盒/4。
 */
export function capacityForBoxes(
  boardW: number,
  boardH: number,
  subjectW: number,
  subjectH: number,
  boxW: number,
  boxH: number,
  count: number
): { W: number; H: number } {
  const needW = Math.max(8, boxW - MARGIN * 2) + 2;
  const needH = Math.max(8, boxH - MARGIN * 2) + 2;
  let W = boardW,
    H = boardH;
  for (let i = 0; i < 64; i++) {
    const cols = Math.max(1, Math.floor(W / needW));
    const rows = Math.max(1, Math.floor(H / needH));
    const stepW = W / cols;
    const stepH = H / rows;
    const guard = {
      left: W / 2 - subjectW / 2 - boxW / 4,
      right: W / 2 + subjectW / 2 + boxW / 4,
      top: H / 2 - subjectH / 2 - boxH / 4,
      bottom: H / 2 + subjectH / 2 + boxH / 4,
    };
    let usable = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c + 0.5) * stepW;
        const y = (r + 0.5) * stepH;
        const hits =
          x + stepW / 2 > guard.left &&
          x - stepW / 2 < guard.right &&
          y + stepH / 2 > guard.top &&
          y - stepH / 2 < guard.bottom;
        if (!hits) usable++;
      }
    }
    if (usable >= count * 1.3) break;
    W *= 1.08;
    H *= 1.08;
  }
  return { W: Math.round(W), H: Math.round(H) };
}

export interface ScatterParams {
  pieces: Piece[]; // 待散布的块（partial 模式只传未动块）
  fixed: Piece[]; // 已就位、需避让的块
  W: number;
  H: number;
  subjectW: number;
  subjectH: number;
  rand?: () => number;
}

export function scatter(params: ScatterParams): void {
  const { pieces, fixed, W, H, subjectW, subjectH } = params;
  const rand = params.rand ?? Math.random;
  if (!pieces.length) return;

  const g = gridOf(W, H, pieces);
  const { avgW, avgH, stepW, stepH } = g;
  const guard = guardOf(W, H, subjectW, subjectH, avgW, avgH);
  const cells = spiralCells(W, H, g, guard);

  const intersectsGuard = (bcx: number, bcy: number, hw: number, hh: number) =>
    bcx + hw > guard.left &&
    bcx - hw < guard.right &&
    bcy + hh > guard.top &&
    bcy - hh < guard.bottom;

  /* ---- 已放置碰撞盒（bounds 中心空间）+ 锚点位置表 ---- */
  const placed: { x: number; y: number; hw: number; hh: number }[] = [];
  const placedPos = new Map<number, { x: number; y: number }>();
  for (const f of fixed) {
    const bi = boundsInfo(f);
    placed.push({
      x: f.x + bi.offX,
      y: f.y + bi.offY,
      hw: shrink(bi.w / 2),
      hh: shrink(bi.h / 2),
    });
    placedPos.set(f.id, { x: f.x, y: f.y });
  }
  const collides = (bcx: number, bcy: number, hw: number, hh: number) => {
    for (let i = placed.length - 1; i >= 0; i--) {
      const o = placed[i];
      if (Math.abs(bcx - o.x) < hw + o.hw && Math.abs(bcy - o.y) < hh + o.hh)
        return true;
    }
    return false;
  };

  /** 邻居退避：任一已放置的拼图邻居与锚点距离 < 成品偏移 × 1.5 视为阻挡 */
  const nearNeighbor = (p: Piece, ax: number, ay: number) => {
    for (const n of p.neighbors) {
      const pos = placedPos.get(n.id);
      if (!pos) continue;
      const joinDist = Utils.hypot(p.refX - n.refX, p.refY - n.refY) * 1.5;
      if (Utils.hypot(ax - pos.x, ay - pos.y) < joinDist) return true;
    }
    return false;
  };

  /* ---- 顺序：seeded shuffle，每次散布布局不同 ---- */
  const order = pieces.slice();
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const commit = (
    p: Piece,
    bcx: number,
    bcy: number,
    bi: ReturnType<typeof boundsInfo>
  ) => {
    p.x = bcx - bi.offX;
    p.y = bcy - bi.offY;
    placed.push({ x: bcx, y: bcy, hw: shrink(bi.w / 2), hh: shrink(bi.h / 2) });
    placedPos.set(p.id, { x: p.x, y: p.y });
  };

  /* ---- 主放置：螺旋格首个可用格（两遍：带邻居退避 → 放宽） ---- */
  let fallbackCursor = { x: 0, y: 0 }; // 兜底扫描连续游标（不回头，避免堆叠）
  for (const p of order) {
    const bi = boundsInfo(p);
    const hw = bi.w / 2,
      hh = bi.h / 2;
    const shw = shrink(hw),
      shh = shrink(hh);

    let done = false;
    for (const avoidNeighbor of [true, false]) {
      for (const cell of cells) {
        if (cell.used) continue;
        // 世界边缘：块比格宽时 clamp 进界，clamp 后仍需全部约束通过
        const bx = Utils.clamp(cell.x, hw, W - hw);
        const by = Utils.clamp(cell.y, hh, H - hh);
        if (intersectsGuard(bx, by, hw, hh)) continue;
        if (collides(bx, by, shw, shh)) continue;
        if (avoidNeighbor && nearNeighbor(p, bx - bi.offX, by - bi.offY))
          continue;
        cell.used = true;
        // 抖动（jigex ±avg×0.0625），违反任一约束则放弃抖动
        const jx = (rand() >= 0.5 ? 1 : -1) * rand() * avgW * 0.0625;
        const jy = (rand() >= 0.5 ? 1 : -1) * rand() * avgH * 0.0625;
        const ax = Utils.clamp(bx + jx, hw, W - hw);
        const ay = Utils.clamp(by + jy, hh, H - hh);
        if (
          !intersectsGuard(ax, ay, hw, hh) &&
          !collides(ax, ay, shw, shh) &&
          !(avoidNeighbor && nearNeighbor(p, ax - bi.offX, ay - bi.offY))
        ) {
          commit(p, ax, ay, bi);
        } else {
          commit(p, bx, by, bi);
        }
        done = true;
        break;
      }
      if (done) break;
    }
    if (done) continue;

    /* ---- 兜底：细扫描，游标连续推进；先无碰撞，再仅避保护区 ---- */
    const fineStep = Math.max(4, Math.min(stepW, stepH) / 2);
    let spot: { x: number; y: number } | null = null;
    for (const allowOverlap of [false, true]) {
      let { x, y } = fallbackCursor;
      let wrapped = false;
      while (!spot) {
        x += fineStep;
        if (x > W - hw) {
          x = hw;
          y += fineStep;
          if (y > H - hh) {
            y = hh;
            if (wrapped) break; // 全图扫完一轮
            wrapped = true;
          }
        }
        if (intersectsGuard(x, y, hw, hh)) continue;
        if (!allowOverlap && collides(x, y, shrink(hw), shrink(hh))) continue;
        spot = { x, y };
      }
      if (spot) break;
    }
    if (spot) {
      fallbackCursor = { x: spot.x, y: spot.y };
      commit(p, spot.x, spot.y, bi);
    } else {
      commit(p, Utils.clamp(hw, hw, W - hw), Utils.clamp(hh, hh, H - hh), bi);
    }
  }
}
