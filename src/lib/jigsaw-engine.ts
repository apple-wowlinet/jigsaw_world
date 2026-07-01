/**
 * Jigsaw Engine —— 工业级 Canvas2D 拼图引擎
 *
 * 移植自 src/template/jigsaw_upload_demo.html，框架无关（仅依赖浏览器 Canvas2D）。
 * 核心算法对应 demo 注释中的文档章节：
 *   §3.2.3 凸凹互补 · §3.3 预渲染掩码 · §3.5.1 吸附几何 · §3.5.4 螺旋散开
 */

/* ============================================================
 * 0. 常量
 * ============================================================ */
export const MARGIN = 10; // 拼块离屏 canvas 边距（给凸耳留空间）
export const HIT_ALPHA = 24; // 命中测试 alpha 阈值
export const DRAG_THRESHOLD = 3; // 拖动判定阈值（px）
export const SUBJECT_AREA_RATIO = 0.35; // 源图目标占画布面积比
export const SNAP_FACTOR = 0.28; // 吸附阈值 = max(18, size × 0.28)
export const SNAP_MIN = 18;

/* ============================================================
 * 1. Utils —— 工具函数
 * ============================================================ */
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
  // 2D 向量旋转（弧度制）—— 用于吸附几何
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

/* ============================================================
 * 2. Subject —— 源图缩放（文档 §3.1）
 * ============================================================ */
export interface SubjectData {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export const Subject = {
  // 从 HTMLImageElement 生成缩放后的离屏 canvas
  create(img: HTMLImageElement, boardW: number, boardH: number): SubjectData {
    const boardArea = boardW * boardH;
    let w = img.naturalWidth,
      h = img.naturalHeight;
    // 面积驱动缩放：目标 ≈ 35% 画布面积；单边 ≤ 65%
    const MAX_SIDE = 0.65;
    let scale = 1;
    while (
      (w * h) / boardArea > SUBJECT_AREA_RATIO ||
      w > boardW * MAX_SIDE ||
      h > boardH * MAX_SIDE
    ) {
      scale -= 0.01;
      w = Math.round(img.naturalWidth * scale);
      h = Math.round(img.naturalHeight * scale);
      if (scale < 0.05) break;
    }
    w = Math.max(40, w);
    h = Math.max(40, h);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, w, h);
    return { canvas, width: w, height: h };
  },
};

/* ============================================================
 * 3. Knife —— 切图核心（文档 §3.2）
 * ============================================================ */

interface CtrlPt {
  fromBase: number; // 垂直边线偏移：0=贴边线 正=凸出 负=内凹
  alongBase: number; // 沿边线进度：0=起点 1=终点
}

interface Template {
  name: string;
  pts: CtrlPt[];
  ptsReversed: CtrlPt[];
}

interface Edge {
  border: boolean;
  tab: boolean;
  thick: number;
  curves: Template | null;
  bend: boolean;
  // 绘制时填充的几何参数
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  side?: number;
}

export interface PieceChoice {
  nop: number;
  rows: number;
  cols: number;
  size: number;
}

export interface Piece {
  id: number;
  row: number;
  col: number;
  imgX: number;
  imgY: number;
  refX: number;
  refY: number;
  core: { width: number; height: number; x: number; y: number };
  width: number;
  height: number;
  x: number;
  y: number;
  z: number;
  angle: number;
  isEdge: boolean;
  sort: number;
  group: Group | null;
  hasMoved: boolean;
  canvas: HTMLCanvasElement | null;
  alpha: Uint8ClampedArray | null;
  renderDpr: number;
  neighbors: Piece[];
  edges: { top: Edge; right: Edge; bottom: Edge; left: Edge };
}

function mkTemplate(
  pts: { f: number; a: number }[],
  rev: { f: number; a: number }[],
  name: string
): Template {
  return {
    name,
    pts: pts.map((p) => ({ fromBase: p.f, alongBase: p.a })),
    ptsReversed: rev.map((p) => ({ fromBase: p.f, alongBase: p.a })),
  };
}

