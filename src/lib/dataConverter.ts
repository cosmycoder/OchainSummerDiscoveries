import { RegistryData, GraphArrow, GraphData, GraphNode, ImageCacheData, SvgCacheData } from "../types/api"

export const BASE_URL = "https://base.org/";
export const REGISTRY_URL = "https://www.base.org/ecosystem";
export const BASE_LOGO = "/Base_Network_Logo" //DO NOT NEED FILE EXTENTION!
export const JSON_URL = "https://raw.githubusercontent.com/base-org/web/master/apps/web/src/data/ecosystem.json";
export const FLEEK_API = "https://hundreds-death-some.functions.on-fleek.app/";
export const FLEEK_CACHE_API = "https://acoustic-needle-ancient.functions.on-fleek.app"
export const DEFAULT_ICON_URL = "/document/mstile-70x70.png";
export const DEFAULT_ICON_URL_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA2FBMVEUAAAAAU/8AU/8AUv8AUv8AUv8AUv8AVf8AUv8AUv8AU/8ASf8AYP8AUv8AUv8AUv8AUf8AUv8AT/8AUv8AUv8AUv8AUv8AUv8AUf8AUv8AUv8AU/8AVf8AUv8AUf8AVf8AUf8AUv8AU/8AUv8AUv8AUv8WYf9qmv+Utv+Ttv9ml/8SXv9nmP/0+P/////v9P9dkf9omf9ckP8XYv/u8/8RXv9unf9hlP9QiP+Irv+pxf+Ps/9PiP9tnP9gk//z9//t8/8QXf9ll/9aj/9bkP8VYP+Stf9klv/6pJ+HAAAAJXRSTlMALpTX+viVCZj+lwcIwL6WL/0tk9b29fPV1I+RKvwsBry9K9P0OYlx2QAAAAFiS0dELlTTEIcAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQfnCAcMIyThgpg2AAAArUlEQVQY01WP1xKCUAxEgyhKsQAWRLGvnavYe8H2/38kCOh4nrJnkpkskQcX4+MJXuAoIJkS8UGUZD8raaDb6w+GIyDjGwkY28xjMgWyRDkVDguZQdUohrkdicUSOuWxYl/WyFMBm23AjrE9ilTC4V8YOP5OTiiTie45ypcrKlS14EbiBrVGpAPuZ2dxBwTv03oDeDiD52sJNBW/TF23gnKqIId9W2a7UzR0zZ/fIZoh6l8gFdwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDgtMDdUMTI6MzU6MzYrMDA6MDCue+XjAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA4LTA3VDEyOjM1OjM2KzAwOjAw3yZdXwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABXelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeJzj8gwIcVYoKMpPy8xJ5VIAAyMLLmMLEyMTS5MUAxMgRIA0w2QDI7NUIMvY1MjEzMQcxAfLgEigSi4A6hcRdPJCNZUAAAAASUVORK5CYII=';
export const DEFAULT_ICON_URL_SVG = '<svg width="146" height="146" viewBox="0 0 146 146" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="73" cy="73" r="73" fill="#0052FF"/><path d="M73.323 123.729C101.617 123.729 124.553 100.832 124.553 72.5875C124.553 44.343 101.617 21.4463 73.323 21.4463C46.4795 21.4463 24.4581 42.0558 22.271 68.2887H89.9859V76.8864H22.271C24.4581 103.119 46.4795 123.729 73.323 123.729Z" fill="white"/></svg>'

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
export const createCategoryNode = (registryData: RegistryData[]): GraphNode[] => {
  return registryData.flatMap(({ tags }) =>
    tags.map((value: string) => ({
      id: value,
      group: value,
      description: value,
      imageUrl: `/${value}`,
      url: value,
      depth: 2
    }))
  );
};

// Making category arrows
export const createCategoryArrow = (registryData: RegistryData[]): GraphArrow[] => {
  const registryNode = createOnChainRegistryNode();
  return registryData.flatMap(({ tags }) =>
    tags.map((value: string) => ({
      source: registryNode.id,
      target: value,
      name: value,
      description: value,
      group: registryNode.group
    }))
  );
};

// Making app nodes
export const createAppNode = (registryData: RegistryData[]): GraphNode[] =>
  registryData.map(obj =>
    ({ id: obj.name, group: obj.tags.join(', '), description: obj.description, imageUrl: obj.imageUrl, url: obj.url, depth: 3 }));


// Making app arrows
export const createAppArrow = (registryData: RegistryData[]): GraphArrow[] =>
  registryData.flatMap(obj =>
    obj.tags.map((value: string) => ({
      source: value,
      target: obj.name,
      name: obj.name,
      description: obj.description,
      group: value
    }))
  );

// Removing duplicate arrow objects
export const filterDuplicateArrow = (graphArrows: any[]): GraphArrow[] => 
  graphArrows.reduce((unique, obj) => unique.some((item: { source: any; target: any; }) => 
    item.source === obj.source && item.target === obj.target) ? unique : [...unique, obj], []);

  
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
export const andSearchObjectByValues = (registryData: RegistryData[], searchValues: string[]): RegistryData[] => {
  const lowerSearchValues = searchValues.map(value => value.toLowerCase());
  return registryData.filter(obj =>
    lowerSearchValues.every(sv =>
      Object.values(obj).some(val =>
        Array.isArray(val) ? val.some(v => v.toLowerCase().includes(sv)) : val.toString().toLowerCase().includes(sv)
      )
    )
  );
}

