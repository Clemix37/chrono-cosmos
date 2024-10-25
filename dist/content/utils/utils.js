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
exports.generateRandomId = exports.hideOtherDivsThan = void 0;
const constants_1 = require("./constants");
/**
 * Hides every game div but the one in parameter
 * @param idDivToShow
 */
const hideOtherDivsThan = (idDivToShow) => {
    const idsDivs = Object.values(constants_1.IDS_GAME_DIVS);
    for (let i = 0; i < idsDivs.length; i++) {
        const id = idsDivs[i];
        const divId = document.getElementById(id);
        if (!divId)
            continue;
        divId.style.display = id === idDivToShow ? "flex" : "none";
    }
};
exports.hideOtherDivsThan = hideOtherDivsThan;
/**
 * Generates a unique id
 * @returns {string}
 */
function generateRandomId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
exports.generateRandomId = generateRandomId;
__exportStar(require("./configs/configs"), exports);
