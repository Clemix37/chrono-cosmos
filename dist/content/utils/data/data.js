"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromLocalStorage = void 0;
const getDataFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    if (data)
        return JSON.parse(data);
    else
        return null;
};
exports.getDataFromLocalStorage = getDataFromLocalStorage;
