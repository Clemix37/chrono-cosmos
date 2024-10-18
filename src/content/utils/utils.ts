import { IDS_GAME_DIVS } from "./constants";

/**
 * Hides every game div but the one in parameter
 * @param idDivToShow
 */
const hideOtherDivsThan = (idDivToShow: string): void => {
	const idsDivs = Object.values(IDS_GAME_DIVS);
	for (let i = 0; i < idsDivs.length; i++) {
		const id = idsDivs[i];
		const divId = document.getElementById(id);
		if (!divId) continue;
		divId.style.display = id === idDivToShow ? "flex" : "none";
	}
};

export * from "./configs/configs";
export { hideOtherDivsThan };
