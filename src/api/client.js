import axios from 'axios'

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
  console.log(`${config.method.toUpperCase()} ${http.getUri(config)}`)
  return config
})

http.interceptors.response.use(response => response, error => {
  if (error.code !== 'ERR_CANCELED') {
    error.message = error.response?.data?.error || (error.code === 'ECONNABORTED'
      ? 'Сова не дождалась ответа. Попробуй ещё раз.'
      : 'Источник недоступен. Проверь соединение и попробуй ещё раз.')
  }
  return Promise.reject(error)
})
