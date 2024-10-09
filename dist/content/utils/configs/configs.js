"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfGameStatus = exports.getOrCreateConfig = void 0;
const data_1 = require("../data/data");
/**
 * Create the default config and returns it
 * @returns {IGameConfig}
 */
function getDefaultConfig() {
    const gameConfig = {
        playerName: "",
        level: 0,
        status: "not started",
    };
    return gameConfig;
}
/**
 * Check if game config exists in localStorage
 * If not, create the default one
 * Save the config
 * Returns it
 * @returns {IGameConfig}
 */
function getOrCreateConfig() {
    let gameConfig = (0, data_1.getDataFromLocalStorage)("gameConfig");
    if (!gameConfig)
        gameConfig = getDefaultConfig();
    saveConfigInLocalStorage(gameConfig);
    return gameConfig;
}
exports.getOrCreateConfig = getOrCreateConfig;
/**
 * Returns the list of game status
 * @returns {object}
 */
function getListOfGameStatus() {
    const list = {
        notStarted: "not started",
        playing: "playing",
        paused: "paused",
        over: "over",
    };
    return list;
}
exports.getListOfGameStatus = getListOfGameStatus;
/**
 * Saves the config in parameter in localStorage
 * @param gameConfig
 */
function saveConfigInLocalStorage(gameConfig) {
    localStorage.setItem("gameConfig", JSON.stringify(gameConfig));
}
