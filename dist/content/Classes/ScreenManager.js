"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScreenManager {
    //#region Methods
    /**
     * Gets the game UI div
     * @returns {HTMLDivElement}
     */
    static getGameUI() {
        return document.getElementById("game-ui");
    }
    /**
     * Display the content as argument in the GAME UI
     * @param content
     * @returns {void}
     */
    static displayOnGameUI(content) {
        ScreenManager.getGameUI().innerHTML = content;
    }
    /**
     * Change the display of the game UI
     * @param toDisplay
     */
    static changeDisplayOfGameUI(toDisplay = true) {
        ScreenManager.getGameUI().style.display = toDisplay ? "flex" : "none";
    }
}
exports.default = ScreenManager;
