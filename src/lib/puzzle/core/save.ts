/**
 * Save —— v6 存档格式（对齐 jigex 归一化坐标 JSON）
 * { v:6, seed, nop, rot, elapsed, moves, pieces:[{i,x,y,a,m,g}] }
 */
import { Group } from './group';
import { Utils } from './utils';
import type { PuzzleCore } from './puzzle-core';
import type { SaveGameV6, SavePieceV6 } from './types';

export function serialize(
  core: PuzzleCore,
  elapsed: number
): SaveGameV6 {
  const pieces: SavePieceV6[] = core.pieces.map((p) => ({
    i: p.id,
    x: (p.x / core.W).toFixed(5),
    y: (p.y / core.H).toFixed(5),
    a: p.angle,
    m: p.hasMoved ? 1 : 0,
    g: p.group && p.group.pieces.length > 1 ? p.group.id : 0,
  }));
  return {
    v: 6,
    seed: core.seed,
    nop: core.choice?.nop ?? core.pieces.length,
    rot: core.rotationEnabled,
    elapsed: Math.round(elapsed),
    moves: core.moves,
    pieces,
  };
}

/**
 * 恢复存档到已 init 的 core（要求 seed/nop 匹配，切图确定性一致）。
 * 返回是否成功。
 */
export function restore(core: PuzzleCore, save: SaveGameV6): boolean {
  if (save.v !== 6) return false;
  if (save.seed !== core.seed) return false;
  if (save.pieces.length !== core.pieces.length) return false;

  const byId = new Map(core.pieces.map((p) => [p.id, p]));
  const groupMap = new Map<number, Group>();

  for (const sp of save.pieces) {
    const p = byId.get(sp.i);
    if (!p) return false;
    p.x = parseFloat(sp.x) * core.W;
    p.y = parseFloat(sp.y) * core.H;
    p.angle = sp.a;
    p.hasMoved = sp.m === 1;
    p.z = ++core.zCounter;
    if (sp.g > 0) {
      let g = groupMap.get(sp.g);
      if (!g) {
        g = new Group([p]);
        groupMap.set(sp.g, g);
      } else {
        g.pieces.push(p);
        p.group = g;
      }
    } else {
      p.group = new Group([p]);
    }
  }
  // 归一化坐标在不同窗口尺寸下按比例还原，会破坏组内块的精确相对位置——
  // 以组内第一块为基准，用 refX/refY 几何重建其余块的位置。
  for (const g of new Set(groupMap.values())) {
    const anchor = g.pieces[0];
    for (let i = 1; i < g.pieces.length; i++) {
      const p = g.pieces[i];
      const rel = Utils.rotate(
        p.refX - anchor.refX,
        p.refY - anchor.refY,
        anchor.angle
      );
      p.x = anchor.x + rel.x;
      p.y = anchor.y + rel.y;
      p.angle = anchor.angle;
    }
    core.keepInBounds(g);
  }

  core.moves = save.moves;
  core.rotationEnabled = save.rot;
  // 完成状态由最大组推导
  core.complete = core.pieces.length > 0 &&
    core.pieces[0].group !== null &&
    core.pieces.every((p) => p.group === core.pieces[0].group);
  return true;
}
