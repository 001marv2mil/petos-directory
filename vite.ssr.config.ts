import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Separate Vite config for the SSR build used by the prerender script.
 * Run with: vite build --config vite.ssr.config.ts
 * Outputs a Node-compatible bundle of src/entry-server.tsx to ssr-build/
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'ssr-build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Output as ESM so the prerender script can import() it
        format: 'es',
      },
    },
  },
  // Suppress CSS processing during SSR build
  css: {
    modules: { generateScopedName: '[local]' },
  },
})
