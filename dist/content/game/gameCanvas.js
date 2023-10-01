"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameCanvas {
    constructor(config) {
        this.id = config.id;
        this.width = config.width;
        this.height = config.height;
        this.bgColor = config.bgColor;
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext("2d");
    }
    init() {
        console.log("Game canvas init");
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.canvas.style.background = this.bgColor;
        this.displayPlayer();
    }
    displayPlayer() {
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
exports.default = GameCanvas;
