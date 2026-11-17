import { NavLink, Route, Routes } from 'react-router-dom'
import { AdvicePage } from '@/pages/AdvicePage'
import { SavedPage } from '@/pages/SavedPage'
import { SiteFooter } from '@/components/SiteFooter'
import { BackgroundWorld } from '@/components/BackgroundWorld'
import { Icon } from '@/shared/Icon'
import './App.css'

export default function App() {
  return (
    <BackgroundWorld footer={<SiteFooter />}>
      <a className="skip-link" href="#content">К содержимому</a>
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Сова на скакалке - на главную">
          <img src="/owl-idle.png" alt="" width="54" height="62" />
          <span><strong className="rainbow-text">Сова на скакалке</strong><small>Бюро пернатых советов</small></span>
        </NavLink>
        <nav aria-label="Страницы сайта">
          <NavLink to="/" end><Icon name="spark" />Спросить сову</NavLink>
          <NavLink to="/saved"><Icon name="book" />Копилка</NavLink>
        </nav>
        <a className="world-link" href="#world">Немного безумия <Icon name="arrow" /></a>
      </header>
      <main id="content">
        <Routes>
          <Route path="/" element={<AdvicePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="*" element={<section className="not-found"><p className="eyebrow">МАРШРУТ НЕ СОГЛАСОВАН</p><h1>Сова сюда<br />не допрыгала.</h1><p>Такой страницы нет. Но есть шанс вернуться.</p><NavLink className="primary-link" to="/">На главную <Icon name="arrow" /></NavLink></section>} />
        </Routes>
      </main>

    </BackgroundWorld>
  )
}
