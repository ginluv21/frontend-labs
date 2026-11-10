import { NavLink, Route, Routes } from 'react-router-dom'
import { AdvicePage } from '@/pages/AdvicePage'
import { SavedPage } from '@/pages/SavedPage'
import { SourceFilter } from '@/components/SourceFilter'
import { Disclaimer } from '@/components/Disclaimer'
import './App.css'

export default function App() {
  return (
    <main>
      <header>
        <p>★ ДОБРО ПОЖАЛОВАТЬ В МОЙ ИНТЕРНЕТ ★</p>
        <h1>СОВА НА СКАКАЛКЕ</h1>
        <p className="moving-text">УГУ! Советы бесплатно. Польза не гарантируется.</p>
        <nav aria-label="Страницы сайта">
          <NavLink to="/" end>Спросить сову</NavLink>
          <NavLink to="/saved">Копилка</NavLink>
        </nav>
      </header>
      <SourceFilter />
      <Routes>
        <Route path="/" element={<AdvicePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="*" element={<section className="result"><h2>Сова сюда не допрыгала</h2><p>Такой страницы нет.</p><NavLink to="/">На главную</NavLink></section>} />
      </Routes>
      <footer>
        <Disclaimer />
        <p>🚧 САЙТ ВЕЧНО СТРОИТСЯ 🚧</p>
      </footer>
    </main>
  )
}
