import Character from "../content/Classes/Character";
import { Game } from "../content/Classes/Game";
import { GameContent } from "../content/Classes/GameContent";
import IGameConfig from "./IGameConfig";

export default interface IGame {
	spaceshipLevel: number; // The level of the current spaceship
	energy: number; // Energy gained
	config: IGameConfig; // Game configuration
	resources: GameContent[]; // Resources collected
	components: GameContent[]; // Components collected
	character?: Character; // Character the player is playing
	timeTravelGames?: Game[]; // Possible previous games before travel
}
