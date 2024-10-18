/**
 * Gets the game UI div
 * @returns {HTMLDivElement}
 */
function getGameUI(): HTMLDivElement {
	return document.getElementById("game-ui") as HTMLDivElement;
}

/**
 * Display the content as argument in the GAME UI
 * @param content
 * @returns {void}
 */
function displayOnGameUI(content: string): void {
	getGameUI().innerHTML = content;
}

/**
 * Change the display of the game UI
 * @param toDisplay
 */
function changeDisplayOfGameUI(toDisplay: boolean = true) {
	getGameUI().style.display = toDisplay ? "flex" : "none";
}

export { displayOnGameUI, changeDisplayOfGameUI };
