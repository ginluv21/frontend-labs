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
  if (!env.GEMINI_API_KEY) return reply({ error: 'Сова пока не готова отвечать. Загляни чуть позже.' }, 503)
  const origin = request.headers.get('Origin')
  if (origin && origin !== new URL(request.url).origin) return reply({ error: 'Запрос с другого сайта отклонён.' }, 403)

  try {
    const body = await request.text()
    if (body.length > 2000) return reply({ error: 'Вопрос слишком длинный.' }, 400)
    const question = JSON.parse(body)?.question
    if (typeof question !== 'string' || question.trim().length > 300) {
      return reply({ error: 'Вопрос должен быть текстом до 300 символов.' }, 400)
    }
    const model = env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
    const started = Date.now()
    console.log('Gemini request', model)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      signal: AbortSignal.timeout(60000),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instruction }] },
        contents: [{ parts: [{ text: question.trim() || 'Дай один бодрый совет человеку, который только открыл сайт.' }] }],
        generationConfig: { maxOutputTokens: 256, thinkingConfig: { thinkingLevel: 'MINIMAL' } },
      }),
    })
    console.log('Gemini response', response.status, Date.now() - started)
    if (!response.ok) return reply({ error: response.status === 429
      ? 'Сова выдохлась. Дай ей передохнуть и попробуй снова.'
      : 'Мысль запуталась в скакалке. Попробуй ещё раз.' }, response.status === 429 ? 429 : 502)
    const data = await response.json()
    const parts = data.candidates?.[0]?.content?.parts || []
    const advice = parts.filter(part => !part.thought).map(part => part.text || '').join('').trim()
    return reply({ advice: advice.replace(/[\u2010-\u2015\u2212]/g, '-') })
  } catch (error) {
    console.error('Gemini request error', error.name)
    if (error instanceof SyntaxError) return reply({ error: 'Не удалось прочитать вопрос.' }, 400)
    return reply({ error: 'Сова задумалась дольше обычного. Попробуй ещё раз.' }, 504)
  }
}
