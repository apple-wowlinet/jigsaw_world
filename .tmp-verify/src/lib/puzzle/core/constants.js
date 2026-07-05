"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOUNDS_PAD = exports.SNAP_MIN = exports.SNAP_FACTOR = exports.SUBJECT_AREA_RATIO = exports.DRAG_THRESHOLD = exports.HIT_ALPHA = exports.MARGIN = void 0;
/**
 * 拼图引擎全局常量
 * 数值对齐 jigex-prog.js 与原 jigsaw-engine.ts
 */
exports.MARGIN = 10; // 拼块位图边距（给凸耳描边留空间）
exports.HIT_ALPHA = 24; // 命中测试 alpha 阈值
exports.DRAG_THRESHOLD = 3; // 拖动判定阈值（px）
exports.SUBJECT_AREA_RATIO = 0.35; // 源图目标占画布面积比
exports.SNAP_FACTOR = 0.28; // 吸附阈值 = max(SNAP_MIN, size × SNAP_FACTOR)
exports.SNAP_MIN = 18;
exports.BOUNDS_PAD = 12; // 组保持在界内的边距
