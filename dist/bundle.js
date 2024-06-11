(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
var _Game_instances, _Game_countEverySecond, _Game_displayAndAttachGameContents, _Game_displayGameContents, _Game_displayEnergy, _Game_attachEvents;
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
    init() {
        this.launchActualScreen();
    }
    // Save the energy, the config, and the contents in the localStorage
    saveGame() {
        localStorage.setItem("energyCounter", JSON.stringify(this.energy));
        localStorage.setItem("gameConfig", JSON.stringify(this.config));
        localStorage.setItem("gameContent", JSON.stringify({ components: this.components, resources: this.resources }));
    }
    // remove every item in the local storage 
    // So that when reloading, no game already exists
    clearDataFromLocalStorage() {
        localStorage.removeItem("energyCounter");
        localStorage.removeItem("gameConfig");
        localStorage.removeItem("gameContent");
        window.location.reload();
    }
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
                    break;
                case listOfGameStatuses.over:
                    yield (0, endScreen_1.launchGameEndScreen)();
                    break;
            }
        });
    }
    changeStatus(newStatus) {
        this.config.status = newStatus;
        this.launchActualScreen();
    }
    checkForNewContent() {
        const idsContentAlreadyDisplayed = [...this.resources.map(res => res.id), ...this.components.map(comp => comp.id)];
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
    if (!!this._intervalle)
        clearInterval(this._intervalle);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
    this._intervalle = setInterval(() => {
        const gainComponents = this.components.reduce((acc, comp) => acc + (comp.level * comp.gainPerSecond), 0);
        const gainResources = this.resources.reduce((acc, res) => acc + (res.level * res.gainPerSecond), 0);
        this.energy = (0, formulas_1.toDecimal)(this.energy + gainComponents + gainResources);
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
        this.saveGame();
        this.checkForNewContent();
    }, 1000);
}, _Game_displayAndAttachGameContents = function _Game_displayAndAttachGameContents() {
    if (!!this._intervalle)
        clearInterval(this._intervalle);
    this.saveGame();
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameContents).call(this, "components-content", this.components);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameContents).call(this, "resources-content", this.resources);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachEvents).call(this);
    if (this.config.status === "playing")
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_countEverySecond).call(this);
}, _Game_displayGameContents = function _Game_displayGameContents(id, contens) {
    const div = document.getElementById(id);
    if (!div)
        return;
    div.innerHTML = "";
    for (let i = 0; i < contens.length; i++) {
        const comp = contens[i];
        const contentHml = comp.getHtmlTemplateGameContent(this.config.status === "paused");
        div.innerHTML += contentHml;
    }
}, _Game_displayEnergy = function _Game_displayEnergy(ernegy) {
    const energyCounter = document.getElementById("energyCounter");
    if (!energyCounter)
        return;
    energyCounter.textContent = `${ernegy}⚡`;
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
    const buttonGame = document.getElementById("button-game");
    buttonGame.addEventListener("click", () => {
        this.energy += 1;
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
    });
};
const game = new Game();
exports.game = game;
game.init();

},{"../screens/endScreen":3,"../screens/playingScreen":4,"../screens/startScreen":5,"../utils/data/data":10,"../utils/formulas/formulas":12,"../utils/utils":13,"./gameContent":2}],2:[function(require,module,exports){
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _GameContent_instances, _GameContent_upgradeCostWithFormula, _GameContent_getHtmlLine;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextGameContent = exports.getOrCreateGameContent = exports.GameContent = void 0;
const resources_json_1 = __importDefault(require("../utils/data/resources.json"));
const components_json_1 = __importDefault(require("../utils/data/components.json"));
const components_1 = require("../utils/components/components");
const getOrCreateGameContent = () => {
    const gameContent = (0, components_1.getOrCreateComponents)();
    return {
        components: gameContent.components.map((comp) => {
            const compJson = components_json_1.default.components.find(compJson => compJson.id === comp.id);
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
            const resJson = components_json_1.default.components.find(resJson => resJson.id === res.id);
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
};
exports.getOrCreateGameContent = getOrCreateGameContent;
const getDefaultGameContent = () => {
    const firstResourceConfig = resources_json_1.default.resources[0];
    const firstComponentConfig = components_json_1.default.components[0];
    const content = {
        components: [new GameContent(firstComponentConfig)],
        resources: [new GameContent(firstResourceConfig)],
    };
    return content;
};
const getNextGameContent = (energy, ids) => {
    const minEnergy = 1.2 * energy;
    const comps = components_json_1.default.components.filter(comp => comp.baseCost <= minEnergy && !ids.includes(comp.id)).map(comp => new GameContent(comp));
    const res = resources_json_1.default.resources.filter(res => res.baseCost <= minEnergy && !ids.includes(res.id)).map(res => new GameContent(res));
    return {
        components: comps,
        resources: res,
    };
};
exports.getNextGameContent = getNextGameContent;
class GameContent {
    // btn: HTMLButtonElement | null;
    //#endregion
    //#region Constructor
    constructor(config) {
        var _a;
        _GameContent_instances.add(this);
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
        this.upgradeCost = __classPrivateFieldGet(this, _GameContent_instances, "m", _GameContent_upgradeCostWithFormula).call(this);
    }
    getHtmlTemplateGameContent(isPaused) {
        const ligneBtn = isPaused ? "" : `
            <div class="flex height-100 align-items-center">
                <button class="btn btn-primary btn-game-content" id="${this.idBtn}">${this.upgradeCost}</button>
            </div>
        `;
        const isNew = !this.level;
        return __classPrivateFieldGet(this, _GameContent_instances, "m", _GameContent_getHtmlLine).call(this, `
            <div class="flex colonne game-content width-100">
                <div class="flex">
					<div class="flex colonne width-100">
						<div class="flex">
                    		<h1>${isNew ? "<em style='color: var(--tertiary);'>New</em> - " : ""}${this.name} ${isNew ? "" : `(${this.level})`}</h1>
						</div>
						<div class="flex justify-content-center">
							<h3>
								<i class="fa-solid fa-coins icon color-yellow margin-right"></i>
								${this.gainPerSecond}/s
							</h3>
						</div>
					</div>
					<div class="flex colonne width-100">
						${ligneBtn}
					</div>
                </div>
            </div>
        `);
    }
}
exports.GameContent = GameContent;
_GameContent_instances = new WeakSet(), _GameContent_upgradeCostWithFormula = function _GameContent_upgradeCostWithFormula() {
    const formula = this.baseCost * (Math.pow(this.level, this.exponent));
    return Math.ceil(formula);
}, _GameContent_getHtmlLine = function _GameContent_getHtmlLine(content) {
    return `<div class="flex justify-content-center">${content}</div>`;
};

},{"../utils/components/components":6,"../utils/data/components.json":9,"../utils/data/resources.json":11}],3:[function(require,module,exports){
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
/**
 * Gets the HTML file of the end screen and display it inside the DOM
 */
function launchGameEndScreen() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("./screens/end.html");
        const htmlContent = yield res.text();
        document.body.innerHTML = htmlContent;
    });
}
exports.launchGameEndScreen = launchGameEndScreen;

},{}],4:[function(require,module,exports){
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
const buttons_1 = require("../utils/configs/buttons/buttons");
const game_1 = require("../game/game");
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
    attachEventClearData();
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
const attachEventClearData = () => {
    const btnClearData = document.getElementById(buttons_1.IDS_BTNS_SCREENS.GAME.CLEAR_DATA);
    if (!btnClearData)
        return;
    btnClearData.addEventListener("click", () => {
        game_1.game.clearDataFromLocalStorage();
    });
};

},{"../game/game":1,"../utils/configs/buttons/buttons":7}],5:[function(require,module,exports){
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
const buttons_1 = require("../utils/configs/buttons/buttons");
const game_1 = require("../game/game");
/**
 * Gets the HTML file of the start screen and display it in the DOM
 */
function launchGameStartScreen() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("./screens/start.html");
        const htmlContent = yield res.text();
        document.body.innerHTML = htmlContent;
        attachEvents();
    });
}
exports.launchGameStartScreen = launchGameStartScreen;
//#region Events
const attachEvents = () => {
    attachEventGameStart();
};
const attachEventGameStart = () => {
    const gameStartDiv = document.getElementById(buttons_1.IDS_BTNS_SCREENS.GAME_START.LAUNCH);
    if (!gameStartDiv)
        return;
    gameStartDiv.addEventListener("click", () => {
        game_1.game.changeStatus("playing");
    });
};

},{"../game/game":1,"../utils/configs/buttons/buttons":7}],6:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateComponents = void 0;
const gameContent_1 = require("../../game/gameContent");
const data_1 = require("../data/data");
const resources_json_1 = __importDefault(require("../../utils/data/resources.json"));
const components_json_1 = __importDefault(require("../../utils/data/components.json"));
const getOrCreateComponents = () => {
    let localComp = (0, data_1.getDataFromLocalStorage)("gameComponents");
    if (!localComp)
        localComp = getDefaultComponents();
    return localComp;
};
exports.getOrCreateComponents = getOrCreateComponents;
const getDefaultComponents = () => {
    const firstResourceConfig = resources_json_1.default.resources[0];
    const firstComponentConfig = components_json_1.default.components[0];
    const content = {
        components: [new gameContent_1.GameContent(firstComponentConfig)],
        resources: [new gameContent_1.GameContent(firstResourceConfig)],
    };
    return content;
};

},{"../../game/gameContent":2,"../../utils/data/components.json":9,"../../utils/data/resources.json":11,"../data/data":10}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDS_BTNS_SCREENS = void 0;
const IDS_BTNS_SCREENS = {
    GAME_START: {
        LAUNCH: "btn-launch-game",
    },
    GAME_END: {
        RESTART: "btnRestartGame",
    },
    GAME: {
        PAUSE: "btn-pause-game",
        CLEAR_DATA: "btn-clear-data",
    },
    GAME_PAUSED: {
        RESUME: "btn-resume-game",
    },
};
exports.IDS_BTNS_SCREENS = IDS_BTNS_SCREENS;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfGameStatus = exports.getOrCreateConfig = void 0;
const data_1 = require("../data/data");
const getDefaultConfig = () => {
    const gameConfig = {
        playerName: "",
        level: 0,
        status: "not started",
    };
    return gameConfig;
};
const getOrCreateConfig = () => {
    let gameConfig = (0, data_1.getDataFromLocalStorage)("gameConfig");
    if (!gameConfig)
        gameConfig = getDefaultConfig();
    saveConfigInLocalStorage(gameConfig);
    return gameConfig;
};
exports.getOrCreateConfig = getOrCreateConfig;
const getListOfGameStatus = () => {
    const list = {
        notStarted: "not started",
        playing: "playing",
        paused: "paused",
        over: "over",
    };
    return list;
};
exports.getListOfGameStatus = getListOfGameStatus;
const saveConfigInLocalStorage = (gameConfig) => {
    localStorage.setItem("gameConfig", JSON.stringify(gameConfig));
};

},{"../data/data":10}],9:[function(require,module,exports){
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
            "baseCost": 5,
            "exponent": 2.1,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-bowl",
            "name": "Bowl",
            "type": "component",
            "gainPerSecond": 0.5,
            "baseCost": 10,
            "exponent": 2.2,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-plate",
            "name": "Plate",
            "type": "component",
            "gainPerSecond": 1,
            "baseCost": 15,
            "exponent": 2.3,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-tray",
            "name": "Tray",
            "type": "component",
            "gainPerSecond": 2,
            "baseCost": 30,
            "exponent": 2.4,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-pitcher",
            "name": "Pitcher",
            "type": "component",
            "gainPerSecond": 5,
            "baseCost": 50,
            "exponent": 2.5,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-cooking-pot",
            "name": "Cooking Pot",
            "type": "component",
            "gainPerSecond": 10,
            "baseCost": 75,
            "exponent": 2.6,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-oven",
            "name": "Oven",
            "type": "component",
            "gainPerSecond": 20,
            "baseCost": 100,
            "exponent": 2.7,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-stove",
            "name": "Stove",
            "type": "component",
            "gainPerSecond": 50,
            "baseCost": 150,
            "exponent": 2.8,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-microwave",
            "name": "Microwave",
            "type": "component",
            "gainPerSecond": 100,
            "baseCost": 200,
            "exponent": 2.9,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "comp-fridge",
            "name": "Fridge",
            "type": "component",
            "gainPerSecond": 200,
            "baseCost": 300,
            "exponent": 3.0,
            "level": 0,
            "maxLevel": 10000
        }
    ]
}

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomFromArray = exports.getDataFromLocalStorage = void 0;
/**
 * Gets data from the localStorage based on key
 * @param key key of the data in localStorage
 * @returns {any|any[]}
 */
const getDataFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
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

},{}],11:[function(require,module,exports){
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
            "baseCost": 150,
            "exponent": 1.3,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-star-fragments",
            "name": "Star Fragments",
            "type": "resource",
            "gainPerSecond": 2,
            "baseCost": 200,
            "exponent": 1.3,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-asteroid-minerals",
            "name": "Asteroid Minerals",
            "type": "resource",
            "gainPerSecond": 2.5,
            "baseCost": 250,
            "exponent": 1.4,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-dark-matter",
            "name": "Dark Matter",
            "type": "resource",
            "gainPerSecond": 3,
            "baseCost": 300,
            "exponent": 1.4,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-quantum-particles",
            "name": "Quantum Particles",
            "type": "resource",
            "gainPerSecond": 4,
            "baseCost": 400,
            "exponent": 1.5,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-alien-artifacts",
            "name": "Alien Artifacts",
            "type": "resource",
            "gainPerSecond": 5,
            "baseCost": 500,
            "exponent": 1.5,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-temporal-energy",
            "name": "Temporal Energy",
            "type": "resource",
            "gainPerSecond": 6,
            "baseCost": 600,
            "exponent": 1.6,
            "level": 0,
            "maxLevel": 10000
        },
        {
            "id": "res-stellar-energy",
            "name": "Stellar Energy",
            "type": "resource",
            "gainPerSecond": 7,
            "baseCost": 700,
            "exponent": 1.6,
            "level": 0,
            "maxLevel": 10000
        }
    ]
}

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDecimal = void 0;
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

},{}],13:[function(require,module,exports){
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
exports.hideOtherDivsThan = exports.IDS_DIVS = void 0;
const IDS_DIVS = {
    GAME_START: "div-game-start-screen",
    GAME_END: "div-game-end-screen",
    GAME: "div-game-content",
};
exports.IDS_DIVS = IDS_DIVS;
const hideOtherDivsThan = (divIdNotToHide) => {
    const idsDivs = Object.values(IDS_DIVS);
    for (let i = 0; i < idsDivs.length; i++) {
        const id = idsDivs[i];
        const divId = document.getElementById(id);
        if (!divId)
            continue;
        divId.style.display = id === divIdNotToHide ? "flex" : "none";
    }
};
exports.hideOtherDivsThan = hideOtherDivsThan;
__exportStar(require("./configs/configs"), exports);

},{"./configs/configs":8}]},{},[1]);
