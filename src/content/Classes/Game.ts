import IGame from "../../interfaces/IGame";
import { getDataFromLocalStorage } from "../utils/data/data";
import { toDecimal } from "../utils/formulas/formulas";
import { getOrCreateConfig } from "../utils/utils";
import GameContent from "./GameContent";
import { launchGameScreen } from "../screens/playingScreen";
import { launchGameStartScreen } from "../screens/startScreen";
import { launchGameEndScreen } from "../screens/endScreen";
import { CHARACTER_STATS, CLASSES_GAME, GameStatus, SESSIONS_KEYS } from "../utils/constants";
import {
	displayRandomCharacters,
	getCharacterGeneratedById,
	launchGameCharacterCreationScreen,
} from "../screens/characterCreationScreen";
import Character from "./Character";
import DisplayManager from "./DisplayManager";
import GameStateManager from "./GameStateManager";
import Spaceship from "./Spaceship";

export class Game implements IGame {
	//#region Properties

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
		GameStateManager.spaceship = new Spaceship(getDataFromLocalStorage(SESSIONS_KEYS.SPACESHIP) ?? {});
		GameStateManager.energy = getDataFromLocalStorage(SESSIONS_KEYS.ENERGY) ?? 3;
		GameStateManager.config = getOrCreateConfig();
		GameStateManager.character = getDataFromLocalStorage(SESSIONS_KEYS.GAME_CHAR) ?? null;
		const gameContent = GameContent.getOrCreateGameContent();
		GameStateManager.components = gameContent.components;
		GameStateManager.resources = gameContent.resources;
		this.#lastClickDate = new Date();
		DisplayManager.displayEnergy();
		GameStateManager.game = this;
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
		localStorage.setItem(SESSIONS_KEYS.ENERGY, JSON.stringify(GameStateManager.energy));
		localStorage.setItem(SESSIONS_KEYS.GAME_CONFIG, JSON.stringify(GameStateManager.config));
		localStorage.setItem(
			SESSIONS_KEYS.GAME_CONTENT,
			JSON.stringify({
				components: GameStateManager.components,
				resources: GameStateManager.resources,
			}),
		);
		localStorage.setItem(SESSIONS_KEYS.GAME_CHAR, JSON.stringify(GameStateManager.character));
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
		switch (GameStateManager.config.status) {
			case GameStatus.notStarted:
				await launchGameStartScreen();
				break;
			case GameStatus.characterCreation:
				await launchGameCharacterCreationScreen();
				displayRandomCharacters();
				this.#attachCharacterSelectEvent();
				break;
			case GameStatus.playing:
				await launchGameScreen(GameStateManager.config);
				this.#displayAndAttachGameContents();
				this.#attachAddOneEnergyBtn();
				this.#displayCurrentCharacter();
				break;
			case GameStatus.over:
				await launchGameEndScreen();
				break;
		}
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
		DisplayManager.displayEnergy();
		this._interval = setInterval(() => {
			const gainComponents = GameStateManager.components.reduce(
				(acc, comp) => acc + comp.level * comp.gainPerSecond,
				0,
			);
			const gainResources = GameStateManager.resources.reduce(
				(acc, res) => acc + res.level * res.gainPerSecond,
				0,
			);
			GameStateManager.energy = toDecimal(GameStateManager.energy + gainComponents + gainResources);
			DisplayManager.displayEnergy();
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
		DisplayManager.display();
		this.#attachEvents();
		if (GameStateManager.config.status === "playing") this.#countEverySecond();
	}

	/**
	 * Display the current character
	 */
	#displayCurrentCharacter(): void {
		const strengthBar: HTMLElement = document.querySelector("#strength-bar") as HTMLElement;
		const intelligenceBar: HTMLElement = document.querySelector("#intelligence-bar") as HTMLElement;
		const speedBar: HTMLElement = document.querySelector("#speed-bar") as HTMLElement;
		strengthBar.style.width = `${
			!GameStateManager.character?.strength
				? 0
				: (GameStateManager.character?.strength / CHARACTER_STATS.strength[1]) * 100
		}%`;
		intelligenceBar.style.width = `${
			!GameStateManager.character?.intelligence
				? 0
				: (GameStateManager.character?.intelligence / CHARACTER_STATS.intelligence[1]) * 100
		}%`;
		speedBar.style.width = `${
			!GameStateManager.character?.speed
				? 0
				: (GameStateManager.character?.speed / CHARACTER_STATS.speed[1]) * 100
		}%`;
	}

	//#endregion

	//#region Events

	/**
	 * Attach every event on the DOM
	 */
	#attachEvents() {
		const all: GameContent[] = [...GameStateManager.components, ...GameStateManager.resources];
		for (let i = 0; i < all.length; i++) {
			const content = all[i];
			if (!content.idBtn) continue;
			const btn = document.getElementById(content.idBtn);
			if (!btn) continue;
			btn.addEventListener("click", () => {
				const cost = content.upgradeCost || content.baseCost;
				if (cost > GameStateManager.energy) return;
				GameStateManager.energy = toDecimal(GameStateManager.energy - cost);
				DisplayManager.displayEnergy();
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
			GameStateManager.energy += 1;
			DisplayManager.displayEnergy();
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
			GameStateManager.character = char;
			// Saves the current character selected
			this.saveGame();
			GameStateManager.changeStatus(GameStatus.playing);
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
