import { useState } from 'react'
import { useAdvice } from '@/hooks/useAdvice'
import { useFilter } from '@/store/useFilter'
import { AdviceForm } from '@/components/AdviceForm'
import { AdviceResult } from '@/components/AdviceResult'
import { Owl } from '@/components/Owl'
import { SourceFilter } from '@/components/SourceFilter'
import { Icon } from '@/shared/Icon'
import type { FormEvent } from 'react'

export function AdvicePage() {
  const [question, setQuestion] = useState('')
  const [error, setError] = useState('')
  const [submittedQuestion, setSubmittedQuestion] = useState('')
  const source = useFilter(state => state.source)
  const { results, loading, reload } = useAdvice(submittedQuestion)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
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
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> НА СВЯЗИ. НЕ В СВОЁМ УМЕ.</p>
          <h1>Не знаешь,<br />что делать?<br /><span className="rainbow-text">Сова тоже.</span></h1>
          <p className="hero-description">Но совет всё равно даст. Расскажи, что случилось, и получи немного мудрости с примесью абсолютного угу.</p>
          <a className="primary-link" href="#ask">Довериться птице <Icon name="arrow" /></a>
          <p className="hero-fineprint">Без регистрации, оплаты и подтверждения здравого смысла.</p>
        </div>
        <div className="hero-art">
          <span className="art-spark spark-one" aria-hidden="true">✦</span>
          <span className="art-spark spark-two" aria-hidden="true">✧</span>
          <div className="owl-orbit" aria-hidden="true" />
          <span className="owl-sticker">Мудрость<br />на лапках</span>
          <Owl loading={loading} ready={results.some(result => result.id === 'owl' && result.status === 'success')} />
          <span className="art-label"><span className="status-dot" /> Отдел необязательной мудрости</span>
        </div>
      </section>
      <div className="promise-strip"><span><Icon name="spark" />Советы бесплатно</span><span>Польза не гарантируется</span><span>Скакалка одобряет</span></div>
      <section className="advice-desk" id="ask" aria-labelledby="desk-title">
        <div className="section-heading"><div><p className="eyebrow">ПРИЁМНАЯ ОТКРЫТА</p><h2 id="desk-title">Выкладывай. Сова слушает.</h2></div><SourceFilter /></div>
        <div className="desk-grid">
          <div className="form-column"><AdviceForm question={question} onQuestionChange={setQuestion} onSubmit={handleSubmit} error={error} loading={loading} /><div className="desk-note"><Icon name="spark" /><p>Два мнения лучше одного.<br /><strong>Даже когда одно из них - Канье.</strong></p></div></div>
          <div className="answers-column">
            {results.filter(result => source === 'all' || result.id === source).map(result => (
              <AdviceResult key={result.id} result={result} onRetry={() => reload(result.id)} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
