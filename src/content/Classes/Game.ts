import IGame from "../../interfaces/IGame";
import IGameConfig from "../../interfaces/IGameConfig";
import { getDataFromLocalStorage } from "../utils/data/data";
import { formatEnergy, toDecimal } from "../utils/formulas/formulas";
import { getOrCreateConfig } from "../utils/utils";
import { GameContent, getOrCreateGameContent } from "./GameContent";
import { launchGameScreen } from "../screens/playingScreen";
import { launchGameStartScreen } from "../screens/startScreen";
import { launchGameEndScreen } from "../screens/endScreen";
import { CHARACTER_STATS, CLASSES_GAME, GameStatus, IDS_GAME_DIVS, SESSIONS_KEYS } from "../utils/constants";
import {
	displayRandomCharacters,
	getCharacterGeneratedById,
	launchGameCharacterCreationScreen,
} from "../screens/characterCreationScreen";
import Character from "./Character";

export class Game implements IGame {
	//#region Properties

	/**
	 * The level of the current spaceship
	 */
	spaceshipLevel: number;
	/**
	 * Energy counter
	 */
	energy: number;
	/**
	 * Game config
	 */
	config: IGameConfig;
	/**
	 * Game components
	 */
	components: GameContent[];
	/**
	 * Game resources
	 */
	resources: GameContent[];
	/**
	 * Character the player is playing
	 */
	character?: Character;
	/**
	 * Game passed as the player traveled through time
	 */
	timeTravelGames?: Game[];
	/**
	 * Interval by whoch game refreshes
	 */
	_interval?: NodeJS.Timeout;
	/**
	 * Min delay before next click
	 */
	#minDelay: number = 50;
	/**
	 * Date of last click
	 */
	#lastClickDate: Date;

	//#endregion

	//#region Constructor

	constructor() {
		this.spaceshipLevel = getDataFromLocalStorage(SESSIONS_KEYS.SPACESHIP_LEVEL);
		this.energy = getDataFromLocalStorage(SESSIONS_KEYS.ENERGY) ?? 3;
		this.config = getOrCreateConfig();
		this.character = getDataFromLocalStorage(SESSIONS_KEYS.GAME_CHAR) ?? null;
		const gameContent = getOrCreateGameContent();
		this.components = gameContent.components;
		this.resources = gameContent.resources;
		this.#lastClickDate = new Date();
		this.#displayEnergy(this.energy);
	}

	//#endregion

	//#region Public methods

	/**
	 * Initialize the game
	 */
	init() {
		this.launchActualScreen();
	}

	/**
	 * Saves the energy, the config, and the contents in the localStorage
	 */
	saveGame() {
		localStorage.setItem(SESSIONS_KEYS.ENERGY, JSON.stringify(this.energy));
		localStorage.setItem(SESSIONS_KEYS.GAME_CONFIG, JSON.stringify(this.config));
		localStorage.setItem(
			SESSIONS_KEYS.GAME_CONTENT,
			JSON.stringify({
				components: this.components,
				resources: this.resources,
			}),
		);
		localStorage.setItem(SESSIONS_KEYS.GAME_CHAR, JSON.stringify(this.character));
	}

	/**
	 * Remove every item in the local storage
	 * So that when reloading, no game already exists
	 */
	clearDataFromLocalStorage() {
		localStorage.removeItem(SESSIONS_KEYS.ENERGY);
		localStorage.removeItem(SESSIONS_KEYS.GAME_CONFIG);
		localStorage.removeItem(SESSIONS_KEYS.GAME_CONTENT);
		localStorage.removeItem(SESSIONS_KEYS.GAME_CHAR);
	}

	/**
	 * Based on the status of the config,
	 * 	Launch the screen necessary
	 */
	async launchActualScreen() {
		switch (this.config.status) {
			case GameStatus.notStarted:
				await launchGameStartScreen();
				break;
			case GameStatus.characterCreation:
				await launchGameCharacterCreationScreen();
				displayRandomCharacters();
				this.#attachCharacterSelectEvent();
				break;
			case GameStatus.playing:
				await launchGameScreen(this.config);
				this.#displayAndAttachGameContents();
				this.#attachAddOneEnergyBtn();
				this.#displayCurrentCharacter();
				break;
			case GameStatus.over:
				await launchGameEndScreen();
				break;
		}
	}

