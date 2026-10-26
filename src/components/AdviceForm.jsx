import { Button } from '@/shared/Button'

export function AdviceForm({ question, onQuestionChange, onSubmit, error, advice }) {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="question">Твой вопрос к сове:</label>
      <textarea
        id="question"
        value={question}
        onChange={event => onQuestionChange(event.target.value)}
        placeholder="Что мне делать?"
        maxLength={300}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'error' : undefined}
      />
      {error && <p id="error" role="alert">{error}</p>}
      <Button type="submit">{advice ? '★ ЕЩЁ СОВЕТ ★' : '★ ПОЛУЧИТЬ СОВЕТ ★'}</Button>
    </form>
  )
}
