import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // Lossless compression – adjust quality for better size reduction
      png: {
        quality: 80, // 0-100, lower = smaller file
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      avif: {
        quality: 70,
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
      logStats: true, // shows before/after sizes in build output
    }),
    // Bundle visualizer – generates a report after build
    visualizer({
      open: true, // automatically open report in browser
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html', // output file
    }),
  ],

  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ['react', 'react-dom', 'react-helmet-async'],
          // You can add more specific chunks if needed, e.g.:
          // ui: ['some-ui-library'],
        },
      },
    },
    chunkSizeWarningLimit: 500, // increase warning limit if needed
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
