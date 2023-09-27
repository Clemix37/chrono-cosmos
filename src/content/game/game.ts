import IGame from "../../interfaces/IGame";
import IGameConfig from "../../interfaces/IGameConfig";
import { getDataFromLocalStorage } from "../utils/data/data";
import { toDecimal } from "../utils/formulas/formulas";
import { getListOfGameStatus, getOrCreateConfig } from "../utils/utils";
import { GameContent, getNextGameContent, getOrCreateGameContent } from "./gameContent";
import { launchGameScreen } from "./screens/playingScreen";
import { launchGameStartScreen } from "./screens/startScreen";

export class Game implements IGame {

    energy: number;
    config: IGameConfig;
    components: GameContent[];
    resources: GameContent[];
    timeTravelGames?: Game[];
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

    #getHtmlTemplateGameContent(content: GameContent){
        const ligneBtn = this.config.status === "paused" ? "" : `
            <div class="ligne">
                <button class="btn btn-primary" id="${content.idBtn}">${content.upgradeCost}</button>
            </div>
        `;
        return `
            <div class="colonne game-content">
                <div class="ligne">
                    <h1>Niveau ${content.level}</h1>
                </div>
                <div class="ligne">
                    <span>${content.name}</span>
                </div>
                <div class="ligne">
                    <div class="colonne">
                        <div class="ligne">
                            <span><i class="fa-solid fa-coins icon color-yellow margin-right"></i>${content.gainPerSecond}</span>
                        </div>
                    </div>
                    <div class="colonne">
                        <div class="ligne">
                            <span><i class="fa-solid fa-clock icon color-light-blue margin-right"></i>1s</span>
                        </div>
                    </div>
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
        this.#attachEvents();
        if(this.config.status === "playing") this.#countEverySecond();
    }
    
    #displayComponents(){
        const ID_DIV_COMPS = "components-content";
        const div = document.getElementById(ID_DIV_COMPS);
        if(!div) return;
        div.innerHTML = "";
        for (let i = 0; i < this.components.length; i++) {
            const comp = this.components[i];
            const contentHml = this.#getHtmlLine(this.#getHtmlTemplateGameContent(comp));
            div.innerHTML += contentHml;
        }
    }

    #displayResources(){
        const ID_DIV_RESOURCES = "resources-content";
        const div = document.getElementById(ID_DIV_RESOURCES);
        if(!div) return;
        div.innerHTML = "";
        for (let i = 0; i < this.resources.length; i++) {
            const res = this.resources[i];
            const contentHml = this.#getHtmlLine(this.#getHtmlTemplateGameContent(res));
            div.innerHTML += contentHml;
        }
    }

    #displayEnergy(){
        const energyCounter = document.getElementById("energyCounter");
        if(!energyCounter) return;
        energyCounter.textContent = `${this.energy}⚡`;
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
                this.#displayEnergy();
                content.upgrade();
                this.#displayGameContents();
            });
        }
    }

    //#endregion
}

const game = new Game();
game.init();

export {game};