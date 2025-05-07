import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode']
  },
  rollupOptions: {
    external: [
      'react', 
        'react-dom', 
        'graphql', 
        'graphql-ws',
        'socket.io-client',
        'subscriptions-transport-ws',
        'jwt-decode',
        'react-router-dom'
    ]
  },
})
