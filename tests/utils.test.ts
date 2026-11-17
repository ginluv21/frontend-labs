import { expect, test } from '@jest/globals'
import { toArray } from '../src/utils/toArray'
import { getErrorMessage } from '../src/utils/errors'

test('Одно значение превращается в массив', () => {
  expect(toArray('Совет')).toEqual(['Совет'])
})

test('Готовый массив остается тем же массивом', () => {
  const items = ['Первый', 'Второй']
  expect(toArray(items)).toBe(items)
})

test('Пустой массив остается пустым', () => {
  expect(toArray([])).toEqual([])
})

test('Из ошибки берется ее сообщение', () => {
  expect(getErrorMessage(new Error('Нет сети'))).toBe('Нет сети')
})

test('Для неизвестной ошибки есть запасной текст', () => {
  expect(getErrorMessage(null)).toBe('Произошла неизвестная ошибка.')
})
