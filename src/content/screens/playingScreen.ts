import IGameConfig from "../../interfaces/IGameConfig";
import { IDS_BTNS_SCREENS } from "../utils/configs/buttons/buttons";
import { game } from "../game/game";
// import { changeGameStatus, getGameConfig } from "../gameConfig";

/**
 * Gets the HTML file playing screen and display it in the DOM
 * @param config 
 */
async function launchGameScreen(config:IGameConfig):Promise<void> {
    const res = await fetch("./screens/playing.html");
    const htmlContent = await res.text();
    document.body.innerHTML = htmlContent;
    displayPausedGame(config.status === "paused");
    attachEvents();
}

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
    const btnClearData = document.getElementById(IDS_BTNS_SCREENS.GAME.CLEAR_DATA);
    if(!btnClearData) return;
    btnClearData.addEventListener("click", () => {
        game.clearDataFromLocalStorage();
    });
};

//#endregion

export {launchGameScreen}