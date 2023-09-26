export default interface IGameContent {
    id: string;
    name: string; // Name of the component / resource
    type: "component" | "resource";
    gainPerSecond: number;
    baseCost: number; // The base cost
    exponent: number; // Helps in the formula for upgrading the cost gradually
    level: number; // Level of the production
    maxLevel: number; // Max level to get 
    upgradeCost?: number; // Cost of the upgrade to get to next level
    progressToNext?: number; // The percentage of progress to get to next production
    idBtn?: string; // Id of the button to be displayed
    // btn: HTMLButtonElement | null; // Button element to click on
}