import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "client/index.html"),
        "404": path.resolve(import.meta.dirname, "client/404.html")
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['wouter']
        }
      }
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  // Add base path for GitHub Pages
  base: "/Dementia-Assistant/",
});