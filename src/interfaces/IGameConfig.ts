export default interface IGameConfig {
	playerName: string; // Name of the player
	level: number; // Level of the game
	status: "not started" | "playing" | "paused" | "over"; // Status of the game
}
