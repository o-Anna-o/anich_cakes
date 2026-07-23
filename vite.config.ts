import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function copyDir(src: string, dest: string) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry)
    const destPath = join(dest, entry)
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

function copyStaticPlugin(): import('vite').Plugin {
  return {
    name: 'copy-static',
    closeBundle() {
      const src = join(__dirname, 'anich_cakes')
      const dest = join(__dirname, 'dist', 'anich_cakes')
      if (existsSync(src)) {
        copyDir(src, dest)
        console.log('[copy-static] Copied anich_cakes/ -> dist/anich_cakes/')
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/anich_cakes/',
  plugins: [react(), copyStaticPlugin()],
  server: {
    fs: {
      // Разрешаем доступ к папке anich_cakes для статических файлов
      allow: ['..'],
    },
  },
})
