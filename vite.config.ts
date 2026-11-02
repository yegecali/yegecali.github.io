import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seoPlugin, siteBase } from './build/seo'

export default defineConfig({
  plugins: [
    react(),
    seoPlugin(),
  ],
  base: siteBase,
  build: { outDir: 'dist', emptyOutDir: true },
})
