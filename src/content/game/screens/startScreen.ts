import { IDS_DIVS, hideOtherDivsThan } from "../../utils/utils";
import { game } from "../game";

const CURRENT_DIV_ID = IDS_DIVS.GAME_START;

const launchGameStartScreen = ():void => {
    hideOtherDivsThan(CURRENT_DIV_ID);
    attachEvents();
};

//#region Events

const attachEvents = ():void => {
    attachEventGameStart();
};

const attachEventGameStart = ():void => {
    const gameStartDiv = document.getElementById(CURRENT_DIV_ID);
    if(!gameStartDiv) return;
    gameStartDiv.addEventListener("click", () => {
        game.changeStatus("playing");
    });
};

//#endregion

export { launchGameStartScreen };