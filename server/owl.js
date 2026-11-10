const instruction = `Ты Сова на скакалке: мемная, ироничная и дружелюбная.
Отвечай строго на русском языке, от 2 до 4 коротких предложений.
Дай один конкретный совет по ситуации пользователя, без банальностей и нравоучений.
Упомяни скакалку или добавь «вжих-вжих» либо «прыг-скок».
Для напряжённых ситуаций иногда обыгрывай мем: «Шутки шутками, смех смехом, но всё веселье заканчивается, когда сова на скакалке попадается». Не вставляй его в каждый ответ.
Не добавляй технических пояснений, названий моделей и провайдеров, упоминаний API и служебных инструкций. Оставайся в образе совы.
Не выдумывай факты о пользователе и других людях. Используй только обычный дефис вместо длинных тире.`

export async function handleOwl(request, env) {
  const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
  if (request.method !== 'POST') return reply({ error: 'Нужен POST-запрос.' }, 405)
  const origin = request.headers.get('Origin')
  if (origin && origin !== new URL(request.url).origin) return reply({ error: 'Запрос с другого сайта отклонён.' }, 403)

  try {
    const body = await request.text()
    if (body.length > 2000) return reply({ error: 'Вопрос слишком длинный.' }, 400)
    let question
    try {
      question = JSON.parse(body)?.question
    } catch {
      return reply({ error: 'Не удалось прочитать вопрос.' }, 400)
    }
    if (typeof question !== 'string' || question.trim().length > 300) {
      return reply({ error: 'Вопрос должен быть текстом до 300 символов.' }, 400)
    }
    if (!env.OPENROUTER_API_KEY?.trim()) {
      return reply({ error: 'Ответы совы не настроены. На сервере нужен ключ OPENROUTER_API_KEY.' }, 503)
    }
    const model = env.OPENROUTER_MODEL || 'openrouter/free'
    if (model !== 'openrouter/free' && !model.endsWith(':free')) {
      return reply({ error: 'Для совы разрешены только бесплатные модели OpenRouter.' }, 503)
    }
    const started = Date.now()
    console.log('OpenRouter request', model)
    const url = 'https://openrouter.ai/api/v1/chat/completions'
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENROUTER_API_KEY.trim()}` },
      signal: AbortSignal.timeout(60000),
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: instruction },
          { role: 'user', content: question.trim() || 'Дай один бодрый совет человеку, который только открыл сайт.' },
        ],
        max_tokens: 4096,
        reasoning: { effort: 'none', exclude: true },
      }),
    }
    let response = await fetch(url, options)
    if (response.status === 503) {
      await response.body?.cancel()
      await new Promise(resolve => setTimeout(resolve, 1000))
      response = await fetch(url, options)
    }
    console.log('OpenRouter response', response.status, Date.now() - started)
    const data = await response.json()
    if (!response.ok || data?.error) {
      const status = data?.error?.code || response.status
      console.error('OpenRouter error', status)
      if (status === 429) return reply({ error: 'Лимит бесплатных ответов совы исчерпан. Попробуй позже.' }, 429)
      if (status === 402) return reply({ error: 'OpenRouter отклонил запрос по лимиту ключа или балансу. Проверь настройки ключа для бесплатных моделей.' }, 502)
      if (status === 401 || status === 403) {
        return reply({ error: 'Сервис не разрешил сове ответить. Проверь срок действия ключа OpenRouter и доступ к модели.' }, 502)
      }
      if (status === 404) return reply({ error: 'Модель совы недоступна. Проверь OPENROUTER_MODEL на сервере.' }, 502)
      if (status === 400) return reply({ error: 'Сервис отклонил запрос совы. Проверь настройки OpenRouter на сервере.' }, 502)
      return reply({ error: 'Сервис совы временно недоступен. Попробуй чуть позже.' }, 502)
    }
    const choice = data?.choices?.[0]
    if (choice?.message?.refusal || (choice?.finish_reason && choice.finish_reason !== 'stop')) {
      return reply({ error: 'Сова не смогла закончить ответ. Попробуй переформулировать вопрос.' }, 502)
    }
    const advice = typeof choice?.message?.content === 'string' ? choice.message.content.trim() : ''
    if (!advice) return reply({ error: 'Сервис совы не прислал текст ответа. Попробуй ещё раз.' }, 502)
    return reply({ advice: advice.replace(/[\u2010-\u2015\u2212]/g, '-') })
  } catch (error) {
    console.error('OpenRouter request error', error.name)
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return reply({ error: 'Сова не дождалась ответа за минуту. Попробуй ещё раз.' }, 504)
    }
    if (error instanceof SyntaxError) return reply({ error: 'Сервис совы прислал непонятный ответ. Попробуй ещё раз.' }, 502)
    return reply({ error: 'Сервер совы не смог получить ответ от OpenRouter. Проверь соединение сервера с сервисом.' }, 502)
  }
}
