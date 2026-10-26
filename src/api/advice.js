import { http, apiUrls } from '@/api/client'

export async function getOwl(signal, question = '') {
  const { data } = await http.post('/api/owl', { question }, { signal })
  if (data === null || (Array.isArray(data) && data.length === 0)) return []
  if (typeof data.advice !== 'string') throw new Error('Сова прислала непонятный ответ.')
  if (!data.advice.trim()) return []
  return [{ id: 'owl', text: data.advice }]
}

export async function getKanye(signal) {
  const { data } = await http.get('/', { baseURL: apiUrls.kanye, signal })
  if (data === null || (Array.isArray(data) && data.length === 0)) return []
  if (typeof data.quote !== 'string') throw new Error('Источник прислал непонятную цитату.')
  if (!data.quote.trim()) return []
  return [{ id: 'kanye', text: data.quote }]
}
