"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawEdge = drawEdge;
exports.outline = outline;
exports.buildPieces = buildPieces;
/**
 * Knife —— 切图核心（文档 §3.2，原样移植自 jigsaw-engine.ts）
 * 4 种凸耳 bezier 模板（sock/finger/ball/stub，各 12 控制点）+
 * SHAPE_TABLE/TAB_HOLE 选择表 + 三遍网格切割。
 * drawEdge/outline 保留 Canvas2D 签名，供渲染层 atlas 烘焙使用。
 */
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const types_1 = require("./types");
function mkTemplate(pts, rev, name) {
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
function shapeFor(ord) {
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
function edgeOf(shapeIdx, tabIdx) {
    const shapeOrd = SHAPE_TABLE[shapeIdx % SHAPE_TABLE.length];
    const { template, bend } = shapeFor(shapeOrd);
    const tab = TAB_HOLE[tabIdx % TAB_HOLE.length];
    return { border: false, tab, thick: 0, curves: template, bend };
}
// 凸凹取反（邻居互补）
function flipEdge(e) {
    return { border: false, tab: !e.tab, thick: e.thick, curves: e.curves, bend: !e.bend };
}
function drawEdge(c, e) {
    if (e.border) {
        c.lineTo(e.endX, e.endY);
        return;
    }
    const vertical = e.startX === e.endX;
    const d = vertical
        ? Math.abs(e.startY - e.endY)
        : Math.abs(e.startX - e.endX);
    const pts = e.bend ? e.curves.pts : e.curves.ptsReversed;
    let s, l;
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
    for (let i = 0; i < 12;) {
        const r = pts[i++]; // 控制点
        const a = pts[i++]; // 终点
        let cx, cy, ex, ey;
        if (vertical) {
            cx = e.startX + d * r.fromBase * s;
            cy = e.startY + d * r.alongBase * l;
            ex = e.startX + d * a.fromBase * s;
            ey = e.startY + d * a.alongBase * l;
        }
        else {
            cx = e.startX + d * r.alongBase * l;
            cy = e.startY + d * r.fromBase * s;
            ex = e.startX + d * a.alongBase * l;
            ey = e.startY + d * a.fromBase * s;
        }
        c.quadraticCurveTo(cx, cy, ex, ey);
    }
}
/**
 * 在给定 context 上描绘拼块轮廓路径。
 * offsetX/offsetY 允许把轮廓平移到 atlas 页的任意槽位。
 */
function outline(c, p, offsetX = 0, offsetY = 0) {
    const x = p.core.x + offsetX, y = p.core.y + offsetY, w = p.core.width, h = p.core.height;
    const top = p.edges.top, left = p.edges.left, right = p.edges.right, bottom = p.edges.bottom;
    c.beginPath();
    c.moveTo(x, y);
    // 左边：上→下
    left.startX = x;
    left.startY = y;
    left.endX = x;
    left.endY = y + h;
    left.side = 0;
    drawEdge(c, left);
    // 下边：左→右
    bottom.startX = x;
    bottom.startY = y + h;
    bottom.endX = x + w;
    bottom.endY = y + h;
    bottom.side = 1;
    drawEdge(c, bottom);
    // 右边：下→上
    right.startX = x + w;
    right.startY = y + h;
    right.endX = x + w;
    right.endY = y;
    right.side = 2;
    drawEdge(c, right);
    // 上边：右→左
    top.startX = x + w;
    top.startY = y;
    top.endX = x;
    top.endY = y;
    top.side = 3;
    drawEdge(c, top);
    c.closePath();
}
// 主切图：三遍扫描
function buildPieces(subject, choice, seed) {
    const rng = utils_1.Utils.rng(seed);
    const rows = choice.rows, cols = choice.cols, size = choice.size;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    const list = [];
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
            if (hRem % rows - row > 0)
                h++;
        }
        let x = 0;
        for (let col = 0; col < cols; col++) {
            let w = size;
            const extraW = wRem - wChunk * col - Math.min(col, wRem % cols);
            if (extraW > 0) {
                w += wChunk;
                if (wRem % cols - col > 0)
                    w++;
            }
            const piece = {
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
                state: types_1.PieceState.FREE,
                atlasRef: null,
                neighbors: [],
                edges: {
                    top: {},
                    right: {},
                    bottom: {},
                    left: {},
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
            const top = row === 0, left = col === 0;
            const right = col === cols - 1, bottom = row === rows - 1;
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
                : eRight;
            p.edges.bottom = bottom
                ? { border: true, tab: false, thick: 0, curves: null, bend: false }
                : eBottom;
        }
    }
    // 第二遍半：测量凸耳厚度
    for (const p of list) {
        for (const side of ['top', 'right', 'bottom', 'left']) {
            const e = p.edges[side];
            if (e.border || !e.curves) {
                e.thick = 0;
                continue;
            }
            const pts = e.bend ? e.curves.pts : e.curves.ptsReversed;
            let maxF = 0;
            for (const pt of pts) {
                const a = Math.abs(pt.fromBase);
                if (a > maxF)
                    maxF = a;
            }
            const span = side === 'top' || side === 'bottom' ? p.core.width : p.core.height;
            e.thick = Math.round(maxF * span) + 1;
        }
        p.width = p.edges.left.thick + p.core.width + p.edges.right.thick + constants_1.MARGIN * 2;
        p.height = p.edges.top.thick + p.core.height + p.edges.bottom.thick + constants_1.MARGIN * 2;
        p.core.x = p.edges.left.thick + constants_1.MARGIN;
        p.core.y = p.edges.top.thick + constants_1.MARGIN;
        p.isEdge = p.row === 0 || p.col === 0 || p.row === rows - 1 || p.col === cols - 1;
    }
    // 第三遍：建立邻居引用
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const p = grid[row][col];
            const nb = [];
            if (row > 0)
                nb.push(grid[row - 1][col]);
            if (col < cols - 1)
                nb.push(grid[row][col + 1]);
            if (row < rows - 1)
                nb.push(grid[row + 1][col]);
            if (col > 0)
                nb.push(grid[row][col - 1]);
            p.neighbors = nb;
        }
    }
    return list;
}
