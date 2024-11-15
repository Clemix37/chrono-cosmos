import IGameContent from "../../../interfaces/IGameContent";
import { GameContent } from "../../Classes/GameContent";
import { getDataFromLocalStorage } from "../data/data";
import resourceFile from "../../utils/data/resources.json";
import componentFile from "../../utils/data/components.json";
import { SESSIONS_KEYS } from "../constants";

/**
 * Checks if game components exists in localStorage
 * If not, gets the default one
 * Return game components
 * @returns {any}
 */
function getOrCreateComponents(): any {
	let localComp = getDataFromLocalStorage(SESSIONS_KEYS.GAME_CONTENT);
	if (!localComp) localComp = getDefaultsComponents();
	return localComp;
}

/**
 * Creates the defaults components and returns them
 * @returns {{ components: GameContent[], resources: GameContent[] }}
 */
function getDefaultsComponents(): {
	components: GameContent[];
	resources: GameContent[];
} {
	const everyComponents = componentFile.components.map((comp) => new GameContent(comp as IGameContent));
	const everyResources = resourceFile.resources.map((comp) => new GameContent(comp as IGameContent));
	const content = {
		components: everyComponents,
		resources: everyResources,
	};
	return content;
}

export { getOrCreateComponents, getDefaultsComponents };
