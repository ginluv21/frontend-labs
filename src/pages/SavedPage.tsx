import { useQuery } from '@tanstack/react-query'
import { getSaved } from '@/api/saved'
import { useFilter } from '@/store/useFilter'
import { Button } from '@/shared/Button'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { SourceFilter } from '@/components/SourceFilter'
import { Icon } from '@/shared/Icon'
import { sourceNames } from '@/types/advice'

export function SavedPage() {
  const [limitInput, setLimitInput] = useState('10')
  const [limit, setLimit] = useState<number | null>(10)
  const source = useFilter(state => state.source)
  const saved = useQuery({ queryKey: ['saved'], queryFn: getSaved })
  const items = (saved.data || []).filter(item => source === 'all' || item.source === source).slice(0, limit ?? 0)

  function handleLimitChange(event: ChangeEvent<HTMLInputElement>): void {
    const text = event.target.value
    setLimitInput(text)
    const number = Number(text)
    if (!text.trim() || !Number.isInteger(number) || number < 1 || number > 50) {
      setLimit(null)
      return
    }
    setLimit(number)
  }

  return (
    <section className="saved-page" aria-live="polite" aria-busy={saved.isFetching}>
      <div className="saved-heading"><div><p className="eyebrow">АРХИВ ПЕРНАТОЙ МЫСЛИ</p><h1>Склад маленьких<br /><span className="rainbow-text">озарений.</span></h1><p>Сова складывает, мы перечитываем.<br />Общая копилка советов всех посетителей.</p></div><span className="saved-emblem" aria-hidden="true"><Icon name="book" /></span></div>
      <div className="saved-toolbar"><SourceFilter /><div className="saved-limit-control">
      <label htmlFor="saved-limit">Сколько советов показать (1-50):</label>
      <input id="saved-limit" type="number" min="1" max="50" step="1" value={limitInput} onChange={handleLimitChange} aria-invalid={limit === null} aria-describedby={limit === null ? 'limit-error' : undefined} />
      </div></div>
      {limit === null && <p id="limit-error" role="alert">Введи целое число от 1 до 50.</p>}
      {saved.isPending && <p role="status">Сова роется в копилке...</p>}
      {saved.isFetching && !saved.isPending && <p role="status">Обновляем копилку...</p>}
      {saved.isError && <div role="alert"><p>{saved.error.message}</p><Button disabled={saved.isFetching} onClick={() => saved.refetch()}>Повторить</Button></div>}
      {saved.isSuccess && limit !== null && items.length === 0 && <p>{saved.data.length ? 'По этому фильтру советов пока нет.' : 'Копилка пустая. Сохрани первый совет на главной.'}</p>}
      <div className="saved-grid">{items.map(item => (
        <article className="result" key={item.id}>
          <h2>{sourceNames[item.source]}</h2>
          <blockquote>{item.text}</blockquote>
        </article>
      ))}</div>
    </section>
  )
}
