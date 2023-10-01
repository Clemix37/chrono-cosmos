import IGameCanvas from "../../interfaces/IGameCanvas";
import IGameCanvasConfig from "../../interfaces/IGameCanvasConfig";

export default class GameCanvas implements IGameCanvas {

    id:string;
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    width:number;
    height:number;
    bgColor:string;
    
    constructor(config: IGameCanvasConfig){
        this.id = config.id;
        this.width = config.width;
        this.height = config.height;
        this.bgColor = config.bgColor;
        this.canvas = document.getElementById(this.id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    init(){
        console.log("Game canvas init");
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.canvas.style.background = this.bgColor;
        this.displayPlayer();
    }

    displayPlayer(){
        const img = new Image();
        const ctx = this.ctx;
        img.onload = function () {
            // draw background image
            ctx.drawImage(img, 0, 0, 300, 300);
            // draw a box over the top
            // ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
            // ctx.fillRect(0, 0, 500, 500);
        };

        img.src = 'img/ninja.png';
    }
}