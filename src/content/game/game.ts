import IGame from "../../interfaces/IGame";
import IGameCanvasConfig from "../../interfaces/IGameCanvasConfig";
import IGameConfig from "../../interfaces/IGameConfig";
import { getDataFromLocalStorage } from "../utils/data/data";
import { toDecimal } from "../utils/formulas/formulas";
import { getListOfGameStatus, getOrCreateConfig } from "../utils/utils";
import GameCanvas from "./gameCanvas";
import { GameContent, getNextGameContent, getOrCreateGameContent } from "./gameContent";
import { launchGameScreen } from "./screens/playingScreen";
import { launchGameStartScreen } from "./screens/startScreen";

export class Game implements IGame {

    //#region Properties

    energy: number;
    config: IGameConfig;
    components: GameContent[];
    resources: GameContent[];
    timeTravelGames?: Game[];
    canvas: GameCanvas;
    _intervalle: any;

    //#endregion

    //#region Constructor

    constructor(){
        this.energy = getDataFromLocalStorage("energyCounter") ?? 5;
        this.config = getOrCreateConfig();
        const gameContent = getOrCreateGameContent();
        this.components = gameContent.components;
        this.resources = gameContent.resources;
        this.#displayEnergy(this.energy);
        const configCanvas: IGameCanvasConfig = {
            id: "canvas",
            width: Math.floor(window.innerWidth - 200),
            height: 300,
            bgColor: "#00c4ff",
        };
        this.canvas = new GameCanvas(configCanvas);
        window.requestAnimationFrame(() => this.#displayOnEachFrame());
    }

    //#endregion

    init(){
        this.launchGameScreen();
    }

    // Save the energy, the config, and the contents in the localStorage
    saveGame(){
        localStorage.setItem("energyCounter", JSON.stringify(this.energy));
        localStorage.setItem("gameConfig", JSON.stringify(this.config))
        localStorage.setItem("gameContent", JSON.stringify({components:this.components, resources:this.resources}));
    }

    // remove every item in the local storage 
    // So that when reloading, no game already exists
    clearDataFromLocalStorage(){
        localStorage.removeItem("energyCounter");
        localStorage.removeItem("gameConfig")
        localStorage.removeItem("gameContent");
        window.location.reload();
    }

    launchGameScreen(){
        const listOfGameStatuses = getListOfGameStatus();
        switch(this.config.status){
            case listOfGameStatuses.notStarted:
                launchGameStartScreen();
                break;
            case listOfGameStatuses.playing:
            case listOfGameStatuses.paused:
                launchGameScreen(this.config);
                this.#displayAndAttachGameContents();
                break;
            case listOfGameStatuses.over:
                //@todo
                break;
        }
    }

    changeStatus(newStatus: "not started" | "playing" | "paused" | "over"){
        this.config.status = newStatus;
        this.launchGameScreen();
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

    #displayOnEachFrame(): void{
        // We display a random component
        this.canvas.displayRandomContent(this.components);
        // We display a random resource
        this.canvas.displayRandomContent(this.resources);

        window.requestAnimationFrame(() => this.#displayOnEachFrame());
    }
    
    #displayAndAttachGameContents(): void{
        if(!!this._intervalle) clearInterval(this._intervalle);
        this.saveGame();
        this.#displayGameContents("components-content", this.components);
        this.#displayGameContents("resources-content", this.resources);
        this.#attachEvents();
        if(this.config.status === "playing") this.#countEverySecond();
        this.canvas.init();
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
        energyCounter.textContent = `${ernegy}⚡`;
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
    }

    //#endregion
}

const game = new Game();
game.init();

export {game};