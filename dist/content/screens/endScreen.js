"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchGameEndScreen = void 0;
/**
 * Gets the HTML file of the end screen and display it inside the DOM
 */
function launchGameEndScreen() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("../../../screens/end.html");
        const htmlContent = yield res.text();
        document.body.innerHTML = htmlContent;
    });
}
exports.launchGameEndScreen = launchGameEndScreen;
