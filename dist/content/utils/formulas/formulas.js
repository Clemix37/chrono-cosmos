"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEnergy = exports.toDecimal = void 0;
const THOUSAND = 1e3;
const MILLION = 1e6;
const BILLION = 1e9;
/**
 * Returns the number with the number of decimal wanted
 * @param nb
 * @param nbDecimal
 * @returns {number}
 */
const toDecimal = (nb, nbDecimal = 2) => {
    return parseFloat(nb.toFixed(nbDecimal));
};
exports.toDecimal = toDecimal;
/**
 * Format the energy given into correct currency
 * @param energy
 * @returns {string}
 */
const formatEnergy = (energy) => {
    if (energy >= THOUSAND)
        return `${(0, exports.toDecimal)(energy / THOUSAND, 4)}K`;
    else if (energy >= MILLION)
        return `${(0, exports.toDecimal)(energy / MILLION, 4)}M`;
    else if (energy >= BILLION)
        return `${(0, exports.toDecimal)(energy / BILLION, 4)}B`;
    return `${energy}`;
};
exports.formatEnergy = formatEnergy;
