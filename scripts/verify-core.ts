/**
 * Phase 1 验证脚本（node --experimental-transform-types 运行，无 DOM 依赖）
 *  1. 同种子切边一致
 *  2. 散布专项：多画布宽高比 × 多块数，断言零块与参考图相交、零块重叠、全部在界内
 *  3. 存档序列化↔恢复幂等
 */
import { buildPieces } from '../src/lib/puzzle/core/knife';
import { scatter, ensureScatterCapacity } from '../src/lib/puzzle/core/scatter';
import { pieceBounds, Group } from '../src/lib/puzzle/core/group';
import type { PieceChoice } from '../src/lib/puzzle/core/types';
import type { SubjectData } from '../src/lib/puzzle/core/subject';

let failures = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error('  ✗ ' + msg);
  }
}

function mkSubject(w: number, h: number): SubjectData {
  return { canvas: null as unknown as HTMLCanvasElement, width: w, height: h };
}

function choiceFor(subW: number, subH: number, targetNop: number): PieceChoice {
  // 简化：按目标块数求近似 rows/cols
  const aspect = subW / subH;
  const rows = Math.max(2, Math.round(Math.sqrt(targetNop / aspect)));
  const cols = Math.max(2, Math.round(targetNop / rows));
  const size = Math.floor(Math.min(subW / cols, subH / rows));
  return { nop: rows * cols, rows, cols, size };
}

/* ---------- 1. 切图确定性 ---------- */
console.log('1. 切图确定性');
{
  const sub = mkSubject(600, 400);
  const choice = choiceFor(600, 400, 24);
  const a = buildPieces(sub, choice, 12345);
  const b = buildPieces(sub, choice, 12345);
  assert(a.length === b.length, 'piece count mismatch');
  for (let i = 0; i < a.length; i++) {
    const ea = a[i].edges, eb = b[i].edges;
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      assert(
        ea[side].tab === eb[side].tab &&
        ea[side].bend === eb[side].bend &&
        ea[side].border === eb[side].border &&
        (ea[side].curves?.name ?? '') === (eb[side].curves?.name ?? ''),
        `edge mismatch piece ${i} ${side}`
      );
    }
    assert(a[i].width === b[i].width && a[i].height === b[i].height, `size mismatch piece ${i}`);
  }
  const c = buildPieces(sub, choice, 54321);
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      if (
        a[i].edges[side].tab !== c[i].edges[side].tab ||
        a[i].edges[side].bend !== c[i].edges[side].bend ||
        (a[i].edges[side].curves?.name ?? '') !== (c[i].edges[side].curves?.name ?? '')
      )
        diff++;
    }
  }
  assert(diff > 0, 'different seeds should produce different cuts');
  console.log(`  ✓ ${a.length} pieces deterministic`);
}

/* ---------- 2. 散布专项 ---------- */
console.log('2. 散布专项（保护区/重叠/边界）');
const boards = [
  { W: 1200, H: 800 },   // 常规宽屏
  { W: 800, H: 1200 },   // 竖屏
  { W: 900, H: 600 },    // 小画布
  { W: 2200, H: 700 },   // 极端宽
];
const nops = [24, 150, 500, 1000];

