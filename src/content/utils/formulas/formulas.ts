
/**
 * Returns the number with the number of decimal wanted
 * @param nb 
 * @param nbDecimal 
 * @returns {number}
 */
export const toDecimal = (nb:number, nbDecimal:number = 2):number => {
    return parseFloat(nb.toFixed(nbDecimal));
};