"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchGameScreen = void 0;
const Game_1 = require("../Classes/Game");
const constants_1 = require("../utils/constants");
// import { changeGameStatus, getGameConfig } from "../gameConfig";
/**
 * Gets the HTML file playing screen and display it in the DOM
 * @param config
 */
function launchGameScreen(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("./screens/playing.html");
        const htmlContent = yield res.text();
        document.body.innerHTML = htmlContent;
        displayPausedGame(config.status === "paused");
        attachEvents();
    });
}
exports.launchGameScreen = launchGameScreen;
/**
 * Based on the parameter, hides / displays the pause button and the resume button
 * @param toDisplay
 * @returns {void}
 */
function displayPausedGame(toDisplay) {
    const btnGamePause = document.getElementById(constants_1.IDS_BTNS_SCREENS.GAME.PAUSE);
    const btnResumeGame = document.getElementById(constants_1.IDS_BTNS_SCREENS.GAME_PAUSED.RESUME);
    if (!btnGamePause || !btnResumeGame)
        return;
    btnGamePause.style.display = toDisplay ? "none" : "block";
    btnResumeGame.style.display = toDisplay ? "block" : "none";
}
//#region Events
function attachEvents() {
    attachEventsPause();
    attachEventsResume();
    attachEventClearData();
}
function attachEventsPause() {
    const btnGamePause = document.getElementById(constants_1.IDS_BTNS_SCREENS.GAME.PAUSE);
    if (!btnGamePause)
        return;
    btnGamePause.addEventListener("click", () => {
        Game_1.game.changeStatus("paused");
    });
}
function attachEventsResume() {
    const btnResumeGame = document.getElementById(constants_1.IDS_BTNS_SCREENS.GAME_PAUSED.RESUME);
    if (!btnResumeGame)
        return;
    btnResumeGame.addEventListener("click", () => {
        Game_1.game.changeStatus("playing");
    });
}
function attachEventClearData() {
    const btnClearData = document.getElementById(constants_1.IDS_BTNS_SCREENS.GAME.CLEAR_DATA);
    if (!btnClearData)
        return;
    btnClearData.addEventListener("click", () => {
        Game_1.game.clearDataFromLocalStorage();
        (0, Game_1.recreateGame)();
    });
}
