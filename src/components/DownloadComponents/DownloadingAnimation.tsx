import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrthographicCamera, PerspectiveCamera, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import styles from './DownloadingAnimation.module.css';

interface MessageProps {
  message: {
    type: 'error' | 'success' | 'progress';
    content: string;
  } | null;
}

type BoxProps = {
  color: string;
};

const Box: React.FC<BoxProps> = ({ color }) => {
  const ref = useRef<THREE.Mesh>(null);

  // Load the textures
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/images/ipfs-face.png');

  // Create materials with the textures
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    color: color ?? 'silver',
    shininess: 100,
    emissive: 0x000000,
    emissiveIntensity: 0.5,
  });

  useFrame(() => {

    const rotationToDegree = (rotation: number) => Math.floor((rotation * (180 / Math.PI)) % 360);

    if (ref.current) {
      if (color !== 'silver' && color !== 'lightgreen' && color !== 'red') {
        ref.current.rotation.x += 0.01;
        ref.current.rotation.y += 0.01;
      } else {
        rotationToDegree(ref.current.rotation.x) !== 36 ? ref.current.rotation.x += 0.01 : ref.current.rotation.x = Math.PI / 5;
        rotationToDegree(ref.current.rotation.y) !== 45 ? ref.current.rotation.y += 0.01 : ref.current.rotation.y = Math.PI / 4;
      }
    }
  });

  return (
    <mesh ref={ref} material={material} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
      <boxGeometry args={[3.8, 3.8, 3.8]} />
    </mesh>
  );
};

const DownloadingAnimation: React.FC<MessageProps> = ({ message }) => {

  const getColor = () => {
    switch (message?.type) {
      case 'success':
        return 'lightgreen';
      case 'error':
        return 'red';
      case 'progress':
        return 'white';
      default:
        return 'silver';
    }
  };

  return (
    <Canvas className={styles.canvasContainer}>
      {/**  <OrthographicCamera makeDefault zoom={30} position={[0,0,10]} /> */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
      <ambientLight intensity={1} />
      <SpotLight
        position={[15, 15, 15]}
        angle={0.3}
        penumbra={0.1}
        intensity={2}
        castShadow
      />
      <Box color={getColor()} />
      <Html center>
        <div className={styles.textContainer}>
          {message?.content ?? "IPFS"}
        </div>
      </Html>
    </Canvas>
  );
};

export default DownloadingAnimation;
