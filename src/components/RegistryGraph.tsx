import { searchGraphDataByValues, fetchFleekApi, fetchRegistryData, fetchFleekApiImgCache, createIconCacheData, fleekCreateIconCacheData, fetchFleekApiByTag, filterDuplicateArrow, filterDuplicateNode, mergeGraphData } from "../lib/dataConverter"
import { GraphData, GraphNode, ImageCacheData } from "../types/api"
import { FC, forwardRef, useCallback, useRef } from 'react';
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { debounce } from 'lodash';
import { createThreeObject, createNodeHoverObject, appNodeClick, appCard } from '../lib/threeFunc'
import ForceGraph3D, { ForceGraphMethods, ForceGraphProps } from "react-force-graph-3d";
import * as THREE from 'three';
import LoadingPage from "./LoadingPage";

const RegistryGraph: FC = forwardRef((props: any, ref: any) => {
    const fgRef = useRef<ForceGraphMethods>();
    const [data, setData] = useState<GraphData>({ links: [], nodes: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [camloading, setCamLoading] = useState<boolean>(true);
    const [imageCache, setImageCache] = useState<ImageCacheData[]>([]);
    const [visibility, setVisibility] = useState<boolean>(true);
    const [timeout, setTimeout] = useState<number>(1000);
    const distance = 200;

    // Initial Data retrival
    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchFleekApi(['', 'AND', '2']);
                setData(result);
                // const fetchedData = await fetchFeekApiImgCache();  // Don't use performance reason
                const fetchedData = await createIconCacheData();
                // const fetchedData = await fleekCreateIconCacheData();
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

    useEffect(() => {
        const interval = setInterval(() => {
            if (camloading) {
                if (fgRef.current) {
                    fgRef.current.cameraPosition(
                        { x: 0, y: 0, z: distance }, // new position
                        { x: 0, y: 0, z: 0 }, // lookAt ({ x, y, z })
                        1000  // ms transition duration
                    );
                    setCamLoading(false);
                }
            }
        }, 1000);
        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [camloading]);



    // Graph rotation animation
    setInterval(() => {
        fgRef.current?.scene().rotateZ(0.0001);
        if (fgRef.current?.camera()?.position) {
            const position = fgRef.current?.camera()?.position;
            const distBase = position.distanceTo(new THREE.Vector3(0, 0, 0))
            // Minimum distance from Base planet 
            if (distBase < 50) {
                //   console.log(position.distanceTo(new THREE.Vector3(0, 0, 0)))
                fgRef.current.cameraPosition(
                    { x: 0, y: 0, z: distance }, // new position
                    { x: 0, y: 0, z: 0 }, // lookAt ({ x, y, z })
                    1000  // ms transition duration
                );
            }
        };
    }, 100);

    // Graph node visivility
    setInterval(() => (visibility === false) ? setVisibility(true) : null, timeout);

    // Loading Page
    if (loading) return <LoadingPage />;

    const handleSearch = debounce(async (query: string[]) => {
        // const result = await searchGraphDataByValues(query);
        const result = query[0].length === 0 ? await fetchFleekApi(['', 'AND', '2']) : await fetchFleekApi(query);
        setData(result);
        setVisibility(false);
        setTimeout(result.links.length * 50 + 1000);
    }, 1000);

    const handleClick = debounce(async (query: string) => {
        // const result = await searchGraphDataByValues(query);
        const result = await fetchFleekApiByTag(query);
        const mergedData = mergeGraphData(data, result);
        if (data.links.length !== mergedData.nodes.length) {
            setData(mergedData);
            setVisibility(false);
            setTimeout(mergedData.links.length * 50 + 1000);
        }
    }, 1000);

    const getCurrentCache = () => imageCache;

    return (
        <>
            <ForceGraph3D
                onEngineStop={() => fgRef.current?.zoomToFit(1000)}
                enableNavigationControls={true}
                ref={fgRef}
                cooldownTime={timeout}
                enableNodeDrag={true}
                d3VelocityDecay={0.91}
                // d3AlphaDecay={0.05}
                graphData={data}
                linkAutoColorBy="group"
                // cooldownTicks={100}
                // nodeRelSize={10}
                linkLabel="name"
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
                    node.depth === 3 ? appNodeClick(node) : null;
                }}
                nodeThreeObject={(node) => createThreeObject(node, getCurrentCache(), fgRef) as any}
                nodeLabel={(node) => node.depth === 3 ? appCard(node, getCurrentCache()) : String(node.id)}
            />
            <SearchBar onSearch={handleSearch} />
        </>
    );
});

// Adding the display name
RegistryGraph.displayName = 'RegistryGraph';

export default RegistryGraph;





