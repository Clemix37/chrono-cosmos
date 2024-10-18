"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDisplayOfGameUI = exports.displayOnGameUI = void 0;
/**
 * Gets the game UI div
 * @returns {HTMLDivElement}
 */
function getGameUI() {
    return document.getElementById("game-ui");
}
/**
 * Display the content as argument in the GAME UI
 * @param content
 * @returns {void}
 */
function displayOnGameUI(content) {
    getGameUI().innerHTML = content;
}
exports.displayOnGameUI = displayOnGameUI;
/**
 * Change the display of the game UI
 * @param toDisplay
 */
function changeDisplayOfGameUI(toDisplay = true) {
    getGameUI().style.display = toDisplay ? "flex" : "none";
}
exports.changeDisplayOfGameUI = changeDisplayOfGameUI;
