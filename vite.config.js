import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { handleOwl } from './server/owl.js'
import { handleSaved } from './server/saved.js'
import { openLocalDatabase } from './server/local-db.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configureServer = server => {
    const db = openLocalDatabase()
    server.httpServer?.once('close', () => db.close())
    server.middlewares.use(async (req, res, next) => {
      const path = new URL(req.url, 'http://localhost').pathname
      if (!['/api/owl', '/api/saved'].includes(path)) return next()
      let body = ''
      for await (const chunk of req) {
        body += chunk
        if (body.length > 12000) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Запрос слишком длинный.' }))
          return
        }
      }
      const request = new Request(`http://${req.headers.host}${path}`, {
        method: req.method, headers: req.headers,
        body: req.method === 'POST' ? body : undefined,
      })
      const handler = path === '/api/owl' ? handleOwl : handleSaved
      const response = await handler(request, { ...env, DB: db })
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(await response.text())
    })
  }
  return {
    plugins: [react(), { name: 'owl-api', configureServer, configurePreviewServer: configureServer }],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  }
})
