import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { handleOwl } from './server/owl.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configureServer = server => {
    server.middlewares.use('/api/owl', async (req, res) => {
      let body = ''
      for await (const chunk of req) {
        body += chunk
        if (body.length > 2000) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Вопрос слишком длинный.' }))
          return
        }
      }
      const request = new Request(`http://${req.headers.host}/api/owl`, {
        method: req.method, headers: req.headers,
        body: req.method === 'POST' ? body : undefined,
      })
      const response = await handleOwl(request, env)
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(await response.text())
    })
  }
  return {
    plugins: [react(), { name: 'owl-api', configureServer, configurePreviewServer: configureServer }],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  }
})
