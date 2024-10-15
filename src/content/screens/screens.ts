// import { getListOfGameStatus } from "../../utils/utils";
// import { launchGameScreen } from "./playingScreen";
// import { launchGameStartScreen } from "./startScreen";

// const launchScreenBasedOnGameStatus = (gameStatus: string) => {
//     const listOfGameStatuses = getListOfGameStatus();
//     switch(gameStatus){
//         case listOfGameStatuses.notStarted:
//             launchGameStartScreen();
//             break;
//         case listOfGameStatuses.playing:
//         case listOfGameStatuses.paused:
//             launchGameScreen();
//             break;
//         case listOfGameStatuses.over:
//             //@todo
//             break;
//     }
// };

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

// export {launchScreenBasedOnGameStatus};
export { displayOnGameUI, changeDisplayOfGameUI };