// 四种凸耳模板（移植自 jigex-prog.js traditionalKnife）
function buildTemplates() {
  // sock（袜状）
  const sockP = [
    { f: 0.011364, a: 0.094697 }, { f: -0.030303, a: 0.227273 }, { f: -0.117424, a: 0.537879 }, { f: 0.132576, a: 0.382576 },
    { f: 0.344697, a: 0.284091 }, { f: 0.268939, a: 0.541667 }, { f: 0.208333, a: 0.681818 }, { f: 0.056818, a: 0.575758 },
    { f: -0.079545, a: 0.515152 }, { f: -0.018939, a: 0.761364 }, { f: 0.011364, a: 0.905303 }, { f: 0, a: 1 },
  ];
  const sockR = [
    { f: 0.011364, a: -0.094697 }, { f: -0.018939, a: -0.238636 }, { f: -0.079545, a: -0.484848 }, { f: 0.056818, a: -0.424242 },
    { f: 0.208333, a: -0.318182 }, { f: 0.268939, a: -0.458333 }, { f: 0.344697, a: -0.715909 }, { f: 0.132576, a: -0.617424 },
    { f: -0.117424, a: -0.462121 }, { f: -0.030303, a: -0.772727 }, { f: 0.011364, a: -0.905303 }, { f: 0, a: -1 },
  ];
  // finger（指状）
  const fingerP = [
    { f: 0, a: 0.049242 }, { f: -0.022727, a: 0.159091 }, { f: -0.068182, a: 0.545455 }, { f: 0.125, a: 0.412879 },
    { f: 0.344697, a: 0.253788 }, { f: 0.272727, a: 0.473485 }, { f: 0.238636, a: 0.55303 }, { f: 0.121212, a: 0.549242 },
    { f: -0.109848, a: 0.5 }, { f: -0.018939, a: 0.761364 }, { f: 0.011364, a: 0.905303 }, { f: 0, a: 1 },
  ];
  const fingerR = [
    { f: 0.011364, a: -0.094697 }, { f: -0.018939, a: -0.238636 }, { f: -0.109848, a: -0.5 }, { f: 0.121212, a: -0.450758 },
    { f: 0.238636, a: -0.44697 }, { f: 0.272727, a: -0.526515 }, { f: 0.344697, a: -0.746212 }, { f: 0.125, a: -0.587121 },
    { f: -0.068182, a: -0.454545 }, { f: -0.022727, a: -0.840909 }, { f: 0, a: -0.950758 }, { f: 0, a: -1 },
  ];
  // ball（球状）
  const ballP = [
    { f: -0.003788, a: 0.064394 }, { f: -0.026515, a: 0.162879 }, { f: -0.098485, a: 0.534091 }, { f: 0.056818, a: 0.431818 },
    { f: 0.287879, a: 0.265152 }, { f: 0.295455, a: 0.5 }, { f: 0.287879, a: 0.715909 }, { f: 0.056818, a: 0.575758 },
    { f: -0.079545, a: 0.515152 }, { f: -0.018939, a: 0.761364 }, { f: 0.011364, a: 0.905303 }, { f: 0, a: 1 },
  ];
  const ballR = [
    { f: 0.011364, a: -0.094697 }, { f: -0.018939, a: -0.238636 }, { f: -0.079545, a: -0.484848 }, { f: 0.056818, a: -0.424242 },
    { f: 0.287879, a: -0.284091 }, { f: 0.295455, a: -0.5 }, { f: 0.287879, a: -0.734848 }, { f: 0.056818, a: -0.568182 },
    { f: -0.098485, a: -0.465909 }, { f: -0.026515, a: -0.837121 }, { f: -0.003788, a: -0.935606 }, { f: 0, a: -1 },
  ];
  // stub（短桩）
  const stubP = [
    { f: 0.007576, a: 0.094697 }, { f: -0.049242, a: 0.219697 }, { f: -0.117424, a: 0.397727 }, { f: 0.018939, a: 0.378788 },
    { f: 0.234848, a: 0.363636 }, { f: 0.151515, a: 0.617424 }, { f: 0.109848, a: 0.708333 }, { f: -0.015152, a: 0.617424 },
    { f: -0.181818, a: 0.518939 }, { f: -0.030303, a: 0.837121 }, { f: 0.003788, a: 0.909091 }, { f: 0, a: 1 },
  ];
  const stubR = [
    { f: 0.003788, a: -0.090909 }, { f: -0.030303, a: -0.162879 }, { f: -0.181818, a: -0.481061 }, { f: -0.015152, a: -0.382576 },
    { f: 0.109848, a: -0.291667 }, { f: 0.151515, a: -0.382576 }, { f: 0.234848, a: -0.636364 }, { f: 0.018939, a: -0.621212 },
    { f: -0.117424, a: -0.602273 }, { f: -0.049242, a: -0.780303 }, { f: 0.007576, a: -0.905303 }, { f: 0, a: -1 },
  ];
  return {
    sock: mkTemplate(sockP, sockR, 'sock'),
    finger: mkTemplate(fingerP, fingerR, 'finger'),
    ball: mkTemplate(ballP, ballR, 'ball'),
    stub: mkTemplate(stubP, stubR, 'stub'),
  };
}

