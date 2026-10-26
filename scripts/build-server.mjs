import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const assets = {}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' }

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'server' || entry.name === '.openai') continue
    const path = `${directory}/${entry.name}`
    if (entry.isDirectory()) await collect(path)
    else assets[path.slice(4)] = { type: types[path.slice(path.lastIndexOf('.'))] || 'application/octet-stream', body: (await readFile(path)).toString('base64') }
  }
}

await collect('dist')
const handler = await readFile('server/owl.js', 'utf8') + '\n' + await readFile('server/saved.js', 'utf8')
const worker = `${handler}
const assets = ${JSON.stringify(assets)};
export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === '/api/owl') return handleOwl(request, env);
    if (path === '/api/saved') return handleSaved(request, env);
    if (path.startsWith('/api/')) return Response.json({ error: 'Маршрут не найден.' }, { status: 404 });
    const asset = assets[path] || (!path.split('/').pop().includes('.') ? assets['/index.html'] : undefined);
    if (!asset) return new Response('Не найдено', { status: 404 });
    const body = request.method === 'HEAD' ? null : Uint8Array.from(atob(asset.body), char => char.charCodeAt(0));
    return new Response(body, { headers: { 'Content-Type': asset.type, 'Cache-Control': 'no-cache' } });
  }
};`
await mkdir('dist/server', { recursive: true })
await writeFile('dist/server/index.js', worker)
if (existsSync('.openai/hosting.json')) {
  await mkdir('dist/.openai', { recursive: true })
  await writeFile('dist/.openai/hosting.json', await readFile('.openai/hosting.json', 'utf8'))
}
console.log('Сервер совы и статические файлы собраны.')
