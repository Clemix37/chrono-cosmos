import { IDS_BTNS_SCREENS } from "../utils/configs/buttons/buttons";
import { game } from "../game/game";

/**
 * Gets the HTML file of the start screen and display it in the DOM
 */
async function launchGameStartScreen():Promise<void> {
    const res = await fetch("../../../screens/start.html");
    const htmlContent = await res.text();
    document.body.innerHTML = htmlContent;
    attachEvents();
}

//#region Events

const attachEvents = ():void => {
    attachEventGameStart();
};

const attachEventGameStart = ():void => {
    const gameStartDiv = document.getElementById(IDS_BTNS_SCREENS.GAME_START.LAUNCH);
    if(!gameStartDiv) return;
    gameStartDiv.addEventListener("click", () => {
        game.changeStatus("playing");
    });
};

//#endregion

export { launchGameStartScreen };