const TEMPLATES = buildTemplates();

// 形状选择表（36 项）
const SHAPE_TABLE = [0, 1, 6, 4, 1, 7, 5, 9, 2, 8, 6, 9, 0, 5, 9, 6, 7, 9, 3, 7, 2, 0, 8, 4, 9, 6, 2, 6, 8, 4, 3, 0, 8, 3, 2, 7, 9];
// 凸凹真值表（30 项）
const TAB_HOLE = [false, false, true, false, true, true, false, true, true, false, true, false, true, true, false, true, true, false, true, false, true, true, false, true, true, false, true, false, true, true];

function shapeFor(ord: number): { template: Template; bend: boolean } {
  switch (ord) {
    case 0:
      return { template: TEMPLATES.ball, bend: false };
    case 1:
      return { template: TEMPLATES.ball, bend: true };
    case 2:
      return { template: TEMPLATES.finger, bend: false };
    case 3:
      return { template: TEMPLATES.finger, bend: true };
    case 4:
      return { template: TEMPLATES.stub, bend: false };
    case 5:
      return { template: TEMPLATES.stub, bend: true };
    default:
      return { template: TEMPLATES.sock, bend: ord % 2 === 1 };
  }
}

// 右/下边参数
function edgeOf(shapeIdx: number, tabIdx: number): Edge {
  const shapeOrd = SHAPE_TABLE[shapeIdx % SHAPE_TABLE.length];
  const { template, bend } = shapeFor(shapeOrd);
  const tab = TAB_HOLE[tabIdx % TAB_HOLE.length];
  return { border: false, tab, thick: 0, curves: template, bend };
}

// 凸凹取反（邻居互补）
function flipEdge(e: Edge): Edge {
  return { border: false, tab: !e.tab, thick: e.thick, curves: e.curves, bend: !e.bend };
}

function drawEdge(c: CanvasRenderingContext2D, e: Edge) {
  if (e.border) {
    c.lineTo(e.endX!, e.endY!);
    return;
  }
  const vertical = e.startX === e.endX;
  const d = vertical
    ? Math.abs(e.startY! - e.endY!)
    : Math.abs(e.startX! - e.endX!);
  const pts = e.bend ? e.curves!.pts : e.curves!.ptsReversed;
  let s: number, l: number;
  switch (e.side) {
    case 0:
      s = e.tab ? -1 : 1;
      l = e.bend ? 1 : -1;
      break; // 左
    case 1:
      s = e.tab ? 1 : -1;
      l = e.bend ? 1 : -1;
      break; // 下
    case 2:
      s = e.tab ? 1 : -1;
      l = e.bend ? -1 : 1;
      break; // 右
    case 3:
      s = e.tab ? -1 : 1;
      l = e.bend ? -1 : 1;
      break; // 上
    default:
      s = 1;
      l = 1;
  }
  for (let i = 0; i < 12; ) {
    const r = pts[i++]; // 控制点
    const a = pts[i++]; // 终点
    let cx, cy, ex, ey;
    if (vertical) {
      cx = e.startX! + d * r.fromBase * s;
      cy = e.startY! + d * r.alongBase * l;
      ex = e.startX! + d * a.fromBase * s;
      ey = e.startY! + d * a.alongBase * l;
    } else {
      cx = e.startX! + d * r.alongBase * l;
      cy = e.startY! + d * r.fromBase * s;
      ex = e.startX! + d * a.alongBase * l;
      ey = e.startY! + d * a.fromBase * s;
    }
    c.quadraticCurveTo(cx, cy, ex, ey);
  }
}

