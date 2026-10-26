import { useQuery } from '@tanstack/react-query'
import { getOwl, getKanye } from '@/api/advice'

export function useAdvice(question) {
  const owl = useQuery({
    queryKey: ['advice', 'owl', question],
    queryFn: ({ signal }) => getOwl(signal, question),
  })
  const kanye = useQuery({
    queryKey: ['advice', 'kanye'],
    queryFn: ({ signal }) => getKanye(signal),
  })
  const sources = [
    { id: 'owl', title: 'Ответ совы', method: 'Мудрость на высоте одного прыжка.', query: owl },
    { id: 'kanye', title: 'Канье на связи', method: 'Высказался. К вопросу не присматривался.', query: kanye },
  ]
  const results = sources.map(({ query, ...source }) => ({
    ...source,
    status: query.isFetching || query.isPending ? 'loading' : query.isError ? 'error' : query.data.length ? 'success' : 'empty',
    data: query.isFetching || query.isError ? [] : query.data || [],
    error: query.error?.message || '',
  }))

  function reload(sourceId) {
    if (!sourceId || sourceId === 'owl') owl.refetch()
    if (!sourceId || sourceId === 'kanye') kanye.refetch()
  }

  return { results, loading: results.some(result => result.status === 'loading'), reload }
}
