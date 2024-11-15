import { game } from "../Classes/Game";
import { IDS_BTNS_SCREENS, GameStatus } from "../utils/constants";

const startScreenUrl = "./screens/start.html";

/**
 * Gets the HTML file of the start screen and display it in the DOM
 */
async function launchGameStartScreen(): Promise<void> {
	const res = await fetch(startScreenUrl);
	const htmlContent = await res.text();
	document.body.innerHTML = htmlContent;
	attachEvents();
}

//#region Events

function attachEvents(): void {
	attachEventStartScreen();
}

/**
 * Attache events on the game start screen
 * @returns {void}
 */
function attachEventStartScreen(): void {
	const gameStartDiv = document.getElementById(IDS_BTNS_SCREENS.GAME_START.SELECT_CHARACTER);
	if (!gameStartDiv) return;
	gameStartDiv.addEventListener("click", () => {
		game.changeStatus(GameStatus.characterCreation);
	});
}

//#endregion

export { launchGameStartScreen };
