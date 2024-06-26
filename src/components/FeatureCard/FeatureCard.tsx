// app/components/FeatureCard.tsx
import Image from 'next/image';
import styles from './FeatureCard.module.css';
import { FC } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <Image src={icon} alt="" width={150} height={100} className={styles.icon} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;