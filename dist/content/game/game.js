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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Game_instances, _Game_countEverySecond, _Game_displayAndAttachGameContents, _Game_displayGameComponents, _Game_displayEnergy, _Game_attachEvents, _Game_attachAddOneEnergyBtn;
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = exports.Game = void 0;
const data_1 = require("../utils/data/data");
const formulas_1 = require("../utils/formulas/formulas");
const utils_1 = require("../utils/utils");
const gameContent_1 = require("./gameContent");
const playingScreen_1 = require("../screens/playingScreen");
const startScreen_1 = require("../screens/startScreen");
const endScreen_1 = require("../screens/endScreen");
class Game {
    //#endregion
    //#region Constructor
    constructor() {
        var _a;
        _Game_instances.add(this);
        this.energy = (_a = (0, data_1.getDataFromLocalStorage)("energyCounter")) !== null && _a !== void 0 ? _a : 3;
        this.config = (0, utils_1.getOrCreateConfig)();
        const gameContent = (0, gameContent_1.getOrCreateGameContent)();
        this.components = gameContent.components;
        this.resources = gameContent.resources;
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
    }
    //#endregion
    //#region Public methods
    /**
     * Initialize the game
     */
    init() {
        this.launchActualScreen();
    }
    /**
     * Saves the energy, the config, and the contents in the localStorage
     */
    saveGame() {
        localStorage.setItem(data_1.SESSIONS_KEYS.ENERGY, JSON.stringify(this.energy));
        localStorage.setItem(data_1.SESSIONS_KEYS.GAME_CONFIG, JSON.stringify(this.config));
        localStorage.setItem(data_1.SESSIONS_KEYS.GAME_CONTENT, JSON.stringify({
            components: this.components,
            resources: this.resources,
        }));
    }
    /**
     * Remove every item in the local storage
     * So that when reloading, no game already exists
     */
    clearDataFromLocalStorage() {
        localStorage.removeItem(data_1.SESSIONS_KEYS.ENERGY);
        localStorage.removeItem(data_1.SESSIONS_KEYS.GAME_CONFIG);
        localStorage.removeItem(data_1.SESSIONS_KEYS.GAME_CONTENT);
        window.location.reload();
    }
    /**
     * Based on the status of the config,
     * 	Launch the screen necessary
     */
    launchActualScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            const listOfGameStatuses = (0, utils_1.getListOfGameStatus)();
            switch (this.config.status) {
                case listOfGameStatuses.notStarted:
                    yield (0, startScreen_1.launchGameStartScreen)();
                    break;
                case listOfGameStatuses.playing:
                case listOfGameStatuses.paused:
                    yield (0, playingScreen_1.launchGameScreen)(this.config);
                    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayAndAttachGameContents).call(this);
                    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachAddOneEnergyBtn).call(this);
                    break;
                case listOfGameStatuses.over:
                    yield (0, endScreen_1.launchGameEndScreen)();
                    break;
            }
        });
    }
    /**
     * Change the current game status
     * @param newStatus
     */
    changeStatus(newStatus) {
        this.config.status = newStatus;
        this.launchActualScreen();
    }
    /**
     * Gets the game components displayed and gets the next
     * Display them and attach events if necessary
     */
    checkForNewContent() {
        const idsContentAlreadyDisplayed = [
            ...this.resources.map((res) => res.id),
            ...this.components.map((comp) => comp.id),
        ];
        const nextContent = (0, gameContent_1.getNextGameContent)(this.energy, idsContentAlreadyDisplayed);
        if (nextContent.components.length > 0)
            this.components.push(...nextContent.components);
        if (nextContent.resources.length > 0)
            this.resources.push(...nextContent.resources);
        if (nextContent.components.length > 0 || nextContent.resources.length > 0)
            __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayAndAttachGameContents).call(this);
    }
}
exports.Game = Game;
_Game_instances = new WeakSet(), _Game_countEverySecond = function _Game_countEverySecond() {
    if (!!this._interval)
        clearInterval(this._interval);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
    this._interval = setInterval(() => {
        const gainComponents = this.components.reduce((acc, comp) => acc + comp.level * comp.gainPerSecond, 0);
        const gainResources = this.resources.reduce((acc, res) => acc + res.level * res.gainPerSecond, 0);
        this.energy = (0, formulas_1.toDecimal)(this.energy + gainComponents + gainResources);
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
        this.saveGame();
        this.checkForNewContent();
    }, 1000);
}, _Game_displayAndAttachGameContents = function _Game_displayAndAttachGameContents() {
    if (!!this._interval)
        clearInterval(this._interval);
    this.saveGame();
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameComponents).call(this, "components-content", this.components);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameComponents).call(this, "resources-content", this.resources);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachEvents).call(this);
    if (this.config.status === "playing")
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_countEverySecond).call(this);
}, _Game_displayGameComponents = function _Game_displayGameComponents(id, contents) {
    const div = document.getElementById(id);
    if (!div)
        return;
    div.innerHTML = "";
    for (let i = 0; i < contents.length; i++) {
        const comp = contents[i];
        const contentHml = comp.getHtmlTemplateGameContent(this.config.status === "paused");
        div.innerHTML += contentHml;
    }
}, _Game_displayEnergy = function _Game_displayEnergy(ernegy) {
    const energyCounter = document.getElementById("energyCounter");
    if (!energyCounter)
        return;
    energyCounter.textContent = `${(0, formulas_1.formatEnergy)(ernegy)}⚡`;
}, _Game_attachEvents = function _Game_attachEvents() {
    const all = [...this.components, ...this.resources];
    for (let i = 0; i < all.length; i++) {
        const content = all[i];
        if (!content.idBtn)
            continue;
        const btn = document.getElementById(content.idBtn);
        if (!btn)
            continue;
        btn.addEventListener("click", () => {
            const cost = content.upgradeCost || content.baseCost;
            if (cost > this.energy)
                return;
            this.energy = (0, formulas_1.toDecimal)(this.energy - cost);
            __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
            content.upgrade();
            __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayAndAttachGameContents).call(this);
        });
    }
}, _Game_attachAddOneEnergyBtn = function _Game_attachAddOneEnergyBtn() {
    const buttonGame = document.getElementById("button-game");
    if (!buttonGame)
        throw new Error("No button to add one energy in the game");
    buttonGame.addEventListener("click", () => {
        this.energy += 1;
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
    });
};
const game = new Game();
exports.game = game;
game.init();
