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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Game_instances, _Game_minDelay, _Game_lastClickDate, _Game_countEverySecond, _Game_displayAndAttachGameContents, _Game_displayCurrentCharacter, _Game_attachEvents, _Game_attachAddOneEnergyBtn, _Game_attachCharacterSelectEvent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.recreateGame = exports.game = exports.Game = void 0;
const data_1 = require("../utils/data/data");
const formulas_1 = require("../utils/formulas/formulas");
const utils_1 = require("../utils/utils");
const GameContent_1 = __importDefault(require("./GameContent"));
const playingScreen_1 = require("../screens/playingScreen");
const startScreen_1 = require("../screens/startScreen");
const endScreen_1 = require("../screens/endScreen");
const constants_1 = require("../utils/constants");
const characterCreationScreen_1 = require("../screens/characterCreationScreen");
const DisplayManager_1 = __importDefault(require("./DisplayManager"));
const GameStateManager_1 = __importDefault(require("./GameStateManager"));
const Spaceship_1 = __importDefault(require("./Spaceship"));
class Game {
    //#endregion
    //#region Constructor
    constructor() {
        var _a, _b, _c;
        _Game_instances.add(this);
        /**
         * Min delay before next click
         */
        _Game_minDelay.set(this, 50);
        /**
         * Date of last click
         */
        _Game_lastClickDate.set(this, void 0);
        GameStateManager_1.default.spaceship = new Spaceship_1.default((_a = (0, data_1.getDataFromLocalStorage)(constants_1.SESSIONS_KEYS.SPACESHIP)) !== null && _a !== void 0 ? _a : {});
        GameStateManager_1.default.energy = (_b = (0, data_1.getDataFromLocalStorage)(constants_1.SESSIONS_KEYS.ENERGY)) !== null && _b !== void 0 ? _b : 3;
        GameStateManager_1.default.config = (0, utils_1.getOrCreateConfig)();
        GameStateManager_1.default.character = (_c = (0, data_1.getDataFromLocalStorage)(constants_1.SESSIONS_KEYS.GAME_CHAR)) !== null && _c !== void 0 ? _c : null;
        const gameContent = GameContent_1.default.getOrCreateGameContent();
        GameStateManager_1.default.components = gameContent.components;
        GameStateManager_1.default.resources = gameContent.resources;
        __classPrivateFieldSet(this, _Game_lastClickDate, new Date(), "f");
        DisplayManager_1.default.displayEnergy();
        GameStateManager_1.default.game = this;
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
        localStorage.setItem(constants_1.SESSIONS_KEYS.ENERGY, JSON.stringify(GameStateManager_1.default.energy));
        localStorage.setItem(constants_1.SESSIONS_KEYS.GAME_CONFIG, JSON.stringify(GameStateManager_1.default.config));
        localStorage.setItem(constants_1.SESSIONS_KEYS.GAME_CONTENT, JSON.stringify({
            components: GameStateManager_1.default.components,
            resources: GameStateManager_1.default.resources,
        }));
        localStorage.setItem(constants_1.SESSIONS_KEYS.GAME_CHAR, JSON.stringify(GameStateManager_1.default.character));
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
            switch (GameStateManager_1.default.config.status) {
                case constants_1.GameStatus.notStarted:
                    yield (0, startScreen_1.launchGameStartScreen)();
                    break;
                case constants_1.GameStatus.characterCreation:
                    yield (0, characterCreationScreen_1.launchGameCharacterCreationScreen)();
                    (0, characterCreationScreen_1.displayRandomCharacters)();
                    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachCharacterSelectEvent).call(this);
                    break;
                case constants_1.GameStatus.playing:
                    yield (0, playingScreen_1.launchGameScreen)(GameStateManager_1.default.config);
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
}
exports.Game = Game;
_Game_minDelay = new WeakMap(), _Game_lastClickDate = new WeakMap(), _Game_instances = new WeakSet(), _Game_countEverySecond = function _Game_countEverySecond() {
    if (!!this._interval)
        clearInterval(this._interval);
    DisplayManager_1.default.displayEnergy();
    this._interval = setInterval(() => {
        const gainComponents = GameStateManager_1.default.components.reduce((acc, comp) => acc + comp.level * comp.gainPerSecond, 0);
        const gainResources = GameStateManager_1.default.resources.reduce((acc, res) => acc + res.level * res.gainPerSecond, 0);
        GameStateManager_1.default.energy = (0, formulas_1.toDecimal)(GameStateManager_1.default.energy + gainComponents + gainResources);
        DisplayManager_1.default.displayEnergy();
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayAndAttachGameContents).call(this);
        this.saveGame();
    }, 1000); /// ((this.character?.speed ?? 1) + (this.character?.intelligence ?? 1) - (this.character?.strength ?? 1))
}, _Game_displayAndAttachGameContents = function _Game_displayAndAttachGameContents() {
    if (!!this._interval)
        clearInterval(this._interval);
    this.saveGame();
    DisplayManager_1.default.display();
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachEvents).call(this);
    if (GameStateManager_1.default.config.status === "playing")
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_countEverySecond).call(this);
}, _Game_displayCurrentCharacter = function _Game_displayCurrentCharacter() {
    var _a, _b, _c, _d, _e, _f;
    const strengthBar = document.querySelector("#strength-bar");
    const intelligenceBar = document.querySelector("#intelligence-bar");
    const speedBar = document.querySelector("#speed-bar");
    strengthBar.style.width = `${!((_a = GameStateManager_1.default.character) === null || _a === void 0 ? void 0 : _a.strength)
        ? 0
        : (((_b = GameStateManager_1.default.character) === null || _b === void 0 ? void 0 : _b.strength) / constants_1.CHARACTER_STATS.strength[1]) * 100}%`;
    intelligenceBar.style.width = `${!((_c = GameStateManager_1.default.character) === null || _c === void 0 ? void 0 : _c.intelligence)
        ? 0
        : (((_d = GameStateManager_1.default.character) === null || _d === void 0 ? void 0 : _d.intelligence) / constants_1.CHARACTER_STATS.intelligence[1]) * 100}%`;
    speedBar.style.width = `${!((_e = GameStateManager_1.default.character) === null || _e === void 0 ? void 0 : _e.speed)
        ? 0
        : (((_f = GameStateManager_1.default.character) === null || _f === void 0 ? void 0 : _f.speed) / constants_1.CHARACTER_STATS.speed[1]) * 100}%`;
}, _Game_attachEvents = function _Game_attachEvents() {
    const all = [...GameStateManager_1.default.components, ...GameStateManager_1.default.resources];
    for (let i = 0; i < all.length; i++) {
        const content = all[i];
        if (!content.idBtn)
            continue;
        const btn = document.getElementById(content.idBtn);
        if (!btn)
            continue;
        btn.addEventListener("click", () => {
            const cost = content.upgradeCost || content.baseCost;
            if (cost > GameStateManager_1.default.energy)
                return;
            GameStateManager_1.default.energy = (0, formulas_1.toDecimal)(GameStateManager_1.default.energy - cost);
            DisplayManager_1.default.displayEnergy();
            content.upgrade();
            __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayAndAttachGameContents).call(this);
        });
    }
}, _Game_attachAddOneEnergyBtn = function _Game_attachAddOneEnergyBtn() {
    const buttonGame = document.querySelector(".energy-circle");
    if (!buttonGame)
        throw new Error("No button to add one energy in the game");
    buttonGame.addEventListener("click", (e) => {
        if (!e.isTrusted)
            return;
        const delay = new Date().getTime() - __classPrivateFieldGet(this, _Game_lastClickDate, "f").getTime();
        if (delay < __classPrivateFieldGet(this, _Game_minDelay, "f"))
            return;
        __classPrivateFieldSet(this, _Game_lastClickDate, new Date(), "f");
        GameStateManager_1.default.energy += 1;
        DisplayManager_1.default.displayEnergy();
    });
}, _Game_attachCharacterSelectEvent = function _Game_attachCharacterSelectEvent() {
    const btnSelectChar = document.querySelectorAll(`.${constants_1.CLASSES_GAME.SELECT_CHARACTER}`);
    const auClic = (e) => {
        const id = e.target.dataset.id;
        const char = (0, characterCreationScreen_1.getCharacterGeneratedById)(id);
        GameStateManager_1.default.character = char;
        // Saves the current character selected
        this.saveGame();
        GameStateManager_1.default.changeStatus(constants_1.GameStatus.playing);
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
