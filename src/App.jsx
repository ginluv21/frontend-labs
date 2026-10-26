import { useState } from 'react'
import { useAdvice } from '@/hooks/useAdvice'
import { AdviceForm } from '@/components/AdviceForm'
import { AdviceResult } from '@/components/AdviceResult'
import { Disclaimer } from '@/components/Disclaimer'
import { Owl } from '@/components/Owl'
import './App.css'

export default function App() {
  const [question, setQuestion] = useState('')
  const [error, setError] = useState('')
  const [submittedQuestion, setSubmittedQuestion] = useState('')
  const { results, loading, reload } = useAdvice()

  function handleSubmit(event) {
    event.preventDefault()
    if (loading) return
    if (!question.trim()) {
      setError('Сначала напиши вопрос!')
      return
    }
    setError('')
    setSubmittedQuestion(question.trim())
    reload(undefined, undefined, question.trim())
  }

  return (
    <main>
      <header>
        <p>★ ДОБРО ПОЖАЛОВАТЬ В МОЙ ИНТЕРНЕТ ★</p>
        <h1>СОВА НА СКАКАЛКЕ</h1>
        <p className="moving-text">УГУ! Советы бесплатно. Польза не гарантируется.</p>
      </header>
      <Owl loading={loading} />
      <h2>Не знаешь, что делать? Сова тоже.</h2>
      <p>Но совет всё равно даст.</p>
      <AdviceForm
        question={question}
        onQuestionChange={setQuestion}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
      />
      {results.map(result => <AdviceResult
        key={result.id}
        result={result}
        onRetry={() => reload(result.id, undefined, submittedQuestion)}
      />)}
      <footer>
        <Disclaimer />
        <p>🚧 САЙТ ВЕЧНО СТРОИТСЯ 🚧</p>
      </footer>
    </main>
  )
}
