import Character from "../content/Classes/Character";
import { Game } from "../content/Classes/Game";
import GameContent from "../content/Classes/GameContent";
import IGameConfig from "./IGameConfig";

export default interface IGame {
	timeTravelGames?: Game[]; // Possible previous games before travel
}
