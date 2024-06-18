
'use client';
import dynamic from "next/dynamic";
import { searchGraphDataByValues, fetchFleekApi, fetchRegistryData, createImageUrlArray } from "../lib/dataConverter"
import { GraphData } from "../types/api"
import { useRef } from 'react';
import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import SearchBar from '../components/SearchBar';
import { ForceGraphMethods } from 'react-force-graph-3d';
import { CSG } from 'three-csg-ts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { UrlWithStringQuery } from "url";
import { convertCompilerOptionsFromJson } from "typescript";
import { nodeServerAppPaths } from "next/dist/build/webpack/plugins/pages-manifest-plugin";
import { Odibee_Sans } from "next/font/google";

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export const AppTest: React.FC = () => {

  const graphRef = useRef(null);
  const [data, setData] = useState<GraphData>({ links: [], nodes: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<string[]>([]);


  const [imageCache, setImageCache] = useState<{imageUrl: string ; base64data: string} []>([{imageUrl: '/baselogo.png' , base64data: '/baselogo.png'} ]);

  async function blobToBase64(blob: Blob) {
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
      return '/baselogo.png';
    }
  }
  async function fetchAndCacheImage(url: string)  {
    try {
     // console.log(`caching...${url}`);
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob()
        const base64data = await blobToBase64(blob);

    
          // Store the data URL in localStorage
         //  console.log("image data", base64data);
      //  console.log("made data", {imageUrl: url , base64data: base64data});
          const cacheImageData = {imageUrl: url , base64data: base64data};
         // console.log("base64data", base64data);
         return cacheImageData as {imageUrl: string ; base64data: string}

      } else {
        console.error(`Failed to fetch and cache image ${url}:`);
        fetchAndCacheImage("/baselogo.png")
        // throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Failed to fetch and cache image:', url , error);
      throw error;
    }
  }
  const [graphData, setGraphData] = useState(data);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        // const result = await searchGraphDataByValues(['']);
        const result = await fetchFleekApi(['', 'AND', '2']);
        setData(result);
        const regData = await fetchRegistryData();
      //  console.log(createImageUrlArray(regData));
        const urlArray= createImageUrlArray(regData);

        const fetchedData = await Promise.all(urlArray.map( async (url) => fetchAndCacheImage(url)));
        // console.log("All cached data", fetchedData);
        setImageCache(fetchedData);
    //    console.log(imageCache);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  // Use useQuery to fetch data in your component

  const handleSearch = async (query: string[]) => {
    // const result = await searchGraphDataByValues(query.trim().split(/\s+/));
    const result = await fetchFleekApi(query);
  //  console.log(result);
    setData(result);
  };
  
  const getCurrentCache = () => {
    return imageCache;
  };
  return (
    <>
      <ForceGraph3D
        graphData={data}
        //   cameraPosition={({x: 0,y: 0,z: 0})}
        linkAutoColorBy="group"
        nodeLabel="id"
        linkColor={() => 'darkgrey'}
        // cooldownTicks={100}
        // nodeRelSize={10}
        // cooldownTicks={1}
        backgroundColor="black"
        dagMode="radialout"
        warmupTicks={3000}
        numDimensions={2}
        dagLevelDistance={50}
        linkWidth={1.5}
        // nodeCanvasObject={(node, ctx, globalScale) =>
        //   imgMaker(node, ctx, globalScale)
        // }
      showNavInfo={false}
      nodeThreeObject={(node) => {
        if (node.depth === 1) {
          // Load the texture
          const texture = new THREE.TextureLoader().load("/base-logo-in-blue.png")
          const material = new THREE.SpriteMaterial({
            map: texture,
            alphaToCoverage: true,
            premultipliedAlpha: true,
            transparent: false,
            alphaTest: 0.5,
            blending: THREE.AdditiveBlending
          });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(24, 24, 24);
          sprite.position.set(0, 0, 0);
          return sprite




        } else {

 
        const currentCache = getCurrentCache();
     

            const base64 = currentCache.filter((obj)=> obj?.imageUrl === node.imageUrl);
            console.log(base64);
       
              

           
         // console.log(localStorage.getItem(node.imageUrl));
          const texture = node.depth === 3 && base64.length===1  ? (new THREE.TextureLoader().load(base64[0].base64data))
            : node.depth === 2 ? (new THREE.TextureLoader().load("/baselogo.png"))
              : (new THREE.TextureLoader().load("/baselogo.png"))
          const material = new THREE.SpriteMaterial({
            map: texture,
            alphaToCoverage: true,
            premultipliedAlpha: true,
            transparent: true,
            alphaTest: 0.5,
            blending: THREE.AdditiveBlending
          });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(6, 6, 6);
          sprite.position.set(0, 0, 0);
          return sprite

                                     // return sprite

        }



        }}

      />
      <SearchBar onSearch={handleSearch} />
    </>
  );
};


export default function Home() {

  return (
    <AppTest></AppTest>
  )
}


