import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import * as THREE from 'three';
import { Group, Mesh, Texture } from 'three';

interface ModelProps {
  objUrl: string;
  mtlUrl: string;
  imgSrc: string;
}

const Model = ({ objUrl, mtlUrl, imgSrc }: ModelProps) => {
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const ref = useRef<Group>(null);

  useEffect(() => {
    const loadModel = async () => {
      const mtlLoader = new MTLLoader();
      const materials = await mtlLoader.loadAsync(mtlUrl);
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      const loadedObj = await objLoader.loadAsync(objUrl);

      loadedObj.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((material) => {
                material.transparent = true;
                material.opacity = 0.7;
              });
            } else {
              mesh.material.transparent = true;
              mesh.material.opacity = 0.7;
            }
          }
        }
      });

      setObj(loadedObj);
    };

    const loadTexture = async () => {
      const textureLoader = new THREE.TextureLoader();
      const loadedTexture = await textureLoader.loadAsync(imgSrc);
      setTexture(loadedTexture);
    };

    loadModel();
    loadTexture();
  }, [objUrl, mtlUrl, imgSrc]);

  useEffect(() => {
    if (obj && texture) {
      const textureWidth = texture.image.width;
      const textureHeight = texture.image.height;
      const aspectRatio = textureWidth / textureHeight;
      const planeWidth = 0.5;
      const planeHeight = planeWidth / aspectRatio;

      const material = new THREE.MeshBasicMaterial({ map: texture });
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 3.5, 0.5);

      const group = new Group();
      group.add(obj, plane);
      group.position.set(0, 0, 0);

      if (ref.current) {
        ref.current.clear();
        ref.current.add(group);
      }
    }
  }, [obj, texture]);

  useFrame(() => {
    if (ref.current) {
      const time = Date.now() * 0.001;
      ref.current.position.y = Math.sin(time) * 0.1 - 3.2;
      ref.current.position.x = Math.cos(time) * 0.1;
      ref.current.position.z = Math.sin(time) * 0.1 + 3.2;
    }
  });

  return <group ref={ref} />;
};

export default Model;