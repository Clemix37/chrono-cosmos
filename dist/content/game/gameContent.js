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
