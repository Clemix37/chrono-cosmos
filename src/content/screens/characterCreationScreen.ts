import Character from "../Classes/Character";
import { CHARACTER_STATS, IDS_GAME_DIVS, NB_RANDOM_CHARACTER } from "../utils/constants";
import { toDecimal } from "../utils/formulas/formulas";

const characterCreationScreenUrl = "./screens/character-creation.html";
let charactersGenerated: Character[] = [];

//#region Random generation

function generateRandomStat(keyStat: "speed" | "strength" | "intelligence"): number {
	const [minValue, maxValue, weight]: [number, number, number] = CHARACTER_STATS[keyStat] as [number, number, number];
	const probas: number[] = [];
	for (let i = minValue; i < maxValue; i += weight) {
		probas.push(i);
	}
	return toDecimal(probas[Math.floor(Math.random() * probas.length)], 2);
}

function generateThreeRandomCharacters(): Character[] {
	charactersGenerated = [];
	for (let i = 0; i < NB_RANDOM_CHARACTER; i++) {
		const [speed, strength, intelligence] = [
			generateRandomStat("speed"),
			generateRandomStat("strength"),
			generateRandomStat("intelligence"),
		];
		const newChar: Character = new Character({ speed, strength, intelligence });
		charactersGenerated.push(newChar);
	}
	return charactersGenerated;
}

//#endregion

/**
 * Returns the character generated from its id
 * @returns {Character}
 */
function getCharacterGeneratedById(id: string): Character {
	console.log(charactersGenerated);
	return charactersGenerated.find((char) => char.id === id) as Character;
}

function getRandomCharacters(): string {
	const characters: Character[] = generateThreeRandomCharacters();
	return characters.reduce(
		(previousDisplay, actualChar) => `${previousDisplay}${actualChar.getDisplayTemplate()}`,
		"",
	);
}

/**
 * Display characters randomly generated
 */
function displayRandomCharacters() {
	const display = getRandomCharacters();
	const listCharacters: HTMLDivElement = document.getElementById(IDS_GAME_DIVS.LIST_CHARACTERS) as HTMLDivElement;
	listCharacters.innerHTML = display;
}

/**
 * Gets the HTML file of the end screen and display it inside the DOM
 */
async function launchGameCharacterCreationScreen(): Promise<void> {
	const res = await fetch(characterCreationScreenUrl);
	const htmlContent = await res.text();
	document.body.innerHTML = htmlContent;
}

export { launchGameCharacterCreationScreen, displayRandomCharacters, getCharacterGeneratedById };
