"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayRandomCharacters = exports.launchGameCharacterCreationScreen = void 0;
const Character_1 = __importDefault(require("../Classes/Character"));
const constants_1 = require("../utils/constants");
const formulas_1 = require("../utils/formulas/formulas");
//#region Random generation
function generateRandomStat(keyStat) {
    const [minValue, maxValue, weight] = constants_1.CHARACTER_STATS[keyStat];
    const probas = [];
    for (let i = minValue; i < maxValue; i += weight) {
        probas.push(i);
    }
    return (0, formulas_1.toDecimal)(probas[Math.floor(Math.random() * probas.length)], 2);
}
function generateThreeRandomCharacters() {
    const characters = [];
    for (let i = 0; i < constants_1.NB_RANDOM_CHARACTER; i++) {
        const [speed, strength, intelligence] = [
            generateRandomStat("speed"),
            generateRandomStat("strength"),
            generateRandomStat("intelligence"),
        ];
        const newChar = new Character_1.default({ speed, strength, intelligence });
        characters.push(newChar);
    }
    return characters;
}
//#endregion
function getRandomCharacters() {
    const characters = generateThreeRandomCharacters();
    return characters.reduce((previousDisplay, actualChar) => `${previousDisplay}${actualChar.getDisplayTemplate()}`, "");
}
/**
 * Display characters randomly generated
 */
function displayRandomCharacters() {
    const display = getRandomCharacters();
    const listCharacters = document.getElementById(constants_1.IDS_GAME_DIVS.LIST_CHARACTERS);
    listCharacters.innerHTML = display;
}
exports.displayRandomCharacters = displayRandomCharacters;
/**
 * Gets the HTML file of the end screen and display it inside the DOM
 */
function launchGameCharacterCreationScreen() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("./screens/character-creation.html");
        const htmlContent = yield res.text();
        document.body.innerHTML = htmlContent;
    });
}
exports.launchGameCharacterCreationScreen = launchGameCharacterCreationScreen;
