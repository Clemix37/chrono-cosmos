"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateComponents = void 0;
const data_1 = require("../data/data");
const getOrCreateComponents = () => {
    let localComp = (0, data_1.getDataFromLocalStorage)("gameComponents");
    if (!localComp)
        localComp = getDefaultComponents();
    return localComp;
};
exports.getOrCreateComponents = getOrCreateComponents;
const getDefaultComponents = () => {
    const comps = [];
    return comps;
};
