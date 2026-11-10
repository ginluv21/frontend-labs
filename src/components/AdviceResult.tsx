import { Button } from '@/shared/Button'
import { SaveButton } from '@/components/SaveButton'
import type { ReactNode } from 'react'
import type { AdviceResultData, AdviceTextProps } from '@/types/advice'

function AdviceText({ source, text }: AdviceTextProps) {
  return <div><blockquote>{text}</blockquote><SaveButton source={source} text={text} /></div>
}

interface AdviceResultProps {
  result: AdviceResultData
  onRetry: () => void
}

export function AdviceResult({ result, onRetry }: AdviceResultProps) {
  let content: ReactNode = null

  switch (result.status) {
    case 'loading':
      content = <p role="status">Сова ещё прыгает. Мысль на подходе...</p>
      break
    case 'error':
      content = <div role="alert"><p>{result.error}</p><Button onClick={onRetry}>Повторить</Button></div>
      break
    case 'empty':
      content = <p>Ответ пришёл, но советов нет. Даже сове нечего добавить.</p>
      break
    case 'success':
      content = result.data.map(item => <AdviceText key={`${item.id}:${item.text}`} source={result.id} text={item.text} />)
      break
  }

  return (
    <section className="result" aria-live="polite" aria-busy={result.status === 'loading'}>
      <h2>{result.title}</h2>
      <p className="source-method">{result.method}</p>
      {content}
      {result.status === 'success' && <p className="source-method">{result.id === 'owl' ? 'Сказала и поскакала.' : 'Оригинал на английском'}</p>}
    </section>
  )
}
