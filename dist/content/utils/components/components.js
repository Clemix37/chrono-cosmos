"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultComponents = exports.getOrCreateComponents = void 0;
const GameContent_1 = require("../../Classes/GameContent");
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
        localComp = getDefaultComponents();
    return localComp;
}
exports.getOrCreateComponents = getOrCreateComponents;
/**
 * Creates the default components and returns them
 * @returns {object}
 */
function getDefaultComponents() {
    const firstResourceConfig = resources_json_1.default.resources[0];
    const firstComponentConfig = components_json_1.default.components[0];
    const content = {
        components: [new GameContent_1.GameContent(firstComponentConfig)],
        resources: [new GameContent_1.GameContent(firstResourceConfig)],
    };
    return content;
}
exports.getDefaultComponents = getDefaultComponents;
