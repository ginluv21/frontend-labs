export async function handleSaved(request, env) {
  const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
  if (!['GET', 'POST'].includes(request.method)) return reply({ error: 'Нужен GET или POST.' }, 405)
  const origin = request.headers.get('Origin')
  if (origin && origin !== new URL(request.url).origin) return reply({ error: 'Запрос с другого сайта отклонён.' }, 403)
  if (!env.DB) return reply({ error: 'Копилка пока недоступна. Попробуй позже.' }, 503)

  try {
    if (request.method === 'GET') {
      const { results } = await env.DB.prepare('SELECT id, source, text FROM saved_advice ORDER BY rowid DESC').all()
      return reply(results)
    }
    const body = await request.text()
    if (body.length > 12000) return reply({ error: 'Совет слишком длинный.' }, 400)
    const advice = JSON.parse(body)
    if (!advice || !['owl', 'kanye'].includes(advice.source) || typeof advice.text !== 'string'
      || !advice.text.trim() || advice.text.trim().length > 4000) {
      return reply({ error: 'Нужны источник и текст совета до 4000 символов.' }, 400)
    }
    const source = advice.source
    const text = advice.text.trim().replace(/[\u2010-\u2015\u2212]/g, '-')
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${source}:${text}`))
    const id = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('')
    await env.DB.prepare('INSERT OR IGNORE INTO saved_advice (id, source, text) VALUES (?, ?, ?)').bind(id, source, text).run()
    return reply({ id, source, text })
  } catch (error) {
    if (error instanceof SyntaxError) return reply({ error: 'Не удалось прочитать совет.' }, 400)
    return reply({ error: 'Не удалось открыть копилку. Попробуй ещё раз.' }, 503)
  }
}
