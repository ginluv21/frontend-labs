import { useState } from 'react'
import { useAdvice } from '@/hooks/useAdvice'
import { useFilter } from '@/store/useFilter'
import { AdviceForm } from '@/components/AdviceForm'
import { AdviceResult } from '@/components/AdviceResult'
import { Owl } from '@/components/Owl'

export function AdvicePage() {
  const [question, setQuestion] = useState('')
  const [error, setError] = useState('')
  const [submittedQuestion, setSubmittedQuestion] = useState('')
  const source = useFilter(state => state.source)
  const { results, loading, reload } = useAdvice(submittedQuestion)

  function handleSubmit(event) {
    event.preventDefault()
    if (loading) return
    const text = question.trim()
    if (!text) {
      setError('Сначала напиши вопрос!')
      return
    }
    setError('')
    if (text === submittedQuestion) reload()
    else {
      setSubmittedQuestion(text)
      reload('kanye')
    }
  }

  return (
    <>
      <Owl loading={loading} />
      <h2>Не знаешь, что делать? Сова тоже.</h2>
      <p>Но совет всё равно даст.</p>
      <AdviceForm question={question} onQuestionChange={setQuestion} onSubmit={handleSubmit} error={error} loading={loading} />
      {results.filter(result => source === 'all' || result.id === source).map(result => (
        <AdviceResult key={result.id} result={result} onRetry={() => reload(result.id)} />
      ))}
    </>
  )
}
