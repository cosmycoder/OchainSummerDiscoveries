import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

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
  const material = new THREE.MeshBasicMaterial({
    map: texture, // Your texture
    color: color ?? 'black'
  });

  useFrame(() => {

    const rotationToDegree = (rotation: number) => Math.floor((rotation * (180 / Math.PI)) % 360);

    if (ref.current) {
      if (color !== 'silver' && color !== 'green' && color !== 'red') {
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
        return 'green';
      case 'error':
        return 'red';
      case 'progress':
        return 'gray';
      default:
        return 'silver';
    }
  };

  return (
    <Canvas style={{ height: '200px' }}>
      {/**  <OrthographicCamera makeDefault zoom={30} position={[0,0,10]} /> */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Box color={getColor()} />
      <Html center>
        <div style={{ color: 'white', fontSize: '18px', textAlign: 'center' }}>
          {message?.content ?? "IPFS"}
        </div>
      </Html>
    </Canvas>
  );
};

export default DownloadingAnimation;
