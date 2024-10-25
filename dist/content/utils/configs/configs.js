"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultConfig = exports.getOrCreateConfig = void 0;
const constants_1 = require("../constants");
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
exports.getDefaultConfig = getDefaultConfig;
/**
 * Check if game config exists in localStorage
 * If not, create the default one
 * Save the config
 * Returns it
 * @returns {IGameConfig}
 */
function getOrCreateConfig() {
    let gameConfig = (0, data_1.getDataFromLocalStorage)(constants_1.SESSIONS_KEYS.GAME_CONFIG);
    if (!gameConfig)
        gameConfig = getDefaultConfig();
    saveConfigInLocalStorage(gameConfig);
    return gameConfig;
}
exports.getOrCreateConfig = getOrCreateConfig;
/**
 * Saves the config in parameter in localStorage
 * @param gameConfig
 */
function saveConfigInLocalStorage(gameConfig) {
    localStorage.setItem("gameConfig", JSON.stringify(gameConfig));
}