function outline(c: CanvasRenderingContext2D, p: Piece) {
  const x = p.core.x,
    y = p.core.y,
    w = p.core.width,
    h = p.core.height;
  const top = p.edges.top,
    left = p.edges.left,
    right = p.edges.right,
    bottom = p.edges.bottom;
  c.beginPath();
  c.moveTo(x, y);
  // 左边：上→下
  left.startX = x; left.startY = y; left.endX = x; left.endY = y + h; left.side = 0;
  drawEdge(c, left);
  // 下边：左→右
  bottom.startX = x; bottom.startY = y + h; bottom.endX = x + w; bottom.endY = y + h; bottom.side = 1;
  drawEdge(c, bottom);
  // 右边：下→上
  right.startX = x + w; right.startY = y + h; right.endX = x + w; right.endY = y; right.side = 2;
  drawEdge(c, right);
  // 上边：右→左
  top.startX = x + w; top.startY = y; top.endX = x; top.endY = y; top.side = 3;
  drawEdge(c, top);
  c.closePath();
}

function getRenderDpr() {
  return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
}

function paintPiece(p: Piece, subCanvas: HTMLCanvasElement) {
  const dpr = getRenderDpr();
  const cssW = Math.ceil(p.width);
  const cssH = Math.ceil(p.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(cssW * dpr);
  canvas.height = Math.ceil(cssH * dpr);
  const g = canvas.getContext('2d')!;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = 'high';
  outline(g, p);
  g.save();
  g.clip();
  // 源图对应区域（偏移让 core 对齐源图位置）
  g.drawImage(subCanvas, p.core.x - p.imgX, p.core.y - p.imgY);
  // 顶部光泽渐变
  const gloss = g.createLinearGradient(0, 0, 0, canvas.height);
  gloss.addColorStop(0, 'rgba(255,255,255,.20)');
  gloss.addColorStop(0.55, 'rgba(255,255,255,.04)');
  gloss.addColorStop(1, 'rgba(17,32,47,.08)');
  g.fillStyle = gloss;
  g.fillRect(0, 0, cssW, cssH);
  g.restore();
  // 暗描边（底）+ 亮描边（顶）
  outline(g, p);
  g.lineWidth = 1.4;
  g.strokeStyle = 'rgba(10,18,28,.6)';
  g.stroke();
  outline(g, p);
  g.lineWidth = 0.8;
  g.strokeStyle = 'rgba(255,255,255,.4)';
  g.stroke();
  p.canvas = canvas;
  p.renderDpr = dpr;
  p.alpha = g.getImageData(0, 0, canvas.width, canvas.height).data;
}

// 主切图：三遍扫描
function buildPieces(subject: SubjectData, choice: PieceChoice, seed: number): Piece[] {
  const rng = Utils.rng(seed);
  const rows = choice.rows,
    cols = choice.cols,
    size = choice.size;
  const grid: Piece[][] = Array.from({ length: rows }, () => Array(cols).fill(null) as unknown as Piece[]);
  const list: Piece[] = [];

  // 第一遍：网格 + core 尺寸（余数均摊）
  const wRem = subject.width % size;
  const hRem = subject.height % size;
  const wChunk = Math.floor(wRem / cols);
  const hChunk = Math.floor(hRem / rows);
  let y = 0;
  for (let row = 0; row < rows; row++) {
    let h = size;
    const extraH = hRem - hChunk * row - Math.min(row, hRem % rows);
    if (extraH > 0) {
      h += hChunk;
      if (hRem % rows - row > 0) h++;
    }
    let x = 0;
    for (let col = 0; col < cols; col++) {
      let w = size;
      const extraW = wRem - wChunk * col - Math.min(col, wRem % cols);
      if (extraW > 0) {
        w += wChunk;
        if (wRem % cols - col > 0) w++;
      }
      const piece: Piece = {
        id: list.length + 1,
        row,
        col,
        imgX: x,
        imgY: y,
        refX: x + w / 2,
        refY: y + h / 2,
        core: { width: w, height: h, x: 0, y: 0 },
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        z: 0,
        angle: 0,
        isEdge: false,
        sort: rng(),
        group: null,
        hasMoved: false,
        canvas: null,
        alpha: null,
        renderDpr: 1,
        neighbors: [],
        edges: {
          top: {} as Edge,
          right: {} as Edge,
          bottom: {} as Edge,
          left: {} as Edge,
        },
      };
      grid[row][col] = piece;
      list.push(piece);
      x += w;
    }
    y += h;
  }

  // 第二遍：凸凹分配（左/上继承，右/下新生成）
  let shapeCursor = Math.floor(rng() * 36);
  let tabRightCursor = Math.floor(rng() * 30);
  let tabBottomCursor = Math.floor(rng() * 30);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const p = grid[row][col];
      const top = row === 0,
        left = col === 0;
      const right = col === cols - 1,
        bottom = row === rows - 1;
      p.edges.top = top
        ? { border: true, tab: false, thick: 0, curves: null, bend: false }
        : flipEdge(grid[row - 1][col].edges.bottom);
      p.edges.left = left
        ? { border: true, tab: false, thick: 0, curves: null, bend: false }
        : flipEdge(grid[row][col - 1].edges.right);
      const eRight = right ? null : edgeOf(shapeCursor, tabRightCursor);
      if (!right) {
        shapeCursor = (shapeCursor + 1) % 36;
        tabRightCursor = (tabRightCursor + 1) % 30;
      }
      const eBottom = bottom ? null : edgeOf(shapeCursor, tabBottomCursor);
      if (!bottom) {
        shapeCursor = (shapeCursor + 1) % 36;
        tabBottomCursor = (tabBottomCursor + 1) % 30;
      }
      p.edges.right = right
        ? { border: true, tab: false, thick: 0, curves: null, bend: false }
        : (eRight as Edge);
      p.edges.bottom = bottom
        ? { border: true, tab: false, thick: 0, curves: null, bend: false }
        : (eBottom as Edge);
    }
  }

  // 第二遍半：测量凸耳厚度
  for (const p of list) {
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      const e = p.edges[side];
      if (e.border || !e.curves) {
        e.thick = 0;
        continue;
      }
      const pts = e.bend ? e.curves.pts : e.curves.ptsReversed;
      let maxF = 0;
      for (const pt of pts) {
        const a = Math.abs(pt.fromBase);
        if (a > maxF) maxF = a;
      }
      const span = side === 'top' || side === 'bottom' ? p.core.width : p.core.height;
      e.thick = Math.round(maxF * span) + 1;
    }
    p.width = p.edges.left.thick + p.core.width + p.edges.right.thick + MARGIN * 2;
    p.height = p.edges.top.thick + p.core.height + p.edges.bottom.thick + MARGIN * 2;
    p.core.x = p.edges.left.thick + MARGIN;
    p.core.y = p.edges.top.thick + MARGIN;
    p.isEdge = p.row === 0 || p.col === 0 || p.row === rows - 1 || p.col === cols - 1;
  }

  // 第三遍：建立邻居引用
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const p = grid[row][col];
      const nb: Piece[] = [];
      if (row > 0) nb.push(grid[row - 1][col]);
      if (col < cols - 1) nb.push(grid[row][col + 1]);
      if (row < rows - 1) nb.push(grid[row + 1][col]);
      if (col > 0) nb.push(grid[row][col - 1]);
      p.neighbors = nb;
    }
  }
  return list;
}

