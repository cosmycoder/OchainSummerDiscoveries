import React, { useRef, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import * as THREE from 'three'; // Import all components from three
import { Group, Mesh } from 'three';

interface ModelProps {
  objUrl: string;
  mtlUrl: string;
  imgSrc: string;
}

const Model: React.FC<ModelProps> = ({ objUrl, mtlUrl, imgSrc }) => {

  const materials = useLoader(MTLLoader, mtlUrl);
  const obj = useLoader(OBJLoader, objUrl, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const ref = useRef<Group>(null);
  // Load the texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(imgSrc);

  // Create the material using the texture
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // Create the plane geometry (width, height)
  const geometry = new THREE.PlaneGeometry(0.5, 0.5);

  // Combine the geometry and material into a mesh
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 3.5, 0.5);
  const group = new Group();

  group.add(obj, plane);

  useEffect(() => {
    obj.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              material.transparent = true;
              material.opacity = 0.7; // Adjust the opacity as needed
            });
          } else {
            mesh.material.transparent = true;
            mesh.material.opacity = 0.7; // Adjust the opacity as needed
          }
        }
      }
    });
  }, [obj]);

  // Ensure textures are loaded relative to the MTL file
  if (materials.materialsInfo["Astronaut_mat"]) {
    materials.materialsInfo["Astronaut_mat"].map_kd = "/Astronaut/Astronaut_BaseColor.png";
  }

  group.position.set(0, 0, 0);
  // Animation to make the object float
  useFrame(() => {
    if (ref.current) {
      const time = Date.now() * 0.001;
      ref.current.position.y = Math.sin(time) * 0.1 - 3.2; // Make the model float up and down
      ref.current.position.x = Math.cos(time) * 0.1; // Make the model move back and forth
      ref.current.position.z = Math.sin(time) * 0.1 + 3.2; 
    }
  });

  return <primitive object={group} ref={ref} />;
};

export default Model;
