import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      /*'/api': {
        target: 'https://localai.challengers.tech',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1'),
        secure: false
      },*/
      '/__mcp': {
        target: 'https://ollama.challengers.tech',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__mcp/, '/v1'),
        secure: true,
        ws: true, // Enable WebSocket proxying
      }
    }
  }
})
