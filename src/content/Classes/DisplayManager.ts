import { formatEnergy } from "../utils/formulas/formulas";
import GameContent from "./GameContent";
import GameStateManager from "./GameStateManager";

export default abstract class DisplayManager {
	/**
	 * Display game contents
	 * Display energy
	 */
	static display(): void {
		DisplayManager.displayGameContents();
		DisplayManager.displayMostUsedContents();
		DisplayManager.displayEnergy();
		DisplayManager.displayEnergyPerSecond();
	}

	//#region Game Content

	/**
	 * Display game contents available
	 * Display most used contents
	 * @param components
	 * @param resources
	 * @returns {void}
	 */
	static displayGameContents(): void {
		DisplayManager.displayMostUsedContents();
		const divListComponents: HTMLDivElement = document.querySelector(".components-list") as HTMLDivElement;
		if (!divListComponents) return void 0;
		divListComponents.innerHTML = "";
		// Components
		const components = GameStateManager.components;
		divListComponents.innerHTML += `<div class="mini-header">
                    <h3>Components</h3>
                    <div class="small">${
						components.filter((c) => c.upgradeCost! <= GameStateManager.energy).length
					} available</div>
                </div>`;
		const displayComponents = components
			.sort((a, b) => (a.upgradeCost ?? 0) - (b.upgradeCost ?? 0))
			.filter((c) => c.upgradeCost! <= GameStateManager.energy)
			.reduce(
				(prevDisplay, currContent) =>
					`${prevDisplay}${currContent.getHtmlTemplateGameContent(GameStateManager.energy)}`,
				``,
			);
		divListComponents.innerHTML += displayComponents;
		const divListResources: HTMLDivElement = document.querySelector(".resources-list") as HTMLDivElement;
		if (!divListResources) return void 0;
		// Resources
		const resources = GameStateManager.resources;
		divListResources.innerHTML = "";
		divListResources.innerHTML += `<div class="mini-header">
                    <h3>Resources</h3>
                    <div class="small">${
						resources.filter((r) => r.upgradeCost! <= GameStateManager.energy).length
					} available</div>
                </div>`;
		const displayResources = resources
			.sort((a, b) => (a.upgradeCost ?? 0) - (b.upgradeCost ?? 0))
			.filter((r) => r.upgradeCost! <= GameStateManager.energy)
			.reduce(
				(prevDisplay, currContent) =>
					`${prevDisplay}${currContent.getHtmlTemplateGameContent(GameStateManager.energy)}`,
				``,
			);
		divListResources.innerHTML += displayResources;
	}

	/***
	 * Display most used contents
	 * @param components
	 * @param resources
	 */
	static displayMostUsedContents(): void {
		const componentsOrderedBestLevel: GameContent[] = GameStateManager.components
			.filter((c) => c.level > 0)
			.sort((a, b) => a.level - b.level);
		const resourcesOrderedBestLevel: GameContent[] = GameStateManager.resources
			.filter((r) => r.level > 0)
			.sort((a, b) => a.level - b.level);
		const bottomCards: HTMLDivElement = document.querySelector(".bottom")!;
		if (!bottomCards) return void 0;
		bottomCards.innerHTML = "";
		const addContent = (content: GameContent, title: string) => {
			bottomCards.innerHTML += content.getHtmlTemplateGameContentAsBig(GameStateManager.energy, title);
		};
		if (componentsOrderedBestLevel.length > 0) {
			addContent(componentsOrderedBestLevel[0], "Highest Level Component");
			if (componentsOrderedBestLevel.length > 1)
				addContent(componentsOrderedBestLevel[1], "Second highest Level Component");
		}
		if (resourcesOrderedBestLevel.length > 0) {
			addContent(resourcesOrderedBestLevel[0], "Highest Level Resource");
			if (resourcesOrderedBestLevel.length > 1)
				addContent(resourcesOrderedBestLevel[1], "Second highest Level Resource");
		}
	}

	//#endregion

	//#region Energy

	/**
	 * Display the energy given
	 */
	static displayEnergy(): void {
		const energyCounter = document.getElementById("lbl-energy-counter");
		if (!energyCounter) return void 0;
		energyCounter.textContent = `${formatEnergy(GameStateManager.energy)}⚡`;
	}

	/**
	 * Display the number of energy per second generated
	 * @returns {void}
	 */
	static displayEnergyPerSecond(): void {
		const divPerSec: HTMLDivElement = document.querySelector("#energy-per-second") as HTMLDivElement;
		if (!divPerSec) return void 0;
		const totalGain: number = ([...GameStateManager.components, GameStateManager.resources] as GameContent[])
			.filter((content) => content.level > 0)
			.reduce((acc, content) => acc + content.gainPerSecond * content.level, 0);
		divPerSec.innerHTML = `Energy / second: +${totalGain.toFixed(1)}`;
	}

	//#endregy
}
