import Character from "../src/content/Classes/Character";
import { CHARACTER_PROPS, CHARACTER_STATS } from "../src/content/utils/constants";
import {
	generateRandomStat,
	generateThreeRandomCharacters,
	getCharacterGeneratedById,
} from "../src/content/screens/characterCreationScreen";

describe("Character creation", () => {
	let character: Character;
	beforeEach(() => {
		character = new Character({ speed: 1, intelligence: 2, strength: 3 });
	});
	test("it should create character with properties", () => {
		expect(character).toBeDefined();
		expect(character).toBeInstanceOf(Character);
		// Speed
		expect(character).toHaveProperty("speed");
		expect(character.speed).toBeDefined();
		expect(character.speed).toBe(1);
		// Intelligence
		expect(character).toHaveProperty("intelligence");
		expect(character.intelligence).toBeDefined();
		expect(character.intelligence).toBe(2);
		// Strength
		expect(character).toHaveProperty("strength");
		expect(character.strength).toBeDefined();
		expect(character.strength).toBe(3);
		// Name
		expect(character).toHaveProperty("name");
		expect(character.name).toBeDefined();
		expect(character.name).toBe(CHARACTER_PROPS.NAME);
		// Age
		expect(character).toHaveProperty("age");
		expect(character.age).toBeDefined();
		expect(character.age).toBe(CHARACTER_PROPS.AGE);
		// Id
		expect(character).toHaveProperty("id");
	});

	test("it should return the template without error", () => {
		const templateGot: string = character.getDisplayTemplate();
		expect(templateGot).toBeDefined();
	});
});

describe("Generation of random stats", () => {
	// Speed
	test("it should generate random speed", () => {
		const randomStat = generateRandomStat("speed");
		expect(randomStat).toBeDefined();
		expect(randomStat).toBeLessThanOrEqual(CHARACTER_STATS.speed[1]);
		expect(randomStat).toBeGreaterThanOrEqual(CHARACTER_STATS.speed[0]);
	});
	// Intelligence
	test("it should generate random intelligence", () => {
		const randomStat = generateRandomStat("intelligence");
		expect(randomStat).toBeDefined();
		expect(randomStat).toBeLessThanOrEqual(CHARACTER_STATS.intelligence[1]);
		expect(randomStat).toBeGreaterThanOrEqual(CHARACTER_STATS.intelligence[0]);
	});
	// Strength
	test("it should generate random strength", () => {
		const randomStat = generateRandomStat("strength");
		expect(randomStat).toBeDefined();
		expect(randomStat).toBeLessThanOrEqual(CHARACTER_STATS.strength[1]);
		expect(randomStat).toBeGreaterThanOrEqual(CHARACTER_STATS.strength[0]);
	});
});

describe("Generation of three characters", () => {
	let characters: Character[] = [];
	beforeAll(() => {
		characters = generateThreeRandomCharacters();
	});
	test("it should generate three different characters", () => {
		expect(characters.length).toBe(3);
		const first = characters[0];
		const second = characters[1];
		const third = characters[2];
		// Different ids
		expect(first.id).not.toBe(second.id);
		expect(second.id).not.toBe(third.id);
		// Same names
		expect(first.name).toBe(second.name);
		expect(second.name).toBe(third.name);
		// Same age
		expect(first.age).toBe(second.age);
		expect(second.age).toBe(third.age);
		// Different stats
		const getStatsAsString = (c: Character): string => `${c.speed}${c.strength}${c.intelligence}`;
		expect(getStatsAsString(first)).not.toBe(getStatsAsString(second));
		expect(getStatsAsString(second)).not.toBe(getStatsAsString(third));
	});
	test("it should find characters by id", () => {
		expect(characters.length).toBe(3);
		const first = characters[0];
		const second = characters[1];
		const third = characters[2];
		const checkIfCharFound = (c: Character): void => {
			const found: Character = getCharacterGeneratedById(c.id);
			expect(found).toBeDefined();
			expect(found).toBeInstanceOf(Character);
			expect(found).toHaveProperty("id");
			expect(found.id).toBe(c.id);
			expect(found).toHaveProperty("name");
			expect(found.name).toBe(c.name);
			expect(found).toHaveProperty("age");
			expect(found.age).toBe(c.age);
			expect(found).toHaveProperty("speed");
			expect(found.speed).toBe(c.speed);
			expect(found).toHaveProperty("intelligence");
			expect(found.intelligence).toBe(c.intelligence);
			expect(found).toHaveProperty("strength");
			expect(found.strength).toBe(c.strength);
		};
		// First
		checkIfCharFound(first);
		// Second
		checkIfCharFound(second);
		// Third
		checkIfCharFound(third);
	});
});
