export const IDS_GAME_DIVS = {
	GAME_START: "div-game-start-screen",
	CHARACTER_CREATION: "div-character-creation-screen",
	LIST_CHARACTERS: "div-list-characters",
	DISPLAY_CHAR: "div-display-character",
	GAME_END: "div-game-end-screen",
	GAME: "div-game-content",
} as const;

export const CLASSES_GAME = {
	SELECT_CHARACTER: "btn-select-character",
};

export const GameStatus = {
	notStarted: "not started",
	characterCreation: "character creation",
	playing: "playing",
	paused: "paused",
	over: "over",
} as const;

export const IDS_BTNS_SCREENS = {
	GAME_START: {
		SELECT_CHARACTER: "btn-choose-character-game",
	},
	GAME_END: {
		RESTART: "btnRestartGame",
	},
	GAME: {
		PAUSE: "btn-pause-game",
		CLEAR_DATA: "btn-clear-data",
	},
	GAME_PAUSED: {
		RESUME: "btn-resume-game",
	},
} as const;

export const COLORS = {
	BACKGROUND: "#070707",
	TEXT: "#EFEFEF",
	PRIMARY: "#3E4ED6",
	SECONDARY: "#34D1BF",
	TERTIARY: "#D1345B",
} as const;

export const SESSIONS_KEYS = {
	GAME_CONFIG: "ccGameConfig",
	GAME_CONTENT: "ccGameContent",
	ENERGY: "ccEnergyCounter",
	GAME_CHAR: "ccGameChar",
} as const;

export const NUMBERS = {
	THOUSAND: 1e3,
	MILLION: 1e6,
	BILLION: 1e9,
} as const;

export const NB_RANDOM_CHARACTER = 3;

export const CHARACTER_PROPS_STATS = {
	SPEED: "speed",
	STRENGTH: "strength",
	INTELLIGENCE: "intelligence",
} as const;

/**
 * Detailed as follow:
 * 	{ prop: [minValue, maxValue, step] }
 */
export const CHARACTER_STATS = {
	speed: [1, 3, 0.2],
	strength: [1, 5, 0.4],
	intelligence: [1, 3, 0.1],
} as const;

export const CHARACTER_PROPS = {
	AGE: 25,
	NAME: "Jack",
} as const;
