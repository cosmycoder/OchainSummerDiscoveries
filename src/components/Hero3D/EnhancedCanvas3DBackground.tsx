// app/components/EnhancedCanvas3DBackground.tsx
'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'

const Particles = () => {
    const particlesRef = useRef<THREE.Points>(null)

    useEffect(() => {
        if (particlesRef.current) {
            const geometry = particlesRef.current.geometry as THREE.BufferGeometry
            const positions = new Float32Array(1000 * 3)

            for (let i = 0; i < 1000; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 10
                positions[i * 3 + 1] = (Math.random() - 0.5) * 10
                positions[i * 3 + 2] = (Math.random() - 0.5) * 10
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        }

        return () => {
            if (particlesRef.current) {
                const geometry = particlesRef.current.geometry as THREE.BufferGeometry
                geometry.dispose()
            }
        }
    }, [])

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.001
        }
    })

    return (
        <points ref={particlesRef}>
            <bufferGeometry />
            <pointsMaterial size={0.01} color="#ffffff" />
        </points>
    )
}

interface EyesProps {
    position: [number, number, number]
}

const Eyes = ({ position }: EyesProps) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const texture = useLoader(THREE.TextureLoader, "/base-sphere-square.png")

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x = THREE.MathUtils.clamp(meshRef.current.rotation.x, -Math.PI / 4, Math.PI / 4)
            meshRef.current.rotation.y = THREE.MathUtils.clamp(meshRef.current.rotation.y, -Math.PI / 4, Math.PI / 4)
            meshRef.current.rotation.z += 0.005
        }
    })

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    )
}

const EyesGroup = () => {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001
            groupRef.current.rotation.z += 0.001
            groupRef.current.rotation.x += 0.001
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
        }
    })

    return (
        <group ref={groupRef} position={[0, 0, -10]}>
            <Eyes position={[-7, -6, 4]} />
            <Eyes position={[-5, -5, 3]} />
            <Eyes position={[-3, -4, 2]} />
            <Eyes position={[-1, -3, 1]} />
            <Eyes position={[1, -2, 0]} />
            <Eyes position={[3, -1, -1]} />
            <Eyes position={[5, 0, -2]} />
            <Eyes position={[7, 1, -3]} />
        </group>
    )
}

export const EnhancedCanvas3DBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [graphKey, setGraphKey] = useState(0);

    useEffect(() => {
        if (canvasRef.current) {
            const handleContextLost = (event: { preventDefault: () => void; }) => {
                event.preventDefault();
                console.warn('WebGL context lost. Attempting to restore...');
                window.location.reload();
            };

            const handleContextRestored = () => {
                console.log('WebGL context restored.');
                setGraphKey(graphKey + 1);
            };

            canvasRef.current.addEventListener('webglcontextlost', handleContextLost, false);
            canvasRef.current.addEventListener('webglcontextrestored', handleContextRestored, false);

            return () => {
                canvasRef.current?.removeEventListener('webglcontextlost', handleContextLost);
                canvasRef.current?.removeEventListener('webglcontextrestored', handleContextRestored);
            };
        }
    }, [graphKey]);

    const disposeScene = (scene: THREE.Scene) => {
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose()
                if (object.material instanceof THREE.Material) {
                    object.material.dispose()
                }
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose())
                }
            }
        })
    }

    return (
        <Canvas key={graphKey} ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            camera={{ position: [0, 0, 5], fov: 75 }}
            onCreated={({ gl, scene }) => {
                return () => {
                    disposeScene(scene)
                    gl.dispose()
                    console.log('Scene and WebGL context disposed.')
                };
            }}>
            <color attach="background" args={['#000000']} />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            <Particles />
            <EyesGroup />
        </Canvas>
    )
}

export default EnhancedCanvas3DBackground;
