// app/components/EnhancedCanvas3DBackground.tsx
'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
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
            // Limit the rotation to create a more natural eye movement
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

    useEffect(() => {
        const handleContextLost = (event: WebGLContextEvent) => {
            event.preventDefault()
            // Implement any necessary logic to handle context loss
            console.warn('WebGL context lost')
        }

        const handleContextRestored = () => {
            // Implement any necessary logic to handle context restoration
            console.log('WebGL context restored')
        }

        if (canvasRef.current) {
            canvasRef.current.addEventListener('webglcontextlost', handleContextLost as EventListener)
            canvasRef.current.addEventListener('webglcontextrestored', handleContextRestored as EventListener)
        }

        return () => {
            if (canvasRef.current) {
                canvasRef.current.removeEventListener('webglcontextlost', handleContextLost as EventListener)
                canvasRef.current.removeEventListener('webglcontextrestored', handleContextRestored as EventListener)
            }
        }
    }, [])

    return (
        <Canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            camera={{ position: [0, 0, 5], fov: 75 }}>
            <color attach="background" args={['#000000']} />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            <Particles />
            <EyesGroup />
        </Canvas>
    )
}
