import { useState } from 'react'

const advices = [
  'Сначала попей воды. Великие решения подождут.',
  'Сделай один маленький шаг. Потом ещё один. Угу.',
  'Поспи. Утром эта идея станет либо лучше, либо смешнее.',
  'Не покупай новую клавиатуру, пока не сделал лабу на старой.',
  'Сделай перерыв. Даже скакалка иногда лежит.',
]

export function useAdvice() {
  const [advice, setAdvice] = useState('')

  function giveAdvice() {
    const otherAdvices = advices.filter(text => text !== advice)
    const index = Math.floor(Math.random() * otherAdvices.length)
    setAdvice(otherAdvices[index])
  }

  return { advice, giveAdvice }
}
