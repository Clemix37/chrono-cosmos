import ISpaceship from "../../interfaces/ISpaceship";

export default class Spaceship implements ISpaceship {
	//#region Properties

	level: number;

	//#endregion

	//#region Constructor

	constructor({ level = 0 }: { level: number }) {
		this.level = level;
	}

	//#endregion

	//#region Methods

	upgrade() {
		this.level++;
	}

	//#endregion
}
