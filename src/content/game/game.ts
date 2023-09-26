import IGame from "../../interfaces/IGame";
import IGameConfig from "../../interfaces/IGameConfig";
import { getDataFromLocalStorage } from "../utils/data/data";
import { toDecimal } from "../utils/formulas/formulas";
import { getListOfGameStatus, getOrCreateConfig } from "../utils/utils";
import { GameContent, getNextGameContent, getOrCreateGameContent } from "./gameContent";
import { launchGameScreen } from "./screens/playingScreen";
import { launchGameStartScreen } from "./screens/startScreen";

class Game implements IGame {

    energy: number;
    config: IGameConfig;
    components: GameContent[];
    resources: GameContent[];
    _intervalle: any;

    constructor(){
        this.energy = getDataFromLocalStorage("energyCounter") ?? 0;
        this.config = getOrCreateConfig();
        const gameContent = getOrCreateGameContent();
        this.components = gameContent.components;
        this.resources = gameContent.resources;
        this.#displayEnergy();
    }

    init(){
        this.launchGameScreen();
    }

    saveGame(){
        localStorage.setItem("energyCounter", JSON.stringify(this.energy));
        localStorage.setItem("gameConfig", JSON.stringify(this.config))
        localStorage.setItem("gameContent", JSON.stringify({components:this.components, resources:this.resources}));
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
                this.#displayGameContents();
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
        const nextContent:{components:GameContent[],resources:GameContent[]} = getNextGameContent(this.energy, idsContentAlreadyDisplayed);
        if(nextContent.components.length>0) this.components.push(...nextContent.components);
        if(nextContent.resources.length>0) this.resources.push(...nextContent.resources);
        if(nextContent.components.length>0 || nextContent.resources.length>0) this.#displayGameContents();
    }

    #countEverySecond(){
        if(!!this._intervalle) clearInterval(this._intervalle);
        this.#displayEnergy();
        this._intervalle = setInterval(() =>{
            const gainComponents = this.components.reduce((acc, comp) => acc + (comp.level * comp.gainPerSecond), 0);
            const gainResources = this.resources.reduce((acc, res) => acc + (res.level * res.gainPerSecond), 0);
            this.energy = toDecimal(this.energy + gainComponents + gainResources);
            this.#displayEnergy();
            this.saveGame();
            this.checkForNewContent();
        }, 1000);
    }

    //#region Utils HTML

    #getHtmlLine(content:string){
        return `<div class="ligne">${content}</div>`;
    }

    #getHtmlTemplateResource(res: GameContent){
        const ligneBtn = this.config.status === "paused" ? "" : `
            <div class="ligne">
                <button class="btn btn-tertiary" id="${res.idBtn}">${res.upgradeCost}</button>
            </div>
        `;
        return `
            <div class="colonne">
                <div class="ligne">
                    <h1>${res.name} (${res.level})</h1>
                </div>
                ${ligneBtn}
            </div>
        `;
    }

    //#endregion

    //#region Display
    
    #displayGameContents(){
        if(!!this._intervalle) clearInterval(this._intervalle);
        this.saveGame();
        this.#displayComponents();
        this.#displayResources();
        if(this.config.status === "playing") this.#countEverySecond();
    }
    
    #displayComponents(){
        const ID_DIV_COMPS = "components-content";
        const div = document.getElementById(ID_DIV_COMPS);
        if(!div) return;
        div.innerHTML = "";
        for (let i = 0; i < this.components.length; i++) {
            const comp = this.components[i];
            const contentHml = this.#getHtmlLine(``);
            div.innerHTML += contentHml;
            this.#attachEvents(comp);
        }
    }

    #displayResources(){
        const ID_DIV_RESOURCES = "resources-content";
        const div = document.getElementById(ID_DIV_RESOURCES);
        if(!div) return;
        div.innerHTML = "";
        for (let i = 0; i < this.resources.length; i++) {
            const res = this.resources[i];
            const contentHml = this.#getHtmlLine(this.#getHtmlTemplateResource(res));
            div.innerHTML += contentHml;
            this.#attachEvents(res);
        }
    }

    #displayEnergy(){
        const energyCounter = document.getElementById("energyCounter");
        if(!energyCounter) return;
        energyCounter.textContent = `${this.energy}⚡`;
    }

    //#endregion

    //#region Events

    #attachEvents(content:GameContent){
        if(!content.idBtn) return;
        const btn = document.getElementById(content.idBtn);
        if(!btn) return;
        btn.addEventListener("click", () => {
            const cost = content.upgradeCost || content.baseCost;
            if(cost > this.energy) return;
            this.energy = toDecimal(this.energy - cost);
            this.#displayEnergy();
            content.upgrade();
            this.#displayGameContents();
        });
    }

    //#endregion
}

const game = new Game();
game.init();

export {game};