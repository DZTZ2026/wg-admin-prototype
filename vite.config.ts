import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function servePrdHtml(): Plugin {
  const handle = (root: string) => {
    return (req: { method?: string; url?: string }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: Buffer) => void }, next: () => void) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        next()
        return
      }
      const pathname = (req.url || '/').split('?')[0]
      if (pathname !== '/prd.html' && pathname !== '/prd' && pathname !== '/prd/') {
        next()
        return
      }
      const file = path.join(root, 'public', 'prd.html')
      if (!fs.existsSync(file)) {
        next()
        return
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.end(fs.readFileSync(file))
    }
  }

  return {
    name: 'serve-prd-html',
    configureServer(server) {
      server.middlewares.stack.unshift({ route: '', handle: handle(server.config.root) })
    },
    configurePreviewServer(server) {
      server.middlewares.stack.unshift({ route: '', handle: handle(server.config.root) })
    },
    closeBundle() {
      const index = path.join('dist', 'index.html')
      const master = path.join('dist', 'master.html')
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, master)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), servePrdHtml()],
  server: {
    port: 5173,
    host: true,
    strictPort: false,
  },
})
