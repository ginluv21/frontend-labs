import { Button } from '@/shared/Button'

export function AdviceForm({ question, onQuestionChange, onSubmit, error, loading }) {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="question">Твой вопрос к сове:</label>
      <textarea
        id="question"
        value={question}
        onChange={event => onQuestionChange(event.target.value)}
        placeholder="Купить ещё одну клавиатуру?"
        maxLength={300}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'error question-help' : 'question-help'}
      />
      <p id="question-help" className="form-note">Расскажи, что случилось. Сова посоветует, Канье выскажется.</p>
      {error && <p id="error" role="alert">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'СОВА НА ПОДХОДЕ...' : '★ ПОЛУЧИТЬ СОВЕТЫ ★'}</Button>
    </form>
  )
}
