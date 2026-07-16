import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { defineConfig } from "vite";

const srcTauriPath = path.resolve(__dirname, "src-tauri");

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    watch: {
      ignored: (filePath: string) => filePath.startsWith(srcTauriPath),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts')) return 'vendor-recharts'
          if (id.includes('node_modules/@dnd-kit')) return 'vendor-dnd'
          if (id.includes('node_modules/@tanstack/react-table')) return 'vendor-table'
          if (id.includes('node_modules/leaflet')) return 'vendor-leaflet'
          if (id.includes('node_modules/react-hook-form')) return 'vendor-form'
          if (id.includes('node_modules/zod')) return 'vendor-zod'
        }
      }
    }
  }
})