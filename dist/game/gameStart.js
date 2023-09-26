"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchGameStartScreen = void 0;
const IDS_BTNS = {
    START: "btnLaunchGame"
};
const ID_RES = "res";
const launchGameStartScreen = () => {
    var _a;
    (_a = document.getElementById(IDS_BTNS.START)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        console.log("yess");
        const res = document.getElementById(ID_RES);
        console.log(res);
        if (!res)
            return;
        res.textContent = "GAME ON";
    });
};
exports.launchGameStartScreen = launchGameStartScreen;
