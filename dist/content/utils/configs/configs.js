"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfGameStatus = exports.getOrCreateConfig = void 0;
const data_1 = require("../data/data");
const getDefaultConfig = () => {
    const gameConfig = {
        playerName: "",
        level: 0,
        status: "not started",
    };
    return gameConfig;
};
const getOrCreateConfig = () => {
    let gameConfig = (0, data_1.getDataFromLocalStorage)("gameConfig");
    if (!gameConfig)
        gameConfig = getDefaultConfig();
    saveConfigInLocalStorage(gameConfig);
    return gameConfig;
};
exports.getOrCreateConfig = getOrCreateConfig;
const getListOfGameStatus = () => {
    const list = {
        notStarted: "not started",
        playing: "playing",
        paused: "paused",
        over: "over",
    };
    return list;
};
exports.getListOfGameStatus = getListOfGameStatus;
const saveConfigInLocalStorage = (gameConfig) => {
    localStorage.setItem("gameConfig", JSON.stringify(gameConfig));
};
