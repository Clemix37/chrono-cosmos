import IGame from "../../interfaces/IGame";
import IGameConfig from "../../interfaces/IGameConfig";
import { getDataFromLocalStorage } from "../utils/data/data";
import { formatEnergy, toDecimal } from "../utils/formulas/formulas";
import { getOrCreateConfig } from "../utils/utils";
import { GameContent, getNextGameContent, getOrCreateGameContent } from "./GameContent";
import { launchGameScreen } from "../screens/playingScreen";
import { launchGameStartScreen } from "../screens/startScreen";
import { launchGameEndScreen } from "../screens/endScreen";
import { GameStatus, SESSIONS_KEYS } from "../utils/constants";
import { displayRandomCharacters, launchGameCharacterCreationScreen } from "../screens/characterCreationScreen";
import Character from "./Character";

export class Game implements IGame {
	//#region Properties

	/**
	 * Energy counter
	 */
	energy: number;
	/**
	 * Character the player is playing
	 */
	// character: Character;
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
	 * Game passed as the player traveled through time
	 */
	timeTravelGames?: Game[];
	/**
	 * Interval by whoch game refreshes
	 */
	_interval?: NodeJS.Timeout;

	//#endregion

	//#region Constructor

	constructor() {
		this.energy = getDataFromLocalStorage("energyCounter") ?? 3;
		this.config = getOrCreateConfig();
		const gameContent = getOrCreateGameContent();
		this.components = gameContent.components;
		this.resources = gameContent.resources;
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
	}

	/**
	 * Remove every item in the local storage
	 * So that when reloading, no game already exists
	 */
	clearDataFromLocalStorage() {
		localStorage.removeItem(SESSIONS_KEYS.ENERGY);
		localStorage.removeItem(SESSIONS_KEYS.GAME_CONFIG);
		localStorage.removeItem(SESSIONS_KEYS.GAME_CONTENT);
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
				break;
			case GameStatus.playing:
			case GameStatus.paused:
				await launchGameScreen(this.config);
				this.#displayAndAttachGameContents();
				this.#attachAddOneEnergyBtn();
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

	/**
	 * Gets the game components displayed and gets the next
	 * Display them and attach events if necessary
	 */
	checkForNewContent() {
		const idsContentAlreadyDisplayed = [
			...this.resources.map((res) => res.id),
			...this.components.map((comp) => comp.id),
		];
		const nextContent: {
			components: GameContent[];
			resources: GameContent[];
		} = getNextGameContent(this.energy, idsContentAlreadyDisplayed);
		if (nextContent.components.length > 0) this.components.push(...nextContent.components);
		if (nextContent.resources.length > 0) this.resources.push(...nextContent.resources);
		if (nextContent.components.length > 0 || nextContent.resources.length > 0) this.#displayAndAttachGameContents();
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
			this.saveGame();
			this.checkForNewContent();
		}, 1000);
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
		this.#displayGameComponents("components-content", this.components);
		this.#displayGameComponents("resources-content", this.resources);
		this.#attachEvents();
		if (this.config.status === "playing") this.#countEverySecond();
	}

	/**
	 * Display game contents inside the div which id is in parameter
	 * @param id
	 * @param contents
	 * @returns {void}
	 */
	#displayGameComponents(id: string, contents: GameContent[]): void {
		const div = document.getElementById(id);
		if (!div) return;
		div.innerHTML = "";
		for (let i = 0; i < contents.length; i++) {
			const comp = contents[i];
			const contentHml = comp.getHtmlTemplateGameContent(this.config.status === "paused");
			div.innerHTML += contentHml;
		}
	}

	/**
	 * Display the energy given
	 * @param ernegy number of energy
	 */
	#displayEnergy(ernegy: number): void {
		const energyCounter = document.getElementById("energyCounter");
		if (!energyCounter) return;
		energyCounter.textContent = `${formatEnergy(ernegy)}⚡`;
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
		const buttonGame: HTMLButtonElement = document.getElementById("button-game") as HTMLButtonElement;
		if (!buttonGame) throw new Error("No button to add one energy in the game");
		buttonGame.addEventListener("click", () => {
			this.energy += 1;
			this.#displayEnergy(this.energy);
		});
	}

	//#endregion

	//#endregion
}

const game = new Game();
game.init();

export { game };
