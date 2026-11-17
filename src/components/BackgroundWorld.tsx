import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '@/shared/Icon'
import './BackgroundWorld.css'

const wallpapers = [
  { name: 'Обычный вторник', style: 'tuesday', symbols: [''] },
  { name: 'Макаронная тревога', style: 'pasta', symbols: ['🍝', '〰️', '🍝', '🧀'] },
  { name: 'Ремонт у бабушки', style: 'carpet', symbols: ['🦉', '✿', '◆', '✿'] },
  { name: 'Угу в вакууме', style: 'space', symbols: ['🥒', '✦', '🪐', '✧'] },
]
const landscape = ['☁️', '🌳', '☁️', '🥖', '🌲', '☁️', '🪑', '🌳']
const rain = ['🧦', '🥟', '🪑']

export function BackgroundWorld({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const [wallpaperIndex, setWallpaperIndex] = useState(0)
  const [quiet, setQuiet] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [peeking, setPeeking] = useState(false)
  const [annoyed, setAnnoyed] = useState(false)
  const [falling, setFalling] = useState<{ symbol: string; left: number } | null>(null)
  const wallpaper = wallpapers[wallpaperIndex] ?? wallpapers[0]!

  useEffect(() => {
    if (quiet) return
    function drop() {
      setFalling({ symbol: rain[Math.floor(Math.random() * rain.length)] ?? '🧦', left: 5 + Math.random() * 85 })
    }
    const firstDrop = setTimeout(drop, 9000)
    const drops = setInterval(drop, 26000)
    const peeks = setInterval(() => setPeeking(true), 33000)
    return () => {
      clearTimeout(firstDrop)
      clearInterval(drops)
      clearInterval(peeks)
    }
  }, [quiet])

  useEffect(() => {
    if (!peeking) return
    const timer = setTimeout(() => setPeeking(false), 6000)
    return () => clearTimeout(timer)
  }, [peeking])

  useEffect(() => {
    if (!annoyed) return
    const timer = setTimeout(() => setAnnoyed(false), 4500)
    return () => clearTimeout(timer)
  }, [annoyed])

  function toggleQuiet() {
    setQuiet(!quiet)
    setFalling(null)
    setPeeking(false)
  }

  return (
    <div className={`site-world wallpaper-${wallpaper.style} ${quiet ? 'world-quiet' : ''} ${falling ? 'world-raining' : ''}`}>
      <div className="wallpaper-pattern" aria-hidden="true">
        {Array.from({ length: 120 }, (_, index) => <span key={index}>{wallpaper.symbols[index % wallpaper.symbols.length]}</span>)}
      </div>
      {children}
      <section className="world-playground" id="world" aria-labelledby="world-title">
      <div className="playground-heading"><div><p className="eyebrow">ТЕМ ВРЕМЕНЕМ ЗА КАДРОМ</p><h2 id="world-title">У этого сайта своя жизнь.</h2><p>Горошины несущие. Батон проездом. Сов лучше не трогать.</p></div><span className="world-stamp">100%<small>нелепости</small></span></div>
      <div className="world-controls">
        <button type="button" onClick={() => setWallpaperIndex((wallpaperIndex + 1) % wallpapers.length)}><Icon name="shuffle" />Что-то не так с обоями</button>
        <span role="status">{wallpaper.name}</span>
        <button type="button" aria-pressed={quiet} onClick={toggleQuiet}><Icon name="moon" />{quiet ? 'Разбудить фон' : 'Утихомирить фон'}</button>
      </div>
      <aside className="world-stage" aria-label="Странная жизнь фона">
        <div className="passing-landscape" aria-hidden="true">
          <div className="landscape-track">
            {[0, 1].map(lap => <div className="landscape-lap" key={lap}>{landscape.map((symbol, index) => <span key={index}>{symbol}</span>)}<span className="bus-stop">🚏<small>УГУ</small></span></div>)}
          </div>
        </div>
        <span className="bus-route">Автобус № УГУ · следующая остановка неизвестна</span>
        <div className={`background-worker ${annoyed ? 'worker-annoyed' : ''}`}>
          <button type="button" onClick={() => setAnnoyed(true)} aria-label="Потрогать работника фона">
            <picture>
              <source media="(prefers-reduced-motion: reduce)" srcSet="/owl-idle.png" />
              <img src={quiet ? '/owl-idle.png' : annoyed ? '/owl-idle.gif' : '/owl-happy.gif'} alt="" width="128" height="146" />
            </picture>
            <span className="worker-dot" aria-hidden="true">●</span>
          </button>
          <span className="worker-label">Техническое угу</span>
        </div>
        {annoyed && <p className="worker-speech" role="status">Не мешайте, фон не сам себя делает. Эта горошина вообще несущая.</p>}
        <div className={`wallpaper-corner ${peeking ? 'corner-open' : ''}`}>
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet="/owl-idle.png" />
            <img src={quiet || !peeking ? '/owl-idle.png' : '/owl-idle.gif'} alt="" width="136" height="155" />
          </picture>
          <button className="corner-paper" type="button" aria-label={peeking ? 'Заклеить уголок обоев' : 'Приоткрыть уголок обоев'} aria-expanded={peeking} onClick={() => setPeeking(!peeking)}><span>Кто тут?</span></button>
          {peeking && <p role="status">Никого нет. Особенно меня.</p>}
        </div>
      </aside>
      </section>
      {falling && <div className="falling-object" aria-hidden="true" style={{ left: `${falling.left}%` }} onAnimationEnd={() => setFalling(null)}>{falling.symbol}</div>}
      {falling && <p className="rain-notice">Осадки не согласованы. Сова следит.</p>}
      {footer}
      <p className="world-footnote">Фон обслуживается вручную. Жалобы передавайте горошине.</p>
    </div>
  )
}
