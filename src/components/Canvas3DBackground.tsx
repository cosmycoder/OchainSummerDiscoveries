// app/components/Canvas3DBackground.tsx
'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

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
      camera.position.y = -state.mouse.y * 0.1
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial size={0.02} color="#ffffff" />
    </points>
  )
}

export function Canvas3DBackground() {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <color attach="background" args={['#000000']} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      <Particles />
    </Canvas>
  )
}