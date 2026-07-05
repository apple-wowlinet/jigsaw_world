"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieceState = void 0;
/* ---------- 拼块状态机 ---------- */
var PieceState;
(function (PieceState) {
    PieceState[PieceState["FREE"] = 0] = "FREE";
    PieceState[PieceState["HOLDING"] = 1] = "HOLDING";
    PieceState[PieceState["DRAGGING"] = 2] = "DRAGGING";
    PieceState[PieceState["SNAPPING"] = 3] = "SNAPPING";
})(PieceState || (exports.PieceState = PieceState = {}));
