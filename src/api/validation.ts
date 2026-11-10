import type { AdviceSource, SavedAdvice } from '@/types/advice'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isAdviceSource(value: unknown): value is AdviceSource {
  return value === 'owl' || value === 'kanye'
}

export function readSavedAdvice(value: unknown): SavedAdvice {
  if (!isRecord(value) || typeof value.id !== 'string'
    || !isAdviceSource(value.source) || typeof value.text !== 'string') {
    throw new Error('Копилка прислала непонятный ответ.')
  }
  return { id: value.id, source: value.source, text: value.text }
}
