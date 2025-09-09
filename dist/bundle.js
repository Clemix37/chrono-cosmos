(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils/utils");
class Character {
    //#endregion
    //#region Constructor
    constructor({ speed, strength, intelligence }) {
        this.id = (0, utils_1.generateRandomId)();
        this.name = constants_1.CHARACTER_PROPS.NAME;
        this.age = constants_1.CHARACTER_PROPS.AGE;
        this.speed = speed;
        this.strength = strength;
        this.intelligence = intelligence;
    }
    //#endregion
    //#region Accessors
    //#endregion
    //#region Public methods
    getDisplayTemplate() {
        return `
			<div class="colonne" style="padding: 5px; width: 200px; border: 1px solid red; border-radius: 8px; margin: 0 10px;">
				<h3>Speed: <em>${this.speed}</em></h3>
				<h3>Strength: <em>${this.strength}</em></h3>
				<h3>Intelligence: <em>${this.intelligence}</em></h3>
				<button data-id="${this.id}" class="${constants_1.CLASSES_GAME.SELECT_CHARACTER}">Select</button>
			</div>
		`;
    }
}
exports.default = Character;

},{"../utils/constants":13,"../utils/utils":18}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formulas_1 = require("../utils/formulas/formulas");
const GameStateManager_1 = __importDefault(require("./GameStateManager"));
class DisplayManager {
    /**
     * Display game contents
     * Display energy
     */
    static display() {
        DisplayManager.displayGameContents();
        DisplayManager.displayMostUsedContents();
        DisplayManager.displayEnergy();
        DisplayManager.displayEnergyPerSecond();
    }
    //#region Game Content
    /**
     * Display game contents available
     * Display most used contents
     * @param components
     * @param resources
     * @returns {void}
     */
    static displayGameContents() {
        DisplayManager.displayMostUsedContents();
        const divListComponents = document.querySelector(".components-list");
        if (!divListComponents)
            return void 0;
        divListComponents.innerHTML = "";
        // Components
        const components = GameStateManager_1.default.components;
        divListComponents.innerHTML += `<div class="mini-header">
                    <h3>Components</h3>
                    <div class="small">${components.filter((c) => c.upgradeCost <= GameStateManager_1.default.energy).length} available</div>
                </div>`;
        const displayComponents = components
            .sort((a, b) => { var _a, _b; return ((_a = a.upgradeCost) !== null && _a !== void 0 ? _a : 0) - ((_b = b.upgradeCost) !== null && _b !== void 0 ? _b : 0); })
            .filter((c) => c.upgradeCost <= GameStateManager_1.default.energy)
            .reduce((prevDisplay, currContent) => `${prevDisplay}${currContent.getHtmlTemplateGameContent(GameStateManager_1.default.energy)}`, ``);
        divListComponents.innerHTML += displayComponents;
        const divListResources = document.querySelector(".resources-list");
        if (!divListResources)
            return void 0;
        // Resources
        const resources = GameStateManager_1.default.resources;
        divListResources.innerHTML = "";
        divListResources.innerHTML += `<div class="mini-header">
                    <h3>Resources</h3>
                    <div class="small">${resources.filter((r) => r.upgradeCost <= GameStateManager_1.default.energy).length} available</div>
                </div>`;
        const displayResources = resources
            .sort((a, b) => { var _a, _b; return ((_a = a.upgradeCost) !== null && _a !== void 0 ? _a : 0) - ((_b = b.upgradeCost) !== null && _b !== void 0 ? _b : 0); })
            .filter((r) => r.upgradeCost <= GameStateManager_1.default.energy)
            .reduce((prevDisplay, currContent) => `${prevDisplay}${currContent.getHtmlTemplateGameContent(GameStateManager_1.default.energy)}`, ``);
        divListResources.innerHTML += displayResources;
    }
    /***
     * Display most used contents
     * @param components
     * @param resources
     */
    static displayMostUsedContents() {
        const componentsOrderedBestLevel = GameStateManager_1.default.components
            .filter((c) => c.level > 0)
            .sort((a, b) => a.level - b.level);
        const resourcesOrderedBestLevel = GameStateManager_1.default.resources
            .filter((r) => r.level > 0)
            .sort((a, b) => a.level - b.level);
        const bottomCards = document.querySelector(".bottom");
        if (!bottomCards)
            return void 0;
        bottomCards.innerHTML = "";
        const addContent = (content, title) => {
            bottomCards.innerHTML += content.getHtmlTemplateGameContentAsBig(GameStateManager_1.default.energy, title);
        };
        if (componentsOrderedBestLevel.length > 0) {
            addContent(componentsOrderedBestLevel[0], "Highest Level Component");
            if (componentsOrderedBestLevel.length > 1)
                addContent(componentsOrderedBestLevel[1], "Second highest Level Component");
        }
        if (resourcesOrderedBestLevel.length > 0) {
            addContent(resourcesOrderedBestLevel[0], "Highest Level Resource");
            if (resourcesOrderedBestLevel.length > 1)
                addContent(resourcesOrderedBestLevel[1], "Second highest Level Resource");
        }
    }
    //#endregion
    //#region Energy
    /**
     * Display the energy given
     */
    static displayEnergy() {
        const energyCounter = document.getElementById("lbl-energy-counter");
        if (!energyCounter)
            return void 0;
        energyCounter.textContent = `${(0, formulas_1.formatEnergy)(GameStateManager_1.default.energy)}⚡`;
    }
    /**
     * Display the number of energy per second generated
     * @returns {void}
     */
    static displayEnergyPerSecond() {
        const divPerSec = document.querySelector("#energy-per-second");
        if (!divPerSec)
            return void 0;
        const totalGain = [...GameStateManager_1.default.components, GameStateManager_1.default.resources]
            .filter((content) => content.level > 0)
            .reduce((acc, content) => acc + content.gainPerSecond * content.level, 0);
        divPerSec.innerHTML = `Energy / second: +${totalGain.toFixed(1)}`;
    }
}
exports.default = DisplayManager;

},{"../utils/formulas/formulas":17,"./GameStateManager":5}],3:[function(require,module,exports){
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

},{"../screens/characterCreationScreen":7,"../screens/endScreen":8,"../screens/playingScreen":9,"../screens/startScreen":10,"../utils/constants":13,"../utils/data/data":15,"../utils/formulas/formulas":17,"../utils/utils":18,"./DisplayManager":2,"./GameContent":4,"./GameStateManager":5,"./Spaceship":6}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const components_json_1 = __importDefault(require("../utils/data/components.json"));
const components_1 = require("../utils/components/components");
const formulas_1 = require("../utils/formulas/formulas");
class GameContent {
    // btn: HTMLButtonElement | null;
    //#endregion
    //#region Constructor
    /**
     * Assign every value of the config in argument
     * @constructor
     * @param config
     */
    constructor(config) {
        var _a;
        this.id = config.id;
        this.name = config.name;
        this.baseCost = config.baseCost;
        this.exponent = config.exponent;
        this.type = config.type;
        this.gainPerSecond = config.gainPerSecond;
        this.level = config.level;
        this.maxLevel = config.maxLevel;
        this.img = config.img;
        this.upgradeCost = (_a = config.upgradeCost) !== null && _a !== void 0 ? _a : config.baseCost;
        this.progressToNext = config.progressToNext;
        this.idBtn = `btn-${this.type}-${this.name.toLowerCase().split(" ").join("-")}`;
    }
    //#endregion
    upgrade() {
        if (this.level + 1 > this.maxLevel)
            return;
        this.level++;
        this.upgradeCost = (0, formulas_1.getCostUpgraded)(this.baseCost, this.exponent, this.level);
    }
    getHtmlTemplateGameContent(energy) {
        return `
            <div class="item-card">
                <div class="item-left">
                    <div class="ico">${this.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="meta">${this.name} • Level ${this.level}</div>
                        <div class="small">+${this.gainPerSecond} /s</div>
                        <div class="small">${this.upgradeCost} ⚡</div>
                    </div>
                </div>
                <button class="upgrade upgrade-btn" id="${this.idBtn}">${this.level > 0 ? "Upgrade" : "Buy"}</button>
            </div>
        `;
    }
    getHtmlTemplateGameContentAsBig(energy, title) {
        return `
            <div class="big-card" aria-label="${title} card">
                <h4>${title}</h4>
                <div class="big-row">
                    <div>
                        <div style="font-size:13px;color:#A8C9FF">${this.name} • level ${this.level}</div>
                        <div class="big-value">+${(this.gainPerSecond * this.level).toFixed(1)} /s</div>
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * Gets the components and returns them as GameContent array
     * @returns {object}
     */
    static getOrCreateGameContent() {
        const gameContent = (0, components_1.getOrCreateComponents)();
        return {
            components: gameContent.components.map((comp) => {
                const compJson = components_json_1.default.components.find((compJson) => compJson.id === comp.id);
                if (!compJson)
                    return new GameContent(comp);
                comp.baseCost = compJson.baseCost;
                comp.exponent = compJson.exponent;
                comp.gainPerSecond = compJson.gainPerSecond;
                comp.img = compJson.img;
                comp.maxLevel = compJson.maxLevel;
                return new GameContent(comp);
            }),
            resources: gameContent.resources.map((res) => {
                const resJson = components_json_1.default.components.find((resJson) => resJson.id === res.id);
                if (!resJson)
                    return new GameContent(res);
                res.baseCost = resJson.baseCost;
                res.exponent = resJson.exponent;
                res.gainPerSecond = resJson.gainPerSecond;
                res.img = resJson.img;
                res.maxLevel = resJson.maxLevel;
                return new GameContent(res);
            }),
        };
    }
}
exports.default = GameContent;

},{"../utils/components/components":11,"../utils/data/components.json":14,"../utils/formulas/formulas":17}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
class GameStateManager {
    //#endregion
    /**
     * Change the current game status
     * @param newStatus
     */
    static changeStatus(newStatus) {
        var _a;
        GameStateManager.config.status = newStatus;
        (_a = GameStateManager.game) === null || _a === void 0 ? void 0 : _a.launchActualScreen();
    }
    /**
     * Upgrade the spaceship
     */
    static upgradeSpaceship() {
        GameStateManager.spaceship.upgrade();
    }
}
//#region Properties
// Configuration of the game
GameStateManager.config = (0, utils_1.getDefaultConfig)();
// Energy of user
GameStateManager.energy = 3;
// Components
GameStateManager.components = [];
// Resources
GameStateManager.resources = [];
exports.default = GameStateManager;

},{"../utils/utils":18}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Spaceship {
    //#endregion
    //#region Constructor
    constructor({ level = 0 }) {
        this.level = level;
    }
    //#endregion
    //#region Methods
    upgrade() {
        this.level++;
    }
}
exports.default = Spaceship;

},{}],7:[function(require,module,exports){
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
exports.generateRandomStat = exports.getCharacterGeneratedById = exports.generateThreeRandomCharacters = exports.displayRandomCharacters = exports.launchGameCharacterCreationScreen = void 0;
const Character_1 = __importDefault(require("../Classes/Character"));
const constants_1 = require("../utils/constants");
const formulas_1 = require("../utils/formulas/formulas");
const characterCreationScreenUrl = "./screens/character-creation.html";
let charactersGenerated = [];
//#region Random generation
function generateRandomStat(keyStat) {
    const [minValue, maxValue, weight] = constants_1.CHARACTER_STATS[keyStat];
    const probas = [];
    for (let i = minValue; i < maxValue; i += weight) {
        probas.push(i);
    }
    return (0, formulas_1.toDecimal)(probas[Math.floor(Math.random() * probas.length)], 2);
}
exports.generateRandomStat = generateRandomStat;
function generateThreeRandomCharacters() {
    charactersGenerated = [];
    for (let i = 0; i < constants_1.NB_RANDOM_CHARACTER; i++) {
        const [speed, strength, intelligence] = [
            generateRandomStat("speed"),
            generateRandomStat("strength"),
            generateRandomStat("intelligence"),
        ];
        const newChar = new Character_1.default({ speed, strength, intelligence });
        charactersGenerated.push(newChar);
    }
    return charactersGenerated;
}
exports.generateThreeRandomCharacters = generateThreeRandomCharacters;
//#endregion
/**
 * Returns the character generated from its id
 * @returns {Character}
 */
function getCharacterGeneratedById(id) {
    return charactersGenerated.find((char) => char.id === id);
}
exports.getCharacterGeneratedById = getCharacterGeneratedById;
function getRandomCharacters() {
    const characters = generateThreeRandomCharacters();
    return characters.reduce((previousDisplay, actualChar) => `${previousDisplay}${actualChar.getDisplayTemplate()}`, "");
}
/**
 * Display characters randomly generated
 */
function displayRandomCharacters() {
    const display = getRandomCharacters();
    const listCharacters = document.getElementById(constants_1.IDS_GAME_DIVS.LIST_CHARACTERS);
    if (!listCharacters)
        return void 0;
    listCharacters.innerHTML = display;
}
exports.displayRandomCharacters = displayRandomCharacters;
/**
 * Gets the HTML file of the end screen and display it inside the DOM
 */
function launchGameCharacterCreationScreen() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(characterCreationScreenUrl);
        const htmlContent = yield res.text();
        document.body.innerHTML = htmlContent;
    });
}
exports.launchGameCharacterCreationScreen = launchGameCharacterCreationScreen;

},{"../Classes/Character":1,"../utils/constants":13,"../utils/formulas/formulas":17}],8:[function(require,module,exports){
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
exports.launchGameEndScreen = void 0;
const endScreenUrl = "./screens/end.html";
/**
 * Gets the HTML file of the end screen and display it inside the DOM
 */
function launchGameEndScreen() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(endScreenUrl);
        const htmlContent = yield res.text();
        document.body.innerHTML = htmlContent;
    });
}
exports.launchGameEndScreen = launchGameEndScreen;

},{}],9:[function(require,module,exports){
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

},{"../Classes/Game":3,"../utils/constants":13}],10:[function(require,module,exports){
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

},{"../Classes/GameStateManager":5,"../utils/constants":13}],11:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultsComponents = exports.getOrCreateComponents = void 0;
const GameContent_1 = __importDefault(require("../../Classes/GameContent"));
const data_1 = require("../data/data");
const resources_json_1 = __importDefault(require("../../utils/data/resources.json"));
const components_json_1 = __importDefault(require("../../utils/data/components.json"));
const constants_1 = require("../constants");
/**
 * Checks if game components exists in localStorage
 * If not, gets the default one
 * Return game components
 * @returns {any}
 */
function getOrCreateComponents() {
    let localComp = (0, data_1.getDataFromLocalStorage)(constants_1.SESSIONS_KEYS.GAME_CONTENT);
    if (!localComp)
        localComp = getDefaultsComponents();
    return localComp;
}
exports.getOrCreateComponents = getOrCreateComponents;
/**
 * Creates the defaults components and returns them
 * @returns {{ components: GameContent[], resources: GameContent[] }}
 */
function getDefaultsComponents() {
    const everyComponents = components_json_1.default.components.map((comp) => new GameContent_1.default(comp));
    const everyResources = resources_json_1.default.resources.map((comp) => new GameContent_1.default(comp));
    const content = {
        components: everyComponents,
        resources: everyResources,
    };
    return content;
}
exports.getDefaultsComponents = getDefaultsComponents;

},{"../../Classes/GameContent":4,"../../utils/data/components.json":14,"../../utils/data/resources.json":16,"../constants":13,"../data/data":15}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultConfig = exports.getOrCreateConfig = void 0;
const constants_1 = require("../constants");
const data_1 = require("../data/data");
/**
 * Create the default config and returns it
 * @returns {IGameConfig}
 */
function getDefaultConfig() {
    const gameConfig = {
        playerName: "",
        level: 0,
        status: "not started",
    };
    return gameConfig;
}
exports.getDefaultConfig = getDefaultConfig;
/**
 * Check if game config exists in localStorage
 * If not, create the default one
 * Save the config
 * Returns it
 * @returns {IGameConfig}
 */
function getOrCreateConfig() {
    let gameConfig = (0, data_1.getDataFromLocalStorage)(constants_1.SESSIONS_KEYS.GAME_CONFIG);
    if (!gameConfig)
        gameConfig = getDefaultConfig();
    saveConfigInLocalStorage(gameConfig);
    return gameConfig;
}
exports.getOrCreateConfig = getOrCreateConfig;
/**
 * Saves the config in parameter in localStorage
 * @param gameConfig
 */
function saveConfigInLocalStorage(gameConfig) {
    localStorage.setItem("gameConfig", JSON.stringify(gameConfig));
}

},{"../constants":13,"../data/data":15}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHARACTER_PROPS = exports.CHARACTER_STATS = exports.CHARACTER_PROPS_STATS = exports.NB_RANDOM_CHARACTER = exports.NUMBERS = exports.SESSIONS_KEYS = exports.COLORS = exports.IDS_BTNS_SCREENS = exports.GameStatus = exports.CLASSES_GAME = exports.IDS_GAME_DIVS = void 0;
exports.IDS_GAME_DIVS = {
    GAME_START: "div-game-start-screen",
    CHARACTER_CREATION: "div-character-creation-screen",
    LIST_CHARACTERS: "div-list-characters",
    DISPLAY_CHAR: "div-display-character",
    GAME_END: "div-game-end-screen",
    GAME: "div-game-content",
};
exports.CLASSES_GAME = {
    SELECT_CHARACTER: "btn-select-character",
};
exports.GameStatus = {
    notStarted: "not started",
    characterCreation: "character creation",
    playing: "playing",
    over: "over",
};
exports.IDS_BTNS_SCREENS = {
    GAME_START: {
        SELECT_CHARACTER: "btn-choose-character-game",
    },
    GAME_END: {
        RESTART: "btnRestartGame",
    },
    GAME: {
        CLEAR_DATA: "btn-clear-data",
    },
};
exports.COLORS = {
    BACKGROUND: "#070707",
    TEXT: "#EFEFEF",
    PRIMARY: "#3E4ED6",
    SECONDARY: "#34D1BF",
    TERTIARY: "#D1345B",
};
exports.SESSIONS_KEYS = {
    GAME_CONFIG: "ccGameConfig",
    GAME_CONTENT: "ccGameContent",
    ENERGY: "ccEnergyCounter",
    GAME_CHAR: "ccGameChar",
    SPACESHIP: "ccSpaceship",
};
exports.NUMBERS = {
    THOUSAND: 1e3,
    MILLION: 1e6,
    BILLION: 1e9,
};
exports.NB_RANDOM_CHARACTER = 3;
exports.CHARACTER_PROPS_STATS = {
    SPEED: "speed",
    STRENGTH: "strength",
    INTELLIGENCE: "intelligence",
};
/**
 * Detailed as follow:
 * 	{ prop: [minValue, maxValue, step] }
 */
exports.CHARACTER_STATS = {
    speed: [1, 3, 0.2],
    strength: [1, 5, 0.4],
    intelligence: [1, 3, 0.1],
};
exports.CHARACTER_PROPS = {
    AGE: 25,
    NAME: "Jack",
};

},{}],14:[function(require,module,exports){
module.exports={
    "components": [
        {
            "id": "comp-spoon",
            "name": "Spoon",
            "type": "component",
            "gainPerSecond": 0.1,
            "baseCost": 3,
            "exponent": 2,
            "level": 0,
            "maxLevel": 10000,
            "img": {
                "url": "spoon.png",
                "width": 50,
                "height": 75
            }
        },
        {
            "id": "comp-cup",
            "name": "Cup",
            "type": "component",
            "gainPerSecond": 0.2,
            "baseCost": 30,
            "exponent": 2.1,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-bowl",
            "name": "Bowl",
            "type": "component",
            "gainPerSecond": 0.5,
            "baseCost": 100,
            "exponent": 2.2,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-plate",
            "name": "Plate",
            "type": "component",
            "gainPerSecond": 1,
            "baseCost": 350,
            "exponent": 2.3,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-tray",
            "name": "Tray",
            "type": "component",
            "gainPerSecond": 2,
            "baseCost": 1000,
            "exponent": 2.4,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-pitcher",
            "name": "Pitcher",
            "type": "component",
            "gainPerSecond": 5,
            "baseCost": 5000,
            "exponent": 2.5,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-cooking-pot",
            "name": "Cooking Pot",
            "type": "component",
            "gainPerSecond": 10,
            "baseCost": 17500,
            "exponent": 2.6,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-oven",
            "name": "Oven",
            "type": "component",
            "gainPerSecond": 20,
            "baseCost": 50000,
            "exponent": 2.7,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-stove",
            "name": "Stove",
            "type": "component",
            "gainPerSecond": 50,
            "baseCost": 200000,
            "exponent": 2.8,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-microwave",
            "name": "Microwave",
            "type": "component",
            "gainPerSecond": 100,
            "baseCost": 750000,
            "exponent": 2.9,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-fridge",
            "name": "Fridge",
            "type": "component",
            "gainPerSecond": 200,
            "baseCost": 2000000,
            "exponent": 3.0,
            "level": 0,
            "maxLevel": 10000
        }
    ]
}

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomFromArray = exports.getDataFromLocalStorage = void 0;
/**
 * Gets data from the localStorage based on key
 * @param key key of the data in localStorage
 * @returns {any|any[]}
 */
const getDataFromLocalStorage = (key) => {
    const data = localStorage === null || localStorage === void 0 ? void 0 : localStorage.getItem(key);
    if (data)
        return JSON.parse(data);
    else
        return null;
};
exports.getDataFromLocalStorage = getDataFromLocalStorage;
/**
 * Get a random element from the array
 * @param arr
 * @returns {T}
 */
function getRandomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
exports.getRandomFromArray = getRandomFromArray;

},{}],16:[function(require,module,exports){
module.exports={
    "resources": [
        {
            "id": "res-water",
            "name": "Water",
            "type": "resource",
            "gainPerSecond": 0.1,
            "baseCost": 3,
            "exponent": 1.2,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-oxygen-tank",
            "name": "Oxygen Tanks",
            "type": "resource",
            "gainPerSecond": 0.5,
            "baseCost": 30,
            "exponent": 1.2,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-space-logs",
            "name": "Space logs",
            "type": "resource",
            "gainPerSecond": 1,
            "baseCost": 100,
            "exponent": 1.2,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-cosmic-dust",
            "name": "Cosmic Dust",
            "type": "resource",
            "gainPerSecond": 1.5,
            "baseCost": 350,
            "exponent": 1.3,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-star-fragments",
            "name": "Star Fragments",
            "type": "resource",
            "gainPerSecond": 2,
            "baseCost": 1000,
            "exponent": 1.3,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-asteroid-minerals",
            "name": "Asteroid Minerals",
            "type": "resource",
            "gainPerSecond": 2.5,
            "baseCost": 5000,
            "exponent": 1.4,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-dark-matter",
            "name": "Dark Matter",
            "type": "resource",
            "gainPerSecond": 3,
            "baseCost": 17500,
            "exponent": 1.4,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-quantum-particles",
            "name": "Quantum Particles",
            "type": "resource",
            "gainPerSecond": 4,
            "baseCost": 50000,
            "exponent": 1.5,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-alien-artifacts",
            "name": "Alien Artifacts",
            "type": "resource",
            "gainPerSecond": 5,
            "baseCost": 200000,
            "exponent": 1.5,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-temporal-energy",
            "name": "Temporal Energy",
            "type": "resource",
            "gainPerSecond": 6,
            "baseCost": 750000,
            "exponent": 1.6,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-stellar-energy",
            "name": "Stellar Energy",
            "type": "resource",
            "gainPerSecond": 7,
            "baseCost": 2000000,
            "exponent": 1.6,
            "level": 0,
            "maxLevel": 10000
        }
    ]
}

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCostUpgraded = exports.formatEnergy = exports.toDecimal = void 0;
const constants_1 = require("../constants");
/**
 * Returns the number with the number of decimal wanted
 * @param nb
 * @param nbDecimal
 * @returns {number}
 */
const toDecimal = (nb, nbDecimal = 2) => {
    return parseFloat(nb.toFixed(nbDecimal));
};
exports.toDecimal = toDecimal;
/**
 * Format the energy given into correct currency
 * @param energy
 * @returns {string}
 */
const formatEnergy = (energy) => {
    if (energy < constants_1.NUMBERS.THOUSAND)
        return `${energy}`;
    if (energy >= constants_1.NUMBERS.BILLION)
        return `${(0, exports.toDecimal)(energy / constants_1.NUMBERS.BILLION, 4)}B`;
    else if (energy >= constants_1.NUMBERS.MILLION)
        return `${(0, exports.toDecimal)(energy / constants_1.NUMBERS.MILLION, 4)}M`;
    else if (energy >= constants_1.NUMBERS.THOUSAND)
        return `${(0, exports.toDecimal)(energy / constants_1.NUMBERS.THOUSAND, 4)}K`;
    else
        return "";
};
exports.formatEnergy = formatEnergy;
/**
 * Calculate the new cost based on base cost, exponent and actual level
 * @param baseCost
 * @param exponent
 * @param level
 * @returns {number}
 */
function getCostUpgraded(baseCost, exponent, level) {
    const resultFormula = baseCost * Math.pow(exponent, (level - 1));
    return Math.ceil(resultFormula);
}
exports.getCostUpgraded = getCostUpgraded;

},{"../constants":13}],18:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomId = exports.hideOtherDivsThan = void 0;
const constants_1 = require("./constants");
/**
 * Hides every game div but the one in parameter
 * @param idDivToShow
 */
const hideOtherDivsThan = (idDivToShow) => {
    const idsDivs = Object.values(constants_1.IDS_GAME_DIVS);
    for (let i = 0; i < idsDivs.length; i++) {
        const id = idsDivs[i];
        const divId = document.getElementById(id);
        if (!divId)
            continue;
        divId.style.display = id === idDivToShow ? "flex" : "none";
    }
};
exports.hideOtherDivsThan = hideOtherDivsThan;
/**
 * Generates a unique id
 * @returns {string}
 */
function generateRandomId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
exports.generateRandomId = generateRandomId;
__exportStar(require("./configs/configs"), exports);

},{"./configs/configs":12,"./constants":13}]},{},[3]);
