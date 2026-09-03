import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    esbuildDrop: ['console', 'debugger'],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor'
            }
            if (id.includes('framer-motion')) {
              return 'framer'
            }
            if (id.includes('react-icons')) {
              return 'react-icons'
            }
            if (id.includes('react-router') || id.includes('react-router-dom')) {
              return 'router'
            }
            if (id.includes('@emailjs')) {
              return 'emailjs'
            }
            if (id.includes('recharts')) {
              return 'recharts'
            }
            if (id.includes('gsap')) {
              return 'gsap'
            }
            if (id.includes('axios')) {
              return 'axios'
            }
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
