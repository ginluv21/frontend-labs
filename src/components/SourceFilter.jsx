import { useFilter } from '@/store/useFilter'

export function SourceFilter() {
  const source = useFilter(state => state.source)
  const setSource = useFilter(state => state.setSource)

  return (
    <div className="source-filter">
      <label htmlFor="source">Кого слушаем:</label>
      <select id="source" value={source} onChange={event => setSource(event.target.value)}>
        <option value="all">Всех</option>
        <option value="owl">Только сову</option>
        <option value="kanye">Только Канье</option>
      </select>
    </div>
  )
}
