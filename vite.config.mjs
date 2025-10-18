import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
  publicDir: 'public',
  preview: {
    port: 4173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    copyPublicDir: true,
    // ✅ Ensure correct base path
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // ✅ Important for Netlify
  base: './',
});