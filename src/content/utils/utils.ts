
const IDS_GAME_DIVS = {
    GAME_START: "div-game-start-screen",
    GAME_END: "div-game-end-screen",
    GAME: "div-game-content",
};

/**
 * Hides every game div but the one in parameter
 * @param idDivToShow 
 */
const hideOtherDivsThan = (idDivToShow: string): void => {
    const idsDivs = Object.values(IDS_GAME_DIVS);
    for (let i = 0; i < idsDivs.length; i++) {
        const id = idsDivs[i];
        const divId = document.getElementById(id);
        if(!divId) continue;
        divId.style.display = id === idDivToShow ? "flex" : "none";
    }
};

export * from "./configs/configs";
export {
    IDS_GAME_DIVS as IDS_DIVS, hideOtherDivsThan,
};