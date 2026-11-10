import { http, apiUrls } from '@/api/client'
import { isRecord } from '@/api/validation'
import { toArray } from '@/utils/toArray'
import type { Advice } from '@/types/advice'

export async function getOwl(signal?: AbortSignal, question = ''): Promise<Advice[]> {
  const { data } = await http.post<unknown>('/api/owl', { question }, { signal })
  if (data === null || (Array.isArray(data) && data.length === 0)) return []
  if (!isRecord(data) || typeof data.advice !== 'string') {
    throw new Error('Сова прислала непонятный ответ.')
  }
  if (!data.advice.trim()) return []
  return toArray<Advice>({ id: 'owl', text: data.advice })
}

export async function getKanye(signal?: AbortSignal): Promise<Advice[]> {
  const { data } = await http.get<unknown>('/', { baseURL: apiUrls.kanye, signal })
  if (data === null || (Array.isArray(data) && data.length === 0)) return []
  if (!isRecord(data) || typeof data.quote !== 'string') {
    throw new Error('Источник прислал непонятную цитату.')
  }
  if (!data.quote.trim()) return []
  return toArray<Advice>({ id: 'kanye', text: data.quote })
}
