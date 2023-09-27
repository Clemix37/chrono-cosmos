import IGameConfig from "../../../interfaces/IGameConfig";
import { IDS_BTNS_SCREENS } from "../../utils/configs/buttons/buttons";
import { IDS_DIVS, hideOtherDivsThan } from "../../utils/utils";
import { game } from "../game";
// import { changeGameStatus, getGameConfig } from "../gameConfig";

const launchGameScreen = (config:IGameConfig):void => {
    hideOtherDivsThan(IDS_DIVS.GAME);
    displayPausedGame(config.status === "paused");
    attachEvents();
};

const displayPausedGame = (toDisplay:boolean):void => {
    const btnGamePause = document.getElementById(IDS_BTNS_SCREENS.GAME.PAUSE);
    const btnResumeGame = document.getElementById(IDS_BTNS_SCREENS.GAME_PAUSED.RESUME);
    if(!btnGamePause || !btnResumeGame) return;
    btnGamePause.style.display = toDisplay ? "none" : "block";
    btnResumeGame.style.display = toDisplay ? "block" : "none";
};

//#region Events

const attachEvents = ():void => {
    attachEventsPause();
    attachEventsResume();
    attachEventClearData();
};

const attachEventsPause = ():void => {
    const btnGamePause = document.getElementById(IDS_BTNS_SCREENS.GAME.PAUSE);
    if(!btnGamePause) return;
    btnGamePause.addEventListener("click", () => {
        game.changeStatus("paused");
    });
};

const attachEventsResume = ():void => {
    const btnResumeGame = document.getElementById(IDS_BTNS_SCREENS.GAME_PAUSED.RESUME);
    if(!btnResumeGame) return;
    btnResumeGame.addEventListener("click", () => {
        game.changeStatus("playing");
    });
};

const attachEventClearData = () => {
    const btnClearData = document.getElementById("btnClearData");
    if(!btnClearData) return;
    btnClearData.addEventListener("click", () => {
        game.clearDataFromLocalStorage();
    });
};

//#endregion

export {launchGameScreen}