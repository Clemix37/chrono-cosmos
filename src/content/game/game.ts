import IGame from "../../interfaces/IGame";
import IGameConfig from "../../interfaces/IGameConfig";
import { SESSIONS_KEYS, getDataFromLocalStorage } from "../utils/data/data";
import { formatEnergy, toDecimal } from "../utils/formulas/formulas";
import { getListOfGameStatus, getOrCreateConfig } from "../utils/utils";
import { GameContent, getNextGameContent, getOrCreateGameContent } from "./gameContent";
import { launchGameScreen } from "../screens/playingScreen";
import { launchGameStartScreen } from "../screens/startScreen";
import { launchGameEndScreen } from "../screens/endScreen";

export class Game implements IGame {

    //#region Properties

    energy: number;
    config: IGameConfig;
    components: GameContent[];
    resources: GameContent[];
    timeTravelGames?: Game[];
    _intervalle: any;

    //#endregion

    //#region Constructor

    constructor(){
        this.energy = getDataFromLocalStorage("energyCounter") ?? 3;
        this.config = getOrCreateConfig();
        const gameContent = getOrCreateGameContent();
        this.components = gameContent.components;
        this.resources = gameContent.resources;
        this.#displayEnergy(this.energy);
    }

    //#endregion

    init(){
        this.launchActualScreen();
    }

    // Save the energy, the config, and the contents in the localStorage
    saveGame(){
        localStorage.setItem(SESSIONS_KEYS.ENERGY, JSON.stringify(this.energy));
        localStorage.setItem(SESSIONS_KEYS.GAME_CONFIG, JSON.stringify(this.config))
        localStorage.setItem(SESSIONS_KEYS.GAME_CONTENT, JSON.stringify({ components: this.components, resources: this.resources }));
    }

    // remove every item in the local storage 
    // So that when reloading, no game already exists
    clearDataFromLocalStorage(){
        localStorage.removeItem(SESSIONS_KEYS.ENERGY);
        localStorage.removeItem(SESSIONS_KEYS.GAME_CONFIG)
        localStorage.removeItem(SESSIONS_KEYS.GAME_CONTENT);
        window.location.reload();
    }

    async launchActualScreen(){
        const listOfGameStatuses = getListOfGameStatus();
        switch(this.config.status){
            case listOfGameStatuses.notStarted:
                await launchGameStartScreen();
                break;
            case listOfGameStatuses.playing:
            case listOfGameStatuses.paused:
                await launchGameScreen(this.config);
                this.#displayAndAttachGameContents();
                break;
            case listOfGameStatuses.over:
                await launchGameEndScreen();
                break;
        }
    }

    changeStatus(newStatus: "not started" | "playing" | "paused" | "over"){
        this.config.status = newStatus;
        this.launchActualScreen();
    }

    checkForNewContent(){ 
        const idsContentAlreadyDisplayed = [...this.resources.map(res => res.id), ...this.components.map(comp => comp.id)];
        const nextContent: {components: GameContent[], resources: GameContent[]} = getNextGameContent(this.energy, idsContentAlreadyDisplayed);
        if(nextContent.components.length > 0) this.components.push(...nextContent.components);
        if(nextContent.resources.length > 0) this.resources.push(...nextContent.resources);
        if(nextContent.components.length > 0 || nextContent.resources.length > 0) this.#displayAndAttachGameContents();
    }

    #countEverySecond(){
        if(!!this._intervalle) clearInterval(this._intervalle);
        this.#displayEnergy(this.energy);
        this._intervalle = setInterval(() =>{
            const gainComponents = this.components.reduce((acc, comp) => acc + (comp.level * comp.gainPerSecond), 0);
            const gainResources = this.resources.reduce((acc, res) => acc + (res.level * res.gainPerSecond), 0);
            this.energy = toDecimal(this.energy + gainComponents + gainResources);
            this.#displayEnergy(this.energy);
            this.saveGame();
            this.checkForNewContent();
        }, 1000);
    }

    //#region Display
    
    #displayAndAttachGameContents(): void{
        if(!!this._intervalle) clearInterval(this._intervalle);
        this.saveGame();
        this.#displayGameContents("components-content", this.components);
        this.#displayGameContents("resources-content", this.resources);
        this.#attachEvents();
        if(this.config.status === "playing") this.#countEverySecond();
    }

    #displayGameContents(id: string, contens: GameContent[]): void{
        const div = document.getElementById(id);
        if(!div) return;
        div.innerHTML = "";
        for (let i = 0; i < contens.length; i++) {
            const comp = contens[i];
            const contentHml = comp.getHtmlTemplateGameContent(this.config.status === "paused");
            div.innerHTML += contentHml;
        }
    }

    /**
     * Display the energy given
     * @param ernegy number of energy
     */
    #displayEnergy(ernegy: number): void{
        const energyCounter = document.getElementById("energyCounter");
        if(!energyCounter) return;
        energyCounter.textContent = `${formatEnergy(ernegy)}⚡`;
    }

    //#endregion

    //#region Events

    #attachEvents(){
        const all:GameContent[] = [...this.components, ...this.resources];
        for (let i = 0; i < all.length; i++) {
            const content = all[i];
            if(!content.idBtn) continue;
            const btn = document.getElementById(content.idBtn);
            if(!btn) continue;
            btn.addEventListener("click", () => {
                const cost = content.upgradeCost || content.baseCost;
                if(cost > this.energy) return;
                this.energy = toDecimal(this.energy - cost);
                this.#displayEnergy(this.energy);
                content.upgrade();
                this.#displayAndAttachGameContents();
            });
        }
        // Adds an energy
        const buttonGame: HTMLButtonElement = document.getElementById("button-game") as HTMLButtonElement;
        buttonGame.addEventListener("click", () => {
            this.energy += 1;
            this.#displayEnergy(this.energy);
        });
    }

    //#endregion
}

const game = new Game();
game.init();

export { game };