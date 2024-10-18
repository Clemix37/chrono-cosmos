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
	if (!localComp) localComp = getDefaultComponents();
	return localComp;
}

/**
 * Creates the default components and returns them
 * @returns {object}
 */
function getDefaultComponents(): {
	components: GameContent[];
	resources: GameContent[];
} {
	const firstResourceConfig: IGameContent = resourceFile.resources[0] as IGameContent;
	const firstComponentConfig: IGameContent = componentFile.components[0] as IGameContent;
	const content = {
		components: [new GameContent(firstComponentConfig)],
		resources: [new GameContent(firstResourceConfig)],
	};
	return content;
}

export { getOrCreateComponents, getDefaultComponents };
