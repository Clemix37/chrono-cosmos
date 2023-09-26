"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDecimal = void 0;
const toDecimal = (nb, nbDecimal = 2) => {
    return parseFloat(nb.toFixed(nbDecimal));
};
exports.toDecimal = toDecimal;
