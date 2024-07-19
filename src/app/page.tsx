'use client';
import styles from './page.module.css';
import { FadeIn } from '../components/FadeIn/FadeIn';
import FeatureCard from '@/components/FeatureCard/FeatureCard';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { ParallaxHero } from '@/components/Hero/ParallaxHero';
import { FC } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  delay: number;
}

const FeatureCards: FeatureCardProps[] = [
  {
    title: "Powered by Fleek",
    description: "Fleek is an edge-optimized cloud platform. Effortlessly build, ship and scale highly performant apps.",
    icon: "/fleek-xyz-full-on-dark.svg",
    delay: 0.4
  },
  {
    title: "Joined in Onchain Summer",
    description: "Build a compelling app on top of the Onchain Summer Registry, with a focus on discoverability and daily engagement. Sponsored by Fleek and Base.",
    icon: "/ocs_banner.svg",
    delay: 0.6
  },
  {
    title: "Discover on BASE",
    description: "Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.",
    icon: "/Base_Wordmark_White.svg",
    delay: 0.8
  }
];

const Home: FC = () => (
  <>
    <Navbar />
    <ParallaxHero
      title={<>Onchain Summer <span className={styles.highlight}>Discoveries</span></>}
      subtitle={<p className={styles.description}>DISCOVER YOUR FAVORITE APPLICATION IN THE UNIVERSE</p>}
    />
    <main className={styles.main}>
      <FadeIn>
        <h3 className={styles.title}>
          <span className={styles.highlight}>BASE</span> Ecosystem Finder
        </h3>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className={styles.description}>
          Boosting the discoverability of the BASE ecosystem with highly accessible graph visualizations
        </p>
      </FadeIn>
      <div className={styles.grid}>
        {FeatureCards.map((card, index) => (
          <FadeIn key={index} delay={card.delay}>
            <FeatureCard
              title={card.title}
              description={card.description}
              icon={card.icon}
            />
          </FadeIn>
        ))}
      </div>
    </main>
    <Footer />

  </>
);

export default Home;
