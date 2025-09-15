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
    getDisplayTemplate(title = "", emphasizeSpeed = false, emphasizeStrength = false, emphasizeIntelligence = false) {
        return `
            <div class="big-card" aria-label="Character selection">
                <h4>${title}</h4>
                <div class="big-row">
                    <div>
                        <div style="font-size:13px;color:#A8C9FF">Speed</div>
                        <div class="big-value${emphasizeSpeed ? " emphasized" : ""}">${this.speed}</div>
                    </div>
                    <div>
                        <div style="font-size:13px;color:#A8C9FF">Strength</div>
                        <div class="big-value${emphasizeStrength ? " emphasized" : ""}">${this.strength}</div>
                    </div>
                    <div>
                        <div style="font-size:13px;color:#A8C9FF">Intelligence</div>
                        <div class="big-value${emphasizeIntelligence ? " emphasized" : ""}">${this.intelligence}</div>
                    </div>
				    <button data-id="${this.id}" class="${constants_1.CLASSES_GAME.SELECT_CHARACTER} cta">Select</button>
                </div>
            </div>
		`;
    }
}
exports.default = Character;
