import Character from "../Classes/Character";
import { CHARACTER_STATS, IDS_GAME_DIVS, NB_RANDOM_CHARACTER } from "../utils/constants";
import { toDecimal } from "../utils/formulas/formulas";

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
	const characters: Character[] = [];
	for (let i = 0; i < NB_RANDOM_CHARACTER; i++) {
		const [speed, strength, intelligence] = [
			generateRandomStat("speed"),
			generateRandomStat("strength"),
			generateRandomStat("intelligence"),
		];
		const newChar: Character = new Character({ speed, strength, intelligence });
		characters.push(newChar);
	}
	return characters;
}

//#endregion

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
	const res = await fetch("./screens/character-creation.html");
	const htmlContent = await res.text();
	document.body.innerHTML = htmlContent;
}

export { launchGameCharacterCreationScreen, displayRandomCharacters };
