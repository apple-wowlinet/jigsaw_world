/**
 * Atlas —— 拼块位图烘焙器
 * 把所有拼块烘焙进少量大 canvas 页（shelf packing），并为每页提取 alpha
 * 通道 Uint8Array 供像素级命中测试。本模块不依赖 PixiJS（返回原始 canvas
 * 与帧信息），渲染层负责转成 Texture。
 *
 * 绘制流程复用 core/knife 的 outline：clip → drawImage(源图) →
 * 光泽渐变 → 双描边斜面（与原 Canvas2D 引擎视觉一致）。
 */
import { HIT_ALPHA } from '@/lib/puzzle/core/constants';
import { outline } from '@/lib/puzzle/core/knife';
import { pieceBounds } from '@/lib/puzzle/core/group';
import { Utils } from '@/lib/puzzle/core/utils';
import type { Piece } from '@/lib/puzzle/core/types';
import type { SubjectData } from '@/lib/puzzle/core/subject';

export const ATLAS_PAGE_SIZE = 2048;
const SLOT_PAD = 2; // 槽间距，防线性过滤渗色

export interface AtlasPage {
  canvas: HTMLCanvasElement;
  alpha: Uint8Array; // 仅 alpha 通道，page² 字节
}

export interface AtlasResult {
  pages: AtlasPage[];
  bakeDpr: number;
}

/**
 * 计算烘焙 DPR：优先设备 DPR（≤2），若总纹理面积超预算则自动降档。
 */
export function computeBakeDpr(pieces: Piece[], deviceDpr: number): number {
  const MAX_TOTAL_PIXELS = 64 * 1024 * 1024; // ~64MP ≈ 256MB RGBA
  let dpr = Math.min(deviceDpr || 1, 2);
  const area = pieces.reduce((s, p) => s + p.width * p.height, 0);
  while (dpr > 0.5 && area * dpr * dpr * 1.15 > MAX_TOTAL_PIXELS) {
    dpr -= 0.25;
  }
  return Math.max(0.5, dpr);
}

/**
 * shelf packing + 逐块绘制。填充每个 piece 的 atlasRef。
 */
export function bakeAtlas(
  pieces: Piece[],
  subject: SubjectData,
  deviceDpr: number
): AtlasResult {
  const bakeDpr = computeBakeDpr(pieces, deviceDpr);
  const PAGE = ATLAS_PAGE_SIZE;

  // 按高度降序 shelf packing（提高行利用率）
  const order = pieces.slice().sort((a, b) => b.height - a.height);

  interface Shelf {
    y: number;
    height: number;
    x: number;
  }
  const pages: AtlasPage[] = [];
  let ctx: CanvasRenderingContext2D | null = null;
  let shelves: Shelf[] = [];
  let shelfBottom = 0;

  const newPage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = PAGE;
    canvas.height = PAGE;
    ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    pages.push({ canvas, alpha: new Uint8Array(0) });
    shelves = [];
    shelfBottom = 0;
  };
  newPage();

  for (const p of order) {
    const fw = Math.ceil(p.width * bakeDpr) + SLOT_PAD;
    const fh = Math.ceil(p.height * bakeDpr) + SLOT_PAD;
    if (fw > PAGE || fh > PAGE) {
      // 单块超页（理论上不会发生：subject ≤ 屏幕且块 ≤ subject）
      throw new Error(`piece ${p.id} exceeds atlas page (${fw}x${fh})`);
    }

    // 找能放下的 shelf
    let shelf: Shelf | null = null;
    for (const s of shelves) {
      if (s.height >= fh && s.x + fw <= PAGE) {
        shelf = s;
        break;
      }
    }
    if (!shelf) {
      if (shelfBottom + fh > PAGE) newPage();
      shelf = { y: shelfBottom, height: fh, x: 0 };
      shelves.push(shelf);
      shelfBottom += fh;
    }

    const slotX = shelf.x;
    const slotY = shelf.y;
    shelf.x += fw;

    drawPiece(ctx!, p, subject, slotX, slotY, bakeDpr);
    p.atlasRef = {
      page: pages.length - 1,
      frameX: slotX,
      frameY: slotY,
      frameW: Math.ceil(p.width * bakeDpr),
      frameH: Math.ceil(p.height * bakeDpr),
    };
  }

  // 每页提取 alpha 通道（整页一次 getImageData，立即释放 RGBA）
  for (const page of pages) {
    const g = page.canvas.getContext('2d', { willReadFrequently: true })!;
    const data = g.getImageData(0, 0, PAGE, PAGE).data;
    const alpha = new Uint8Array(PAGE * PAGE);
    for (let i = 0, j = 3; i < alpha.length; i++, j += 4) alpha[i] = data[j];
    page.alpha = alpha;
  }

  return { pages, bakeDpr };
}

