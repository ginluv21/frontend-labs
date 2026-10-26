export function AdviceResult({ advice }) {
  return (
    <section className="result" aria-live="polite">
      <h2>Сова говорит:</h2>
      <p>{advice || 'Пока ничего. Ждёт твой вопрос.'}</p>
    </section>
  )
}
