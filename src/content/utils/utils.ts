
const IDS_DIVS = {
    GAME_START: "div-game-start-screen",
    GAME_END: "div-game-end-screen",
    GAME: "div-game-content",
};

const hideOtherDivsThan = (divIdNotToHide: string): void => {
    const idsDivs = Object.values(IDS_DIVS);
    for (let i = 0; i < idsDivs.length; i++) {
        const id = idsDivs[i];
        const divId = document.getElementById(id);
        if(!divId) continue;
        divId.style.display = id === divIdNotToHide ? "flex" : "none";
    }
};

export * from "./configs/configs";
export {
    IDS_DIVS, hideOtherDivsThan,
};