	/**
	 * Change the current game status
	 * @param newStatus
	 */
	changeStatus(newStatus: string) {
		this.config.status = newStatus;
		this.launchActualScreen();
	}

	upgradeSpaceship() {
		this.spaceshipLevel++;
		// TODO: update some stuff
	}

	//#endregion

	//#region Private methods

	/**
	 * Each second,
	 * 	Calculate the amount of energy gained in a second and adds it to the energy counter
	 * 	Display this energy
	 * 	Saves the game in localStorage
	 * 	Check if new content is available
	 */
	#countEverySecond() {
		if (!!this._interval) clearInterval(this._interval);
		this.#displayEnergy(this.energy);
		this._interval = setInterval(() => {
			const gainComponents = this.components.reduce((acc, comp) => acc + comp.level * comp.gainPerSecond, 0);
			const gainResources = this.resources.reduce((acc, res) => acc + res.level * res.gainPerSecond, 0);
			this.energy = toDecimal(this.energy + gainComponents + gainResources);
			this.#displayEnergy(this.energy);
			this.#displayAndAttachGameContents();
			this.saveGame();
		}, 1000); /// ((this.character?.speed ?? 1) + (this.character?.intelligence ?? 1) - (this.character?.strength ?? 1))
	}

	//#region Display

	/**
	 * Clears the interval
	 * Saves the game
	 * Dispkay game components
	 * Attach events of these game components
	 */
	#displayAndAttachGameContents(): void {
		if (!!this._interval) clearInterval(this._interval);
		this.saveGame();
		this.#displayGameContents(
			[...this.components].sort((a, b) => (a.upgradeCost ?? 0) - (b.upgradeCost ?? 0)),
			[...this.resources].sort((a, b) => (a.upgradeCost ?? 0) - (b.upgradeCost ?? 0)),
		);
		this.#attachEvents();
		if (this.config.status === "playing") this.#countEverySecond();
	}

	/**
	 * Display game contents
	 * @param components
	 * @param resources
	 * @returns {void}
	 */
	#displayGameContents(components: GameContent[], resources: GameContent[]): void {
		this.#displayBigContents(components, resources);
		const divListComponents: HTMLDivElement = document.querySelector(".components-list") as HTMLDivElement;
		if (!divListComponents) return;
		divListComponents.innerHTML = "";
		// Components
		divListComponents.innerHTML += `<div class="mini-header">
                <h3>Components</h3>
                <div class="small">${components.filter((r) => r.upgradeCost! <= this.energy).length} available</div>
            </div>`;
		const displayComponents = components
			.filter((c) => c.upgradeCost! <= this.energy)
			.reduce(
				(prevDisplay, currContent) => `${prevDisplay}${currContent.getHtmlTemplateGameContent(this.energy)}`,
				``,
			);
		divListComponents.innerHTML += displayComponents;
		const divListResources: HTMLDivElement = document.querySelector(".resources-list") as HTMLDivElement;
		if (!divListResources) return;
		// Resources
		divListResources.innerHTML = "";
		divListResources.innerHTML += `<div class="mini-header">
                <h3>Resources</h3>
                <div class="small">${resources.filter((r) => r.upgradeCost! <= this.energy).length} available</div>
            </div>`;
		const displayResources = resources
			.filter((r) => r.upgradeCost! <= this.energy)
			.reduce(
				(prevDisplay, currContent) => `${prevDisplay}${currContent.getHtmlTemplateGameContent(this.energy)}`,
				``,
			);
		divListResources.innerHTML += displayResources;
		this.#displayBigContents(components, resources);
	}

	#displayBigContents(components: GameContent[], resources: GameContent[]): void {
		const componentsOrderedBestLevel: GameContent[] = components
			.filter((c) => c.level > 0)
			.sort((a, b) => a.level - b.level);
		const resourcesOrderedBestLevel: GameContent[] = resources
			.filter((r) => r.level > 0)
			.sort((a, b) => a.level - b.level);
		const bottomCards: HTMLDivElement = document.querySelector(".bottom")!;
		if (!bottomCards) return;
		bottomCards.innerHTML = "";
		const addContent = (content: GameContent, title: string) => {
			bottomCards.innerHTML += content.getHtmlTemplateGameContentAsBig(this.energy, title);
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

	/**
	 * Display the energy given
	 * @param ernegy number of energy
	 */
	#displayEnergy(ernegy: number): void {
		const energyCounter = document.getElementById("lbl-energy-counter");
		if (!energyCounter) return;
		energyCounter.textContent = `${formatEnergy(ernegy)}⚡`;
		this.#displayEnergyPerSecond();
	}

	/**
	 * Display the number of energy per second generated
	 * @returns {void}
	 */
	#displayEnergyPerSecond(): void {
		const divPerSec: HTMLDivElement = document.querySelector("#energy-per-second") as HTMLDivElement;
		if (!divPerSec) return;
		const totalGain: number = ([...this.components, this.resources] as GameContent[])
			.filter((content) => content.level > 0)
			.reduce((acc, content) => acc + content.gainPerSecond * content.level, 0);
		divPerSec.innerHTML = `Energy / second: +${totalGain.toFixed(1)}`;
	}

	/**
	 * Display the current character
	 */
	#displayCurrentCharacter(): void {
		const strengthBar: HTMLElement = document.querySelector("#strength-bar") as HTMLElement;
		const intelligenceBar: HTMLElement = document.querySelector("#intelligence-bar") as HTMLElement;
		const speedBar: HTMLElement = document.querySelector("#speed-bar") as HTMLElement;
		strengthBar.style.width = `${
			!this.character?.strength ? 0 : (this.character?.strength / CHARACTER_STATS.strength[1]) * 100
		}%`;
		intelligenceBar.style.width = `${
			!this.character?.intelligence ? 0 : (this.character?.intelligence / CHARACTER_STATS.intelligence[1]) * 100
		}%`;
		speedBar.style.width = `${
			!this.character?.speed ? 0 : (this.character?.speed / CHARACTER_STATS.speed[1]) * 100
		}%`;
	}

	//#endregion

	//#region Events

	/**
	 * Attach every event on the DOM
	 */
	#attachEvents() {
		const all: GameContent[] = [...this.components, ...this.resources];
		for (let i = 0; i < all.length; i++) {
			const content = all[i];
			if (!content.idBtn) continue;
			const btn = document.getElementById(content.idBtn);
			if (!btn) continue;
			btn.addEventListener("click", () => {
				const cost = content.upgradeCost || content.baseCost;
				if (cost > this.energy) return;
				this.energy = toDecimal(this.energy - cost);
				this.#displayEnergy(this.energy);
				content.upgrade();
				this.#displayAndAttachGameContents();
			});
		}
	}

	/**
	 * Attach the button game and adds one energy every click
	 */
	#attachAddOneEnergyBtn() {
		const buttonGame: HTMLDivElement = document.querySelector(".energy-circle") as HTMLDivElement;
		if (!buttonGame) throw new Error("No button to add one energy in the game");
		buttonGame.addEventListener("click", (e) => {
			if (!e.isTrusted) return;
			const delay: number = new Date().getTime() - this.#lastClickDate.getTime();
			if (delay < this.#minDelay) return;
			this.#lastClickDate = new Date();
			this.energy += 1;
			this.#displayEnergy(this.energy);
		});
	}

	/**
	 * Attach the event button select character
	 */
	#attachCharacterSelectEvent(): void {
		const btnSelectChar = document.querySelectorAll(`.${CLASSES_GAME.SELECT_CHARACTER}`);
		const auClic = (e: any) => {
			const id = e.target.dataset.id;
			const char: Character = getCharacterGeneratedById(id);
			this.character = char;
			// Saves the current character selected
			this.saveGame();
			this.changeStatus(GameStatus.playing);
		};
		for (let i = 0; i < btnSelectChar.length; i++) {
			const btn = btnSelectChar[i];
			btn.removeEventListener("click", auClic);
			btn.addEventListener("click", auClic);
		}
	}

	//#endregion

	//#endregion
}

let game: Game;

function recreateGame() {
	game = new Game();
	game.init();
}

recreateGame();

export { game, recreateGame };
