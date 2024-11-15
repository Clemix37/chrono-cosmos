import IGameConfig from "../../interfaces/IGameConfig";
import { game, recreateGame } from "../Classes/Game";
import { IDS_BTNS_SCREENS } from "../utils/constants";
// import { changeGameStatus, getGameConfig } from "../gameConfig";

const playingScreenUrl = "./screens/playing.html";

/**
 * Gets the HTML file playing screen and display it in the DOM
 * @param config
 */
async function launchGameScreen(config: IGameConfig): Promise<void> {
	const res = await fetch(playingScreenUrl);
	const htmlContent = await res.text();
	document.body.innerHTML = htmlContent;
	attachEvents();
}

//#region Events

function attachEvents(): void {
	attachEventClearData();
}

function attachEventClearData() {
	const btnClearData = document.getElementById(IDS_BTNS_SCREENS.GAME.CLEAR_DATA);
	if (!btnClearData) return;
	btnClearData.addEventListener("click", () => {
		clearInterval(game._interval); // Clears the interval so that we can empty localStorage
		game.clearDataFromLocalStorage();
		recreateGame();
	});
}

//#endregion

export { launchGameScreen };
