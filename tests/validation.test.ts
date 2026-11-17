import { expect, test } from '@jest/globals'
import { isRecord, isAdviceSource, readSavedAdvice } from '../src/api/validation'

test('Обычный объект подходит, null и массив не подходят', () => {
  expect(isRecord({ text: 'Совет' })).toBe(true)
  expect(isRecord(null)).toBe(false)
  expect(isRecord([])).toBe(false)
})

test('Разрешены только источники owl и kanye', () => {
  expect(isAdviceSource('owl')).toBe(true)
  expect(isAdviceSource('kanye')).toBe(true)
  expect(isAdviceSource('cat')).toBe(false)
})

test('Правильный совет проходит проверку', () => {
  const advice = { id: '1', source: 'owl', text: 'Отдохни' }
  expect(readSavedAdvice(advice)).toEqual(advice)
})

test.each([null, {}, { id: 1, source: 'owl', text: 'Совет' }, { id: '1', source: 'cat', text: 'Совет' }])(
  'Неверный совет %j отклоняется', value => {
    expect(() => readSavedAdvice(value)).toThrow('Копилка прислала непонятный ответ.')
  },
)
