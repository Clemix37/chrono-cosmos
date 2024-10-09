import { Game } from "../content/game/game";
import { GameContent } from "../content/game/gameContent";
import IGameConfig from "./IGameConfig";

export default interface IGame {
	energy: number; // Energy gained
	config: IGameConfig; // Game configuration
	resources: GameContent[]; // Resources collected
	components: GameContent[]; // Components collected
	timeTravelGames?: Game[]; // Possible previous games before travel
}
