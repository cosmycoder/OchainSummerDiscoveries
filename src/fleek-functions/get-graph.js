import { rawRegistryData } from 'ipfs://bafkreicia6q7ic2t33drwcthtntn5qsi2q6r4r36sqn42frn4ogxud2gji'

export const main = (request) => {
    if (request.query.keywards !== undefined) {
        const keywards = request.query.keywards;
        const keywardsArray = keywards.split(',');
        const orSearchStr = request.query.orsearch;
        const orSearchBool = (orSearchStr.toLowerCase() === "true");
        const depth = Number(request.query.depth);
        return searchGraphDataByValues(keywardsArray, orSearchBool, depth);
    }
    if (request.query.img_url === "true") {
        return urlArray
    }
    if (request.query.tagsearch !== undefined) {
        const tag = request.query.tagsearch;
        return searchGraphDataByTag(tag)
    }
    if (request.query.names !== undefined) {
        const names = request.query.names;
        const nameArray = names.split(',')
        return searchGraphDataByNames(nameArray)
    }
};

// Settings
export const BASE_LOGO = "/Base_Network_Logo" // DO NOT NEED FILE EXTENTION
export const BASE_URL = "https://base.org";
export const REGISTRY_URL = "https://www.base.org/ecosystem";
export const DEFAULT_ICON_URL = "/document/mstile-70x70.png";
export const DEFAULT_ICON_URL_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA2FBMVEUAAAAAU/8AU/8AUv8AUv8AUv8AUv8AVf8AUv8AUv8AU/8ASf8AYP8AUv8AUv8AUv8AUf8AUv8AT/8AUv8AUv8AUv8AUv8AUv8AUf8AUv8AUv8AU/8AVf8AUv8AUf8AVf8AUf8AUv8AU/8AUv8AUv8AUv8WYf9qmv+Utv+Ttv9ml/8SXv9nmP/0+P/////v9P9dkf9omf9ckP8XYv/u8/8RXv9unf9hlP9QiP+Irv+pxf+Ps/9PiP9tnP9gk//z9//t8/8QXf9ll/9aj/9bkP8VYP+Stf9klv/6pJ+HAAAAJXRSTlMALpTX+viVCZj+lwcIwL6WL/0tk9b29fPV1I+RKvwsBry9K9P0OYlx2QAAAAFiS0dELlTTEIcAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQfnCAcMIyThgpg2AAAArUlEQVQY01WP1xKCUAxEgyhKsQAWRLGvnavYe8H2/38kCOh4nrJnkpkskQcX4+MJXuAoIJkS8UGUZD8raaDb6w+GIyDjGwkY28xjMgWyRDkVDguZQdUohrkdicUSOuWxYl/WyFMBm23AjrE9ilTC4V8YOP5OTiiTie45ypcrKlS14EbiBrVGpAPuZ2dxBwTv03oDeDiD52sJNBW/TF23gnKqIId9W2a7UzR0zZ/fIZoh6l8gFdwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDgtMDdUMTI6MzU6MzYrMDA6MDCue+XjAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA4LTA3VDEyOjM1OjM2KzAwOjAw3yZdXwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABXelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeJzj8gwIcVYoKMpPy8xJ5VIAAyMLLmMLEyMTS5MUAxMgRIA0w2QDI7NUIMvY1MjEzMQcxAfLgEigSi4A6hcRdPJCNZUAAAAASUVORK5CYII=';

export const createOnChainRegistryNode = () =>
    ({ id: "Onchain Summer Registry", group: "super", description: "Onchain Summer Registry", imageUrl: BASE_LOGO, url: REGISTRY_URL, depth: 1 });

