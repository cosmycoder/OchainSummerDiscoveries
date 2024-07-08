import { it, expect, expectTypeOf, assertType, describe, vi, beforeEach, test } from "vitest";
import * as fs from 'fs';
import { RegistryData, GraphNode, GraphArrow, GraphData, ImageCacheData } from "../types/api";
import {
    fetchFleekApi,
    fetchFleekApiByTag,
    fleekFetchBase64data,
    fetchFleekApiImgArray,
    fetchFleekByNames
} from "../lib/dataConverter";
import { BASE_URL, REGISTRY_URL, BASE_LOGO, JSON_URL, FLEEK_API, FLEEK_CACHE_API, DEFAULT_ICON_URL, DEFAULT_ICON_URL_BASE64, DEFAULT_ICON_URL_SVG } from '../app.settings'

it("Should get filtered registry data through Fleek Functions API", async () => {
    const graphData = await fetchFleekApi(['Tenderly is a full-stack infrastructure solution ', 'AND', '2']);
    expect(graphData.links).toHaveLength(2);
    expect(graphData.nodes).toHaveLength(3);
});

it("Should get Image Array from Fleek API", async () => {
    const imgArray = await fetchFleekApiImgArray();
    // console.log(imgArray);
    expect(imgArray).toHaveLength(373);
});

it("Should get defi tag graphData from Fleek API", async () => {
    const graphData = await fetchFleekApiByTag("defi");
    expect(graphData.links).toHaveLength(95);
});

it("Should get base64data from Fleek functions API", async () => {
    const base64data = await fleekFetchBase64data("/images/partners/vrbsdao.png");
    // Log the result (optional, for debugging)
    console.log(base64data);
    // Check if the result is of type ImageCacheData
    expect(base64data).toMatchObject<ImageCacheData>({
        imageUrl: expect.any(String),
        base64data: expect.any(String)
    });

});
it("Should get graphData from Fleek API by names", async () => {
    const graphData = await fetchFleekByNames(["uniswap", "aave"]);
    expect(graphData.nodes).toHaveLength(4);
    expect(graphData.links).toHaveLength(3);
});


