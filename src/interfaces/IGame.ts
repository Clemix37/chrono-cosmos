import { Game } from "../content/game/game";
import GameCanvas from "../content/game/gameCanvas";
import { GameContent } from "../content/game/gameContent";
import IGameConfig from "./IGameConfig";

export default interface IGame {
    energy: number;
    config: IGameConfig;
    resources: GameContent[];
    components: GameContent[];
    canvas: GameCanvas;
    timeTravelGames?: Game[];
};