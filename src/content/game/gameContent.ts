import IGameContent from "../../interfaces/IGameContent";
import { getDataFromLocalStorage } from "../utils/data/data";
import resourceFile from "../utils/data/resources.json";
import componentFile from "../utils/data/components.json";

const getOrCreateGameContent = ():any => {
	let gameContent = getDataFromLocalStorage("gameContent");
	if(!gameContent) gameContent = getDefaultGameContent();
	else {
		gameContent.components = gameContent.components.map((comp:IGameContent) => new GameContent(comp));
		gameContent.resources = gameContent.resources.map((res:IGameContent) => new GameContent(res));
	}
	return gameContent;
};

const getDefaultGameContent = ():any => {
	const waterResourceConfig: IGameContent = resourceFile.resources[0] as IGameContent;
	const spoonCompConfig: IGameContent = componentFile.components[0] as IGameContent;
	const content = {
		components: [new GameContent(spoonCompConfig)],
		resources: [new GameContent(waterResourceConfig)],
	};
	return content;
};

const getNextGameContent = (energy:number, ids:string[]):{components:GameContent[], resources:GameContent[]} => {
	const minEnergy = 1.2 * energy;
	const comps = componentFile.components.filter(comp => comp.baseCost <= minEnergy && !ids.includes(comp.id)).map(comp => new GameContent(comp as IGameContent));
	const res = resourceFile.resources.filter(res => res.baseCost <= minEnergy && !ids.includes(res.id)).map(res => new GameContent(res as IGameContent));
	return {
		components: comps,
		resources: res,
	}
};

class GameContent implements IGameContent {
	id: string;
	name: string;
	type: "component" | "resource";
	gainPerSecond: number;
	baseCost: number;
	exponent: number;
	level: number;
	maxLevel: number;
	upgradeCost?: number;
	progressToNext?: number;
	idBtn?: string;
	// btn: HTMLButtonElement | null;
	constructor(config: IGameContent){
		this.id = config.id;
		this.name = config.name;
		this.baseCost = config.baseCost;
		this.exponent = config.exponent;
		this.type = config.type;
		this.gainPerSecond = config.gainPerSecond;
		this.level = config.level;
		this.maxLevel = config.maxLevel;
		this.upgradeCost = config.upgradeCost ?? config.baseCost;
		this.progressToNext = config.progressToNext;
		this.idBtn = `btn-${this.type}-${this.name.toLowerCase().split(" ").join("-")}`;
		// if(!!this.idBtn) this.btn = document.getElementById(this.idBtn);
	}
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
        return `<div class="ligne">${content}</div>`;
    }

    getHtmlTemplateGameContent(isPaused: boolean){
        const ligneBtn = isPaused ? "" : `
            <div class="ligne">
                <button class="btn btn-primary btn-game-content" id="${this.idBtn}">${this.upgradeCost}</button>
            </div>
        `;
        return this.#getHtmlLine(`
            <div class="colonne game-content">
                <div class="ligne">
                    <h1>Niveau ${this.level}</h1>
                </div>
                <div class="ligne">
                    <span>${this.name}</span>
                </div>
                <div class="ligne">
                    <div class="colonne">
                        <div class="ligne">
                            <span class="game-content-gain"><i class="fa-solid fa-coins icon color-yellow margin-right"></i>${this.gainPerSecond}</span>
                        </div>
                    </div>
                    <div class="colonne">
                        <div class="ligne">
                            <span class="game-content-time"><i class="fa-solid fa-clock icon color-light-blue margin-right"></i>1s</span>
                        </div>
                    </div>
                </div>
                ${ligneBtn}
            </div>
        `);
    }
}

export {GameContent, getOrCreateGameContent,getNextGameContent};