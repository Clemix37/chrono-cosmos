"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Spaceship {
    //#endregion
    //#region Constructor
    constructor({ level = 0 }) {
        this.level = level;
    }
    //#endregion
    //#region Methods
    upgrade() {
        this.level++;
    }
}
exports.default = Spaceship;
