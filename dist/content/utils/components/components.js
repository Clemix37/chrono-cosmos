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
