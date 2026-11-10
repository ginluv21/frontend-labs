import { http } from '@/api/client'
import { readSavedAdvice } from '@/api/validation'
import type { NewAdvice, SavedAdvice } from '@/types/advice'

export async function getSaved({ signal }: { signal: AbortSignal }): Promise<SavedAdvice[]> {
  const { data } = await http.get<unknown>('/api/saved', { signal })
  if (!Array.isArray(data)) throw new Error('Копилка прислала непонятный список.')
  return data.map((item: unknown) => readSavedAdvice(item))
}

export async function saveAdvice(advice: NewAdvice): Promise<SavedAdvice> {
  const { data } = await http.post<unknown>('/api/saved', advice)
  return readSavedAdvice(data)
}
