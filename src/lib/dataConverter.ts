import { RegistryData, GraphArrow, GraphData, GraphNode } from "../types/api"

export const BASE_URL = "https://base.org/";
export const REGISTRY_URL = "https://www.base.org/ecosystem";
export const BASE_LOGO = "/Base_Network_Logo.svg"
export const JSON_URL = "https://raw.githubusercontent.com/base-org/web/master/apps/web/src/data/ecosystem.json";
export const FLEEK_API = "https://fleek-test.network/services/1/ipfs/bafkreigvgarzbg2k6hcbmsbqcwp662vltcv543xh5k7kyfv7e5zv4p6ivm";

// Getting base dapp json data
export const fetchRegistryData = async (
  url: string = JSON_URL
): Promise<RegistryData[]> => {
  const response = await fetch(url);
  return !response.ok
    ? () => {
      throw new Error(
        `Failed to fetch data from ${url}: ${response.statusText}`
      );
    }
    : response.json();
};


export const createImageUrlArray = (registryData: RegistryData[]) => registryData.map(({imageUrl})=> imageUrl);

// Making the top tier parent node
export const createOnChainRegistryNode = (): GraphNode =>
  ({ id: "Onchain Summer Registry", group: "super", description: "Onchain Summer Registry", imageUrl: BASE_LOGO, url: REGISTRY_URL, depth: 1 });


// Making category nodes
export const createCategoryNode = (registryData: RegistryData[]): GraphNode[] =>
  registryData.map(({ tags }) =>
    tags.map((value: string) =>
      ({ id: value, group: value, description: value, imageUrl: `/${value}`, url: value, depth: 2 }))).flat(1);


// Making category arrows 
export const createCategoryArrow = (registryData: RegistryData[]): GraphArrow[] =>
  registryData.map(({ tags }) =>
    tags.map((value: string) =>
      ({ source: createOnChainRegistryNode().id, target: value, name: value, description: value }))).flat(1);


// Making app nodes
export const createAppNode = (registryData: RegistryData[]): GraphNode[] =>
  registryData.map((obj) =>
    ({ id: obj.name, group: String(...obj.tags), description: obj.description, imageUrl: obj.imageUrl, url: obj.url, depth: 3 }));


// Making app arrows 
export const createAppArrow = (registryData: RegistryData[]): GraphArrow[] =>
  registryData.map((obj) =>
    obj.tags.map((value: string) =>
      ({ source: value, target: obj.name, name: obj.name, description: obj.description }))).flat(1);

// Removing duplicate arrow objects
export const filterDuplicateArrow = (graphArrows: any[]): GraphArrow[] => {
  return graphArrows.reduce((unique, obj) => {
    return unique.some((item: { source: any; target: any; }) => item.source === obj.source && item.target === obj.target) ? unique : [...unique, obj];
  }, []);
};
// Removing duplicate with **new** node objects
export const filterDuplicateNode = (graphNodes: any[]): GraphNode[] => {
  const uniqueNodes = graphNodes.reduce((acc, obj) => {
    const existingObj = acc.find((item: { id: any; }) => item.id === obj.id);
    existingObj ? existingObj.meta = obj.meta : acc.push(obj);
    return acc;
  }, []);
  return uniqueNodes
}

// Creating Directed Graph data
export const createGraphData = (registryData: RegistryData[], depth: number = 3): GraphData => depth === 3 ? ({
  nodes: filterDuplicateNode([createOnChainRegistryNode(), ...createCategoryNode(registryData), ...createAppNode(registryData)]),
  links: filterDuplicateArrow([...createCategoryArrow(registryData), ...createAppArrow(registryData)])
}) : ({
  nodes: filterDuplicateNode([createOnChainRegistryNode(), ...createCategoryNode(registryData)]),
  links: filterDuplicateArrow([...createCategoryArrow(registryData)])
})

// OR search
export const searchObjectByValues = (registryData: RegistryData[], searchValues: string[]): RegistryData[] => {
  const lowerSearchValues = searchValues.map(value => value.toLowerCase());
  return registryData.filter(obj =>
    Object.values(obj).some(val =>
      Array.isArray(val) ? val.some(v => lowerSearchValues.some(sv => v.toLowerCase().includes(sv))) : lowerSearchValues.some(sv => val.toString().toLowerCase().includes(sv))
    )
  );
}

// AND search
export const andSearchObjectByValues = (registryData: RegistryData[], searchValues: string[]) => {
  const lowerSearchValues = searchValues.map(value => value.toLowerCase());
  return registryData.filter(obj =>
    lowerSearchValues.every(sv =>
      Object.values(obj).some(val =>
        Array.isArray(val) ? val.some(v => v.toLowerCase().includes(sv)) : val.toString().toLowerCase().includes(sv)
      )
    )
  );
}

export const searchGraphDataByValues = async (searchValues: string[], searchType: boolean = false, url: string = JSON_URL, depth: number =3): Promise<GraphData> => {
  const registryData = await fetchRegistryData(url);
  // Default AND search
  const filteredData = searchType ? searchObjectByValues(registryData, searchValues) : andSearchObjectByValues(registryData, searchValues);
  return createGraphData(filteredData, depth);
}

// Getting base dapp json data
export const fetchFleekApi = async (
  query: string[]
): Promise<GraphData> => {
  const keywards = query[0].trim().split(/\s+/);
  const orSearch = (query[1] === "OR") ? "true" : "false";
  const depth = query[2];
  const url = `${FLEEK_API}?keywards=${keywards.join(',').trim()}&orsearch=${orSearch}&depth=${depth}`
  console.log(`Query by Fleek API. URL: ${url}`);
  const response = await fetch(url);
  return !response.ok
    ? () => {
      throw new Error(
        `Failed to fetch data from ${url}: ${response.statusText}`
      );
    }
    : response.json();
};