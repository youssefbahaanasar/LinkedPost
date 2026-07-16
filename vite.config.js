import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "url"
import path from "path"

// السطرين دول بيعوضوا غياب __dirname تماماً وبطريقة متوافقة مع الـ ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base:"/linkedPost/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})