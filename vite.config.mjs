import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // ✅ allows direct reload on /candidates/:id
  },
  // ✅ Ensure public directory is correctly configured
  publicDir: 'public',
  
  // ✅ Add preview server config to match dev server behavior
  preview: {
    port: 4173,
    strictPort: false,
  },
  
  // ✅ Build configuration
  build: {
    outDir: 'dist',
    // Copy public assets including mockServiceWorker.js
    copyPublicDir: true,
  },
});