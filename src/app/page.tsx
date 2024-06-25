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
          Discover your favorite Web3 Application</p></>}
      ></ParallaxHero>
      <main className={styles.main}>
      <FadeIn delay={1}>
          <Link href="/discovery" className={styles.cta}>
            Launch App
          </Link>
        </FadeIn>
        <FadeIn>
          <h1 className={styles.title}>
            <span className={styles.highlight}>BASE</span> Ecosystem Finder
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className={styles.description}>
            Discover your favorite Web3 Application
          </p>
        </FadeIn>

        <div className={styles.grid}>
          <FadeIn delay={0.4}>
            <FeatureCard
              title="Powered by Fleek"
              description="Fleek is an edge-optimized cloud platform. Effortlessly build, ship and
scale highly performant apps."
              icon="/fleekLogo.svg"
            />
          </FadeIn>
          <FadeIn delay={0.6}>
            <FeatureCard
              title="Joined Onchain Summer"
              description="Build a compelling app on top of the Onchain Summer Registry, with a focus on discoverability and daily engagement. Sponsored by Fleek and Base."
              icon="/ocs_banner.svg"
            />
          </FadeIn>
          <FadeIn delay={0.8}>
            <FeatureCard
              title="Discover on BASE"
              description="ON BASE
Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain."
              icon="/Base_Wordmark_Blue.png"
            />
          </FadeIn>
        </div>
      </main>
      <Footer></Footer>
    </>
  )
}

