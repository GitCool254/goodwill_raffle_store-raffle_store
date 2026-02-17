import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ✅ ADD THIS SECTION
  build: {
    sourcemap: false
  },

  // 🚫 FIX PayPal iframe being destroyed
  server: {
    hmr: {
      overlay: false
    },
    watch: {
      ignored: [
        '**/public/paypal-root/**',
        '**/paypal-root/**'
      ]
    }
  }
})
