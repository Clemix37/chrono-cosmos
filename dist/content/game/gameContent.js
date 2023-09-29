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
        gameContent = getDefaultGameContent();
    else {
        gameContent.components = gameContent.components.map((comp) => new GameContent(comp));
        gameContent.resources = gameContent.resources.map((res) => new GameContent(res));
    }
    return gameContent;
};
exports.getOrCreateGameContent = getOrCreateGameContent;
const getDefaultGameContent = () => {
    const waterResourceConfig = resources_json_1.default.resources[0];
    const spoonCompConfig = components_json_1.default.components[0];
    const content = {
        components: [new GameContent(spoonCompConfig)],
        resources: [new GameContent(waterResourceConfig)],
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
        this.upgradeCost = (_a = config.upgradeCost) !== null && _a !== void 0 ? _a : config.baseCost;
        this.progressToNext = config.progressToNext;
        this.idBtn = `btn-${this.type}-${this.name.toLowerCase().split(" ").join("-")}`;
        // if(!!this.idBtn) this.btn = document.getElementById(this.idBtn);
    }
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
