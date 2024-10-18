import IGameConfig from "../../interfaces/IGameConfig";
import { game } from "../Classes/Game";
import { IDS_BTNS_SCREENS } from "../utils/constants";
// import { changeGameStatus, getGameConfig } from "../gameConfig";

/**
 * Gets the HTML file playing screen and display it in the DOM
 * @param config
 */
async function launchGameScreen(config: IGameConfig): Promise<void> {
	const res = await fetch("./screens/playing.html");
	const htmlContent = await res.text();
	document.body.innerHTML = htmlContent;
	displayPausedGame(config.status === "paused");
	attachEvents();
}

/**
 * Based on the parameter, hides / displays the pause button and the resume button
 * @param toDisplay
 * @returns {void}
 */
function displayPausedGame(toDisplay: boolean): void {
	const btnGamePause = document.getElementById(IDS_BTNS_SCREENS.GAME.PAUSE);
	const btnResumeGame = document.getElementById(IDS_BTNS_SCREENS.GAME_PAUSED.RESUME);
	if (!btnGamePause || !btnResumeGame) return;
	btnGamePause.style.display = toDisplay ? "none" : "block";
	btnResumeGame.style.display = toDisplay ? "block" : "none";
}

//#region Events

function attachEvents(): void {
	attachEventsPause();
	attachEventsResume();
	attachEventClearData();
}

function attachEventsPause(): void {
	const btnGamePause = document.getElementById(IDS_BTNS_SCREENS.GAME.PAUSE);
	if (!btnGamePause) return;
	btnGamePause.addEventListener("click", () => {
		game.changeStatus("paused");
	});
}

function attachEventsResume(): void {
	const btnResumeGame = document.getElementById(IDS_BTNS_SCREENS.GAME_PAUSED.RESUME);
	if (!btnResumeGame) return;
	btnResumeGame.addEventListener("click", () => {
		game.changeStatus("playing");
	});
}

function attachEventClearData() {
	const btnClearData = document.getElementById(IDS_BTNS_SCREENS.GAME.CLEAR_DATA);
	if (!btnClearData) return;
	btnClearData.addEventListener("click", () => {
		game.clearDataFromLocalStorage();
	});
}

//#endregion

export { launchGameScreen };
