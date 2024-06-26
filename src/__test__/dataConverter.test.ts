import { it, expect, expectTypeOf, assertType, describe } from "vitest";
import * as fs from 'fs';
import { RegistryData, GraphNode, GraphArrow, GraphData } from "../types/api";
import {
  fetchRegistryData,
  JSON_URL,
  BASE_LOGO,
  REGISTRY_URL,
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
  svgPreloader
} from "../lib/dataConverter";

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

// Commented out as it requires a web server to be running
// describe('SVG Preloading', () => {
//   it("Should get SVG cache data from tag graph", async () => {
//     const svgCacheData = await svgPreloader(tagTestGraph as any);
//     // Add assertions here
//   });
// });