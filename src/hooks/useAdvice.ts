import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'
import { getOwl, getKanye } from '@/api/advice'
import type { Advice, AdviceSource, AdviceState, AdviceResultData } from '@/types/advice'
import { getErrorMessage } from '@/utils/errors'

function getState(query: UseQueryResult<Advice[], Error>): AdviceState {
  if (query.isFetching || query.isPending) return { status: 'loading' }
  if (query.isError) return { status: 'error', error: getErrorMessage(query.error) }
  if (!query.data || query.data.length === 0) return { status: 'empty' }
  return { status: 'success', data: query.data }
}

export function useAdvice(question: string) {
  const owl = useQuery<Advice[], Error>({
    queryKey: ['advice', 'owl', question],
    queryFn: ({ signal }) => getOwl(signal, question),
  })
  const kanye = useQuery<Advice[], Error>({
    queryKey: ['advice', 'kanye'],
    queryFn: ({ signal }) => getKanye(signal),
  })
  const results: AdviceResultData[] = [
    { id: 'owl', title: 'Ответ совы', method: 'Мудрость на высоте одного прыжка.', ...getState(owl) },
    { id: 'kanye', title: 'Канье на связи', method: 'Высказался. К вопросу не присматривался.', ...getState(kanye) },
  ]

  function reload(sourceId?: AdviceSource): void {
    if (!sourceId || sourceId === 'owl') void owl.refetch()
    if (!sourceId || sourceId === 'kanye') void kanye.refetch()
  }

  return { results, loading: results.some(result => result.status === 'loading'), reload }
}
