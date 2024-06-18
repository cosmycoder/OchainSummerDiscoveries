import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  test: {
    globals: true, // Enable global variables
    environment: 'jsdom', // Use jsdom for browser-like environment
    reporters: ['default', 'html'], // Add HTML reporter
    coverage: {
      reporter: ['text', 'html'], // Add coverage reporters
      extension: '.ts' // Specify the extension for coverage analysis
    },
    includeSource: ['src/**/*.{js,ts}'] // Include source files for coverage
  },
  resolve: {
    alias: {
      '@': '/src' // Alias for the src directory
    }
  },
  root: './' // Root directory for the project
})