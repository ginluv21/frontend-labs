import { NavLink } from 'react-router-dom'
import { Disclaimer } from '@/components/Disclaimer'
import { Icon } from '@/shared/Icon'

export function SiteFooter() {
  return (
      <footer className="site-footer">
        <div className="footer-intro"><span className="footer-ugu">Угу.</span><p>Меньше серьёзности.<br />Больше пернатой неопределённости.</p><NavLink to="/">Спросить ещё раз <Icon name="arrow" /></NavLink></div>
        <details className="disclaimer-drawer"><summary>Очень важное мелкошрифтовое угу <span>+</span></summary><Disclaimer /></details>
        <div className="footer-bottom"><span>Сова на скакалке · учебный проект</span><span>Сайт вечно строится. Сова вечно прыгает.</span></div>
      </footer>
  )
}
