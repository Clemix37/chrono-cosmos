import IGame from "../../interfaces/IGame";
import IGameConfig from "../../interfaces/IGameConfig";
import { getDataFromLocalStorage } from "../utils/data/data";
import { formatEnergy, toDecimal } from "../utils/formulas/formulas";
import { getOrCreateConfig } from "../utils/utils";
import { GameContent, getOrCreateGameContent } from "./GameContent";
import { launchGameScreen } from "../screens/playingScreen";
import { launchGameStartScreen } from "../screens/startScreen";
import { launchGameEndScreen } from "../screens/endScreen";
import { CLASSES_GAME, GameStatus, IDS_GAME_DIVS, SESSIONS_KEYS } from "../utils/constants";
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
		this.#displayGameComponents(
			[...this.components, ...this.resources].sort((a, b) => (a.upgradeCost ?? 0) - (b.upgradeCost ?? 0)),
		);
		this.#attachEvents();
		if (this.config.status === "playing") this.#countEverySecond();
	}

	/**
	 * Display game contents
	 * @param contents
	 * @returns {void}
	 */
	#displayGameComponents(contents: GameContent[]): void {
		const div: HTMLDivElement = document.getElementById("div-game-contents-shop") as HTMLDivElement;
		if (!div) return;
		const display = contents.reduce(
			(prevDisplay, currContent) => `${prevDisplay}${currContent.getHtmlTemplateGameContent(this.energy)}`,
			``,
		);
		div.innerHTML = display;
	}

	/**
	 * Display the energy given
	 * @param ernegy number of energy
	 */
	#displayEnergy(ernegy: number): void {
		const energyCounter = document.getElementById("lbl-energy-counter");
		if (!energyCounter) return;
		energyCounter.textContent = `${formatEnergy(ernegy)}⚡`;
	}

	/**
	 * Display the current character
	 */
	#displayCurrentCharacter(): void {
		const divDisplayChar: HTMLDivElement = document.getElementById(IDS_GAME_DIVS.DISPLAY_CHAR) as HTMLDivElement;
		divDisplayChar.innerHTML = `<span>Speed: ${this.character?.speed}, Strength: ${this.character?.strength}, Intelligence: ${this.character?.intelligence}</span>`;
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
