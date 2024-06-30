import { it, expect, expectTypeOf, assertType, describe, vi, beforeEach, test  } from "vitest";
import * as fs from 'fs';
import { RegistryData, GraphNode, GraphArrow, GraphData } from "../types/api";
import {
  fetchRegistryData,
  createOnChainRegistryNode,
  createCategoryNode,
  createCategoryArrow,
  createAppNode,
  createAppArrow,
  createGraphData,
  searchObjectByValues,
  searchGraphDataByValues,
  searchObjectByTag,
  searchGraphDataByTag,
  andSearchObjectByValues,
  fetchFleekApi,
  fetchFleekApiImgArray,
  fetchFleekApiImgCache,
  fetchFleekApiByTag,
  fetchBase64data,
  fleekFetchBase64data,
  fleekCreateIconCacheData,
  mergeGraphData
} from "../lib/dataConverter";
import { BASE_URL, REGISTRY_URL, BASE_LOGO, JSON_URL, FLEEK_API, FLEEK_CACHE_API, DEFAULT_ICON_URL, DEFAULT_ICON_URL_BASE64, DEFAULT_ICON_URL_SVG } from '../app.settings'
const testJsonData = fs.readFileSync('src/__test__/ecosystem.test.json', 'utf-8');
const tagGraphData = fs.readFileSync('src/__test__/tagObjectGraph.json', 'utf-8');
const registryTestData = JSON.parse(testJsonData);

describe('Data Fetching and Node Creation', () => {
  it("Should get Onchain registry json data", async () => {
    const registryData = await fetchRegistryData(JSON_URL);
    expectTypeOf(registryData).toEqualTypeOf<RegistryData[]>();
    assertType<RegistryData[]>(registryData);
  });

  it("Should get an Onchain registry graph node", () => {
   // console.log(createOnChainRegistryNode());
    expect(createOnChainRegistryNode()).toEqual({
      id: "Onchain Summer Registry",
      group: "super",
      description: "Onchain Summer Registry",
      imageUrl: BASE_LOGO,
      url: REGISTRY_URL,
      depth: 1
    });
  });

  it("Should get category graph nodes", () => {
    const categoryNode = createCategoryNode(registryTestData);
    expectTypeOf(categoryNode).toEqualTypeOf<GraphNode[]>();
  });

  it("Should get category graph arrows", () => {
    const categoryArrow = createCategoryArrow(registryTestData);
    expectTypeOf(categoryArrow).toEqualTypeOf<GraphArrow[]>();
  });

  it("Should get app graph nodes", () => {
    const appNode = createAppNode(registryTestData);
    expectTypeOf(appNode).toEqualTypeOf<GraphNode[]>();
  });

  it("Should get app graph arrows", () => {
    const appArrow = createAppArrow(registryTestData);
    expectTypeOf(appArrow).toEqualTypeOf<GraphArrow[]>();
  });

  it("Should get graph data", () => {
    const graphData = createGraphData(registryTestData);
    expectTypeOf(graphData).toEqualTypeOf<GraphData>();
  });
});

describe('Data Filtering and Searching', () => {
  it("Should get filtered registry data", () => {
    const filteredData = searchObjectByValues(registryTestData, ['Tenderly is a full-stack infrastructure solution ']);
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].description).toMatch(/Tenderly is a full-stack infrastructure solution/);
  });

  it("Should get NO registry data for non-existent search", () => {
    const filteredData = searchObjectByValues(registryTestData, ['kdssdfanoei333']);
    expect(filteredData).toHaveLength(0);
  });

  it("Should get All registry data for empty search", () => {
    const filteredData = searchObjectByValues(registryTestData, ['']);
    expect(filteredData.length).toBeGreaterThan(350);
  });

  it("Should get filtered data with AND search", () => {
    const filteredData = andSearchObjectByValues(registryTestData, ['defi', 'bridge']);
    expect(filteredData).toHaveLength(9);
  });

  it("Should get filtered registry graph data", async () => {
    const graphData = await searchGraphDataByValues(['Tenderly is a full-stack infrastructure solution ']);
    expect(graphData.links).toHaveLength(4);
    expect(graphData.nodes).toHaveLength(4);
  });

  it("Should get filtered registry data through Fleek Functions API", async () => {
    const graphData = await fetchFleekApi(['Tenderly is a full-stack infrastructure solution ', 'AND', '2']);
    expect(graphData.links).toHaveLength(2);
    expect(graphData.nodes).toHaveLength(3);
  });

  it("Should get designated tag of registry objects", () => {
    const filteredData = searchObjectByTag(registryTestData, 'defi');
    expect(filteredData).toHaveLength(94);
  });

  it("Should get filtered registry graph data by tag", async () => {
    const graphData = await searchGraphDataByTag('defi');
    expect(graphData.links).toHaveLength(97);
    expect(graphData.nodes).toHaveLength(98);
  });
});

describe('Graph data functions', () => {
  test('mergeGraphData should combine two GraphData objects', () => {
    const prevData = {
      nodes: [{ id: '1', name: 'Node 1' }],
      links: [{ source: '1', target: '2' }],
    } as unknown as GraphData
    const newData = {
      nodes: [{ id: '2', name: 'Node 2' }],
      links: [{ source: '2', target: '3' }],
    } as unknown as GraphData

    const result = mergeGraphData(prevData , newData)
    expect(result.nodes).toHaveLength(2)
    expect(result.links).toHaveLength(2)
  })
})



// Commented out as it requires a web server to be running
// describe('SVG Preloading', () => {
//   it("Should get SVG cache data from tag graph", async () => {
//     const svgCacheData = await svgPreloader(tagTestGraph as any);
//     // Add assertions here
//   });
// });
