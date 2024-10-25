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
			<div class="colonne" style="padding: 5px; width: 200px; border: 1px solid red; border-radius: 8px; margin: 0 10px;">
				<h3>Speed: <em>${this.speed}</em></h3>
				<h3>Strength: <em>${this.strength}</em></h3>
				<h3>Intelligence: <em>${this.intelligence}</em></h3>
				<button data-id="${this.id}" class="btn btn-primary ${CLASSES_GAME.SELECT_CHARACTER}">Select</button>
			</div>
		`;
	}

	//#endregion

	//#region Private methods

	//#endregion
}
