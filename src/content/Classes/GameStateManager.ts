import IGameConfig from "../../interfaces/IGameConfig";
import { getDefaultConfig } from "../utils/utils";
import Character from "./Character";
import { Game } from "./Game";
import GameContent from "./GameContent";
import Spaceship from "./Spaceship";

export default abstract class GameStateManager {
	//#region Properties

	// Configuration of the game
	static config: IGameConfig = getDefaultConfig();
	// Current instance of game
	static game: Game;
	// Energy of user
	static energy: number = 3;
	// Character selected
	static character: Character;
	// Components
	static components: GameContent[] = [];
	// Resources
	static resources: GameContent[] = [];
	// Spaceship
	static spaceship: Spaceship;

	//#endregion

	/**
	 * Change the current game status
	 * @param newStatus
	 */
	static changeStatus(newStatus: string) {
		GameStateManager.config.status = newStatus;
		GameStateManager.game?.launchActualScreen();
	}

	/**
	 * Upgrade the spaceship
	 */
	static upgradeSpaceship() {
		GameStateManager.spaceship.upgrade();
	}
}
