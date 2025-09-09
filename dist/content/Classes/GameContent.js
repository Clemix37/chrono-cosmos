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
