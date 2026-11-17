import { beforeEach, expect, jest, test } from '@jest/globals'
import { http } from '../src/api/client'
import { getSaved, saveAdvice } from '../src/api/saved'
import type { NewAdvice } from '../src/types/advice'

jest.mock('../src/api/client', () => ({ http: { get: jest.fn(), post: jest.fn() } }))

beforeEach(() => jest.resetAllMocks())

const advice = { id: '1', source: 'owl', text: 'Отдохни' }
const draft: NewAdvice = { source: 'owl', text: 'Отдохни' }

function loadSaved() {
  return getSaved({ signal: new AbortController().signal })
}

test('Загрузка возвращает список советов', async () => {
  jest.mocked(http.get).mockResolvedValue({ data: [advice] })
  expect(await loadSaved()).toEqual([advice])
})

test('Пустая копилка возвращает пустой список', async () => {
  jest.mocked(http.get).mockResolvedValue({ data: [] })
  expect(await loadSaved()).toEqual([])
})

test('Ошибка загрузки передается дальше', async () => {
  jest.mocked(http.get).mockRejectedValue(new Error('Нет сети'))
  await expect(loadSaved()).rejects.toThrow('Нет сети')
})

test('Неверный ответ при загрузке отклоняется', async () => {
  jest.mocked(http.get).mockResolvedValue({ data: null })
  await expect(loadSaved()).rejects.toThrow('Копилка прислала непонятный список.')
})

test('Сохранение отправляет совет и возвращает результат', async () => {
  jest.mocked(http.post).mockResolvedValue({ data: advice })
  expect(await saveAdvice(draft)).toEqual(advice)
  expect(http.post).toHaveBeenCalledWith('/api/saved', draft)
})

test('Ошибка сохранения передается дальше', async () => {
  jest.mocked(http.post).mockRejectedValue(new Error('Не удалось сохранить'))
  await expect(saveAdvice(draft)).rejects.toThrow('Не удалось сохранить')
})

test('Неверный ответ при сохранении отклоняется', async () => {
  jest.mocked(http.post).mockResolvedValue({ data: { ok: true } })
  await expect(saveAdvice(draft)).rejects.toThrow('Копилка прислала непонятный ответ.')
})
