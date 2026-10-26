import { Button } from '@/shared/Button'

function AdviceText({ text }) {
  return <blockquote>{text}</blockquote>
}

export function AdviceResult({ result, onRetry }) {
  return (
    <section className="result" aria-live="polite" aria-busy={result.status === 'loading'}>
      <h2>{result.title}</h2>
      <p className="source-method">{result.method}</p>
      {result.status === 'loading' && <p role="status">Сова ещё прыгает. Мысль на подходе...</p>}
      {result.status === 'error' && <div role="alert"><p>{result.error}</p><Button onClick={onRetry}>Повторить</Button></div>}
      {result.status === 'empty' && <p>Ответ пришёл, но советов нет. Даже сове нечего добавить.</p>}
      {result.data.map(item => <AdviceText key={item.id} text={item.text} />)}
      {result.status === 'success' && <p className="source-method">{result.id === 'owl' ? 'Сказала и поскакала.' : 'Оригинал на английском'}</p>}
    </section>
  )
}
