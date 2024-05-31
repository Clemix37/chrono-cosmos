import { Game } from "../content/game/game";
import GameCanvas from "../content/game/gameCanvas";
import { GameContent } from "../content/game/gameContent";
import IGameConfig from "./IGameConfig";

export default interface IGame {
    energy: number; // Energy gained
    config: IGameConfig; // Game configuration
    resources: GameContent[]; // Resources collected
    components: GameContent[]; // Components collected
    canvas: GameCanvas; // Canvas to display game info
    timeTravelGames?: Game[]; // Possible previous games before travel
};