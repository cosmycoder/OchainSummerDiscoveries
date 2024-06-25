import React, { useEffect, useRef, useState, forwardRef, FC } from 'react';
import * as THREE from 'three';


const BaseEyes: FC = forwardRef((_props, _ref) => {
    const refContainer = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        function resizeRenderer() {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            
            if (canvas.width !== width || canvas.height !== height) {
              renderer.setSize(width, height, false);
              camera.aspect = width / height;
              camera.updateProjectionMatrix();
            }
          }
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (refContainer.current) {
            refContainer.current.appendChild(renderer.domElement);
        }

        camera.position.set(0, 0, -300);
        camera.lookAt(new THREE.Vector3(0, 0, 0));


        const texture = new THREE.TextureLoader().load("/base-sphere-square.png");
        const geometry2 = new THREE.SphereGeometry(1, 64, 64);
        const material2 = new THREE.MeshBasicMaterial({ map: texture });

        const sphere1 = new THREE.Mesh(geometry2, material2);
        sphere1.scale.set(18, 18, 18);
        sphere1.position.set(-60, 0, 50);
        // sphere1.rotation.z += Math.PI;

        const sphere2 = new THREE.Mesh(geometry2, material2);
        sphere2.scale.set(18, 18, 18);
        sphere2.position.set(-20, 0, 50);

        const sphere3 = new THREE.Mesh(geometry2, material2);
        sphere3.scale.set(18, 18, 18);
        sphere3.position.set(20, 0, 50);

        const sphere4 = new THREE.Mesh(geometry2, material2);
        sphere4.scale.set(18, 18, 18);
        sphere4.position.set(60, 0, 50);
        // sphere4.rotation.z -= Math.PI;

        const group = new THREE.Group();
        group.add(sphere1);
        group.add(sphere2);
        group.add(sphere3);
        group.add(sphere4);
        scene.add(group);

        const animate = () => {
            requestAnimationFrame(animate);
            resizeRenderer();
            renderer.render(scene, camera);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

     //    window.addEventListener('resize', handleResize);
        // MOUSEMOVE ANIMATION
        window.addEventListener('mousemove', (event) => {
            sphere1.rotation.y = (event.clientX / window.innerWidth) - 0.5;
            sphere1.rotation.x = (event.clientY / window.innerHeight) - 0.5;
            sphere1.rotation.x = ((event.clientX / window.innerWidth) - 0.5) * 15;
            sphere1.rotation.y = ((event.clientY / window.innerHeight) - 0.5) * -15;

            sphere2.rotation.y = (event.clientX / window.innerWidth) - 0.5;
            sphere2.rotation.x = (event.clientY / window.innerHeight) - 0.5;
            sphere2.rotation.x = ((event.clientX / window.innerWidth) - 0.5) * 15;
            sphere2.rotation.y = ((event.clientY / window.innerHeight) - 0.5) * -15;

            sphere3.rotation.y = (event.clientX / window.innerWidth) - 0.5;
            sphere3.rotation.x = (event.clientY / window.innerHeight) - 0.5;
            sphere3.rotation.x = ((event.clientX / window.innerWidth) - 0.5) * 15;
            sphere3.rotation.y = ((event.clientY / window.innerHeight) - 0.5) * -15;


            sphere4.rotation.y = (event.clientX / window.innerWidth) - 0.5;
            sphere4.rotation.x = (event.clientY / window.innerHeight) - 0.5;
            sphere4.rotation.x = ((event.clientX / window.innerWidth) - 0.5) * 15;
            sphere4.rotation.y = ((event.clientY / window.innerHeight) - 0.5) * -15;
        });


        // Simulate loading completion
        animate();

    }, []);

    return <div ref={refContainer} />;
});

// Adding the display name
BaseEyes.displayName = 'BaseEyes';

export default BaseEyes;
