
export const toDecimal = (nb:number, nbDecimal:number = 2):number => {
    return parseFloat(nb.toFixed(nbDecimal));
};