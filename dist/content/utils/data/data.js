"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomFromArray = exports.getDataFromLocalStorage = exports.SESSIONS_KEYS = void 0;
exports.SESSIONS_KEYS = {
    GAME_CONFIG: "gameConfig",
    GAME_CONTENT: "gameContent",
    ENERGY: "energyCounter",
};
/**
 * Gets data from the localStorage based on key
 * @param key key of the data in localStorage
 * @returns {any|any[]}
 */
const getDataFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    if (data)
        return JSON.parse(data);
    else
        return null;
};
exports.getDataFromLocalStorage = getDataFromLocalStorage;
/**
 * Get a random element from the array
 * @param arr
 * @returns {T}
 */
function getRandomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
exports.getRandomFromArray = getRandomFromArray;
