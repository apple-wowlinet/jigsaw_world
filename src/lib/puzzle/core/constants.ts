/**
 * 拼图引擎全局常量
 * 数值对齐 jigex-prog.js 与原 jigsaw-engine.ts
 */
export const MARGIN = 10; // 拼块位图边距（给凸耳描边留空间）
export const HIT_ALPHA = 24; // 命中测试 alpha 阈值
export const DRAG_THRESHOLD = 3; // 拖动判定阈值（px）
export const SUBJECT_AREA_RATIO = 0.35; // 源图目标占画布面积比
export const SNAP_FACTOR = 0.28; // 吸附阈值 = max(SNAP_MIN, size × SNAP_FACTOR)
export const SNAP_MIN = 18;
export const BOUNDS_PAD = 12; // 组保持在界内的边距
