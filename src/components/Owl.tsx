import { useEffect, useState } from 'react'

const moments = [
  'Сова разминает лапки. Ответственность пока не размяла.',
  'Шутки шутками, смех смехом, но всё веселье заканчивается, когда сова на скакалке попадается.',
  'Вжих-вжих. Мысль взлетела. Ловим.',
  'Сова приземлилась. Самооценка - не очень.',
  'Сова уже всё поняла. Сейчас попробует понять правильно.',
  'Угу. Это был многозначительный угу. Запиши.',
  'Сова задумалась. Не выключайте скакалку.',
  'Кажется, решение найдено. Сова сама в шоке.',
]

export function Owl({ loading, ready }: { loading: boolean; ready: boolean }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!loading) return
    const timer = setInterval(() => setStep(previous => (previous + 1) % moments.length), 2800)
    return () => clearInterval(timer)
  }, [loading])

  const animation = loading ? 'jump' : ready ? 'happy' : 'idle'
  const caption = loading
    ? moments[step] ?? 'Сова задумалась. Не выключайте скакалку.'
    : ready ? 'Угу! Совет готов. Сова довольна собой.' : 'Сова моргает. Ждёт вопрос и верит в лучшее.'

  return (
    <figure className={`owl-show ${loading ? 'is-loading' : ''}`}>
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet="/owl-idle.png" />
        <img className="owl-animation" src={`/owl-${animation}.gif`} alt="Пурпурная сова" width="256" height="292" />
      </picture>
      <figcaption className="owl-caption" role="status">{caption}</figcaption>
      {loading && <span className="jump-label" aria-hidden="true">ВЖИХ-ВЖИХ...</span>}
    </figure>
  )
}
