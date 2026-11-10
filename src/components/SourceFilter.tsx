import { useFilter } from '@/store/useFilter'
import { isAdviceSource } from '@/api/validation'
import type { ChangeEvent } from 'react'

export function SourceFilter() {
  const source = useFilter(state => state.source)
  const setSource = useFilter(state => state.setSource)

  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    const value = event.target.value
    if (value === 'all' || isAdviceSource(value)) setSource(value)
  }

  return (
    <div className="source-filter">
      <label htmlFor="source">Кого слушаем:</label>
      <select id="source" value={source} onChange={handleChange}>
        <option value="all">Всех</option>
        <option value="owl">Только сову</option>
        <option value="kanye">Только Канье</option>
      </select>
    </div>
  )
}
