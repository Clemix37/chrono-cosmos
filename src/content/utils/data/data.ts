
const getDataFromLocalStorage = (key: string):any => {
    const data = localStorage.getItem(key);
    if(data) return JSON.parse(data);
    else return null;
};

export {getDataFromLocalStorage};