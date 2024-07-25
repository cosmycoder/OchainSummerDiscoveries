import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Model from './Model'
import styles from './AvatorView.module.css' 
interface AvatorProps {
  imgSrc: string;
}

const AvatorView: React.FC<AvatorProps> = ({imgSrc}) => {
  return (
    <div className={styles.container} >
      <Canvas>
        <ambientLight intensity={10} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1} 
          castShadow
        />
        <pointLight position={[-10, 0, -20]} intensity={0.5} />
        <pointLight position={[0, -10, 0]} intensity={1.5} />
        <Model 
          objUrl="/Astronaut/Astronaut.obj" 
          mtlUrl="/Astronaut/Astronaut.mtl" 
          imgSrc={imgSrc}
        />
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  )
}

export default AvatorView