// Making category nodes
export const createCategoryNode = (registryData) => {
    return registryData.flatMap(({ tags }) =>
        tags.map((value) => ({
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
export const createCategoryArrow = (registryData) => {
    const registryNode = createOnChainRegistryNode();
    return registryData.flatMap(({ tags }) =>
        tags.map((value) => ({
            source: registryNode.id,
            target: value,
            name: value,
            description: value,
            group: registryNode.group
        }))
    );
};
// Making app nodes
export const createAppNode = (registryData) =>
    registryData.map((obj) =>
        ({ id: obj.name, group: String(...obj.tags), description: obj.description, imageUrl: obj.imageUrl, url: obj.url, depth: 3 }));

// Making app arrows
export const createAppArrow = (registryData) =>
    registryData.flatMap(obj =>
        obj.tags.map((value) => ({
            source: value,
            target: obj.name,
            name: obj.name,
            description: obj.description,
            group: value
        }))
    );
// Removing duplicate arrow objects
export const filterDuplicateArrow = (graphArrows) => {
    return graphArrows.reduce((unique, obj) => {
        return unique.some((item) => item.source === obj.source && item.target === obj.target) ? unique : [...unique, obj];
    }, []);
};

// Removing duplicate with **new** node objects
export const filterDuplicateNode = (graphNodes) => {
    const uniqueNodes = graphNodes.reduce((acc, obj) => {
        const existingObj = acc.find((item) => item.id === obj.id);
        existingObj ? existingObj.meta = obj.meta : acc.push(obj);
        return acc;
    }, []);
    return uniqueNodes
}

// Creating Directed Graph data
export const createGraphData = (registryData, depth = 3) => depth === 3 ? ({
    nodes: filterDuplicateNode([createOnChainRegistryNode(), ...createCategoryNode(registryData), ...createAppNode(registryData)]),
    links: filterDuplicateArrow([...createCategoryArrow(registryData), ...createAppArrow(registryData)])
}) : ({
    nodes: filterDuplicateNode([createOnChainRegistryNode(), ...createCategoryNode(registryData)]),
    links: filterDuplicateArrow([...createCategoryArrow(registryData)])
})

// OR search
export const searchObjectByValues = (registryData, searchValues) => {
    const lowerSearchValues = searchValues.map(value => value.toLowerCase());
    return registryData.filter(obj =>
        Object.values(obj).some(val =>
            Array.isArray(val) ? val.some(v => lowerSearchValues.some(sv => v.toLowerCase().includes(sv))) : lowerSearchValues.some(sv => val.toString().toLowerCase().includes(sv))
        )
    );
}

// AND search
export const andSearchObjectByValues = (registryData, searchValues) => {
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
export const searchObjectByTag = (registryData, searchValue) => {
    const lowerSearchValue = searchValue.toLowerCase();
    return registryData.filter(obj =>
        obj.tags.some(tag => tag.toLowerCase().includes(lowerSearchValue))
    );
}


export const searchGraphDataByValues = async (searchValues, searchType = false, depth = 3) => {
    // Default AND search
    const filteredData = searchType ? searchObjectByValues(registryData, searchValues) : andSearchObjectByValues(registryData, searchValues);
    return createGraphData(filteredData, depth);
}

// Fetching graph data by tag
export const searchGraphDataByTag = async (searchValue, depth = 3) => {
    const filteredData = searchObjectByTag(registryData, searchValue);
    return createGraphData(filteredData, depth);
}


// search object by name array
export const searchObjectByNames = (registryData, searchValues) => {
    const lowerSearchValues = searchValues.map(value => value.toLowerCase());
    return registryData.filter(val =>
        lowerSearchValues.some(sv => val.name.toString().toLowerCase() === sv)
    );
}

// Fetching graph data
export const searchGraphDataByNames = async (searchValues, depth = 3) => {
    const filteredData = searchObjectByNames(registryData, searchValues);
    return createGraphData(filteredData, depth);
}


export const createImageUrlArray = () => registryData.map(({ imageUrl }) => imageUrl);


// Alighning tag value to lowercases.
const registryData = rawRegistryData.map(item => ({
    ...item,
    tags: item.tags.map(tag => tag.toLowerCase())
}));


// Base64Icon Bulkdownloading
const blobToBase64 = async (blob) => {
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

const fetchBase64data = async (url) => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const blob = await response.blob()
            const base64data = await blobToBase64(blob);
            const cacheImageData = { imageUrl: url, base64data: base64data };
            return cacheImageData

        } else {
            console.error(`Failed to fetch and cache image ${url}:`);
            fetchBase64data("/document/mstile-70x70.png")
            // throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Failed to fetch and cache image:', url, error);
        return { imageUrl: DEFAULT_ICON_URL, base64data: DEFAULT_ICON_URL_BASE64 }
    }
}

const createIconCacheData = () => {
    const urlArray = createImageUrlArray();
    return Promise.all(urlArray.map(async (url) => fetchBase64data(BASE_URL + url)));
}

const urlArray = createImageUrlArray();
