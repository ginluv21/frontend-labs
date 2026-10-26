import { useEffect, useState } from 'react'

const moments = [
  { x: -164, y: -408, width: 160, text: 'Сова разминает лапки. Ответственность пока не размяла.' },
  { x: -880, y: -208, width: 176, text: 'Шутки шутками, смех смехом, но всё веселье заканчивается, когда сова на скакалке попадается.' },
  { x: -322, y: -408, width: 172, text: 'Вжих-вжих. Мысль взлетела. Ловим.' },
  { x: -500, y: -408, width: 176, text: 'Сова приземлилась. Самооценка - не очень.' },
  { x: -178, y: -208, text: 'Сова уже всё поняла. Сейчас попробует понять правильно.' },
  { x: -548, y: -208, width: 176, text: 'Угу. Это был многозначительный угу. Запиши.' },
  { x: -1045, y: -208, text: 'Сова задумалась. Не выключайте скакалку.' },
  { x: -375, y: -208, width: 172, text: 'Кажется, решение найдено. Сова сама в шоке.' },
]

export function Owl({ loading }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!loading) return
    const timer = setInterval(() => setStep(previous => (previous + 1) % moments.length), 2800)
    return () => clearInterval(timer)
  }, [loading])

  const moment = loading ? moments[step] : { x: -1045, y: -410, text: 'Сова попалась. Теперь послушаем, что скажет.' }

  return (
    <figure className={`owl-show ${loading ? 'is-loading' : ''}`}>
      <div className="owl" role="img" aria-label="Пурпурная сова на скакалке" style={{ width: moment.width || 184, backgroundPosition: `${moment.x}px ${moment.y}px` }} />
      <figcaption className="owl-caption" role="status">{moment.text}</figcaption>
      {loading && <span className="jump-label" aria-hidden="true">ВЖИХ-ВЖИХ...</span>}
    </figure>
  )
}
