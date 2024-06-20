
'use client';
import dynamic from "next/dynamic";
import { searchGraphDataByValues, fetchFleekApi, fetchRegistryData, fetchFeekApiImgCache, createIconCacheData } from "../lib/dataConverter"
import { GraphData, ImageCacheData} from "../types/api"
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
import * as d3 from 'd3';
import { Odibee_Sans } from "next/font/google";
import { SVGLoader } from "three-stdlib";

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export const AppTest: React.FC = () => {

  const graphRef = useRef(null);
  const [data, setData] = useState<GraphData>({ links: [], nodes: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<string[]>([]);


  const [imageCache, setImageCache] = useState<ImageCacheData[]>([]);

  const [graphData, setGraphData] = useState(data);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result = await fetchFleekApi(['', 'AND', '2']);
        setData(result);
    // const fetchedData = await fetchFeekApiImgCache();  // Don't use performance reason
        const fetchedData = await  createIconCacheData();
        console.log(fetchedData);
        setImageCache(fetchedData);
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
       // linkColor={() => 'darkgrey'}
        // cooldownTicks={100}
        // nodeRelSize={10}
        // cooldownTicks={1}
        backgroundColor="black"
        dagMode="radialout"
        warmupTicks={3000}
        numDimensions={2}
        dagLevelDistance={50}
        linkWidth={1}
        // nodeCanvasObject={(node, ctx, globalScale) =>
        //   imgMaker(node, ctx, globalScale)
        // }
        showNavInfo={false}
        nodeThreeObject={(node) => {
          if (node.depth === 1) {
            // Load the texture
            const texture = new THREE.TextureLoader().load("/base-sphere-square.png");
            // Ensure the texture is mapped correctly

            const geometry = new THREE.SphereGeometry(1, 64, 64);
            const material = new THREE.MeshBasicMaterial({
              map: texture
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.scale.set(10, 10, 10);
            sphere.position.set(0, 0, 0);
            return sphere




          }
          else if (node.depth === 2) {

            const currentCache = getCurrentCache();


            const base64 = currentCache.filter((obj) => {
              const pathname = isURL(obj?.imageUrl)?new URL(obj?.imageUrl).pathname:obj?.imageUrl;
              return pathname === node.imageUrl});
            console.log(base64);
            console.log(base64);

            const texture = new THREE.TextureLoader().load(`${node.imageUrl}.svg`);
            // Create a group
            const group = new THREE.Group();

            // Create a sprite
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(6, 6, 6);
            sprite.position.set(0, 0, 0);

            // Create a sphere
            const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
            const sphereMaterial = new THREE.MeshBasicMaterial({
              color: 0x87cefa, // red color
              transparent: true,
              opacity: 0.2 // 50% opacity
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            // Add the sprite and sphere to the group
            group.add(sprite);
            group.add(sphere);

            return group


          }
          else {


            const currentCache = getCurrentCache();


            const base64 = currentCache.filter((obj) => {
              const pathname = isURL(obj?.imageUrl)?new URL(obj?.imageUrl).pathname:obj?.imageUrl;
              return pathname === node.imageUrl});
            console.log(base64);




            // console.log(localStorage.getItem(node.imageUrl));
            const texture = node.depth === 3 && base64.length === 1 ? (new THREE.TextureLoader().load(base64[0].base64data))
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


function isURL(str: string) {
  // Regular expression to match URLs starting with http:// or https://
  const urlRegex = /^(?:https?:\/\/)?[\w.-]+\.\w{2,}(?:\/.*)?$/;
  return urlRegex.test(str);
}
