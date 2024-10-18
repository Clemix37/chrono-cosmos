import IGameConfig from "../../../interfaces/IGameConfig";
import { getDataFromLocalStorage } from "../data/data";

/**
 * Create the default config and returns it
 * @returns {IGameConfig}
 */
function getDefaultConfig(): IGameConfig {
	const gameConfig: IGameConfig = {
		playerName: "",
		level: 0,
		status: "not started",
	};
	return gameConfig;
}

/**
 * Check if game config exists in localStorage
 * If not, create the default one
 * Save the config
 * Returns it
 * @returns {IGameConfig}
 */
function getOrCreateConfig(): IGameConfig {
	let gameConfig: IGameConfig = getDataFromLocalStorage("gameConfig");
	if (!gameConfig) gameConfig = getDefaultConfig();
	saveConfigInLocalStorage(gameConfig);
	return gameConfig;
}

/**
 * Saves the config in parameter in localStorage
 * @param gameConfig
 */
function saveConfigInLocalStorage(gameConfig: IGameConfig): void {
	localStorage.setItem("gameConfig", JSON.stringify(gameConfig));
}

export { getOrCreateConfig, getDefaultConfig };
