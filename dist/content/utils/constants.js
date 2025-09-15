"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHARACTER_PROPS = exports.CHARACTER_STATS = exports.CHARACTER_PROPS_STATS = exports.NB_RANDOM_CHARACTER = exports.NUMBERS = exports.SESSIONS_KEYS = exports.COLORS = exports.IDS_BTNS_SCREENS = exports.GameStatus = exports.CLASSES_GAME = exports.IDS_GAME_DIVS = void 0;
exports.IDS_GAME_DIVS = {
    GAME_START: "div-game-start-screen",
    CHARACTER_CREATION: "div-character-creation-screen",
    LIST_CHARACTERS: "list-characters-generated",
    DISPLAY_CHAR: "div-display-character",
    GAME_END: "div-game-end-screen",
    GAME: "div-game-content",
};
exports.CLASSES_GAME = {
    SELECT_CHARACTER: "btn-select-character",
};
exports.GameStatus = {
    notStarted: "not started",
    characterCreation: "character creation",
    playing: "playing",
    over: "over",
};
exports.IDS_BTNS_SCREENS = {
    GAME_START: {
        SELECT_CHARACTER: "btn-choose-character-game",
    },
    GAME_END: {
        RESTART: "btnRestartGame",
    },
    GAME: {
        CLEAR_DATA: "btn-clear-data",
    },
};
exports.COLORS = {
    BACKGROUND: "#070707",
    TEXT: "#EFEFEF",
    PRIMARY: "#3E4ED6",
    SECONDARY: "#34D1BF",
    TERTIARY: "#D1345B",
};
exports.SESSIONS_KEYS = {
    GAME_CONFIG: "ccGameConfig",
    GAME_CONTENT: "ccGameContent",
    ENERGY: "ccEnergyCounter",
    GAME_CHAR: "ccGameChar",
    SPACESHIP: "ccSpaceship",
};
exports.NUMBERS = {
    THOUSAND: 1e3,
    MILLION: 1e6,
    BILLION: 1e9,
};
exports.NB_RANDOM_CHARACTER = 3;
exports.CHARACTER_PROPS_STATS = {
    SPEED: "speed",
    STRENGTH: "strength",
    INTELLIGENCE: "intelligence",
};
/**
 * Detailed as follow:
 * 	{ prop: [minValue, maxValue, step] }
 */
exports.CHARACTER_STATS = {
    speed: [1, 3, 0.2],
    strength: [1, 5, 0.4],
    intelligence: [1, 3, 0.1],
};
exports.CHARACTER_PROPS = {
    AGE: 25,
    NAME: "Jack",
};
