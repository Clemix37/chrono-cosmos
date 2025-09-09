"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
class GameStateManager {
    //#endregion
    /**
     * Change the current game status
     * @param newStatus
     */
    static changeStatus(newStatus) {
        var _a;
        GameStateManager.config.status = newStatus;
        (_a = GameStateManager.game) === null || _a === void 0 ? void 0 : _a.launchActualScreen();
    }
    /**
     * Upgrade the spaceship
     */
    static upgradeSpaceship() {
        GameStateManager.spaceship.upgrade();
    }
}
//#region Properties
// Configuration of the game
GameStateManager.config = (0, utils_1.getDefaultConfig)();
// Energy of user
GameStateManager.energy = 3;
// Components
GameStateManager.components = [];
// Resources
GameStateManager.resources = [];
exports.default = GameStateManager;
