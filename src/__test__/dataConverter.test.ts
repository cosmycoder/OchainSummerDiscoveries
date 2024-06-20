import { it, expect, test, expectTypeOf, assertType } from "vitest";
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
  fetchFleekApi
} from "../lib/dataConverter";
import SpriteText from 'three-spritetext';

const testJsonData = fs.readFileSync('src/__test__//ecosystem.test.json', 'utf-8');
const registryTestData = JSON.parse(testJsonData);

it("Should get Onchain registry json data", async () => {
  try {
    const registryData = await fetchRegistryData(JSON_URL);
    // console.log(registryData);
    expectTypeOf(registryData).toEqualTypeOf<RegistryData[]>();
    assertType<RegistryData[]>(registryData);
  } catch (error) {
    console.error(error);
  }
});

it("Should get an Onchain registry graph node", async () => {
  expect(createOnChainRegistryNode()).toEqual({ id: "Onchain Summer Registry", group: "super", description: "Onchain Summer Registry", imageUrl: BASE_LOGO, url: REGISTRY_URL, depth: 1 })
});

it("Should get category graph nodes", async () => {
  const categoryNode = createCategoryNode(registryTestData);
  //console.log(categoryNode);
  expectTypeOf(categoryNode).toEqualTypeOf<GraphNode[]>(categoryNode);
});

it("Should get category graph arrows", async () => {
  const categoryArrow = createCategoryArrow(registryTestData);
  //console.log(categoryArrow);
  expectTypeOf(categoryArrow).toEqualTypeOf<GraphArrow[]>(categoryArrow);
});

it("Should get app graph nodes", async () => {
  const appNode = createAppNode(registryTestData);
  //console.log(appNode);
  expectTypeOf(appNode).toEqualTypeOf<GraphNode[]>(appNode);
});


it("Should get app graph arrows", async () => {
  const appArrow = createAppArrow(registryTestData);
  // console.log(appArrow);
  expectTypeOf(appArrow).toEqualTypeOf<GraphArrow[]>(appArrow);
});

it("Should get graph data", async () => {
  const graphData = createGraphData(registryTestData);
  //console.log(graphData) ;
  expectTypeOf(graphData).toEqualTypeOf<GraphData>(graphData);
});

it("Should get filtered registry data", async () => {
  const filteredData = searchObjectByValues(registryTestData, ['Tenderly is a full-stack infrastructure solution ']);
  //console.log(filteredData);
  expect(filteredData).toHaveLength(1);
  expect(filteredData[0].description).toMatch(/Tenderly is a full-stack infrastructure solution/);
});

it("Should get NO registry data", async () => {

  const filteredData = searchObjectByValues(registryTestData, ['kdssdfanoei333']);
  //console.log(filteredData);
  expect(filteredData).toHaveLength(0);
});

it("Should get All registry data", async () => {
  const filteredData = searchObjectByValues(registryTestData, ['']);
  // console.log(filteredData.length);
  expect(filteredData.length > 350).toBe(true);
});

it("Should get All registry data", async () => {
  const filteredData = andSearchObjectByValues(registryTestData, ['defi', 'bridge']);
  expect(filteredData).toHaveLength(9);
});

it("Should get filtered registry graph data", async () => {
  try {
    const graphData = await searchGraphDataByValues(['Tenderly is a full-stack infrastructure solution ']);
    // console.log(graphData);
    expect(graphData.links).toHaveLength(4);
    expect(graphData.nodes).toHaveLength(4);
  } catch (error) {
    console.error(error);
  }
});

it("Should get filtered registry data through Fleek Functions API", async () => {
  try {
    const graphData = await fetchFleekApi(['Tenderly is a full-stack infrastructure solution ', 'AND', '2']);
    // console.log(graphData);
    expect(graphData.links).toHaveLength(2);
    expect(graphData.nodes).toHaveLength(3);
  } catch (error) {
    console.error(error);
  }
});

it("Should get designated tag of registry objects", async () => {
  const filteredData = searchObjectByTag(registryTestData, 'defi');
  console.log(filteredData.length);
  expect(filteredData).toHaveLength(94);
});


it("Should get filtered registry graph data by tag", async () => {
  try {
    const graphData = await searchGraphDataByTag('defi');
    console.log(graphData);
    expect(graphData.links).toHaveLength(97);
    expect(graphData.nodes).toHaveLength(98);
  } catch (error) {
    console.error(error);
  }
});