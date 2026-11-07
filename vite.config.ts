import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seoPlugin, siteBase } from './build/seo'
import { cvPlugin } from './build/cv'

export default defineConfig({
  plugins: [react(), seoPlugin(), cvPlugin()],
  base: siteBase,
  build: { outDir: 'dist', emptyOutDir: true },
})