function renderSize(p: Piece) {
  return p.angle % 180 === 0
    ? { w: p.width, h: p.height }
    : { w: p.height, h: p.width };
}

// 单块外接框（核心中心为锚点）
export function pieceBounds(p: Piece) {
  const s = renderSize(p);
  const ccx = p.core.x + p.core.width / 2;
  const ccy = p.core.y + p.core.height / 2;
  return { x: p.x - ccx, y: p.y - ccy, w: s.w, h: s.h };
}

// 组外接框
export function groupBounds(pieces: Piece[]) {
  let minX = 1e9,
    minY = 1e9,
    maxX = -1e9,
    maxY = -1e9;
  for (const p of pieces) {
    const b = pieceBounds(p);
    if (b.x < minX) minX = b.x;
    if (b.y < minY) minY = b.y;
    if (b.x + b.w > maxX) maxX = b.x + b.w;
    if (b.y + b.h > maxY) maxY = b.y + b.h;
  }
  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
}

/* ============================================================
 * 4. Group —— 拼组（文档 §3.5.2）
 * ============================================================ */
let _groupSeq = 0;
export class Group {
  id: number;
  pieces: Piece[];
  constructor(pieces: Piece[]) {
    this.id = ++_groupSeq;
    this.pieces = pieces.slice();
    for (const p of this.pieces) p.group = this;
  }
  absorb(other: Group) {
    for (const p of other.pieces) {
      if (this.pieces.indexOf(p) === -1) this.pieces.push(p);
      p.group = this;
    }
    return this;
  }
}