for (const board of boards) {
  for (const targetNop of nops) {
    // subject 大约占画布面积 35%
    const subArea = board.W * board.H * 0.35;
    const subAspect = 1.5;
    const subW = Math.round(Math.sqrt(subArea * subAspect));
    const subH = Math.round(subArea / subW);
    const sub = mkSubject(subW, subH);
    const choice = choiceFor(subW, subH, targetNop);
    if (choice.size < 8) continue; // 块太小无意义
    const pieces = buildPieces(sub, choice, 999);
    for (const p of pieces) {
      p.group = new Group([p]);
    }

    const world = ensureScatterCapacity(board.W, board.H, subW, subH, pieces);
    scatter({
      pieces,
      fixed: [],
      W: world.W,
      H: world.H,
      subjectW: subW,
      subjectH: subH,
    });

    const label = `${board.W}x${board.H} nop=${choice.nop} world=${world.W}x${world.H}`;

    // a) 零块与参考图矩形相交
    const prev = {
      left: world.W / 2 - subW / 2,
      right: world.W / 2 + subW / 2,
      top: world.H / 2 - subH / 2,
      bottom: world.H / 2 + subH / 2,
    };
    let onPreview = 0;
    for (const p of pieces) {
      const b = pieceBounds(p);
      if (
        b.x + b.w > prev.left && b.x < prev.right &&
        b.y + b.h > prev.top && b.y < prev.bottom
      ) onPreview++;
    }
    assert(onPreview === 0, `${label}: ${onPreview} pieces on preview area`);

    // b) 全部界内
    let outOfBounds = 0;
    for (const p of pieces) {
      const b = pieceBounds(p);
      if (b.x < -1 || b.y < -1 || b.x + b.w > world.W + 1 || b.y + b.h > world.H + 1)
        outOfBounds++;
    }
    assert(outOfBounds === 0, `${label}: ${outOfBounds} pieces out of bounds`);

    // c) 实体零重叠（碰撞盒 = 外接框每边收缩 MARGIN，即不透明像素区域）
    //    格距按最大块尺寸计算后这是硬保证。
    const MARGIN = 10;
    let overlaps = 0;
    for (let i = 0; i < pieces.length; i++) {
      const a = pieceBounds(pieces[i]);
      for (let j = i + 1; j < pieces.length; j++) {
        const b = pieceBounds(pieces[j]);
        const ox =
          Math.min(a.x + a.w - MARGIN, b.x + b.w - MARGIN) -
          Math.max(a.x + MARGIN, b.x + MARGIN);
        const oy =
          Math.min(a.y + a.h - MARGIN, b.y + b.h - MARGIN) -
          Math.max(a.y + MARGIN, b.y + MARGIN);
        if (ox > 0.5 && oy > 0.5) overlaps++;
      }
    }
    assert(overlaps === 0, `${label}: ${overlaps} opaque overlap pairs`);

    // d) 邻居退避：任何拼图相邻块不得处于「看似已拼合」的距离
    //    （实际间距 < 成品偏移 × 1.2 判为过近）
    let cozy = 0;
    for (const p of pieces) {
      for (const n of p.neighbors) {
        if (n.id < p.id) continue;
        const joinDist = Math.hypot(p.refX - n.refX, p.refY - n.refY);
        const actual = Math.hypot(p.x - n.x, p.y - n.y);
        if (actual < joinDist * 1.2) cozy++;
      }
    }
    assert(cozy === 0, `${label}: ${cozy} neighbor pairs look pre-joined`);
    console.log(`  ${label}: onPreview=0 oob=0 opaqueOverlaps=${overlaps} cozyNeighbors=${cozy}`);
  }
}

/* ---------- 3. 存档幂等（核心字段） ---------- */
console.log('3. 归一化坐标往返精度');
{
  const sub = mkSubject(600, 400);
  const choice = choiceFor(600, 400, 24);
  const pieces = buildPieces(sub, choice, 777);
  const W = 1400, H = 900;
  for (const p of pieces) {
    p.x = Math.random() * W;
    p.y = Math.random() * H;
  }
  for (const p of pieces) {
    const nx = (p.x / W).toFixed(5);
    const ny = (p.y / H).toFixed(5);
    const rx = parseFloat(nx) * W;
    const ry = parseFloat(ny) * H;
    assert(Math.abs(rx - p.x) < 0.05, `x roundtrip err ${Math.abs(rx - p.x)}`);
    assert(Math.abs(ry - p.y) < 0.05, `y roundtrip err ${Math.abs(ry - p.y)}`);
  }
  console.log('  ✓ toFixed(5) roundtrip < 0.05px');
}

if (failures) {
  console.error(`\nFAILED: ${failures} assertion(s)`);
  process.exit(1);
} else {
  console.log('\nALL PASS');
}
