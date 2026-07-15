import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), reactRouter()],
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
