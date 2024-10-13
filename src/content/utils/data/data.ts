export const SESSIONS_KEYS = {
	GAME_CONFIG: "gameConfig",
	GAME_CONTENT: "gameContent",
	ENERGY: "energyCounter",
};

/**
 * Gets data from the localStorage based on key
 * @param key key of the data in localStorage
 * @returns {any|any[]}
 */
const getDataFromLocalStorage = (key: string): any | any[] => {
	const data = localStorage?.getItem(key);
	if (data) return JSON.parse(data);
	else return null;
};

/**
 * Get a random element from the array
 * @param arr
 * @returns {T}
 */
function getRandomFromArray<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export { getDataFromLocalStorage, getRandomFromArray };
