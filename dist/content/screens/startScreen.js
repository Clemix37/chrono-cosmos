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
exports.launchGameStartScreen = void 0;
const Game_1 = require("../Classes/Game");
const constants_1 = require("../utils/constants");
const startScreenUrl = "./screens/start.html";
/**
 * Gets the HTML file of the start screen and display it in the DOM
 */
function launchGameStartScreen() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(startScreenUrl);
        const htmlContent = yield res.text();
        document.body.innerHTML = htmlContent;
        attachEvents();
    });
}
exports.launchGameStartScreen = launchGameStartScreen;
//#region Events
function attachEvents() {
    attachEventStartScreen();
}
/**
 * Attache events on the game start screen
 * @returns {void}
 */
function attachEventStartScreen() {
    const gameStartDiv = document.getElementById(constants_1.IDS_BTNS_SCREENS.GAME_START.SELECT_CHARACTER);
    if (!gameStartDiv)
        return;
    gameStartDiv.addEventListener("click", () => {
        Game_1.game.changeStatus(constants_1.GameStatus.characterCreation);
    });
}
