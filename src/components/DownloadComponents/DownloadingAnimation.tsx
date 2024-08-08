import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
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
    color: color
  });

  useFrame(() => {
    if (ref.current) {
      if (color !== 'white' && color !== 'green') {
        ref.current.rotation.x += 0.01;
        ref.current.rotation.y += 0.01;
      } else {
        ref.current.position.x !== 0 ? ref.current.rotation.x += 0.01 : ref.current.rotation.x = 0;
        ref.current.position.y !== 0 ? ref.current.rotation.y += 0.01 : ref.current.rotation.y = 0;
      }

    }
  });

  return (
    <mesh ref={ref} material={material}>
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
        return 'white';
    }
  };

  return (
    <Canvas style={{ height: '200px' }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Box color={getColor()} />
      <Html center>
        <div style={{ color: 'white', fontSize: '18px', textAlign: 'center' }}>
          {message?.content}
        </div>
      </Html>
    </Canvas>
  );
};

export default DownloadingAnimation;
