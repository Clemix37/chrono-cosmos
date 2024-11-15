import IGameContent from "../../interfaces/IGameContent";
import resourceFile from "../utils/data/resources.json";
import componentFile from "../utils/data/components.json";
import IGameImage from "../../interfaces/IGameImage";
import { getOrCreateComponents } from "../utils/components/components";
import { getCostUpgraded } from "../utils/formulas/formulas";

/**
 * Gets the components and returns them as GameContent array
 * @returns {object}
 */
function getOrCreateGameContent(): { components: GameContent[]; resources: GameContent[] } {
	const gameContent = getOrCreateComponents();
	return {
		components: gameContent.components.map((comp: IGameContent) => {
			const compJson = componentFile.components.find((compJson) => compJson.id === comp.id);
			if (!compJson) return new GameContent(comp);
			comp.baseCost = compJson.baseCost;
			comp.exponent = compJson.exponent;
			comp.gainPerSecond = compJson.gainPerSecond;
			comp.img = compJson.img;
			comp.maxLevel = compJson.maxLevel;
			return new GameContent(comp);
		}),
		resources: gameContent.resources.map((res: IGameContent) => {
			const resJson = componentFile.components.find((resJson) => resJson.id === res.id);
			if (!resJson) return new GameContent(res);
			res.baseCost = resJson.baseCost;
			res.exponent = resJson.exponent;
			res.gainPerSecond = resJson.gainPerSecond;
			res.img = resJson.img;
			res.maxLevel = resJson.maxLevel;
			return new GameContent(res);
		}),
	};
}

class GameContent implements IGameContent {
	//#region Properties

	id: string;
	name: string;
	type: "component" | "resource";
	gainPerSecond: number;
	baseCost: number;
	exponent: number;
	level: number;
	maxLevel: number;
	img?: IGameImage;
	upgradeCost?: number;
	progressToNext?: number;
	idBtn?: string;
	// btn: HTMLButtonElement | null;

	//#endregion

	//#region Constructor

	/**
	 * Assign every value of the config in argument
	 * @constructor
	 * @param config
	 */
	constructor(config: IGameContent) {
		this.id = config.id;
		this.name = config.name;
		this.baseCost = config.baseCost;
		this.exponent = config.exponent;
		this.type = config.type;
		this.gainPerSecond = config.gainPerSecond;
		this.level = config.level;
		this.maxLevel = config.maxLevel;
		this.img = config.img;
		this.upgradeCost = config.upgradeCost ?? config.baseCost;
		this.progressToNext = config.progressToNext;
		this.idBtn = `btn-${this.type}-${this.name.toLowerCase().split(" ").join("-")}`;
	}

	//#endregion

	upgrade() {
		if (this.level + 1 > this.maxLevel) return;
		this.level++;
		this.upgradeCost = getCostUpgraded(this.baseCost, this.exponent, this.level);
	}

	getHtmlTemplateGameContent(energy: number) {
		// TODO: display IMAGES
		return `
			<div class="flex card colonne">
				<div class="flex card-header justify-content-space-around align-items-center">
					<button class="button"
						style="cursor: default; width: 30px; height: 30px; border-radius: 50%; border: none; background-color: var(--bg); color: var(--accent);">
						<i class="fas fa-star"></i></button>
					<h2 style="text-align: center;">${this.name}</h2>
					<button class="button"
						style="cursor: default; width: 30px; height: 30px; border-radius: 50%; border: none; background-color: var(--bg); color: var(--accent);">
						<i class="fas fa-star"></i>
					</button>
				</div>
				<div class="flex card-content colonne align-items-center height-100 justify-content-center">
					<div class="flex card-image-content">
						<!-- <img src="https://github.com/Clemix37/chrono-cosmos/blob/main/img/maquette_dall_e_chatgpt.png?raw=true"
							width="50" height="50" /> -->
					</div>
					<div class="flex card-content-description">
						<h3 style="text-align: center;"><em>${this.gainPerSecond}/s.</em> - <em>Level ${this.level}</em></h3>
					</div>
				</div>
				<div class="flex card-footer width-100">
					<button title="Add one" id="${this.idBtn}" class="btn-game-content ${
			energy < (this.upgradeCost as number) ? "not-enough" : ""
		}">
						<i class="fas fa-star"></i>
						<em style="font-size: 2em;">${this.upgradeCost}</em>
						<i class="fas fa-star"></i>
					</button>
				</div>
			</div>
		`;
	}
}

export { GameContent, getOrCreateGameContent };
