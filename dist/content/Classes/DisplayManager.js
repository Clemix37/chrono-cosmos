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
