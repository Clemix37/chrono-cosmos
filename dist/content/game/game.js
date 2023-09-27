"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Game_instances, _Game_countEverySecond, _Game_displayGameContents, _Game_displayComponents, _Game_displayResources, _Game_displayEnergy, _Game_attachEvents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = exports.Game = void 0;
const data_1 = require("../utils/data/data");
const formulas_1 = require("../utils/formulas/formulas");
const utils_1 = require("../utils/utils");
const gameContent_1 = require("./gameContent");
const playingScreen_1 = require("./screens/playingScreen");
const startScreen_1 = require("./screens/startScreen");
class Game {
    constructor() {
        var _a;
        _Game_instances.add(this);
        this.energy = (_a = (0, data_1.getDataFromLocalStorage)("energyCounter")) !== null && _a !== void 0 ? _a : 0;
        this.config = (0, utils_1.getOrCreateConfig)();
        const gameContent = (0, gameContent_1.getOrCreateGameContent)();
        this.components = gameContent.components;
        this.resources = gameContent.resources;
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this);
    }
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
                __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameContents).call(this);
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
            __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameContents).call(this);
    }
}
exports.Game = Game;
_Game_instances = new WeakSet(), _Game_countEverySecond = function _Game_countEverySecond() {
    if (!!this._intervalle)
        clearInterval(this._intervalle);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this);
    this._intervalle = setInterval(() => {
        const gainComponents = this.components.reduce((acc, comp) => acc + (comp.level * comp.gainPerSecond), 0);
        const gainResources = this.resources.reduce((acc, res) => acc + (res.level * res.gainPerSecond), 0);
        this.energy = (0, formulas_1.toDecimal)(this.energy + gainComponents + gainResources);
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this);
        this.saveGame();
        this.checkForNewContent();
    }, 1000);
}, _Game_displayGameContents = function _Game_displayGameContents() {
    if (!!this._intervalle)
        clearInterval(this._intervalle);
    this.saveGame();
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayComponents).call(this);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayResources).call(this);
    __classPrivateFieldGet(this, _Game_instances, "m", _Game_attachEvents).call(this);
    if (this.config.status === "playing")
        __classPrivateFieldGet(this, _Game_instances, "m", _Game_countEverySecond).call(this);
}, _Game_displayComponents = function _Game_displayComponents() {
    const ID_DIV_COMPS = "components-content";
    const div = document.getElementById(ID_DIV_COMPS);
    if (!div)
        return;
    div.innerHTML = "";
    for (let i = 0; i < this.components.length; i++) {
        const comp = this.components[i];
        const contentHml = comp.getHtmlTemplateGameContent(this.config.status === "paused");
        div.innerHTML += contentHml;
    }
}, _Game_displayResources = function _Game_displayResources() {
    const ID_DIV_RESOURCES = "resources-content";
    const div = document.getElementById(ID_DIV_RESOURCES);
    if (!div)
        return;
    div.innerHTML = "";
    for (let i = 0; i < this.resources.length; i++) {
        const res = this.resources[i];
        const contentHml = res.getHtmlTemplateGameContent(this.config.status === "paused");
        div.innerHTML += contentHml;
    }
}, _Game_displayEnergy = function _Game_displayEnergy() {
    const energyCounter = document.getElementById("energyCounter");
    if (!energyCounter)
        return;
    energyCounter.textContent = `${this.energy}⚡`;
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
            __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayEnergy).call(this);
            content.upgrade();
            __classPrivateFieldGet(this, _Game_instances, "m", _Game_displayGameContents).call(this);
        });
    }
};
const game = new Game();
exports.game = game;
game.init();
