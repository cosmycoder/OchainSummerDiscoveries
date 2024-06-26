// app/page.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FadeIn } from '../components/FadeIn'
import { FeatureCard } from '../components/FeatureCard'
import styles from './page.module.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ParallaxHero } from '@/components/ParallaxHero'
import { ReactNode } from 'react'

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <ParallaxHero
        title={<>Onchain Summer <span className={styles.highlight}>Discoveries</span></>}
        subtitle={<><p className={styles.description}>
          DISCOVER YOUR FAVORITE APPLICATION IN THE UNIVERSE</p></>}
      ></ParallaxHero>
      <main className={styles.main}>
        <FadeIn>
          <h3 className={styles.title}>
            <span className={styles.highlight}>BASE</span> Ecosystem Finder
          </h3>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className={styles.description}>
            Kick off Onchain Summer by participating in a global virtual hackathon hosted by Base and track sponsors including Stripe, Shopify, Farcaster, Zora, Fleek, thirdweb, Nouns, Aerodrome, and Synthetix.
          </p>
        </FadeIn>
        <div className={styles.grid}>
          <FadeIn delay={0.4}>
            <FeatureCard
              title="Powered by Fleek"
              description="Fleek is an edge-optimized cloud platform. Effortlessly build, ship and
scale highly performant apps."
              icon="/fleek-xyz-full-on-dark.svg"
            />
          </FadeIn>
          <FadeIn delay={0.6}>
            <FeatureCard
              title="Joined in Onchain Summer"
              description="Build a compelling app on top of the Onchain Summer Registry, with a focus on discoverability and daily engagement. Sponsored by Fleek and Base."
              icon="/ocs_banner.svg"
            />
          </FadeIn>
          <FadeIn delay={0.8}>
            <FeatureCard
              title="Discover on BASE"
              description="Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain."
              icon="/Base_Wordmark_Blue.png"
            />
          </FadeIn>
        </div>
      </main>
      <Footer></Footer>
    </>
  )
}

