import { getDataFromLocalStorage } from "../data/data";

const getOrCreateComponents = (): any => {
  let localComp = getDataFromLocalStorage("gameComponents");
  if (!localComp) localComp = getDefaultComponents();
  return localComp;
};

const getDefaultComponents = (): any[] => {
  const comps: any[] = [];
  return comps;
};

export { getOrCreateComponents };
