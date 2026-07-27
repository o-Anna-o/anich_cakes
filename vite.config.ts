import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'
import type { Connect } from 'vite'

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
      // Также копируем public/ (favicon, icons)
      const publicSrc = join(__dirname, 'public')
      if (existsSync(publicSrc)) {
        copyDir(publicSrc, dest)
        console.log('[copy-static] Copied public/ -> dist/anich_cakes/')
      }
    },
  }
}

function serveStaticPlugin(): import('vite').Plugin {
  return {
    name: 'serve-static',
    configureServer(server) {
      server.middlewares.use((req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
        const url = req.url || ''
        if (url.startsWith('/anich_cakes/')) {
          const relativePath = url.replace('/anich_cakes/', '')
          // Сначала проверяем в anich_cakes/
          let filePath = join(__dirname, 'anich_cakes', relativePath)
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            const content = readFileSync(filePath)
            const ext = filePath.split('.').pop() || ''
            const mime: Record<string, string> = {
              jpg: 'image/jpeg',
              jpeg: 'image/jpeg',
              png: 'image/png',
              gif: 'image/gif',
              svg: 'image/svg+xml',
              webp: 'image/webp',
              mp4: 'video/mp4',
              css: 'text/css',
              js: 'application/javascript',
              json: 'application/json',
              ico: 'image/x-icon',
            }
            res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' })
            res.end(content)
            return
          }
          // Если не нашли, проверяем в public/
          filePath = join(__dirname, 'public', relativePath)
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            const content = readFileSync(filePath)
            const ext = filePath.split('.').pop() || ''
            const mime: Record<string, string> = {
              jpg: 'image/jpeg',
              jpeg: 'image/jpeg',
              png: 'image/png',
              gif: 'image/gif',
              svg: 'image/svg+xml',
              webp: 'image/webp',
              mp4: 'video/mp4',
              css: 'text/css',
              js: 'application/javascript',
              json: 'application/json',
              ico: 'image/x-icon',
            }
            res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' })
            res.end(content)
            return
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/anich_cakes/',
  plugins: [react(), copyStaticPlugin(), serveStaticPlugin()],
})
