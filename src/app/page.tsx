
'use client';
import dynamic from "next/dynamic";
import { searchGraphDataByValues, fetchFleekApi, fetchRegistryData, fetchFleekApiImgCache, createIconCacheData, fetchFleekApiByTag, filterDuplicateArrow, filterDuplicateNode, mergeGraphData } from "../lib/dataConverter"
import { GraphData, ImageCacheData } from "../types/api"
import { useRef } from 'react';
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { debounce } from 'lodash';
import { createThreeObject } from '../lib/threeFunc'

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export const AppTest: React.FC = () => {

  const graphRef = useRef(null);
  const [data, setData] = useState<GraphData>({ links: [], nodes: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [imageCache, setImageCache] = useState<ImageCacheData[]>([]);
  const [visibility, setVisibility] = useState<boolean>(true);

  setInterval(() => {
    if (visibility === false) { setVisibility(true); }
  }, 2000);
  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result = await fetchFleekApi(['', 'AND', '2']);
        setData(result);
        // const fetchedData = await fetchFeekApiImgCache();  // Don't use performance reason
        const fetchedData = await createIconCacheData();
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
    // const result = await searchGraphDataByValues(query);
    const result = query[0].length===0? await fetchFleekApi(['', 'AND', '2']) :await fetchFleekApi(query);
    setData(result);
    setVisibility(false);
  };

  const handleClick = debounce(async (query: string) => {
    // const result = await searchGraphDataByValues(query);
    const result = await fetchFleekApiByTag(query);
    const mergedData = mergeGraphData(data, result);
    if (data.links.length !== mergedData.nodes.length) {
      setData(mergedData);
      setVisibility(false);
    }
  }, 1000);

  const getCurrentCache = () => imageCache;


  return (
    <>
      <ForceGraph3D
        //d3VelocityDecay={0.1}
        d3AlphaDecay={0.1}
        graphData={data}
        linkAutoColorBy="group"
        nodeLabel="id"
        // cooldownTicks={100}
        // nodeRelSize={10}
        // cooldownTicks={1}
        linkLabel=""
        backgroundColor="black"
        dagMode="radialout"
        linkResolution={1}
        linkOpacity={0.5}
        linkPositionUpdate={() => false}
        linkVisibility={true}
        nodeResolution={1}
        nodeVisibility={() => visibility}
        numDimensions={2}
        dagLevelDistance={50}
        linkWidth={0}
        nodeRelSize={1}
        showNavInfo={false}
        onNodeClick={(node) => {
          node.depth === 1 ? handleSearch(['', 'AND', '2']) : null; // Back to initial graph
          node.depth === 2 ? handleClick(String(node?.id)) : null; // Search by tag
        }}
        nodeThreeObject={(node) => createThreeObject(node, getCurrentCache()) as any}

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

function getAngleFromCoordinates(x: number, y: number) {
  const deltaX = x;
  const deltaY = y;
  const angleInRadians = Math.atan2(deltaY, deltaX);
  const angleInDegrees = angleInRadians * (180 / Math.PI);
  return angleInDegrees;
}

