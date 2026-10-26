import { http } from '@/api/client'

export async function getSaved({ signal }) {
  const { data } = await http.get('/api/saved', { signal })
  if (!Array.isArray(data) || data.some(item => !item || typeof item.id !== 'string'
    || !['owl', 'kanye'].includes(item.source) || typeof item.text !== 'string')) {
    throw new Error('Копилка прислала непонятный ответ.')
  }
  return data
}

export async function saveAdvice(advice) {
  const { data } = await http.post('/api/saved', advice)
  return data
}
