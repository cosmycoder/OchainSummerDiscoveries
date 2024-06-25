// app/components/FeatureCard.tsx
import Image from 'next/image'
import styles from './FeatureCard.module.css'

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}><Image src={icon} alt="" width={150} height={100} className={styles.icon} /></div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}