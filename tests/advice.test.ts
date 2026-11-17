import { beforeEach, expect, jest, test } from '@jest/globals'
import { http } from '../src/api/client'
import { getOwl, getKanye } from '../src/api/advice'

jest.mock('../src/api/client', () => ({
  http: { get: jest.fn(), post: jest.fn() },
  apiUrls: { kanye: 'https://api.kanye.rest' },
}))

beforeEach(() => jest.resetAllMocks())

test('Ответ совы превращается в совет', async () => {
  jest.mocked(http.post).mockResolvedValue({ data: { advice: 'Не спеши' } })
  expect(await getOwl(undefined, 'Что делать?')).toEqual([{ id: 'owl', text: 'Не спеши' }])
})

test('Неверный ответ совы отклоняется', async () => {
  jest.mocked(http.post).mockResolvedValue({ data: { advice: 42 } })
  await expect(getOwl()).rejects.toThrow('Сова прислала непонятный ответ.')
})

test('Цитата Канье превращается в совет', async () => {
  jest.mocked(http.get).mockResolvedValue({ data: { quote: 'Believe in yourself' } })
  expect(await getKanye()).toEqual([{ id: 'kanye', text: 'Believe in yourself' }])
})

test('Пустой ответ Канье дает пустой массив', async () => {
  jest.mocked(http.get).mockResolvedValue({ data: null })
  expect(await getKanye()).toEqual([])
})
