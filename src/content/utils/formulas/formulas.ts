const THOUSAND = 1e3;
const MILLION = 1e6;
const BILLION = 1e9;

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
	if (energy < THOUSAND) return `${energy}`;
	if (energy >= BILLION) return `${toDecimal(energy / BILLION, 4)}B`;
	else if (energy >= MILLION) return `${toDecimal(energy / MILLION, 4)}M`;
	else if (energy >= THOUSAND) return `${toDecimal(energy / THOUSAND, 4)}K`;
	else return "";
};
