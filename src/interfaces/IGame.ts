import { Game } from "../content/game/game";
import { GameContent } from "../content/game/gameContent";
import IGameConfig from "./IGameConfig";

export default interface IGame {
    energy: number;
    config: IGameConfig;
    resources: GameContent[];
    components: GameContent[];
    timeTravelGames?: Game[];
};