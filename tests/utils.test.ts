import { toDecimal, formatEnergy } from "../src/content/utils/formulas/formulas";
import { getRandomFromArray } from "../src/content/utils/data/data";
import { getDefaultConfig } from "../src/content/utils/configs/configs";
import { getDefaultsComponents } from "../src/content/utils/components/components";
import IGameConfig from "../src/interfaces/IGameConfig";
import { GameContent } from "../src/content/Classes/GameContent";

//#region Formulas

test("formulas toDecimal correct", () => {
	// 2 Decimals
	const twoDecimals = 2;
	expect(toDecimal(2.4156844, twoDecimals)).toBe(2.42);
	expect(toDecimal(2.4136844, twoDecimals)).toBe(2.41);
	// 3 Decimals
	const threeDecimals = 3;
	expect(toDecimal(2.4156844, threeDecimals)).toBe(2.416);
	expect(toDecimal(2.4136844, threeDecimals)).toBe(2.414);
	// 4 Decimals
	const fourDecimals = 4;
	expect(toDecimal(2.4156844, fourDecimals)).toBe(2.4157);
	expect(toDecimal(2.4136844, fourDecimals)).toBe(2.4137);
});

test("formulas formatEnergy correct", () => {
	// Normal
	expect(formatEnergy(0)).toBe(`0`);
	expect(formatEnergy(1)).toBe(`1`);
	expect(formatEnergy(100)).toBe(`100`);
	expect(formatEnergy(999)).toBe(`999`);
	// Thousands
	expect(formatEnergy(1e3)).toBe(`1K`);
	expect(formatEnergy(1e4)).toBe(`10K`);
	expect(formatEnergy(1e5)).toBe(`100K`);
	expect(formatEnergy(999999)).toBe(`999.999K`);
	// Millions
	expect(formatEnergy(1e6)).toBe(`1M`);
	expect(formatEnergy(1e7)).toBe(`10M`);
	expect(formatEnergy(1e8)).toBe(`100M`);
	// Billions
	expect(formatEnergy(1e9)).toBe(`1B`);
	expect(formatEnergy(1e10)).toBe(`10B`);
	expect(formatEnergy(1e11)).toBe(`100B`);
});

//#endregion

//#region Data

test("it should return random element from array", () => {
	const arr: number[] = [];
	for (let i = 0; i < 10000; i++) {
		arr.push(i);
	}
	expect(getRandomFromArray(arr)).toBeDefined();
	expect(getRandomFromArray(arr)).not.toBeNaN();
	expect(getRandomFromArray(arr)).not.toBeNull();
	expect(getRandomFromArray(arr)).toBeGreaterThanOrEqual(0);
	expect(getRandomFromArray(arr)).toBeLessThan(arr.length);
});

//#endregion

//#region Config

test("Gets the default config", () => {
	const defaultConfig: IGameConfig = getDefaultConfig();
	expect(defaultConfig).toBeDefined();
	expect(defaultConfig).toEqual({
		playerName: "",
		level: 0,
		status: "not started",
	});
});

//#endregion
