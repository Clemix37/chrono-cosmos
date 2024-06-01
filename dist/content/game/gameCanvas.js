"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../utils/data/data");
class GameCanvas {
    //#endregion
    //#region Constructor
    constructor(config) {
        this.id = config.id;
        this.width = config.width;
        this.height = config.height;
        this.bgColor = config.bgColor;
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext("2d");
    }
    //#endregion
    init() {
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.canvas.style.background = this.bgColor;
    }
    /**
     * Gets a random content
     * Display it above the canvas, and make it fall
     * @param contents
     */
    displayRandomContent(contents) {
        const everyContentWithProbabilities = [];
        contents.forEach(content => {
            for (let i = 0; i < content.level; i++) {
                everyContentWithProbabilities.push(content);
            }
        });
        const randomContent = (0, data_1.getRandomFromArray)(everyContentWithProbabilities);
        if (!(randomContent === null || randomContent === void 0 ? void 0 : randomContent.img))
            return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        // const img = new Image();
        // img.src = `./img/${randomContent.type}s/${randomContent.img.url}`;
        // this.ctx.drawImage(img, Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height), randomContent.img.width, randomContent.img.height);
    }
}
exports.default = GameCanvas;
