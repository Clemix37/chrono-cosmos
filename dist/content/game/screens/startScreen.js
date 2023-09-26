"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchGameStartScreen = void 0;
const utils_1 = require("../../utils/utils");
const game_1 = require("../game");
const CURRENT_DIV_ID = utils_1.IDS_DIVS.GAME_START;
const launchGameStartScreen = () => {
    (0, utils_1.hideOtherDivsThan)(CURRENT_DIV_ID);
    attachEvents();
};
exports.launchGameStartScreen = launchGameStartScreen;
//#region Events
const attachEvents = () => {
    attachEventGameStart();
};
const attachEventGameStart = () => {
    const gameStartDiv = document.getElementById(CURRENT_DIV_ID);
    if (!gameStartDiv)
        return;
    gameStartDiv.addEventListener("click", () => {
        game_1.game.changeStatus("playing");
    });
};
