import { GameContent } from "../src/content/Classes/GameContent";
import { getCostUpgraded } from "../src/content/utils/formulas/formulas";
import IGameContent from "../src/interfaces/IGameContent";

const gameContent: IGameContent = {
	id: "test",
	name: "CTHE",
	baseCost: 4,
	exponent: 2,
	type: "component",
	gainPerSecond: 1,
	level: 1,
	maxLevel: 200,
};
let newGameContent: GameContent;

beforeEach(() => {
	newGameContent = new GameContent(gameContent);
});

test("game content instantiated correctly", () => {
	expect(newGameContent).toBeDefined();
	expect(newGameContent).toEqual({
		id: "test",
		name: "CTHE",
		baseCost: 4,
		exponent: 2,
		type: "component",
		gainPerSecond: 1,
		level: 1,
		maxLevel: 200,
		upgradeCost: 4,
		idBtn: "btn-component-cthe",
	});
});

test("game content upgrade correct", () => {
	const oldLevel = newGameContent.level;
	newGameContent.upgrade();

	expect(newGameContent).toBeDefined();
	expect(newGameContent.level).toBe(oldLevel + 1);
	expect(newGameContent.upgradeCost).toBeDefined();
	expect(newGameContent.upgradeCost).toBe(
		getCostUpgraded(newGameContent.baseCost, newGameContent.exponent, oldLevel + 1),
	);
});
