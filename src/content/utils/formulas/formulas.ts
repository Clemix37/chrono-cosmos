import { NUMBERS } from "../constants";

/**
 * Returns the number with the number of decimal wanted
 * @param nb
 * @param nbDecimal
 * @returns {number}
 */
export const toDecimal = (nb: number, nbDecimal: number = 2): number => {
	return parseFloat(nb.toFixed(nbDecimal));
};

/**
 * Format the energy given into correct currency
 * @param energy
 * @returns {string}
 */
export const formatEnergy = (energy: number): string => {
	if (energy < NUMBERS.THOUSAND) return `${energy}`;
	if (energy >= NUMBERS.BILLION) return `${toDecimal(energy / NUMBERS.BILLION, 4)}B`;
	else if (energy >= NUMBERS.MILLION) return `${toDecimal(energy / NUMBERS.MILLION, 4)}M`;
	else if (energy >= NUMBERS.THOUSAND) return `${toDecimal(energy / NUMBERS.THOUSAND, 4)}K`;
	else return "";
};

/**
 * Calculate the new cost based on base cost, exponent and actual level
 * @param baseCost
 * @param exponent
 * @param level
 * @returns {number}
 */
export function getCostUpgraded(baseCost: number, exponent: number, level: number): number {
	const resultFormula = baseCost * exponent ** (level - 1);
	return Math.ceil(resultFormula);
}
