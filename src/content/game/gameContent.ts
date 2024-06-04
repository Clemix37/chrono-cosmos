import IGameContent from "../../interfaces/IGameContent";
import resourceFile from "../utils/data/resources.json";
import componentFile from "../utils/data/components.json";
import IGameImage from "../../interfaces/IGameImage";
import { getOrCreateComponents } from "../utils/components/components";

const getOrCreateGameContent = (): { components: GameContent[], resources: GameContent[] } => {
	const gameContent = getOrCreateComponents();
	return {
		components: gameContent.components.map((comp: IGameContent) => {
			const compJson = componentFile.components.find(compJson => compJson.id === comp.id);
			if(!compJson) return new GameContent(comp);
			comp.baseCost = compJson.baseCost;
			comp.exponent = compJson.exponent;
			comp.gainPerSecond = compJson.gainPerSecond;
			comp.img = compJson.img;
			comp.maxLevel = compJson.maxLevel;
			return new GameContent(comp);
		}),
		resources: gameContent.resources.map((res: IGameContent) => {
			const resJson = componentFile.components.find(resJson => resJson.id === res.id);
			if(!resJson) return new GameContent(res);
			res.baseCost = resJson.baseCost;
			res.exponent = resJson.exponent;
			res.gainPerSecond = resJson.gainPerSecond;
			res.img = resJson.img;
			res.maxLevel = resJson.maxLevel;
			return new GameContent(res);
		}),
	};
};

const getDefaultGameContent = (): { components: GameContent[], resources: GameContent[] } => {
	const firstResourceConfig: IGameContent = resourceFile.resources[0] as IGameContent;
	const firstComponentConfig: IGameContent = componentFile.components[0] as IGameContent;
	const content = {
		components: [new GameContent(firstComponentConfig)],
		resources: [new GameContent(firstResourceConfig)],
	};
	return content;
};

const getNextGameContent = (energy: number, ids: string[]): { components: GameContent[], resources: GameContent[] } => {
	const minEnergy = 1.2 * energy;
	const comps = componentFile.components.filter(comp => comp.baseCost <= minEnergy && !ids.includes(comp.id)).map(comp => new GameContent(comp as IGameContent));
	const res = resourceFile.resources.filter(res => res.baseCost <= minEnergy && !ids.includes(res.id)).map(res => new GameContent(res as IGameContent));
	return {
		components: comps,
		resources: res,
	};
};

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

	constructor(config: IGameContent){
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

	upgrade(){
		if(this.level +1 > this.maxLevel) return;
		this.level++;
		this.upgradeCost = this.#upgradeCostWithFormula();
	}
	#upgradeCostWithFormula():number{
		const formula = this.baseCost * (this.level ** this.exponent);
		return Math.ceil(formula);
	}
    #getHtmlLine(content:string){
        return `<div class="flex justify-content-center">${content}</div>`;
    }

    getHtmlTemplateGameContent(isPaused: boolean){
        const ligneBtn = isPaused ? "" : `
            <div class="flex height-100 align-items-center">
                <button class="btn btn-primary btn-game-content" id="${this.idBtn}">${this.upgradeCost}</button>
            </div>
        `;
		const isNew = !this.level;
        return this.#getHtmlLine(`
            <div class="flex colonne game-content width-100">
                <div class="flex">
					<div class="flex colonne width-100">
						<div class="flex">
                    		<h1>${isNew ? "<em style='color: var(--tertiary);'>New</em> - " : ""}${this.name} ${isNew ? "" : `(${this.level})`}</h1>
						</div>
						<div class="flex justify-content-center">
							<h3>
								<i class="fa-solid fa-coins icon color-yellow margin-right"></i>
								${this.gainPerSecond}/s
							</h3>
						</div>
					</div>
					<div class="flex colonne width-100">
						${ligneBtn}
					</div>
                </div>
            </div>
        `);
    }
}

export { GameContent, getOrCreateGameContent, getNextGameContent };