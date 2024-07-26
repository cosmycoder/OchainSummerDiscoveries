import { searchGraphDataByValues, fetchFleekApi, fetchRegistryData, createIconCacheData, fleekCreateIconCacheData, fetchFleekApiByTag, mergeGraphData, svgPreloader, fetchBase64data, fetchFleekByNames } from "../../lib/dataConverter"
import { GraphData, ImageCacheData, SvgCacheData } from "../../types/api"
import React, { useState, useEffect, useRef, forwardRef, FC } from 'react';
import SearchBar from '../../components/Search/Search';
import ShowFavoriteButton from '../ShowFavoritesButton/ShowFavoritesButton';
import Popup from '../Popup/Popup'; // 
import { debounce } from 'lodash';
import { createThreeObject, appNodeClick, appCard } from '../../lib/threeFunc'
import ForceGraph3D, { ForceGraphMethods, ForceGraphProps } from "react-force-graph-3d";
import * as THREE from 'three';
import LoadingPage from "./LoadingPage";
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Profile from '@/components/Profile/Profile';
import SwapButton from "../SwapButton/SwapButton";
import styles from './RegistryGraph.module.css';


const RegistryGraph: FC = forwardRef((_props, _ref) => {
    const fgRef = useRef<ForceGraphMethods>();
    const [data, setData] = useState<GraphData>({ links: [], nodes: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [camloading, setCamLoading] = useState<boolean>(true);
    const [imageCache, setImageCache] = useState<ImageCacheData[]>([]);
    const [svgCache, setSvgCache] = useState<SvgCacheData[]>([]);
    const [visibility, setVisibility] = useState<boolean>(true);
    const [timeout, setTimeout] = useState<number>(1000);
    const [error, setError] = useState<string | null>(null);
    const [base3dLogo, setBase3dLogo] = useState<ImageCacheData | (() => void)>();
    const [graphKey, setGraphKey] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupValue, setPopupValue] = useState<any>();


    const DISTANCE = 200000 / window.innerHeight;
    const ROTATION_SPEED = 0.0002;
    const DEBOUNCE_DELAY = 1000;
    const MIN_DISTANCE = 50;
    // calc delay time
    const imageDelay = (graphData: GraphData) => Math.sqrt(graphData.links.length * 100000) + 1000 as number;

    useEffect(() => {
        if (fgRef.current) {
            const handleContextLost = (event: { preventDefault: () => void; }) => {
                event.preventDefault();
                console.warn('WebGL context lost. Attempting to restore...');
                window.location.reload();
            };

            const handleContextRestored = () => {
                console.log('WebGL context restored.');
                setGraphKey(graphKey + 1);
            };

            const canvas = fgRef.current?.renderer().domElement;
            canvas.addEventListener('webglcontextlost', handleContextLost, false);
            canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

            return () => {
                canvas.removeEventListener('webglcontextlost', handleContextLost);
                canvas.removeEventListener('webglcontextrestored', handleContextRestored);
                if (fgRef.current) {
                    const scene = fgRef.current.scene();
                    disposeScene(scene);
                    fgRef.current.renderer().dispose();
                }
            };
        }
    }, [graphKey]);
    // Initial Data retrival
    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const [initialGraph, fetchedData, base3dLogoData] = await Promise.all([
                    fetchFleekApi(['', 'AND', '2']),
                    fleekCreateIconCacheData(),
                    // createIconCacheData(),
                    fetchBase64data('/base-sphere-square.png')
                ]);
                const svgData = await svgPreloader(initialGraph);
                setData(initialGraph), setImageCache(fetchedData), setSvgCache(svgData), setBase3dLogo(base3dLogoData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch initial data.');
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
                        { x: 0, y: 0, z: DISTANCE }, // new position
                        { x: 0, y: 0, z: 0 }, // lookAt ({ x, y, z })
                        1000  // ms transition duration
                    );
                    setCamLoading(false);
                }
            }
        }, 1000);
        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [camloading, DISTANCE]);

    // Responsively change the size of display
    useEffect(() => {
        const handleResize = () => {
            if (fgRef.current) {
                const camera = fgRef.current.camera() as THREE.PerspectiveCamera;
                const renderer = fgRef.current.renderer();
                const width = window.innerWidth;
                const height = window.innerHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Graph rotation animation
    useEffect(() => {
        const rotationInterval = setInterval(() => {
            fgRef.current?.scene().rotateZ(ROTATION_SPEED);
            if (fgRef.current?.camera()?.position) {
                const position = fgRef.current?.camera()?.position;
                const distBase = position.distanceTo(new THREE.Vector3(0, 0, 0))
                // Minimum distance from Base planet 
                if (distBase < MIN_DISTANCE) {
                    //   console.log(position.distanceTo(new THREE.Vector3(0, 0, 0)))
                    fgRef.current.cameraPosition(
                        { x: 0, y: 0, z: DISTANCE }, // new position
                        { x: 0, y: 0, z: 0 }, // lookAt ({ x, y, z })
                        1000  // ms transition duration
                    );
                }
            };
        }, 50);
        return () => clearInterval(rotationInterval);
    }, [DISTANCE]);
    // Graph node visivility
    setInterval(() => (visibility === false) ? setVisibility(true) : null, timeout);

    // Loading Page
    if (loading) return <LoadingPage />;
    if (error) return <ErrorMessage message={error} />;

    const handleOpenPopup = debounce(async (node: any) => {
        try {
            setIsPopupOpen(true);
            setPopupValue(node);
        } catch (error) {
            console.error('Error opening popup:', error);
        }
    }, 500);

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const handleFavorites = debounce(async () => {
        try {

            const getAllLocalStorageKeys = () =>
                Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
                    .filter(key => key !== null && localStorage.getItem(key) === "true").filter(item => item !== null) as string[];;

            const favoritesArray = getAllLocalStorageKeys();

            const result = await (async () => {
                if (favoritesArray.length === 0) {
                    const result = await fetchFleekApi(['', 'AND', '2'])
                    setCamLoading(true);
                    return result as GraphData;

                } else {
                    const result = await fetchFleekByNames(favoritesArray);
                    return result as GraphData;
                }
            })();

            if (fgRef.current) {
                const scene = fgRef.current.scene();
                disposeScene(scene);
            }
            setData(result);
            setVisibility(false);
            setTimeout(imageDelay(result));
        } catch (error) {
            console.error('Error on click:', error);
            setError('Failed to fetch data by favorites.');
        }


    }, DEBOUNCE_DELAY);

    const handleSearch = debounce(async (query: string[]) => {
        try {
            // const result = await searchGraphDataByValues(query);
            const result = await (async () => {
                if (query[0].length === 0) {
                    const result = await fetchFleekApi(['', 'AND', '2'])
                    setCamLoading(true);
                    return result as GraphData;

                } else {
                    const result = await fetchFleekApi(query);
                    return result as GraphData;
                }
            })();

            setData(result);
            setVisibility(false);
            setTimeout(imageDelay(result));
            if (fgRef.current) {
                const scene = fgRef.current.scene();
                disposeScene(scene);
            }
        } catch (error) {
            console.error('Error during search:', error);
            setError('Failed to search graph data.');
        }
    }, DEBOUNCE_DELAY);

    const handleClick = debounce(async (query: string) => {
        try {
            // const result = await searchGraphDataByValues(query);
            const result = await fetchFleekApiByTag(query);
            const mergedData = mergeGraphData(data, result);
            if (data.links.length !== mergedData.nodes.length) {
                if (fgRef.current) {
                    const scene = fgRef.current.scene();
                    disposeScene(scene);
                }
                setData(mergedData);
                setVisibility(false);
                setTimeout(imageDelay(mergedData));
            }
        } catch (error) {
            console.error('Error on click:', error);
            setError('Failed to fetch data by tag.');
        }
    }, DEBOUNCE_DELAY);
    const getCurrentCache = () => imageCache;
    const getCurrentSvgCache = () => svgCache;
    const getBase3dLogo = () => base3dLogo;
    const getPopupValue = () => popupValue;
    const getIsPopupOpen = () => isPopupOpen;

    return (
        <>
            <div>
                <Profile>
                    <div className={styles.buttonContainer}>
                    <ShowFavoriteButton onFavorites={handleFavorites} />
                    <SwapButton />
                    </div>
                </ Profile>
                <ForceGraph3D
                    key={graphKey} // Force re-render by changing the key
                    // onEngineStop={() => fgRef.current?.zoomToFit(1000)}
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
                    linkLabel={(links) => (links.group !== "super") ? (`${links?.group}: ${links.name}`) : links.name}
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
                        if (node.depth === 1) { handleSearch(['', 'AND', '2']) } // Back to initial graph
                        if (node.depth === 2) { handleClick(String(node?.id)) } // Search by tag
                        if (node.depth === 3) { handleOpenPopup(node) }
                    }}
                    nodeThreeObject={(node) => createThreeObject(node, getCurrentCache(), getCurrentSvgCache(), getBase3dLogo() as any) as any}
                    nodeLabel={(node) => node.depth === 3 ? appCard(node, getCurrentCache()) : String(node.id)}
                />
            </div>
            <SearchBar onSearch={handleSearch} />
            <Popup isOpen={getIsPopupOpen()} onClose={handleClosePopup} popupValue={getPopupValue()} currentCache={getCurrentCache()} />
        </>
    );
});

// Adding the display name
RegistryGraph.displayName = 'RegistryGraph';

export default RegistryGraph;

// disposeScene when corrupted
const disposeScene = (scene: THREE.Scene) => {
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        }
    });
};


