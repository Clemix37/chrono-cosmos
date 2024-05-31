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
