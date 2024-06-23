import React, { useEffect, useRef, useState, forwardRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const LoadingPage = forwardRef((props, ref) => {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }

    camera.position.set(0, 0, -300);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const light = new THREE.DirectionalLight(0xffffff, 10);
    scene.add(light);

    const texture = new THREE.TextureLoader().load("/base-sphere-square.png");
    const geometry2 = new THREE.SphereGeometry(1, 64, 64);
    const material2 = new THREE.MeshBasicMaterial({ map: texture });

    const sphere1 = new THREE.Mesh(geometry2, material2);
    sphere1.scale.set(18, 18, 18);
    sphere1.position.set(-60, 0, 50);
    sphere1.rotation.z += Math.PI;

    const sphere2 = new THREE.Mesh(geometry2, material2);
    sphere2.scale.set(18, 18, 18);
    sphere2.position.set(-20, 0, 50);

    const sphere3 = new THREE.Mesh(geometry2, material2);
    sphere3.scale.set(18, 18, 18);
    sphere3.position.set(20, 0, 50);

    const sphere4 = new THREE.Mesh(geometry2, material2);
    sphere4.scale.set(18, 18, 18);
    sphere4.position.set(60, 0, 50);
    sphere4.rotation.z -= Math.PI;

    const group = new THREE.Group();
    group.add(sphere1);
    group.add(sphere2);
    group.add(sphere3);
    group.add(sphere4);
    scene.add(group);

    const fontLoader = new FontLoader();
    fontLoader.load('/helvetiker_bold.typeface.json', function (font) {
      const textGeometry = new TextGeometry('Loading...', {
        font: font,
        size: 10,
        depth: 2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
      });

      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textGeometry.center();
      textMesh.position.y = -30;
      scene.add(textMesh);

      animate();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      sphere1.rotation.x += 0;
      sphere1.rotation.y += 0;
      sphere1.rotation.z += 0.01;
      sphere2.rotation.x += 0.01;
      sphere2.rotation.y += 0.01;
      sphere3.rotation.x -= 0.01;
      sphere3.rotation.y -= 0.01;
      sphere4.rotation.x -= 0;
      sphere4.rotation.y -= 0;
      sphere4.rotation.z -= 0.01;
      renderer.render(scene, camera);

      const t = Date.now() / 500;
      const r = 40.0;
      const lx = r * Math.cos(t);
      const lz = r * Math.sin(t);
      const ly = 6.0 + 5.0 * Math.sin(t / 3.0);
      light.position.set(lx, ly, lz);

      scene.children.forEach(child => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).rotation.y += Math.PI + 0.01;
        }
      });
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Simulate loading completion
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Change this timeout as needed

    return () => {
      window.removeEventListener('resize', handleResize);

      if (refContainer.current && renderer.domElement.parentNode === refContainer.current) {
        refContainer.current.removeChild(renderer.domElement);
      }

      // Clean up resources
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  if (!loading) {
    return null;
  }

  return <div ref={refContainer} />;
});

export default LoadingPage;
