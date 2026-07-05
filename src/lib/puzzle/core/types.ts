/**
 * 拼图核心类型定义
 * Piece 相比原 jigsaw-engine.ts 去掉 canvas/alpha/renderDpr（渲染层职责），
 * 增加 state（FSM）与 atlasRef（图集帧引用）。
 */
import type { Group } from './group';

/* ---------- 切割几何 ---------- */

export interface CtrlPt {
  fromBase: number; // 垂直边线偏移：0=贴边线 正=凸出 负=内凹
  alongBase: number; // 沿边线进度：0=起点 1=终点
}

export interface Template {
  name: string;
  pts: CtrlPt[];
  ptsReversed: CtrlPt[];
}

export interface Edge {
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

/* ---------- 拼块状态机 ---------- */

export enum PieceState {
  FREE = 0, // 空闲，可悬停/拾取
  HOLDING = 1, // 被指针捕获（未超过拖动阈值）
  DRAGGING = 2, // 拖拽中
  SNAPPING = 3, // 吸附回弹动画中
}

/* ---------- 图集帧引用（渲染层烘焙后填充） ---------- */

export interface AtlasRef {
  page: number; // 图集页索引
  frameX: number; // 帧在页内的像素位置
  frameY: number;
  frameW: number; // 帧像素尺寸（= piece 尺寸 × bakeDpr）
  frameH: number;
}

/* ---------- 拼块 ---------- */

export interface Piece {
  id: number;
  row: number;
  col: number;
  imgX: number; // 在源图中的左上角
  imgY: number;
  refX: number; // 在源图中的核心中心（吸附参考点）
  refY: number;
  core: { width: number; height: number; x: number; y: number };
  width: number; // 含凸耳与边距的完整位图尺寸
  height: number;
  x: number; // 世界坐标（核心中心为锚点）
  y: number;
  z: number;
  angle: number; // 量化角度 0/90/180/270
  isEdge: boolean;
  sort: number;
  group: Group | null;
  hasMoved: boolean;
  state: PieceState;
  atlasRef: AtlasRef | null;
  neighbors: Piece[];
  edges: { top: Edge; right: Edge; bottom: Edge; left: Edge };
}

/* ---------- 事件 ---------- */

export interface SnapEvent {
  piece: Piece; // 主动吸附的块
  other: Piece; // 被吸附的邻居
  jointX: number; // 接缝中点（世界坐标）
  jointY: number;
  horizontal: boolean; // 接缝是否为水平方向排列（左右相邻）
}

export interface PuzzleEvents {
  onProgress?: (pct: number) => void;
  onComplete?: () => void;
  onSnap?: (e: SnapEvent) => void;
  onMove?: () => void; // 一次有效拖放（用于步数/自动存档）
}

/* ---------- 存档格式（对齐 jigex v6） ---------- */

export interface SavePieceV6 {
  i: number; // piece id
  x: string; // 归一化 x（toFixed(5)）
  y: string;
  a: number; // 角度
  m: 0 | 1; // hasMoved
  g: number; // group id（0 = 无组）
}

export interface SaveGameV6 {
  v: 6;
  seed: number;
  nop: number;
  rot: boolean; // 旋转模式
  elapsed: number; // 已用秒数
  moves: number;
  pieces: SavePieceV6[];
}

/* ---------- 调试信息 ---------- */

export interface DebugPieceInfo {
  id: number;
  row: number;
  col: number;
  x: number; // 世界坐标（核心中心锚点）
  y: number;
  angle: number;
  width: number; // 完整位图尺寸
  height: number;
  bounds: { x: number; y: number; w: number; h: number }; // 当前角度下轴对齐外接框
  group: number; // 组 id（单块为自身组 id）
  groupSize: number;
  hasMoved: boolean;
}

export interface DebugOverlapPair {
  a: number; // piece id
  b: number; // piece id
  depthX: number; // 不透明区域重叠深度（px）
  depthY: number;
}

export interface PuzzleDebugInfo {
  image: {
    naturalWidth: number; // 原始图片像素尺寸
    naturalHeight: number;
    subjectWidth: number; // 参考图逻辑尺寸（切割基准）
    subjectHeight: number;
    subjectCanvasWidth: number; // 参考图物理画布尺寸（×dpr）
    subjectCanvasHeight: number;
  };
  board: {
    worldWidth: number; // 世界尺寸（散布区）
    worldHeight: number;
    screenWidth: number; // 屏幕/画布尺寸
    screenHeight: number;
    viewScale: number; // 当前视图缩放
    devicePixelRatio: number;
  };
  atlas: {
    pages: number;
    bakeDpr: number;
  };
  pieceCount: number;
  choice: PieceChoice | null;
  pieces: DebugPieceInfo[];
  overlaps: DebugOverlapPair[]; // 实体（不透明）重叠对
  overlapCount: number;
  complete: boolean;
  moves: number;
  percent: number;
}