/* ============================================================
 * 5. Puzzle —— 拼图主控（文档 §3.4/§3.5）
 * ============================================================ */
export class Puzzle {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  pieces: Piece[] = [];
  choice: PieceChoice | null = null;
  subject: SubjectData | null = null;
  subCanvas: HTMLCanvasElement | null = null;
  zCounter = 0;
  drag: {
    piece: Piece;
    group: Group;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null = null;
  moves = 0;
  complete = false;
  showPreview = true;
  previewAlpha = 0.18;
  onComplete: (() => void) | null = null;
  onProgress: ((pct: number) => void) | null = null;
  snapDistance = SNAP_MIN;

  constructor(ctx: CanvasRenderingContext2D, boardW: number, boardH: number) {
    this.ctx = ctx;
    this.W = boardW;
    this.H = boardH;
  }

  // 初始化：切图 + 预渲染 + 散开
  init(subject: SubjectData, choice: PieceChoice, seed: number) {
    this.subject = subject;
    this.choice = choice;
    this.subCanvas = subject.canvas;
    this.pieces = buildPieces(subject, choice, seed);
    for (const p of this.pieces) paintPiece(p, this.subCanvas);
    this.snapDistance = Math.max(SNAP_MIN, Math.round(choice.size * SNAP_FACTOR));
    for (const p of this.pieces) p.group = new Group([p]);
    this.scatter();
    this.complete = false;
    this.moves = 0;
  }

  // 散开：螺旋由外向内 + AABB 硬约束零重叠
  scatter() {
    for (const p of this.pieces) {
      if (!p.group || p.group.pieces.length !== 1) p.group = new Group([p]);
    }

    const cx = this.W / 2,
      cy = this.H / 2;
    const PAD = 12;
    const prev = {
      left: cx - this.subject!.width / 2,
      right: cx + this.subject!.width / 2,
      top: cy - this.subject!.height / 2,
      bottom: cy + this.subject!.height / 2,
    };
    const inPreview = (px: number, py: number, halfW: number, halfH: number) =>
      px + halfW > prev.left &&
      px - halfW < prev.right &&
      py + halfH > prev.top &&
      py - halfH < prev.bottom;

    let avgW = 0,
      avgH = 0;
    for (const pc of this.pieces) {
      avgW += pc.width;
      avgH += pc.height;
    }
    avgW /= this.pieces.length;
    avgH /= this.pieces.length;
    const step = Math.max(6, Math.round(Math.min(avgW, avgH) / 4));
    const jitter = step / 2;

    const sorted = this.pieces.slice().sort((a, b) => a.sort - b.sort);
    const reordered: Piece[] = [];
    {
      const queue = sorted.slice();
      let last: Piece | null = null,
        retries = 0;
      while (queue.length) {
        const pc = queue.pop()!;
        if (last && last.neighbors.indexOf(pc) !== -1 && retries < 5) {
          queue.unshift(pc);
          retries++;
        } else {
          reordered.push(pc);
          last = pc;
          retries = 0;
        }
      }
    }
    reordered.sort((a, b) => b.width * b.height - a.width * a.height);

    const cols = Math.max(1, Math.floor((this.W - PAD * 2) / step));
    const rows = Math.max(1, Math.floor((this.H - PAD * 2) / step));
    const ox = (this.W - (cols - 1) * step) / 2;
    const oy = (this.H - (rows - 1) * step) / 2;
    const candidates: { x: number; y: number }[] = [];
    {
      let top = 0,
        bottom = rows - 1,
        left = 0,
        right = cols - 1;
      while (top <= bottom && left <= right) {
        for (let c = left; c <= right; c++) candidates.push({ x: ox + c * step, y: oy + top * step });
        top++;
        if (top <= bottom) {
          for (let r = top; r <= bottom; r++) candidates.push({ x: ox + right * step, y: oy + r * step });
          right--;
        }
        if (top <= bottom) {
          for (let c = right; c >= left; c--) candidates.push({ x: ox + c * step, y: oy + bottom * step });
          bottom--;
        }
        if (left <= right) {
          for (let r = bottom; r >= top; r--) candidates.push({ x: ox + left * step, y: oy + r * step });
          left++;
        }
      }
    }

    const placedPieces: Piece[] = [];
    const collides = (px: number, py: number, hw: number, hh: number) => {
      for (const op of placedPieces) {
        if (
          Math.abs(px - op.x) < hw + op.width / 2 &&
          Math.abs(py - op.y) < hh + op.height / 2
        )
          return true;
      }
      return false;
    };

    const commit = (pc: Piece, fx: number, fy: number) => {
      pc.x = fx;
      pc.y = fy;
      pc.hasMoved = false;
      pc.z = ++this.zCounter;
      placedPieces.push(pc);
    };

    for (const pc of reordered) {
      const halfW = pc.width / 2,
        halfH = pc.height / 2;
      let spot: { x: number; y: number } | null = null;
      let spotPrev: { x: number; y: number } | null = null;
      for (const cand of candidates) {
        const fx = Utils.clamp(cand.x, halfW + PAD, this.W - halfW - PAD);
        const fy = Utils.clamp(cand.y, halfH + PAD, this.H - halfH - PAD);
        if (collides(fx, fy, halfW, halfH)) continue;
        if (!inPreview(fx, fy, halfW, halfH)) {
          spot = { x: fx, y: fy };
          break;
        }
        if (!spotPrev) spotPrev = { x: fx, y: fy };
      }
      let chosen = spot || spotPrev;

      if (chosen) {
        const jx = (Math.random() >= 0.5 ? 1 : -1) * Math.random() * jitter;
        const jy = (Math.random() >= 0.5 ? 1 : -1) * Math.random() * jitter;
        let fx = Utils.clamp(chosen.x + jx, halfW + PAD, this.W - halfW - PAD);
        let fy = Utils.clamp(chosen.y + jy, halfH + PAD, this.H - halfH - PAD);
        if (collides(fx, fy, halfW, halfH)) {
          fx = chosen.x;
          fy = chosen.y;
        }
        commit(pc, fx, fy);
        continue;
      }

      // 兜底扫描
      const scanFind = (avoidPreview: boolean) => {
        for (let y = halfH + PAD; y <= this.H - halfH - PAD; y += step) {
          for (let x = halfW + PAD; x <= this.W - halfW - PAD; x += step) {
            if (avoidPreview && inPreview(x, y, halfW, halfH)) continue;
            if (!collides(x, y, halfW, halfH)) return { x, y };
          }
        }
        return null;
      };
      chosen = scanFind(true) || scanFind(false);
      if (chosen) {
        commit(pc, chosen.x, chosen.y);
        continue;
      }

      // 极端兜底：允许溢出
      let fx: number | null = null,
        fy: number | null = null;
      for (let y = halfH; y < this.H + halfH && fx === null; y += step) {
        for (let x = halfW; x < this.W + halfH && fx === null; x += step) {
          if (!collides(x, y, halfW, halfH)) {
            fx = x;
            fy = y;
          }
        }
      }
      commit(pc, fx !== null ? fx : halfW, fy !== null ? fy : halfH);
    }
  }

  // 命中测试
  hitPiece(point: { x: number; y: number }, piece: Piece) {
    const b = pieceBounds(piece);
    if (point.x < b.x || point.x > b.x + b.w || point.y < b.y || point.y > b.y + b.h)
      return false;
    const dpr = piece.renderDpr || 1;
    const lx = Math.floor((point.x - b.x) * dpr);
    const ly = Math.floor((point.y - b.y) * dpr);
    if (
      lx < 0 ||
      ly < 0 ||
      lx >= piece.canvas!.width ||
      ly >= piece.canvas!.height
    )
      return false;
    return piece.alpha![(ly * piece.canvas!.width + lx) * 4 + 3] > HIT_ALPHA;
  }

  pick(point: { x: number; y: number }): Piece | null {
    const sorted = this.pieces.slice().sort((a, b) => b.z - a.z);
    for (const p of sorted) {
      if (this.hitPiece(point, p)) return p;
    }
    return null;
  }

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
    if (b.x < 12) dx = 12 - b.x;
    if (b.x + b.w > this.W - 12) dx = this.W - 12 - (b.x + b.w);
    if (b.y < 12) dy = 12 - b.y;
    if (b.y + b.h > this.H - 12) dy = this.H - 12 - (b.y + b.h);
    if (dx || dy) for (const p of group.pieces) {
      p.x += dx;
      p.y += dy;
    }
  }

