import { Button } from '@/shared/Button'
import { Icon } from '@/shared/Icon'
import type { FormEvent } from 'react'

interface AdviceFormProps {
  question: string
  onQuestionChange: (question: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  error: string
  loading: boolean
}

export function AdviceForm({ question, onQuestionChange, onSubmit, error, loading }: AdviceFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <span className="card-kicker">01 / ВОПРОС ВСЕЛЕННОЙ</span>
      <label htmlFor="question">Что тебя озадачило?</label>
      <textarea
        id="question"
        value={question}
        onChange={event => onQuestionChange(event.target.value)}
        placeholder="Например: бросить всё и открыть пельменную?"
        maxLength={300}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'error question-help' : 'question-help'}
      />
      <div className="question-ideas" aria-label="Примеры вопросов">{['Как пережить понедельник?', 'Купить ещё одну клавиатуру?', 'А вдруг я молодец?'].map(text => <button type="button" key={text} onClick={() => onQuestionChange(text)}>{text}</button>)}</div>
      <p id="question-help" className="form-note">Расскажи, что случилось. Сова посоветует, Канье выскажется.</p>
      {error && <p id="error" role="alert">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'Сова собирается с мыслями...' : 'Получить пернатый совет'} <Icon name="arrow" /></Button>
    </form>
  )
}
