// app/components/EnhancedCanvas3DBackground.tsx
'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'

function Particles() {
    const particlesRef = useRef<THREE.Points>(null)
    const { camera } = useThree()

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
    }, [])

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.001
        }
    })

    return (
        <points ref={particlesRef}>
            <bufferGeometry />
            <pointsMaterial size={0.02} color="#ffffff" />
        </points>
    )
}

interface EyesProps {
    position: [number, number, number]
}

function Eyes({ position }: EyesProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const texture = useLoader(THREE.TextureLoader, "/base-sphere-square.png")
    const { viewport } = useThree()

    useFrame(() => {
        if (meshRef.current) {

            // Limit the rotation to create a more natural eye movement
            meshRef.current.rotation.x = THREE.MathUtils.clamp(meshRef.current.rotation.x, -Math.PI / 4, Math.PI / 4)
            meshRef.current.rotation.y = THREE.MathUtils.clamp(meshRef.current.rotation.y, -Math.PI / 4, Math.PI / 4)
            meshRef.current.rotation.z = THREE.MathUtils.clamp(meshRef.current.rotation.z, -Math.PI / 4, Math.PI / 4)
        }
    })

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    )
}

function EyesGroup() {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current) {
            // Rotate the entire group slowly
            groupRef.current.rotation.y += 0.001
            groupRef.current.rotation.z += 0.001
            groupRef.current.rotation.x += 0.001
            // Add some "bobbing" motion
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
        }
    })

    return (
        <group ref={groupRef} position={[0, 0, -10]}>
            <Eyes position={[-5, -5, 0]} />
            <Eyes position={[-3, -5, 0]} />
            <Eyes position={[-1, -5, 0]} />
            <Eyes position={[1, -5, 0]} />
            <Eyes position={[3, -5, 0]} />
            <Eyes position={[5, -5, 0]} />
        </group>
    )
}

export function EnhancedCanvas3DBackground() {
    return (
        <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            camera={{ position: [0, 0, 5], fov: 75 }}>
            <color attach="background" args={['#000000']} />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            <Particles />
            <EyesGroup />
        </Canvas>
    )
}