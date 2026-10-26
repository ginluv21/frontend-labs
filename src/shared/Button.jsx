export function Button({ children, type = 'button' }) {
  return <button type={type} className="retro-button">{children}</button>
}
