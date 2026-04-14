import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Added this comment to force Vite to restart and pick up TailwindCSS/PostCSS!
export default defineConfig({
  plugins: [react()],
})
