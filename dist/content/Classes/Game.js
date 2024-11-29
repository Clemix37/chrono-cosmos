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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Game_instances, _Game_minDelay, _Game_lastClickDate, _Game_countEverySecond, _Game_displayAndAttachGameContents, _Game_displayGameComponents, _Game_displayEnergy, _Game_displayCurrentCharacter, _Game_attachEvents, _Game_attachAddOneEnergyBtn, _Game_attachCharacterSelectEvent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.recreateGame = exports.game = exports.Game = void 0;
const data_1 = require("../utils/data/data");
const formulas_1 = require("../utils/formulas/formulas");
const utils_1 = require("../utils/utils");
const GameContent_1 = require("./GameContent");
const playingScreen_1 = require("../screens/playingScreen");
const startScreen_1 = require("../screens/startScreen");
const endScreen_1 = require("../screens/endScreen");
const constants_1 = require("../utils/constants");
const characterCreationScreen_1 = require("../screens/characterCreationScreen");
class Game {
    //#endregion
    //#region Constructor
    constructor() {
        var _a, _b;
        _Game_instances.add(this);
        /**
         * Min delay before next click
         */
        _Game_minDelay.set(this, 50);
        /**
         * Date of last click
         */
        _Game_lastClickDate.set(this, void 0);
        this.spaceshipLevel = (0, data_1.getDataFromLocalStorage)(constants_1.SESSIONS_KEYS.SPACESHIP_LEVEL);
        this.energy = (_a = (0, data_1.getDataFromLocalStorage)(constants_1.SESSIONS_KEYS.ENERGY)) !== null && _a !== void 0 ? _a : 3;
        this.config = (0, utils_1.getOrCreateConfig)();
        this.character = (_b = (0, data_1.getDataFromLocalStorage)(constants_1.SESSIONS_KEYS.GAME_CHAR)) !== null && _b !== void 0 ? _b : null;
        const gameContent = (0, GameContent_1.getOrCreateGameContent)();
        this.components = gameContent.components;
        this.resources = gameContent.resources;
        __classPrivateFieldSet(this, _Game_lastClickDate, new Date(), "f");
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
        localStorage.setItem(constants_1.SESSIONS_KEYS.ENERGY, JSON.stringify(this.energy));
        localStorage.setItem(constants_1.SESSIONS_KEYS.GAME_CONFIG, JSON.stringify(this.config));
        localStorage.setItem(constants_1.SESSIONS_KEYS.GAME_CONTENT, JSON.stringify({
            components: this.components,
            resources: this.resources,
        }));
        localStorage.setItem(constants_1.SESSIONS_KEYS.GAME_CHAR, JSON.stringify(this.character));
    }
    /**
     * Remove every item in the local storage
     * So that when reloading, no game already exists
     */
    clearDataFromLocalStorage() {
        localStorage.removeItem(constants_1.SESSIONS_KEYS.ENERGY);
        localStorage.removeItem(constants_1.SESSIONS_KEYS.GAME_CONFIG);
        localStorage.removeItem(constants_1.SESSIONS_KEYS.GAME_CONTENT);
        localStorage.removeItem(constants_1.SESSIONS_KEYS.GAME_CHAR);
    }
    /**
     * Based on the status of the config,
     * 	Launch the screen necessary
     */
    launchActualScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.config.status) {
                case constants_1.GameStatus.notStarted:
                    yield (0, startScreen_1.launchGameStartScreen)();
                    break;
                case constants_1.GameStatus.characterCreation:
                    yield (0, characterCreationScreen_1.launchGameCharacterCreationScreen)();
                    (0, characterCreationScreen_1.displayRandomCharacters)();
                    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachCharacterSelectEvent).call(this);
                    break;
                case constants_1.GameStatus.playing:
                    yield (0, playingScreen_1.launchGameScreen)(this.config);
                    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayAndAttachGameContents).call(this);
                    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachAddOneEnergyBtn).call(this);
                    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayCurrentCharacter).call(this);
                    break;
                case constants_1.GameStatus.over:
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
    upgradeSpaceship() {
        this.spaceshipLevel++;
        // TODO: update some stuff
    }
}
exports.Game = Game;
_Game_minDelay = new WeakMap(), _Game_lastClickDate = new WeakMap(), _Game_instances = new WeakSet(), _Game_countEverySecond = function _Game_countEverySecond() {
    if (!!this._interval)
        clearInterval(this._interval);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
    this._interval = setInterval(() => {
        const gainComponents = this.components.reduce((acc, comp) => acc + comp.level * comp.gainPerSecond, 0);
        const gainResources = this.resources.reduce((acc, res) => acc + res.level * res.gainPerSecond, 0);
        this.energy = (0, formulas_1.toDecimal)(this.energy + gainComponents + gainResources);
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayAndAttachGameContents).call(this);
        this.saveGame();
    }, 1000);
}, _Game_displayAndAttachGameContents = function _Game_displayAndAttachGameContents() {
    if (!!this._interval)
        clearInterval(this._interval);
    this.saveGame();
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameComponents).call(this, [...this.components, ...this.resources].sort((a, b) => { var _a, _b; return ((_a = a.upgradeCost) !== null && _a !== void 0 ? _a : 0) - ((_b = b.upgradeCost) !== null && _b !== void 0 ? _b : 0); }));
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachEvents).call(this);
    if (this.config.status === "playing")
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_countEverySecond).call(this);
}, _Game_displayGameComponents = function _Game_displayGameComponents(contents) {
    const div = document.getElementById("div-game-contents-shop");
    if (!div)
        return;
    const display = contents.reduce((prevDisplay, currContent) => `${prevDisplay}${currContent.getHtmlTemplateGameContent(this.energy)}`, ``);
    div.innerHTML = display;
}, _Game_displayEnergy = function _Game_displayEnergy(ernegy) {
    const energyCounter = document.getElementById("lbl-energy-counter");
    if (!energyCounter)
        return;
    energyCounter.textContent = `${(0, formulas_1.formatEnergy)(ernegy)}⚡`;
}, _Game_displayCurrentCharacter = function _Game_displayCurrentCharacter() {
    var _a, _b, _c;
    const divDisplayChar = document.getElementById(constants_1.IDS_GAME_DIVS.DISPLAY_CHAR);
    divDisplayChar.innerHTML = `<span>Speed: ${(_a = this.character) === null || _a === void 0 ? void 0 : _a.speed}, Strength: ${(_b = this.character) === null || _b === void 0 ? void 0 : _b.strength}, Intelligence: ${(_c = this.character) === null || _c === void 0 ? void 0 : _c.intelligence}</span>`;
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
        const delay = new Date().getTime() - __classPrivateFieldGet(this, _Game_lastClickDate, "f").getTime();
        if (delay < __classPrivateFieldGet(this, _Game_minDelay, "f"))
            return;
        __classPrivateFieldSet(this, _Game_lastClickDate, new Date(), "f");
        this.energy += 1;
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
    });
}, _Game_attachCharacterSelectEvent = function _Game_attachCharacterSelectEvent() {
    const btnSelectChar = document.querySelectorAll(`.${constants_1.CLASSES_GAME.SELECT_CHARACTER}`);
    const auClic = (e) => {
        const id = e.target.dataset.id;
        const char = (0, characterCreationScreen_1.getCharacterGeneratedById)(id);
        this.character = char;
        // Saves the current character selected
        this.saveGame();
        this.changeStatus(constants_1.GameStatus.playing);
    };
    for (let i = 0; i < btnSelectChar.length; i++) {
        const btn = btnSelectChar[i];
        btn.removeEventListener("click", auClic);
        btn.addEventListener("click", auClic);
    }
};
let game;
function recreateGame() {
    exports.game = game = new Game();
    game.init();
}
exports.recreateGame = recreateGame;
recreateGame();
