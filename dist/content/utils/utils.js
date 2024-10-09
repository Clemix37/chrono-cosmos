"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideOtherDivsThan = exports.IDS_DIVS = void 0;
const IDS_GAME_DIVS = {
    GAME_START: "div-game-start-screen",
    GAME_END: "div-game-end-screen",
    GAME: "div-game-content",
};
exports.IDS_DIVS = IDS_GAME_DIVS;
/**
 * Hides every game div but the one in parameter
 * @param idDivToShow
 */
const hideOtherDivsThan = (idDivToShow) => {
    const idsDivs = Object.values(IDS_GAME_DIVS);
    for (let i = 0; i < idsDivs.length; i++) {
        const id = idsDivs[i];
        const divId = document.getElementById(id);
        if (!divId)
            continue;
        divId.style.display = id === idDivToShow ? "flex" : "none";
    }
};
exports.hideOtherDivsThan = hideOtherDivsThan;
__exportStar(require("./configs/configs"), exports);
