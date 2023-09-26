"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameStart_1 = require("./gameStart");
const IDS_CONTENTS = {
    GAME_START: "",
    GAME_END: "",
    GAME: "",
};
const gameStatus = 0;
if (gameStatus === 0)
    (0, gameStart_1.launchGameStartScreen)();
