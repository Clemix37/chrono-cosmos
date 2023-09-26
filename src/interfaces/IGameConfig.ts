export default interface IGameConfig {
    playerName: string;
    level: number;
    status: "not started" | "playing" | "paused" | "over";
}