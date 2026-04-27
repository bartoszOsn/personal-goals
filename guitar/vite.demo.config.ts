import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: 'demo',
  plugins: [react()],
  resolve: {
    alias: {
      '@guitar': resolve(__dirname, 'src'),
    },
  },
})
