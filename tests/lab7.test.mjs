import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  resolve: { alias: { '@': fileURLToPath(new URL('../src', import.meta.url)) } },
})
after(() => server.close())

const { readSavedAdvice, isRecord, isAdviceSource } = await server.ssrLoadModule('/src/api/validation.ts')
const { toArray } = await server.ssrLoadModule('/src/utils/toArray.ts')
const { getErrorMessage } = await server.ssrLoadModule('/src/utils/errors.ts')
const { http } = await server.ssrLoadModule('/src/api/client.ts')
const { getOwl, getKanye } = await server.ssrLoadModule('/src/api/advice.ts')
const { getSaved, saveAdvice } = await server.ssrLoadModule('/src/api/saved.ts')

test('Проверки unknown отклоняют null, массив и чужой источник', () => {
  assert.equal(isRecord(null), false)
  assert.equal(isRecord([]), false)
  assert.equal(isAdviceSource('other'), false)
  for (const value of [null, [], {}, { id: 7, source: 'owl', text: 'Совет' }, { id: '1', source: 'other', text: 'Совет' }]) {
    assert.throws(() => readSavedAdvice(value))
  }
  assert.deepEqual(readSavedAdvice({ id: '1', source: 'owl', text: 'Совет' }), { id: '1', source: 'owl', text: 'Совет' })
})

test('Generic сохраняет массив и оборачивает одну запись', () => {
  const list = [{ id: '1', text: 'Совет' }]
  assert.equal(toArray(list), list)
  assert.deepEqual(toArray(list[0]), list)
})

test('Неизвестная ошибка имеет запасное сообщение', () => {
  assert.equal(getErrorMessage(new Error('Ошибка сети')), 'Ошибка сети')
  assert.equal(getErrorMessage(null), 'Произошла неизвестная ошибка.')
})

test('API-функции проверяют реальные формы ответа до передачи в компоненты', async () => {
  let body
  http.defaults.adapter = async config => ({ data: body, status: 200, statusText: 'OK', headers: {}, config })
  body = { advice: 'Совет совы' }
  assert.deepEqual(await getOwl(), [{ id: 'owl', text: 'Совет совы' }])
  body = { advice: 42 }
  await assert.rejects(getOwl(), /непонятный ответ/)
  body = { quote: 'Цитата' }
  assert.deepEqual(await getKanye(), [{ id: 'kanye', text: 'Цитата' }])
  body = null
  assert.deepEqual(await getKanye(), [])
  const signal = new AbortController().signal
  body = [{ id: '1', source: 'owl', text: 'Совет' }]
  assert.equal((await getSaved({ signal })).length, 1)
  body = [{ id: '1', source: 'wrong', text: 'Совет' }]
  await assert.rejects(getSaved({ signal }), /непонятный ответ/)
  body = { id: '1', source: 'owl', text: 'Совет' }
  assert.deepEqual(await saveAdvice({ source: 'owl', text: 'Совет' }), body)
  body = { ok: true }
  await assert.rejects(saveAdvice({ source: 'owl', text: 'Совет' }), /непонятный ответ/)
})
