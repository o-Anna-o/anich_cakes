import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Разрешаем доступ к папке anich_cakes для статических файлов
      allow: ['..'],
    },
  },
})
