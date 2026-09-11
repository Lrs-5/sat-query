import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standard Vite + React configuration.
// This is what lets us write .jsx files and use fast refresh during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
