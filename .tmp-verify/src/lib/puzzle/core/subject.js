"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = void 0;
exports.optimizeSubjectSize = optimizeSubjectSize;
exports.computeChoices = computeChoices;
/**
 * Subject —— 源图缩放 + computeChoices 档位 + 尺寸优化
 */
const constants_1 = require("./constants");
const scatter_1 = require("./scatter");
function drawScaled(img, w, h) {
    const dpr = typeof window !== 'undefined'
        ? Math.min(window.devicePixelRatio || 1, 2)
        : 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
}
exports.Subject = {
    // 自动尺寸：面积驱动（目标 ≈ 35% 画布面积；单边 ≤ 65%）
    create(img, boardW, boardH) {
        const natW = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
        const natH = img instanceof HTMLImageElement ? img.naturalHeight : img.height;
        const boardArea = boardW * boardH;
        let w = natW, h = natH;
        const MAX_SIDE = 0.65;
        let scale = 1;
        while ((w * h) / boardArea > constants_1.SUBJECT_AREA_RATIO ||
            w > boardW * MAX_SIDE ||
            h > boardH * MAX_SIDE) {
            scale -= 0.01;
            w = Math.round(natW * scale);
            h = Math.round(natH * scale);
            if (scale < 0.05)
                break;
        }
        return exports.Subject.createSized(img, Math.max(40, w), Math.max(40, h));
    },
    // 指定逻辑尺寸创建（供优化器使用）
    createSized(img, w, h) {
        return { canvas: drawScaled(img, w, h), width: w, height: h, source: img };
    },
};
/**
 * subject 尺寸优化：给定档位（rows/cols）与画布，在 [1.0, 0.55] 区间尝试
 * 缩放因子，最大化「块尺寸 × 初始视图缩放」——
 * 世界扩容越多 fitWorld 缩得越狠，块在屏幕上反而更小；
 * 适度缩小 subject 让散布不扩容（或少扩容），块的最终视觉尺寸更大。
 */
function optimizeSubjectSize(baseW, baseH, choice, boardW, boardH) {
    let best = null;
    for (let f = 1; f >= 0.55; f -= 0.05) {
        const w = Math.round(baseW * f);
        const h = Math.round(baseH * f);
        const size = Math.floor(Math.min(w / choice.cols, h / choice.rows));
        if (size < 24)
            break;
        // 近似最大块外接：核心 + 双侧凸耳（34.5%）+ 双侧 MARGIN
        const box = Math.ceil(size * 1.7) + 22;
        const world = (0, scatter_1.capacityForBoxes)(boardW, boardH, w, h, box, box, choice.nop);
        const fit = Math.min(1, boardW / world.W, boardH / world.H);
        const score = size * fit;
        // 迭代从大到小，仅严格更优才替换 → 平分时保留更大的 subject
        if (!best || score > best.score + 0.5) {
            best = { width: w, height: h, size, score };
        }
    }
    return best ?? {
        width: baseW,
        height: baseH,
        size: Math.floor(Math.min(baseW / choice.cols, baseH / choice.rows)),
    };
}
// 可选档位（文档 §3.2.1）
// 先穷举全部有效网格（size 从 min/3 递减到 24px），再在 log(nop) 空间取
// ~10 个均匀档位 —— 大图可达 1000+ 块，与 jigex 的档位跨度一致。
function computeChoices(subject) {
    const w = subject.width, h = subject.height;
    const all = [];
    const seen = new Set();
    let size = Math.floor(Math.min(w, h) / 3);
    let lastSize = Infinity;
    let guard = 0;
    while (size > 24 && size < lastSize && guard < 200) {
        guard++;
        lastSize = size;
        const rows = Math.max(2, Math.floor(h / size));
        const cols = Math.max(2, Math.floor(w / size));
        const nop = rows * cols;
        if (nop >= 6 && !seen.has(nop)) {
            seen.add(nop);
            all.push({ nop, rows, cols, size });
        }
        const sR = Math.floor(h / (rows + 1));
        const sC = Math.floor(w / (cols + 1));
        size = Math.max(sR, sC);
    }
    all.sort((a, b) => a.nop - b.nop);
    if (all.length <= 10)
        return all;
    // log 空间均匀抽样，首尾必留
    const result = [];
    const lo = Math.log(all[0].nop);
    const hi = Math.log(all[all.length - 1].nop);
    const N = 10;
    let cursor = 0;
    for (let i = 0; i < N; i++) {
        const target = Math.exp(lo + ((hi - lo) * i) / (N - 1));
        while (cursor < all.length - 1 &&
            Math.abs(all[cursor + 1].nop - target) <= Math.abs(all[cursor].nop - target))
            cursor++;
        if (!result.includes(all[cursor]))
            result.push(all[cursor]);
    }
    return result;
}
