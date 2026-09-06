import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // Lossy compression – lower quality = smaller file
      png: {
        quality: 65,
      },
      jpeg: {
        quality: 70,
      },
      jpg: {
        quality: 70,
      },
      webp: {
        quality: 70,
      },
      avif: {
        quality: 60,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                cleanupIds: { minify: false, remove: false },
                convertPathData: false,
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
      // 🔥 Convert images to modern formats
      convert: {
        webp: true,
        avif: true,
      },
      // Process all images in the build output
      include: ['**/*.{jpg,jpeg,png,svg,gif,webp,avif}'],
      logStats: true,
    }),
    // Bundle visualizer – generates a report after build
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],

  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-helmet-async'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },

  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: [
        '**/public/paypal-root/**',
        '**/paypal-root/**',
      ],
    },
  },
})
