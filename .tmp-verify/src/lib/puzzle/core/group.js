"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
exports.pieceBounds = pieceBounds;
exports.groupBounds = groupBounds;
/**
 * 单块外接框（核心中心为锚点，考虑量化旋转）。
 * 位图相对锚点的局部矩形为 [x0, y0, x0+w, y0+h]（x0/y0 为负的核心中心偏移），
 * 旋转 0/90/180/270 后取轴对齐包围盒 —— 对所有量化角度精确。
 */
function pieceBounds(p) {
    const x0 = -(p.core.x + p.core.width / 2);
    const y0 = -(p.core.y + p.core.height / 2);
    const x1 = x0 + p.width;
    const y1 = y0 + p.height;
    let bx0, by0, bx1, by1;
    switch (((p.angle % 360) + 360) % 360) {
        case 90: // (x,y) -> (-y, x)
            bx0 = -y1;
            by0 = x0;
            bx1 = -y0;
            by1 = x1;
            break;
        case 180: // (x,y) -> (-x, -y)
            bx0 = -x1;
            by0 = -y1;
            bx1 = -x0;
            by1 = -y0;
            break;
        case 270: // (x,y) -> (y, -x)
            bx0 = y0;
            by0 = -x1;
            bx1 = y1;
            by1 = -x0;
            break;
        default:
            bx0 = x0;
            by0 = y0;
            bx1 = x1;
            by1 = y1;
    }
    return { x: p.x + bx0, y: p.y + by0, w: bx1 - bx0, h: by1 - by0 };
}
// 组外接框
function groupBounds(pieces) {
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (const p of pieces) {
        const b = pieceBounds(p);
        if (b.x < minX)
            minX = b.x;
        if (b.y < minY)
            minY = b.y;
        if (b.x + b.w > maxX)
            maxX = b.x + b.w;
        if (b.y + b.h > maxY)
            maxY = b.y + b.h;
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
let _groupSeq = 0;
class Group {
    constructor(pieces) {
        this.id = ++_groupSeq;
        this.pieces = pieces.slice();
        for (const p of this.pieces)
            p.group = this;
    }
    absorb(other) {
        for (const p of other.pieces) {
            if (this.pieces.indexOf(p) === -1)
                this.pieces.push(p);
            p.group = this;
        }
        return this;
    }
}
exports.Group = Group;
