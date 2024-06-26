// app/components/ParallaxHero.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EnhancedCanvas3DBackground } from './EnhancedCanvas3DBackground'
import styles from './ParallaxHero.module.css'
import { FadeIn } from './FadeIn'
import Link from 'next/link'

interface ParallaxHeroProps {
    title: ReactNode;
    subtitle: ReactNode;
  }

export function ParallaxHero({ title, subtitle }: ParallaxHeroProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className={styles.parallaxContainer}>
      <EnhancedCanvas3DBackground />
      <div className={styles.content}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
        <FadeIn delay={1}>
          <Link href="/discovery" className={styles.cta}>
            Launch App
          </Link>
        </FadeIn>
      </div>
    </div>
  )
}