// Tag name search
export const searchObjectByTag = (registryData: RegistryData[], searchValue: string): RegistryData[] => {
  const lowerSearchValue = searchValue.toLowerCase();
  return registryData.filter(obj =>
    obj.tags.some(tag => tag.toLowerCase().includes(lowerSearchValue))
  );
}

// Alighning tag value to lowercases.
const createRegistryData = (rawRegistryData: RegistryData[]) => rawRegistryData.map(item => ({
  ...item,
  tags: item.tags.map(tag => tag.toLowerCase())
}));

// Fetching graph data
export const searchGraphDataByValues = async (searchValues: string[], searchType: boolean = false, url: string = JSON_URL, depth: number = 3): Promise<GraphData> => {
  const rawRegistryData = await fetchRegistryData(url);
  const registryData = createRegistryData(rawRegistryData);
  // Default AND search
  const filteredData = searchType ? searchObjectByValues(registryData, searchValues) : andSearchObjectByValues(registryData, searchValues);
  return createGraphData(filteredData, depth);
}

// Fetching graph data by tag
export const searchGraphDataByTag = async (searchValue: string, url: string = JSON_URL, depth: number = 3): Promise<GraphData> => {
  const rawRegistryData = await fetchRegistryData(url);
  const registryData = createRegistryData(rawRegistryData);
  const filteredData = searchObjectByTag(registryData, searchValue);
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

export const fetchFleekApiImgArray = async (): Promise<string[]> => {
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

export const fetchFleekApiImgCache = async (): Promise<ImageCacheData[]> => {
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

export const fetchFleekApiByTag = async (tag: string): Promise<GraphData> => {
  const url = `${FLEEK_API}?tagsearch=${tag}`
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
    return !response.ok ? () => {
      console.error(`Failed to fetch and cache image ${url}:`);
      fetchBase64data("/document/mstile-70x70.png")
      // throw new Error('Network response was not ok.');
    }
      : await (async () => {
        const blob = await response.blob()
        const base64data = await blobToBase64(blob);
        const cacheImageData = { imageUrl: url, base64data: base64data };
        return cacheImageData as ImageCacheData

      })()
  } catch (error) {
    console.error('Failed to fetch and cache image:', url, error);
    return { imageUrl: DEFAULT_ICON_URL, base64data: DEFAULT_ICON_URL_BASE64 } as ImageCacheData
  }
}

const fleekFetchBase64data = async (url: string) => {
  try {
    const response = await fetch(`${FLEEK_CACHE_API}?img_cache=${url}`);
    return !response.ok ? () => {
      console.error(`Failed to fetch and cache image ${url}:`);
      fetchBase64data("/document/mstile-70x70.png")
      // throw new Error('Network response was not ok.');
    }
      : await (async () => {
        const base64data = await response.text()
        const cacheImageData = { imageUrl: url, base64data: base64data };
        return cacheImageData as ImageCacheData
      })()
  } catch (error) {
    console.error('Failed to fetch and cache image:', url, error);
    return { imageUrl: DEFAULT_ICON_URL, base64data: DEFAULT_ICON_URL_BASE64 } as ImageCacheData
  }
}


export const createIconCacheData = async (): Promise<ImageCacheData[]> => {
  const urlArray = await fetchFleekApiImgArray();
  return await Promise.all(urlArray.map(async (url) => fetchBase64data(url))) as ImageCacheData[];
}

export const fleekCreateIconCacheData = async (): Promise<ImageCacheData[]> => {
  const urlArray = await fetchFleekApiImgArray();
  return await Promise.all(urlArray.map(async (url) => fleekFetchBase64data(url))) as ImageCacheData[];
}

export const mergeGraphData = (prevData: GraphData, newData: GraphData): GraphData => ({
  nodes: filterDuplicateNode([
    ...prevData.nodes,
    ...newData.nodes,
  ]),
  links: filterDuplicateArrow([
    ...prevData.links,
    ...newData.links
  ])
})


// Loading SVG from HTTP takes time. This is Tag Graph Nodes SVG Preloader. 
// SVG Preloader
export const svgPreloader = async (tagGraphData: GraphData): Promise<SvgCacheData[]> => {
  const svgCacheData = await Promise.all(tagGraphData.nodes.map(async ({ imageUrl }) => {
    try {
      const response = await fetch(`${imageUrl}.svg`);
      if (!response.ok) {
        console.error(`Failed to fetch and cache image ${imageUrl}.svg: ${response.statusText}`);
        return { imageUrl: DEFAULT_ICON_URL, svgData: DEFAULT_ICON_URL_SVG } as SvgCacheData;
      }
      const text = await response.text();
      const blob = new Blob([text], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob)
      const cacheSvgData = { imageUrl, svgData: url };
      return cacheSvgData as SvgCacheData;
    } catch (error) {
      console.error('Failed to fetch and cache image:', imageUrl, error);
      const blob = new Blob([DEFAULT_ICON_URL_SVG], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob)
      return { imageUrl: DEFAULT_ICON_URL, svgData: url } as SvgCacheData;
    }
  }));
  return svgCacheData;
};