// app/components/FadeIn.tsx
'use client'

import { ReactNode, FC } from 'react'
import { motion } from 'framer-motion'

interface FadeInProps {
  children: ReactNode;
  delay?: number;
}

export const FadeIn: FC<FadeInProps> = ({ children, delay = 0 }) =>
(
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
)