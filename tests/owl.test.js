import test from 'node:test'
import assert from 'node:assert/strict'
import { handleOwl } from '../server/owl.js'

const env = { OPENROUTER_API_KEY: 'test-key' }

function request(body = { question: 'Как подготовиться к защите?' }) {
  return new Request('http://localhost/api/owl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('Без ключа сервер объясняет причину и не вызывает OpenRouter', async t => {
  t.mock.method(globalThis, 'fetch', () => assert.fail('Запрос не нужен'))
  const response = await handleOwl(request(), {})
  assert.equal(response.status, 503)
  assert.match((await response.json()).error, /OPENROUTER_API_KEY/)
})

test('Неправильный вопрос отклоняется до запроса к OpenRouter', async t => {
  t.mock.method(globalThis, 'fetch', () => assert.fail('Запрос не нужен'))
  for (const body of [null, {}, { question: 42 }, { question: 'a'.repeat(301) }]) {
    assert.equal((await handleOwl(request(body), env)).status, 400)
  }
  const invalid = new Request('http://localhost/api/owl', { method: 'POST', body: '{' })
  assert.equal((await handleOwl(invalid, env)).status, 400)
})

test('Другой метод и чужой сайт отклоняются', async t => {
  t.mock.method(globalThis, 'fetch', () => assert.fail('Запрос не нужен'))
  assert.equal((await handleOwl(new Request('http://localhost/api/owl'), env)).status, 405)
  const foreign = request()
  foreign.headers.set('Origin', 'https://other.example')
  assert.equal((await handleOwl(foreign, env)).status, 403)
})

for (const [status, expected, message] of [
  [400, 502, /отклонил запрос/],
  [401, 502, /ключа OpenRouter/],
  [403, 502, /ключа OpenRouter/],
  [402, 502, /лимиту ключа/],
  [404, 502, /OPENROUTER_MODEL/],
  [429, 429, /Лимит/],
  [503, 502, /временно недоступен/],
]) {
  test(`Ошибка OpenRouter ${status} имеет понятное сообщение`, async t => {
    t.mock.method(globalThis, 'fetch', async () => Response.json({}, { status }))
    const response = await handleOwl(request(), env)
    assert.equal(response.status, expected)
    assert.match((await response.json()).error, message)
  })
}

test('Сетевой сбой, тайм-аут и повреждённый JSON различаются', async t => {
  const mock = t.mock.method(globalThis, 'fetch')
  for (const [error, status] of [[new TypeError('fetch failed'), 502], [new DOMException('timeout', 'TimeoutError'), 504]]) {
    mock.mock.mockImplementation(async () => { throw error })
    assert.equal((await handleOwl(request(), env)).status, status)
  }
  mock.mock.mockImplementation(async () => new Response('{'))
  assert.equal((await handleOwl(request(), env)).status, 502)
})

test('Временный сбой 503 повторяется один раз с общим тайм-аутом', async t => {
  let calls = 0
  const mock = t.mock.method(globalThis, 'fetch', async () => {
    calls += 1
    return calls === 1 ? Response.json({}, { status: 503 }) : Response.json({
      choices: [{ finish_reason: 'stop', message: { content: 'Прыг-скок! Начни с плана.' } }],
    })
  })
  const response = await handleOwl(request(), env)
  assert.equal(response.status, 200)
  assert.equal(calls, 2)
  assert.equal(mock.mock.calls[0].arguments[1].signal, mock.mock.calls[1].arguments[1].signal)
})

test('Пустой, заблокированный и обрезанный ответы не выдаются за успех', async t => {
  const mock = t.mock.method(globalThis, 'fetch')
  for (const body of [
    null,
    {},
    { error: { code: 503, message: 'Unavailable' } },
    { choices: [{ finish_reason: 'content_filter', message: { content: 'Ответ' } }] },
    { choices: [{ finish_reason: 'length', message: { content: 'Начало ответа' } }] },
    { choices: [{ message: { content: ' ' } }] },
    { choices: [{ message: { content: null, reasoning: 'Мысли' } }] },
    { choices: [{ message: { content: {} } }] },
    { choices: [{ message: { content: 'Ответ', refusal: 'Отказ' } }] },
  ]) {
    mock.mock.mockImplementation(async () => Response.json(body))
    const response = await handleOwl(request(), env)
    assert.equal(response.status, 502)
    assert.equal(typeof (await response.json()).error, 'string')
  }
})

test('Текст возвращается без мыслей и ключа, вопрос передаётся OpenRouter', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => Response.json({
    choices: [{
      finish_reason: 'stop',
      message: { content: '  Прыг-скок! Начни с одного вопроса.  ', reasoning: 'Служебные мысли' },
    }],
  }))
  const response = await handleOwl(request({ question: '  Как учиться?  ' }), env)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { advice: 'Прыг-скок! Начни с одного вопроса.' })
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  const options = mock.mock.calls[0].arguments[1]
  assert.equal(options.headers.Authorization, `Bearer ${env.OPENROUTER_API_KEY}`)
  assert.equal(JSON.parse(options.body).model, 'openrouter/free')
  assert.equal(mock.mock.calls[0].arguments[0], 'https://openrouter.ai/api/v1/chat/completions')
  assert.equal(JSON.parse(options.body).messages[1].content, 'Как учиться?')
})


test('Платная модель отклоняется до внешнего запроса', async t => {
  t.mock.method(globalThis, 'fetch', () => assert.fail('Запрос не нужен'))
  const response = await handleOwl(request(), { ...env, OPENROUTER_MODEL: 'openai/gpt-4o' })
  assert.equal(response.status, 503)
  assert.match((await response.json()).error, /только бесплатные/)
})
