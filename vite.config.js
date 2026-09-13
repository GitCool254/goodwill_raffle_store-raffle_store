import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { visualizer } from 'rollup-plugin-visualizer'
import { viteSingleFile } from 'vite-plugin-singlefile'

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
      open: false, // do NOT auto-open during CI/Vercel builds
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html', // output file
    }),
    // Inline all CSS and JS into a single index.html so there are
    // zero render-blocking CSS requests on the critical path.
    viteSingleFile(),
  ],

  build: {
    sourcemap: false,
    // viteSingleFile needs these settings to be able to inline everything
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    // manualChunks removed — incompatible with single-file bundling
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
