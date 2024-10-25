"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils/utils");
class Character {
    //#endregion
    //#region Constructor
    constructor({ speed, strength, intelligence }) {
        this.id = (0, utils_1.generateRandomId)();
        this.name = constants_1.CHARACTER_PROPS.NAME;
        this.age = constants_1.CHARACTER_PROPS.AGE;
        this.speed = speed;
        this.strength = strength;
        this.intelligence = intelligence;
    }
    //#endregion
    //#region Accessors
    //#endregion
    //#region Public methods
    getDisplayTemplate() {
        return `
			<div class="colonne" style="padding: 5px; width: 200px; border: 1px solid red; border-radius: 8px; margin: 0 10px;">
				<h3>Speed: <em>${this.speed}</em></h3>
				<h3>Strength: <em>${this.strength}</em></h3>
				<h3>Intelligence: <em>${this.intelligence}</em></h3>
				<button data-id="${this.id}" class="btn btn-primary ${constants_1.CLASSES_GAME.SELECT_CHARACTER}">Select</button>
			</div>
		`;
    }
}
exports.default = Character;
