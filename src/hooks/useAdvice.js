import { useState, useEffect, useCallback } from 'react'
import { getOwl, getKanye } from '@/api/advice'

const sources = [
  { id: 'owl', title: 'Ответ совы', method: 'Мудрость на высоте одного прыжка.', load: getOwl },
  { id: 'kanye', title: 'Канье на связи', method: 'Высказался. К вопросу не присматривался.', load: getKanye },
]

export function useAdvice() {
  const [results, setResults] = useState(() => sources.map(source => ({
    id: source.id, title: source.title, method: source.method,
    status: 'loading', data: [], error: '',
  })))

  const reload = useCallback(async (sourceId, signal, question = '') => {
    const selected = sources.filter(source => !sourceId || source.id === sourceId)
    setResults(previous => previous.map(result => selected.some(source => source.id === result.id)
      ? { ...result, status: 'loading', data: [], error: '' } : result))

    await Promise.all(selected.map(async source => {
      try {
        const data = await source.load(signal, question)
        if (signal?.aborted) return
        setResults(previous => previous.map(result => result.id === source.id
          ? { ...result, data, status: data.length ? 'success' : 'empty' } : result))
      } catch (error) {
        if (signal?.aborted) return
        setResults(previous => previous.map(result => result.id === source.id
          ? { ...result, status: 'error', error: error.message } : result))
      }
    }))
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    reload(undefined, controller.signal)
    return () => controller.abort()
  }, [reload])

  return { results, loading: results.some(result => result.status === 'loading'), reload }
}
