import React, { useEffect, useRef, forwardRef, FC } from 'react';
import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const LoadingPage: FC = forwardRef((_props, _ref) => {
  const refContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { scene, camera, renderer, cleanUp } = initializeScene(refContainer.current);
    const spheres = createSpheres();
    const group = new THREE.Group().add(...spheres);
    scene.add(group);

    const light = createLight();
    scene.add(light);

    loadFont().then((font) => {
      const textMesh = createTextMesh(font);
      scene.add(textMesh);
      animate(renderer, scene, camera, spheres, light);
    });

    const handleResize = createResizeHandler(camera, renderer);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanUp();
    };
  }, []);

  return <div ref={refContainer} />;
});

LoadingPage.displayName = 'LoadingPage';

const initializeScene = (container: HTMLDivElement | null) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.set(0, 0, -300);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  if (container) {
    container.appendChild(renderer.domElement);
  }

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    console.warn('WebGL context lost. Attempting to restore...');
    window.location.reload();
  };

  const handleContextRestored = () => {
    console.log('WebGL context restored.');
  };

  renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
  renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

  const cleanUp = () => {
    if (container && renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
    disposeScene(scene);
    renderer.dispose();
  };

  return { scene, camera, renderer, cleanUp };
};

const createSpheres = () => {
  const texture = new THREE.TextureLoader().load('/base-sphere-square.png');
  const geometry = new THREE.SphereGeometry(1, 128, 128); // Increased segments for smoother geometry
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.8 });

  return [
    createSphere(geometry, material, -60, 0, 50, -Math.PI, 0.01, 0, 0),
    createSphere(geometry, material, -20, 0, 50, 0, 0.01, 0.01, 0.01),
    createSphere(geometry, material, 20, 0, 50, 0, -0.01, -0.01, -0.01),
    createSphere(geometry, material, 60, 0, 50, -0.01, 0, 0, 0.01),
  ];
};

const createSphere = (
  geometry: THREE.SphereGeometry,
  material: THREE.MeshBasicMaterial,
  x: number,
  y: number,
  z: number,
  rotationZ: number,
  rotationSpeedX: number,
  rotationSpeedY: number,
  rotationSpeedZ: number
) => {
  const sphere = new THREE.Mesh(geometry, material);
  sphere.scale.set(18, 18, 18);
  sphere.position.set(x, y, z);
  sphere.rotation.z = rotationZ;
  sphere.userData = { rotationSpeed: { x: rotationSpeedX, y: rotationSpeedY, z: rotationSpeedZ } };
  return sphere;
};

const createLight = () => {
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 0, -200);
  return light;
};

const loadFont = () => new FontLoader().loadAsync('/helvetiker_bold.typeface.json');

const createTextMesh = (font: Font) => {
  const textGeometry = new TextGeometry('Loading...', {
    font,
    size: 10,
    height: 2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 5,
  });
  const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textGeometry.center();
  textMesh.position.y = -30;
  textMesh.rotateY(Math.PI);
  return textMesh;
};

const animate = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  spheres: THREE.Mesh[],
  light: THREE.DirectionalLight
) => {
  requestAnimationFrame(() => animate(renderer, scene, camera, spheres, light));
  spheres.forEach((sphere) => {
    const { x, y, z } = sphere.userData.rotationSpeed;
    sphere.rotation.x += x;
    sphere.rotation.y += y;
    sphere.rotation.z += z;
  });
  renderer.render(scene, camera);
};

const createResizeHandler = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const disposeScene = (scene: THREE.Scene) => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material?.dispose();
      }
    }
  });
};

export default LoadingPage;
