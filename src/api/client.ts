import axios from 'axios'
import { isRecord } from '@/api/validation'
import { getErrorMessage } from '@/utils/errors'

export const apiUrls = {
  owl: '/',
  kanye: 'https://api.kanye.rest',
}

export const http = axios.create({
  baseURL: apiUrls.owl,
  timeout: 65000,
  headers: { Accept: 'application/json' },
})

http.interceptors.request.use(config => {
  console.log(`${config.method?.toUpperCase()} ${http.getUri(config)}`)
  return config
})

http.interceptors.response.use(response => response, (error: unknown) => {
  if (!axios.isAxiosError<unknown>(error)) {
    return Promise.reject(new Error(getErrorMessage(error)))
  }
  if (error.code !== 'ERR_CANCELED') {
    const data = error.response?.data
    const message = isRecord(data) ? data.error : undefined
    if (typeof message === 'string' && message.trim()) error.message = message
    else if (error.code === 'ECONNABORTED') error.message = 'Источник не ответил вовремя. Попробуй ещё раз.'
    else if (error.response) error.message = `Источник вернул ошибку ${error.response.status}. Попробуй позже.`
    else error.message = 'Источник недоступен. Проверь соединение и попробуй ещё раз.'
  }
  return Promise.reject(error)
})
