import { RegistryData, GraphArrow, GraphData, GraphNode, ImageCacheData } from "../types/api"

export const BASE_URL = "https://base.org/";
export const REGISTRY_URL = "https://www.base.org/ecosystem";
export const BASE_LOGO = "/Base_Network_Logo.svg"
export const JSON_URL = "https://raw.githubusercontent.com/base-org/web/master/apps/web/src/data/ecosystem.json";
export const FLEEK_API = "https://fleek-test.network/services/1/ipfs/bafkreicoxgojzdkihowll5v2ruxl3o57iq2e65gdjn4c55mh7j5lag4acm";
export const DEFAULT_ICON_URL = "/document/mstile-70x70.png";
export const DEFAULT_ICON_URL_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA2FBMVEUAAAAAU/8AU/8AUv8AUv8AUv8AUv8AVf8AUv8AUv8AU/8ASf8AYP8AUv8AUv8AUv8AUf8AUv8AT/8AUv8AUv8AUv8AUv8AUv8AUf8AUv8AUv8AU/8AVf8AUv8AUf8AVf8AUf8AUv8AU/8AUv8AUv8AUv8WYf9qmv+Utv+Ttv9ml/8SXv9nmP/0+P/////v9P9dkf9omf9ckP8XYv/u8/8RXv9unf9hlP9QiP+Irv+pxf+Ps/9PiP9tnP9gk//z9//t8/8QXf9ll/9aj/9bkP8VYP+Stf9klv/6pJ+HAAAAJXRSTlMALpTX+viVCZj+lwcIwL6WL/0tk9b29fPV1I+RKvwsBry9K9P0OYlx2QAAAAFiS0dELlTTEIcAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQfnCAcMIyThgpg2AAAArUlEQVQY01WP1xKCUAxEgyhKsQAWRLGvnavYe8H2/38kCOh4nrJnkpkskQcX4+MJXuAoIJkS8UGUZD8raaDb6w+GIyDjGwkY28xjMgWyRDkVDguZQdUohrkdicUSOuWxYl/WyFMBm23AjrE9ilTC4V8YOP5OTiiTie45ypcrKlS14EbiBrVGpAPuZ2dxBwTv03oDeDiD52sJNBW/TF23gnKqIId9W2a7UzR0zZ/fIZoh6l8gFdwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDgtMDdUMTI6MzU6MzYrMDA6MDCue+XjAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA4LTA3VDEyOjM1OjM2KzAwOjAw3yZdXwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABXelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeJzj8gwIcVYoKMpPy8xJ5VIAAyMLLmMLEyMTS5MUAxMgRIA0w2QDI7NUIMvY1MjEzMQcxAfLgEigSi4A6hcRdPJCNZUAAAAASUVORK5CYII=';

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


export const createImageUrlArray = (registryData: RegistryData[]) => registryData.map(({ imageUrl }) => imageUrl);

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
      ({ source: createOnChainRegistryNode().id, target: value, name: value, description: value, group: createOnChainRegistryNode().group }))).flat(1);


// Making app nodes
export const createAppNode = (registryData: RegistryData[]): GraphNode[] =>
  registryData.map((obj) =>
    ({ id: obj.name, group: String(...obj.tags), description: obj.description, imageUrl: obj.imageUrl, url: obj.url, depth: 3 }));


// Making app arrows 
export const createAppArrow = (registryData: RegistryData[]): GraphArrow[] =>
  registryData.map((obj) =>
    obj.tags.map((value: string) =>
      ({ source: value, target: obj.name, name: obj.name, description: obj.description, group: value }))).flat(1);

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


// Alighning tag value to lowercases.
const createRegistryData = (rawRegistryData: RegistryData[]) => rawRegistryData.map(item => ({
  ...item,
  tags: item.tags.map(tag => tag.toLowerCase())
}));

// Fetching data
export const searchGraphDataByValues = async (searchValues: string[], searchType: boolean = false, url: string = JSON_URL, depth: number = 3): Promise<GraphData> => {
  const rawRegistryData = await fetchRegistryData(url);
  const registryData = createRegistryData(rawRegistryData);
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

export const fetchFeekApiImgArray = async (): Promise<string[]> => {
  const url = `${FLEEK_API}?img_url=true`
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

export const fetchFeekApiImgCache = async (): Promise<ImageCacheData[]> => {
  const url = `${FLEEK_API}?img_cache=true`
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

// Base64Icon Bulkdownloading

const blobToBase64 = async (blob: Blob) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  } catch (error) {
    console.error('Error:', error);
    return DEFAULT_ICON_URL_BASE64
  }
}

const fetchBase64data = async (url: string) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const blob = await response.blob()
      const base64data = await blobToBase64(blob);
      const cacheImageData = { imageUrl: url, base64data: base64data };
      return cacheImageData as ImageCacheData

    } else {
      console.error(`Failed to fetch and cache image ${url}:`);
      fetchBase64data("/document/mstile-70x70.png")
      // throw new Error('Network response was not ok.');
    }
  } catch (error) {
    console.error('Failed to fetch and cache image:', url, error);
    return { imageUrl: DEFAULT_ICON_URL, base64data: DEFAULT_ICON_URL_BASE64 } as ImageCacheData
  }
}

export const createIconCacheData = async () :  Promise<ImageCacheData[]> => {
     const urlArray = await fetchFeekApiImgArray();  
     return await Promise.all(urlArray.map(async (url) => fetchBase64data(url))) as  ImageCacheData[];
}

   