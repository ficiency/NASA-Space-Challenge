import { defineConfig } from '@tailwindcss/vite'

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bloom-green': '#059669',
        'bloom-orange': '#ea580c',
        'bloom-red': '#dc2626',
      },
    },
  },
})