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
const playingScreenUrl = "./screens/playing.html";
/**
 * Gets the HTML file playing screen and display it in the DOM
 * @param config
 */
function launchGameScreen(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(playingScreenUrl);
        const htmlContent = yield res.text();
        document.body.innerHTML = htmlContent;
        attachEvents();
    });
}
exports.launchGameScreen = launchGameScreen;
//#region Events
function attachEvents() {
    attachEventClearData();
}
function attachEventClearData() {
    const btnClearData = document.getElementById(constants_1.IDS_BTNS_SCREENS.GAME.CLEAR_DATA);
    if (!btnClearData)
        return;
    btnClearData.addEventListener("click", () => {
        clearInterval(Game_1.game._interval); // Clears the interval so that we can empty localStorage
        Game_1.game.clearDataFromLocalStorage();
        (0, Game_1.recreateGame)();
    });
}
