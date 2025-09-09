export default abstract class ScreenManager {
	//#region Methods

	/**
	 * Gets the game UI div
	 * @returns {HTMLDivElement}
	 */
	static getGameUI(): HTMLDivElement {
		return document.getElementById("game-ui") as HTMLDivElement;
	}

	/**
	 * Display the content as argument in the GAME UI
	 * @param content
	 * @returns {void}
	 */
	static displayOnGameUI(content: string): void {
		ScreenManager.getGameUI().innerHTML = content;
	}

	/**
	 * Change the display of the game UI
	 * @param toDisplay
	 */
	static changeDisplayOfGameUI(toDisplay: boolean = true) {
		ScreenManager.getGameUI().style.display = toDisplay ? "flex" : "none";
	}

	//#endregion
}
