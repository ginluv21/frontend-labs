const paths = {
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
  book: 'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4Zm16 0h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h3Z',
  shuffle: 'm16 3 4 4-4 4M4 17l5-5m-5-5h3l10 10h3m-4-4 4 4-4 4M14 7h6',
  moon: 'M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z',
}

export function Icon({ name }: { name: keyof typeof paths }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
