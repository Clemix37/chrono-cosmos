import IGameConfig from "../../../interfaces/IGameConfig";
import IGameStatus from "../../../interfaces/IGameStatus";
import { getDataFromLocalStorage } from "../data/data";

const getDefaultConfig = ():IGameConfig => {
    const gameConfig:IGameConfig = {
        playerName: "",
        level: 0,
        status: "not started",
    };
    return gameConfig;
};

const getOrCreateConfig = ():IGameConfig => {
    let gameConfig: IGameConfig = getDataFromLocalStorage("gameConfig");
    if(!gameConfig) gameConfig = getDefaultConfig();
    saveConfigInLocalStorage(gameConfig);
    return gameConfig;
};

const getListOfGameStatus = ():IGameStatus => {
    const list:IGameStatus = {
        notStarted: "not started",
        playing: "playing",
        paused: "paused",
        over: "over",
    };
    return list;
};

const saveConfigInLocalStorage = (gameConfig: IGameConfig):void => {
    localStorage.setItem("gameConfig", JSON.stringify(gameConfig));
};

export {getOrCreateConfig,getListOfGameStatus};