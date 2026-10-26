import { useState } from 'react'
import { useAdvice } from '@/hooks/useAdvice'
import { AdviceForm } from '@/components/AdviceForm'
import { AdviceResult } from '@/components/AdviceResult'
import { Disclaimer } from '@/components/Disclaimer'
import './App.css'

export default function App() {
  const [question, setQuestion] = useState('')
  const [error, setError] = useState('')
  const { advice, giveAdvice } = useAdvice()

  function handleSubmit(event) {
    event.preventDefault()
    if (!question.trim()) {
      setError('Сначала напиши вопрос!')
      return
    }
    setError('')
    giveAdvice()
  }

  return (
    <main>
      <header>
        <p>★ ДОБРО ПОЖАЛОВАТЬ В МОЙ ИНТЕРНЕТ ★</p>
        <h1>СОВА НА СКАКАЛКЕ</h1>
        <p className="moving-text">УГУ! Советы бесплатно. Польза не гарантируется.</p>
      </header>
      <div className="owl" role="img" aria-label="Пурпурная сова на скакалке" />
      <h2>Не знаешь, что делать? Сова тоже.</h2>
      <p>Но совет всё равно даст.</p>
      <AdviceForm
        question={question}
        onQuestionChange={setQuestion}
        onSubmit={handleSubmit}
        error={error}
        advice={advice}
      />
      <AdviceResult advice={advice} />
      <footer>
        <Disclaimer />
        <p>🚧 САЙТ ВЕЧНО СТРОИТСЯ 🚧</p>
      </footer>
    </main>
  )
}
