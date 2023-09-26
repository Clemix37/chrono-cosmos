
const IDS_DIVS = {
    GAME_START: "gameStartScreen",
    GAME_END: "gameEndScreen",
    GAME: "gameContent",
};

const hideOtherDivsThan = (divIdNotToHide: string): void => {
    const idsDivs = Object.values(IDS_DIVS);
    for (let i = 0; i < idsDivs.length; i++) {
        const id = idsDivs[i];
        const divId = document.getElementById(id);
        if(!divId) continue;
        divId.style.display = id === divIdNotToHide ? "block" : "none";
    }
};

export * from "./configs/configs";
export {
    IDS_DIVS, hideOtherDivsThan
};