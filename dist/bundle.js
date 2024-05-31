(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Game_instances, _Game_countEverySecond, _Game_displayOnEachFrame, _Game_displayAndAttachGameContents, _Game_displayGameContents, _Game_displayEnergy, _Game_attachEvents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = exports.Game = void 0;
const data_1 = require("../utils/data/data");
const formulas_1 = require("../utils/formulas/formulas");
const utils_1 = require("../utils/utils");
const gameCanvas_1 = __importDefault(require("./gameCanvas"));
const gameContent_1 = require("./gameContent");
const playingScreen_1 = require("./screens/playingScreen");
const startScreen_1 = require("./screens/startScreen");
class Game {
    //#endregion
    //#region Constructor
    constructor() {
        var _a;
        _Game_instances.add(this);
        this.energy = (_a = (0, data_1.getDataFromLocalStorage)("energyCounter")) !== null && _a !== void 0 ? _a : 5;
        this.config = (0, utils_1.getOrCreateConfig)();
        const gameContent = (0, gameContent_1.getOrCreateGameContent)();
        this.components = gameContent.components;
        this.resources = gameContent.resources;
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this, this.energy);
        const configCanvas = {
            id: "canvas",
            width: Math.floor(window.innerWidth - 200),
            height: 300,
            bgColor: "#00c4ff",
        };
        this.canvas = new gameCanvas_1.default(configCanvas);
        window.requestAnimationFrame(() => __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayOnEachFrame).call(this));
    }
    //#endregion
    init() {
        this.launchGameScreen();
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
    launchGameScreen() {
        const listOfGameStatuses = (0, utils_1.getListOfGameStatus)();
        switch (this.config.status) {
            case listOfGameStatuses.notStarted:
                (0, startScreen_1.launchGameStartScreen)();
                break;
            case listOfGameStatuses.playing:
            case listOfGameStatuses.paused:
                (0, playingScreen_1.launchGameScreen)(this.config);
                __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayAndAttachGameContents).call(this);
                break;
            case listOfGameStatuses.over:
                //@todo
                break;
        }
    }
    changeStatus(newStatus) {
        this.config.status = newStatus;
        this.launchGameScreen();
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
}, _Game_displayOnEachFrame = function _Game_displayOnEachFrame() {
    // We display a random component
    this.canvas.displayRandomContent(this.components);
    // We display a random resource
    this.canvas.displayRandomContent(this.resources);
    window.requestAnimationFrame(() => __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayOnEachFrame).call(this));
}, _Game_displayAndAttachGameContents = function _Game_displayAndAttachGameContents() {
    if (!!this._intervalle)
        clearInterval(this._intervalle);
    this.saveGame();
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameContents).call(this, "components-content", this.components);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameContents).call(this, "resources-content", this.resources);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachEvents).call(this);
    if (this.config.status === "playing")
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_countEverySecond).call(this);
    this.canvas.init();
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
};
const game = new Game();
exports.game = game;
game.init();

},{"../utils/data/data":9,"../utils/formulas/formulas":11,"../utils/utils":12,"./gameCanvas":2,"./gameContent":3,"./screens/playingScreen":4,"./screens/startScreen":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../utils/data/data");
class GameCanvas {
    //#endregion
    //#region Constructor
    constructor(config) {
        this.id = config.id;
        this.width = config.width;
        this.height = config.height;
        this.bgColor = config.bgColor;
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext("2d");
    }
    //#endregion
    init() {
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.canvas.style.background = this.bgColor;
    }
    /**
     * Gets a random content
     * Display it above the canvas, and make it fall
     * @param contents
     */
    displayRandomContent(contents) {
        const everyContentWithProbabilities = [];
        contents.forEach(content => {
            for (let i = 0; i < content.level; i++) {
                everyContentWithProbabilities.push(content);
            }
        });
        const randomContent = (0, data_1.getRandomFromArray)(everyContentWithProbabilities);
        if (!(randomContent === null || randomContent === void 0 ? void 0 : randomContent.img))
            return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        const img = new Image();
        img.src = `./img/${randomContent.type}s/${randomContent.img.url}`;
        this.ctx.drawImage(img, Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height), randomContent.img.width, randomContent.img.height);
    }
}
exports.default = GameCanvas;

},{"../utils/data/data":9}],3:[function(require,module,exports){
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
const data_1 = require("../utils/data/data");
const resources_json_1 = __importDefault(require("../utils/data/resources.json"));
const components_json_1 = __importDefault(require("../utils/data/components.json"));
const formulas_1 = require("../utils/formulas/formulas");
const getOrCreateGameContent = () => {
    let gameContent = (0, data_1.getDataFromLocalStorage)("gameContent");
    if (!gameContent)
        return getDefaultGameContent();
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
        // if(!!this.idBtn) this.btn = document.getElementById(this.idBtn);
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
            <div class="ligne">
                <button class="btn btn-primary btn-game-content" id="${this.idBtn}">${this.upgradeCost}</button>
            </div>
        `;
        return __classPrivateFieldGet(this, _GameContent_instances, "m", _GameContent_getHtmlLine).call(this, `
            <div class="colonne game-content">
                <div class="ligne">
                    <h1>Niveau ${this.level}</h1>
                </div>
                <div class="ligne">
                    <span>${this.name}</span>
                </div>
                <div class="ligne">
                    <div class="colonne">
                        <div class="ligne">
                            <span class="game-content-gain"><i class="fa-solid fa-coins icon color-yellow margin-right"></i>${(0, formulas_1.toDecimal)(this.level * this.gainPerSecond)}</span>
                        </div>
                    </div>
                    <div class="colonne">
                        <div class="ligne">
                            <span class="game-content-time"><i class="fa-solid fa-clock icon color-light-blue margin-right"></i>1s</span>
                        </div>
                    </div>
                </div>
                ${ligneBtn}
            </div>
        `);
    }
}
exports.GameContent = GameContent;
_GameContent_instances = new WeakSet(), _GameContent_upgradeCostWithFormula = function _GameContent_upgradeCostWithFormula() {
    const formula = this.baseCost * (Math.pow(this.level, this.exponent));
    return Math.ceil(formula);
}, _GameContent_getHtmlLine = function _GameContent_getHtmlLine(content) {
    return `<div class="ligne">${content}</div>`;
};

},{"../utils/data/components.json":8,"../utils/data/data":9,"../utils/data/resources.json":10,"../utils/formulas/formulas":11}],4:[function(require,module,exports){
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
    const btnClearData = document.getElementById("btnClearData");
    if (!btnClearData)
        return;
    btnClearData.addEventListener("click", () => {
        game_1.game.clearDataFromLocalStorage();
    });
};

},{"../../utils/configs/buttons/buttons":6,"../../utils/utils":12,"../game":1}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchGameStartScreen = void 0;
const utils_1 = require("../../utils/utils");
const game_1 = require("../game");
const CURRENT_DIV_ID = utils_1.IDS_DIVS.GAME_START;
const launchGameStartScreen = () => {
    (0, utils_1.hideOtherDivsThan)(CURRENT_DIV_ID);
    attachEvents();
};
exports.launchGameStartScreen = launchGameStartScreen;
//#region Events
const attachEvents = () => {
    attachEventGameStart();
};
const attachEventGameStart = () => {
    const gameStartDiv = document.getElementById(CURRENT_DIV_ID);
    if (!gameStartDiv)
        return;
    gameStartDiv.addEventListener("click", () => {
        game_1.game.changeStatus("playing");
    });
};

},{"../../utils/utils":12,"../game":1}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDS_BTNS_SCREENS = void 0;
const IDS_BTNS_SCREENS = {
    GAME_START: {
        LAUNCH: "btnLaunchGame",
    },
    GAME_END: {
        RESTART: "btnRestartGame",
    },
    GAME: {
        PAUSE: "btn-pause-game",
    },
    GAME_PAUSED: {
        RESUME: "btn-resume-game",
    },
};
exports.IDS_BTNS_SCREENS = IDS_BTNS_SCREENS;

},{}],7:[function(require,module,exports){
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

},{"../data/data":9}],8:[function(require,module,exports){
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
        }
    ]
}

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomFromArray = exports.getDataFromLocalStorage = void 0;
/**
 * Gets data from the localStorage based on key
 * @param key key of the data in localStorage
 * @returns {any}
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

},{}],10:[function(require,module,exports){
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
        }
    ]
}

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDecimal = void 0;
const toDecimal = (nb, nbDecimal = 2) => {
    return parseFloat(nb.toFixed(nbDecimal));
};
exports.toDecimal = toDecimal;

},{}],12:[function(require,module,exports){
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
    GAME_START: "gameStartScreen",
    GAME_END: "gameEndScreen",
    GAME: "gameContent",
};
exports.IDS_DIVS = IDS_DIVS;
const hideOtherDivsThan = (divIdNotToHide) => {
    const idsDivs = Object.values(IDS_DIVS);
    for (let i = 0; i < idsDivs.length; i++) {
        const id = idsDivs[i];
        const divId = document.getElementById(id);
        if (!divId)
            continue;
        divId.style.display = id === divIdNotToHide ? "block" : "none";
    }
};
exports.hideOtherDivsThan = hideOtherDivsThan;
__exportStar(require("./configs/configs"), exports);

},{"./configs/configs":7}]},{},[1]);