/** 单块绘制到 atlas 槽位（复用原 paintPiece 流程） */
function drawPiece(
  g: CanvasRenderingContext2D,
  p: Piece,
  subject: SubjectData,
  slotX: number,
  slotY: number,
  bakeDpr: number
) {
  g.save();
  g.setTransform(bakeDpr, 0, 0, bakeDpr, slotX, slotY);
  outline(g, p);
  g.save();
  g.clip();
  // 源图对应区域（偏移让 core 对齐源图位置）。
  // 优先从原始图源直接采样（缩放到逻辑尺寸一次到位），避免
  // 「先缩小到预览尺寸再放大烘焙」造成的二次重采样发虚。
  if (subject.source) {
    g.drawImage(
      subject.source,
      p.core.x - p.imgX,
      p.core.y - p.imgY,
      subject.width,
      subject.height
    );
  } else {
    g.drawImage(
      subject.canvas,
      p.core.x - p.imgX,
      p.core.y - p.imgY,
      subject.width,
      subject.height
    );
  }
  // 顶部光泽渐变
  const gloss = g.createLinearGradient(0, 0, 0, p.height);
  gloss.addColorStop(0, 'rgba(255,255,255,.20)');
  gloss.addColorStop(0.55, 'rgba(255,255,255,.04)');
  gloss.addColorStop(1, 'rgba(17,32,47,.08)');
  g.fillStyle = gloss;
  g.fillRect(0, 0, p.width, p.height);
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
  g.restore();
}

/**
 * 像素级命中测试：世界坐标 → 块局部 → atlas 像素。
 * local = rotate(world − anchor, −angle) + coreCenter
 */
export function makeAlphaAt(result: AtlasResult) {
  return (piece: Piece, worldX: number, worldY: number): boolean => {
    const ref = piece.atlasRef;
    if (!ref) return false;
    // 快速外接框剔除
    const b = pieceBounds(piece);
    if (
      worldX < b.x ||
      worldX > b.x + b.w ||
      worldY < b.y ||
      worldY > b.y + b.h
    )
      return false;
    const rel = Utils.rotate(worldX - piece.x, worldY - piece.y, -piece.angle);
    const lx = rel.x + piece.core.x + piece.core.width / 2;
    const ly = rel.y + piece.core.y + piece.core.height / 2;
    if (lx < 0 || ly < 0 || lx >= piece.width || ly >= piece.height)
      return false;
    const scaleX = ref.frameW / piece.width;
    const scaleY = ref.frameH / piece.height;
    const ax = ref.frameX + Math.floor(lx * scaleX);
    const ay = ref.frameY + Math.floor(ly * scaleY);
    const page = result.pages[ref.page];
    if (!page || ax < 0 || ay < 0 || ax >= ATLAS_PAGE_SIZE || ay >= ATLAS_PAGE_SIZE)
      return false;
    return page.alpha[ay * ATLAS_PAGE_SIZE + ax] > HIT_ALPHA;
  };
}
