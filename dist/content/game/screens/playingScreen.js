"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchGameScreen = void 0;
const buttons_1 = require("../../utils/configs/buttons/buttons");
const utils_1 = require("../../utils/utils");
const game_1 = require("../game");
// import { changeGameStatus, getGameConfig } from "../gameConfig";
const launchGameScreen = (config) => {
    (0, utils_1.hideOtherDivsThan)(utils_1.IDS_DIVS.GAME);
    displayPausedGame(config.status === "paused");
    attachEvents();
};
exports.launchGameScreen = launchGameScreen;
const displayPausedGame = (toDisplay) => {
    const btnGamePause = document.getElementById(buttons_1.IDS_BTNS_SCREENS.GAME.PAUSE);
    const btnResumeGame = document.getElementById(buttons_1.IDS_BTNS_SCREENS.GAME_PAUSED.RESUME);
    if (!btnGamePause || !btnResumeGame)
        return;
    btnGamePause.style.display = toDisplay ? "none" : "block";
    btnResumeGame.style.display = toDisplay ? "block" : "none";
};
//#region Events
const attachEvents = () => {
    attachEventsPause();
    attachEventsResume();
};
const attachEventsPause = () => {
    const btnGamePause = document.getElementById(buttons_1.IDS_BTNS_SCREENS.GAME.PAUSE);
    if (!btnGamePause)
        return;
    btnGamePause.addEventListener("click", () => {
        game_1.game.changeStatus("paused");
    });
};
const attachEventsResume = () => {
    const btnResumeGame = document.getElementById(buttons_1.IDS_BTNS_SCREENS.GAME_PAUSED.RESUME);
    if (!btnResumeGame)
        return;
    btnResumeGame.addEventListener("click", () => {
        game_1.game.changeStatus("playing");
    });
};
