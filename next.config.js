/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})

const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = withPWA(nextConfig)