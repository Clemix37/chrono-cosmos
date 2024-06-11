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
    let localComp = (0, data_1.getDataFromLocalStorage)(data_1.SESSIONS_KEYS.GAME_CONTENT);
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
