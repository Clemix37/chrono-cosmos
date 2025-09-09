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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchGameStartScreen = void 0;
const GameStateManager_1 = __importDefault(require("../Classes/GameStateManager"));
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
        GameStateManager_1.default.changeStatus(constants_1.GameStatus.characterCreation);
    });
}
