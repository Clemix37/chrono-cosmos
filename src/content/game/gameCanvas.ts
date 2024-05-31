import IGameCanvas from "../../interfaces/IGameCanvas";
import IGameCanvasConfig from "../../interfaces/IGameCanvasConfig";
import { getRandomFromArray } from "../utils/data/data";
import { GameContent } from "./gameContent";

export default class GameCanvas implements IGameCanvas {

    //#region Properties

    id:string;
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    width:number;
    height:number;
    bgColor:string;

    //#endregion

    //#region Constructor
    
    constructor(config: IGameCanvasConfig){
        this.id = config.id;
        this.width = config.width;
        this.height = config.height;
        this.bgColor = config.bgColor;
        this.canvas = document.getElementById(this.id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    //#endregion

    init(){
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.canvas.style.background = this.bgColor;
    }

    /**
     * Gets a random content
     * Display it above the canvas, and make it fall
     * @param contents 
     */
    displayRandomContent(contents: GameContent[]){
        const everyContentWithProbabilities: GameContent[] = [];
        contents.forEach(content => {
            for (let i = 0; i < content.level; i++) {
                everyContentWithProbabilities.push(content);   
            }
        });
        const randomContent = getRandomFromArray(everyContentWithProbabilities);
        if(!randomContent?.img) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        const img = new Image();
        img.src = `./img/${randomContent.type}s/${randomContent.img.url}`;
        this.ctx.drawImage(img, Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height), randomContent.img.width, randomContent.img.height);
    }

}