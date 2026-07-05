/* 多种子扫描:实体重叠 + 邻居贴合 + 保护区,3 画布 × 4 档 × 30 种子 */
import { buildPieces } from '../src/lib/puzzle/core/knife';
import { scatter, ensureScatterCapacity } from '../src/lib/puzzle/core/scatter';
import { pieceBounds, Group } from '../src/lib/puzzle/core/group';
import { MARGIN } from '../src/lib/puzzle/core/constants';
import { Utils } from '../src/lib/puzzle/core/utils';
import type { PieceChoice } from '../src/lib/puzzle/core/types';
import type { SubjectData } from '../src/lib/puzzle/core/subject';

const boards = [
  { W: 1990, H: 780 },
  { W: 1200, H: 800 },
  { W: 900, H: 1400 },
];
let overlapBad = 0, cozyBad = 0, guardBad = 0, runs = 0;
for (const b of boards) {
  for (const nop of [12, 32, 88, 300]) {
    for (let seed = 1; seed <= 30; seed++) {
      const subArea = b.W * b.H * 0.35;
      const subW = Math.round(Math.sqrt(subArea * 1.78));
      const subH = Math.round(subArea / subW);
      const aspect = subW / subH;
      const rows = Math.max(2, Math.round(Math.sqrt(nop / aspect)));
      const cols = Math.max(2, Math.round(nop / rows));
      const size = Math.floor(Math.min(subW / cols, subH / rows));
      if (size < 8) continue;
      const choice: PieceChoice = { nop: rows * cols, rows, cols, size };
      const sub = { canvas: null as unknown as HTMLCanvasElement, width: subW, height: subH } as SubjectData;
      const pieces = buildPieces(sub, choice, seed * 7919);
      for (const p of pieces) p.group = new Group([p]);
      const world = ensureScatterCapacity(b.W, b.H, subW, subH, pieces);
      scatter({ pieces, fixed: [], W: world.W, H: world.H, subjectW: subW, subjectH: subH, rand: Utils.rng(seed * 31) });
      runs++;
      const prev = {
        left: world.W / 2 - subW / 2, right: world.W / 2 + subW / 2,
        top: world.H / 2 - subH / 2, bottom: world.H / 2 + subH / 2,
      };
      for (let i = 0; i < pieces.length; i++) {
        const a = pieceBounds(pieces[i]);
        if (a.x + a.w > prev.left && a.x < prev.right && a.y + a.h > prev.top && a.y < prev.bottom) guardBad++;
        for (let j = i + 1; j < pieces.length; j++) {
          const c = pieceBounds(pieces[j]);
          const ox = Math.min(a.x + a.w - MARGIN, c.x + c.w - MARGIN) - Math.max(a.x + MARGIN, c.x + MARGIN);
          const oy = Math.min(a.y + a.h - MARGIN, c.y + c.h - MARGIN) - Math.max(a.y + MARGIN, c.y + MARGIN);
          if (ox > 0.5 && oy > 0.5) overlapBad++;
        }
        for (const n of pieces[i].neighbors) {
          if (n.id < pieces[i].id) continue;
          const joinDist = Math.hypot(pieces[i].refX - n.refX, pieces[i].refY - n.refY);
          if (Math.hypot(pieces[i].x - n.x, pieces[i].y - n.y) < joinDist * 1.2) cozyBad++;
        }
      }
    }
  }
}
console.log(`runs=${runs} overlapPairs=${overlapBad} cozyNeighbors=${cozyBad} onGuard=${guardBad}`);
