import { searchGraphDataByValues, fetchFleekApi, fetchRegistryData, fetchFleekApiImgCache, createIconCacheData, fleekCreateIconCacheData, fetchFleekApiByTag, mergeGraphData, svgPreloader } from "../../lib/dataConverter"
import { GraphData, ImageCacheData, SvgCacheData } from "../../types/api"
import { FC, forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import SearchBar from '../../components/Search/Search';
import { debounce } from 'lodash';
import { createThreeObject, appNodeClick, appCard } from '../../lib/threeFunc'
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from 'three';
import LoadingPage from "./LoadingPage";
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

const RegistryGraph: FC = forwardRef((_props, _ref) => {
    const fgRef = useRef<ForceGraphMethods>();
    const [data, setData] = useState<GraphData>({ links: [], nodes: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [imageCache, setImageCache] = useState<ImageCacheData[]>([]);
    const [svgCache, setSvgCache] = useState<SvgCacheData[]>([]);
    const [visibility, setVisibility] = useState<boolean>(true);
    const [timeout, setTimeout] = useState<number>(1000);
    const [error, setError] = useState<string | null>(null);
    const [camloading, setCamLoading] = useState<boolean>(true);
    const distance = 200;

    // Retrieve initial data
    const fetchInitialData = useCallback(async () => {
        try {
            const result = await fetchFleekApi(['', 'AND', '2']);
            setData(result);
            const fetchedData = await createIconCacheData();
            // const fetchedData = await fleekCreateIconCacheData();
            setImageCache(fetchedData);
            setSvgCache(await svgPreloader(result));
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch initial data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        const rotationInterval = setInterval(() => {
            fgRef.current?.scene().rotateZ(0.0001);
            const position = fgRef.current?.camera()?.position;
            if (position) {
                const distBase = position.distanceTo(new THREE.Vector3(0, 0, 0));
                if (distBase < 50) {
                    fgRef.current?.cameraPosition(
                        { x: 0, y: 0, z: distance },
                        { x: 0, y: 0, z: 0 },
                        1000
                    );
                }
            }
        }, 100);

        const visibilityInterval = setInterval(() => {
            if (!visibility) setVisibility(true);
        }, timeout);

        return () => {
            clearInterval(rotationInterval);
            clearInterval(visibilityInterval);
        };
    }, [visibility, timeout]);
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

    const handleSearch = useCallback(debounce(async (query: string[]) => {
        try {
            const result = query[0].length === 0 ? await fetchFleekApi(['', 'AND', '2']) : await fetchFleekApi(query);
            setData(result);
            setVisibility(false);
            setTimeout(result.links.length * 30 + 1000);
        } catch (error) {
            console.error('Error during search:', error);
            setError('Failed to search graph data.');
        }
    }, 1000), []);


    const handleClick = useCallback(debounce(async (query: string) => {
        try {
            const result = await fetchFleekApiByTag(query);
            const mergedData = mergeGraphData(data, result);
            if (data.links.length !== mergedData.nodes.length) {
                setData(mergedData);
                setVisibility(false);
              setTimeout(mergedData.links.length * 30 + 1000);
            }
        } catch (error) {
            console.error('Error on click:', error);
            setError('Failed to fetch data by tag.');
        }
    }, 1000), [data]);

    // Loading Page
    if (loading) return <LoadingPage />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <>
            <ForceGraph3D
                // onEngineStop={() => fgRef.current?.zoomToFit(2000)}
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
                linkLabel={(links) => (links.group !== "super") ? (`${links?.group}: ${links.name}`) : ""}
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
                nodeThreeObject={(node) => createThreeObject(node, imageCache, svgCache) as any}
                nodeLabel={(node) => node.depth === 3 ? appCard(node, imageCache) : String(node.id)}
            />
            <SearchBar onSearch={handleSearch} />
        </>
    );
});

// Adding the display name
RegistryGraph.displayName = 'RegistryGraph';

export default RegistryGraph;





