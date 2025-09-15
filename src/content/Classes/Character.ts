import ICharacter from "../../interfaces/ICharacter";
import { CHARACTER_PROPS, CLASSES_GAME } from "../utils/constants";
import { generateRandomId } from "../utils/utils";

export default class Character implements ICharacter {
	//#region Properties

	id: string;
	name: string;
	age: number;
	speed: number;
	strength: number;
	intelligence: number;

	//#endregion

	//#region Constructor

	constructor({ speed, strength, intelligence }: { speed: number; strength: number; intelligence: number }) {
		this.id = generateRandomId();
		this.name = CHARACTER_PROPS.NAME;
		this.age = CHARACTER_PROPS.AGE;
		this.speed = speed;
		this.strength = strength;
		this.intelligence = intelligence;
	}

	//#endregion

	//#region Accessors

	//#endregion

	//#region Public methods

	getDisplayTemplate(): string {
		return `
            <div class="big-card" aria-label="Character selection">
                <h4>Character</h4>
                <div class="big-row">
                    <div>
                        <div style="font-size:13px;color:#A8C9FF">Speed</div>
                        <div class="big-value">${this.speed}</div>
                    </div>
                    <div>
                        <div style="font-size:13px;color:#A8C9FF">Strength</div>
                        <div class="big-value">${this.strength}</div>
                    </div>
                    <div>
                        <div style="font-size:13px;color:#A8C9FF">Intelligence</div>
                        <div class="big-value">${this.intelligence}</div>
                    </div>
				    <button data-id="${this.id}" class="${CLASSES_GAME.SELECT_CHARACTER} cta">Select</button>
                </div>
            </div>
		`;
	}

	//#endregion

	//#region Private methods

	//#endregion
}
