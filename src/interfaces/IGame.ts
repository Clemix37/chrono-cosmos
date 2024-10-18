import Character from "../content/Classes/Character";
import { Game } from "../content/Classes/Game";
import { GameContent } from "../content/Classes/GameContent";
import IGameConfig from "./IGameConfig";

export default interface IGame {
	energy: number; // Energy gained
	// character: Character; // Character the player is playing
	config: IGameConfig; // Game configuration
	resources: GameContent[]; // Resources collected
	components: GameContent[]; // Components collected
	timeTravelGames?: Game[]; // Possible previous games before travel
}
