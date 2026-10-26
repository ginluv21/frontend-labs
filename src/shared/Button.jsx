export function Button({ children, type = 'button', ...props }) {
  return <button type={type} className="retro-button" {...props}>{children}</button>
}
