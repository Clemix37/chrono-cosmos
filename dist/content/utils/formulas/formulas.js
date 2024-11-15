"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCostUpgraded = exports.formatEnergy = exports.toDecimal = void 0;
const constants_1 = require("../constants");
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
    if (energy < constants_1.NUMBERS.THOUSAND)
        return `${energy}`;
    if (energy >= constants_1.NUMBERS.BILLION)
        return `${(0, exports.toDecimal)(energy / constants_1.NUMBERS.BILLION, 4)}B`;
    else if (energy >= constants_1.NUMBERS.MILLION)
        return `${(0, exports.toDecimal)(energy / constants_1.NUMBERS.MILLION, 4)}M`;
    else if (energy >= constants_1.NUMBERS.THOUSAND)
        return `${(0, exports.toDecimal)(energy / constants_1.NUMBERS.THOUSAND, 4)}K`;
    else
        return "";
};
exports.formatEnergy = formatEnergy;
/**
 * Calculate the new cost based on base cost, exponent and actual level
 * @param baseCost
 * @param exponent
 * @param level
 * @returns {number}
 */
function getCostUpgraded(baseCost, exponent, level) {
    const resultFormula = baseCost * Math.pow(exponent, (level - 1));
    return Math.ceil(resultFormula);
}
exports.getCostUpgraded = getCostUpgraded;
