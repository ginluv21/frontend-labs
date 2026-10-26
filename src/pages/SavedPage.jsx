import { useQuery } from '@tanstack/react-query'
import { getSaved } from '@/api/saved'
import { useFilter } from '@/store/useFilter'
import { Button } from '@/shared/Button'

export function SavedPage() {
  const source = useFilter(state => state.source)
  const saved = useQuery({ queryKey: ['saved'], queryFn: getSaved })
  const items = (saved.data || []).filter(item => source === 'all' || item.source === source)

  return (
    <section className="saved-page" aria-live="polite" aria-busy={saved.isFetching}>
      <h2>Копилка советов</h2>
      <p>Общая для всех посетителей. Сова складывает, мы перечитываем.</p>
      {saved.isPending && <p role="status">Сова роется в копилке...</p>}
      {saved.isFetching && !saved.isPending && <p role="status">Обновляем копилку...</p>}
      {saved.isError && <div role="alert"><p>{saved.error.message}</p><Button disabled={saved.isFetching} onClick={() => saved.refetch()}>Повторить</Button></div>}
      {saved.isSuccess && items.length === 0 && <p>{saved.data.length ? 'По этому фильтру советов пока нет.' : 'Копилка пустая. Сохрани первый совет на главной.'}</p>}
      {items.map(item => (
        <article className="result" key={item.id}>
          <h2>{item.source === 'owl' ? 'Сова' : 'Канье'}</h2>
          <blockquote>{item.text}</blockquote>
        </article>
      ))}
    </section>
  )
}