  // 吸附几何
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

  // 拼合
  snapGroup(group: Group): Group {
    let active = group;
    let joins = 0;
    while (true) {
      const snap = this.findSnap(active);
      if (!snap) break;
      this.translateGroup(active, snap.dx, snap.dy, false);
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
    if (joins && this.onProgress) this.onProgress(this.percent());
    if (!this.complete && active.pieces.length === this.pieces.length) {
      this.complete = true;
      if (this.onComplete) this.onComplete();
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
    return this.pieces.length
      ? Math.round(((max - 1) / (this.pieces.length - 1)) * 99)
      : 0;
  }

  // 交互
  pointerDown(point: { x: number; y: number }) {
    if (this.complete) return false;
    const piece = this.pick(point);
    if (!piece) return false;
    this.raiseGroup(piece.group!);
    this.drag = {
      piece,
      group: piece.group!,
      offsetX: point.x - piece.x,
      offsetY: point.y - piece.y,
      startX: point.x,
      startY: point.y,
      moved: false,
    };
    return true;
  }

  pointerMove(point: { x: number; y: number }) {
    if (!this.drag) return false;
    const d = this.drag;
    const tx = point.x - d.offsetX,
      ty = point.y - d.offsetY;
    const dx = tx - d.piece.x,
      dy = ty - d.piece.y;
    if (dx || dy) this.translateGroup(d.group, dx, dy);
    if (
      Utils.hypot(point.x - d.startX, point.y - d.startY) > DRAG_THRESHOLD
    )
      d.moved = true;
    return true;
  }

  pointerUp() {
    if (!this.drag) return false;
    const d = this.drag;
    this.drag = null;
    if (d.moved) {
      this.moves++;
      this.snapGroup(d.group);
      if (this.onProgress) this.onProgress(this.percent());
    }
    return true;
  }

  // 渲染
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    // 中央半透明参考图
    if (this.showPreview && this.subCanvas) {
      const cx = this.W / 2,
        cy = this.H / 2;
      const sw = this.subject!.width,
        sh = this.subject!.height;
      ctx.save();
      ctx.globalAlpha = this.previewAlpha;
      ctx.drawImage(this.subCanvas, cx - sw / 2, cy - sh / 2);
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - sw / 2, cy - sh / 2, sw, sh);
      ctx.restore();
    }

    const sorted = this.pieces.slice().sort((a, b) => a.z - b.z);
    const dragging = this.drag;
    for (const p of sorted) {
      const isSelected =
        dragging && dragging.group.pieces.indexOf(p) !== -1;
      ctx.save();
      if (isSelected) {
        ctx.shadowColor = 'rgba(0,0,0,.5)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;
      } else {
        ctx.shadowColor = 'rgba(0,0,0,.35)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetY = 1;
      }
      ctx.translate(p.x, p.y);
      if (p.angle) ctx.rotate((p.angle * Math.PI) / 180);
      ctx.drawImage(
        p.canvas!,
        -(p.core.x + p.core.width / 2),
        -(p.core.y + p.core.height / 2),
        p.width,
        p.height
      );
      ctx.restore();
    }
  }

  uniqueGroups(): Group[] {
    const set = new Set<Group>();
    for (const p of this.pieces) if (p.group) set.add(p.group);
    return [...set];
  }
}

/* ============================================================
 * 6. computeChoices —— 可选档位（文档 §3.2.1）
 * ============================================================ */
export function computeChoices(subject: SubjectData): PieceChoice[] {
  const w = subject.width,
    h = subject.height;
  const result: PieceChoice[] = [];
  const seen = new Set<number>();
  let size = Math.floor(Math.min(w, h) / 3);
  let lastSize = Infinity;
  let guard = 0;
  while (size > 24 && size < lastSize && guard < 60) {
    guard++;
    lastSize = size;
    const rows = Math.max(2, Math.floor(h / size));
    const cols = Math.max(2, Math.floor(w / size));
    const nop = rows * cols;
    if (nop >= 6 && !seen.has(nop)) {
      seen.add(nop);
      result.push({ nop, rows, cols, size });
    }
    const sR = Math.floor(h / (rows + 1));
    const sC = Math.floor(w / (cols + 1));
    size = Math.max(sR, sC);
    if (result.length >= 8) break;
  }
  result.sort((a, b) => a.nop - b.nop);
  return result;
}
