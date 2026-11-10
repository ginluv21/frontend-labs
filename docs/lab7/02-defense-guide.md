# Лабораторная 7: объяснение с нуля и подготовка к защите

Дата подготовки: 10 ноября 2026 года. Этот файл объясняет именно новые решения седьмой лабораторной. Построчное сопоставление с исходниками находится в `01-line-by-line.md`. Здесь идём от смысла к коду: что хотели проверить, что написали, почему это работает и что сказать преподавателю.

Материал рассчитан на студента, который изучает фронтенд около месяца. Не нужно изображать знание всей документации TypeScript. Достаточно понимать собственные функции, уметь проследить один совет от запроса до карточки и честно различать компилятор, браузер и сервер.

## 1. О чём эта лабораторная одним понятным объяснением

В прошлой работе сайт уже умел отправлять вопрос сове, получать цитату и складывать ответы в копилку. В седьмой работе мы описываем, какие данные ходят между частями этого же приложения. Теперь редактор и отдельная команда проверки могут заметить ошибку раньше, чем пользователь откроет страницу.

Например, источник совета должен быть `owl` или `kanye`. Раньше по ошибке можно было написать `owll`, и программа узнала бы об этом только при работе. Теперь TypeScript видит, что такой строки нет в разрешённых вариантах. Другой пример: во время загрузки ответа ещё нет. Тип карточки не разрешает читать массив ответа, пока не проверено состояние `success`.

Это всё ещё тот же React. Хуки остаются хуками, Axios отправляет HTTP, Query хранит серверные данные, Zustand хранит фильтр. Мы не заменяли стек и не писали новый сайт.

На защите можно начать так:

> Я продолжил проект шестой лабораторной. Перевёл клиентские файлы на TypeScript, описал советы и состояния запросов, типизировал props и обработчики. Внешние ответы принимаю как unknown и проверяю во время выполнения. Для пятёрки добавил свой generic, использовал стандартные типы React и строгие настройки компилятора. Сейчас покажу это на одном ответе совы и на числовом поле копилки.

## 2. Что происходит в голове, редакторе и браузере

Есть три разных шага. Сначала TypeScript проверяет исходный текст программы. Потом Vite собирает браузерный JavaScript. Потом браузер выполняет этот JavaScript и получает реальные сетевые ответы. Ошибка на одном шаге не равна ошибке на другом.

`interface Advice` не существует в браузере как проверяющий объект. Браузер не читает этот interface перед показом карточки. Поэтому фраза «сервер вернул Advice, ведь я написал тип» неверная. Реально сервер вернул JSON, а мы проверили его с помощью `typeof`, сравнения с null и других условий.

`npm run typecheck` может пройти, даже когда внешняя нейросеть недоступна: команда анализирует код и не отправляет вопрос в API. И наоборот: API может успешно ответить, хотя в другом компоненте разработчик оставил несовместимые props. Поэтому для сдачи отдельно показываем проверку типов и работу интерфейса.

## 3. Что нового в файлах, а что было раньше

| Новое в лабораторной 7 | Где искать | Зачем |
| --- | --- | --- |
| Конфигурация компилятора | `tsconfig.json` | Единые строгие правила |
| Команда проверки | `package.json` | Повторяемая проверка всей клиентской части |
| Общие типы | `src/types/advice.ts` | Один словарь данных вместо догадок в каждом компоненте |
| Проверки неизвестных данных | `src/api/validation.ts` | Не доверять JSON только из-за interface |
| Свой generic | `src/utils/toArray.ts` | Сохранить тип при превращении одного ответа в список |
| Обработка неизвестной ошибки | `src/utils/errors.ts` | Безопасно получить message |
| Типизированные API-функции | `src/api/advice.ts`, `src/api/saved.ts` | Договор о входе и результате запроса |
| Union состояния | `src/hooks/useAdvice.ts`, `src/components/AdviceResult.tsx` | Разрешать поля только в нужной ветке |
| Числовое поле | `src/pages/SavedPage.tsx` | Показать строку, преобразование и проверку числа |

Роутер, CSS-стиль, копилка, схема базы и серверный маршрут были в прошлой работе. Их не нужно выдавать за новые механизмы TypeScript. Файлы сервера и упаковщика остаются на JavaScript. Конфигурация tsc проверяет папку `src`, то есть именно React-клиент.

## 4. Как запускать и какие команды сдавать

В корне проекта выполнить:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

`npm ci` берёт конкретные версии из lock-файла. Он подходит для воспроизведения чужого проекта и для проверки после чистой установки. `npm install` нужен, например, когда мы добавляем или меняем зависимость. Нельзя удалять lock-файл, а потом говорить, что проверена повторяемая установка через ci.

`npm run typecheck` запускает tsc. `npm test` проверяет обработку ответов и ошибок без настоящей генерации. `npm run build` сначала ещё раз запускает typecheck, потом Vite и серверный упаковщик. `npm run dev` открывает режим разработки. Нужен Node.js 24, потому что локальная база использует встроенный модуль sqlite.

В проверке 10 ноября получен такой вывод после чистой установки:

```text
added 59 packages in 2s
npm notice run frontend-labs@0.0.0 typecheck
npm notice run tsc --noEmit
```

Команда завершилась с кодом 0, диагностик ошибок TypeScript нет. Установки npm другой версии могут печатать строки с символом `>` вместо `npm notice run`: смысл тот же. Точное время и число пакетов после дальнейших изменений могут отличаться. Для сдачи лучше приложить собственный свежий вывод этой команды.

## 5. Конфигурация: строгий не означает сложный

Полный код `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vite/client"],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

Смотри на три главные настройки: `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`. Первая включает строгие правила, в том числе проверку null. Вторая напоминает, что по индексу массива может не оказаться элемента. Третья сообщает о забытых переменных и импортах. Эти дополнительные проверки пришлось реально учесть в коде, а не просто поставить галочки.

`include` показывает границы проверки. `noEmit` означает «ничего не записывай, только проверяй». `jsx: react-jsx` относится к синтаксису JSX. `paths` объясняет сокращённые импорты с `@/`. Сборщик и TypeScript должны одинаково понимать это сокращение: настройка Vite из предыдущей работы уже указывает на ту же папку `src`.

Можно сказать преподавателю: «Мне не нужен отдельный набор сложных конфигураций. Один tsconfig проверяет клиент, Vite собирает приложение. Строгие флаги заставили проверить root и результат обращения к массиву».

## 6. Главная сущность простыми словами

Сущность - это объект, с которым работает приложение. У нас это совет. Для обычного ответа нужны идентификатор и текст. Для сохранённого ответа дополнительно нужен источник. Весь договор виден в одном небольшом файле.

Полный код `src/types/advice.ts`:

```ts
export type AdviceSource = 'owl' | 'kanye'

export type SourceFilter = AdviceSource | 'all'

export interface Advice {
  id: string
  text: string
}

export interface SavedAdvice extends Advice {
  source: AdviceSource
}

export type NewAdvice = Pick<SavedAdvice, 'source' | 'text'>

export type AdviceTextProps = Omit<SavedAdvice, 'id'>

export type AdviceState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'empty' }
  | { status: 'success'; data: Advice[] }

export type AdviceResultData = {
  id: AdviceSource
  title: string
  method: string
} & AdviceState

export const sourceNames: Record<AdviceSource, string> = {
  owl: 'Сова',
  kanye: 'Канье',
}
```

Читай `AdviceSource` как «источник может быть совой или Канье». Это не класс с двумя экземплярами, а две разрешённые строки. `SourceFilter` добавляет all, потому что фильтр может показывать всех. Источник конкретной записи all быть не может: запись принадлежит одному источнику.

`Advice` - описание объекта. `SavedAdvice extends Advice` означает: взять уже описанные поля id и text и добавить source. Это не наследование React-компонента и не запрос к базе. Здесь extends относится к описанию структуры данных.

`Pick` буквально выбирает нужные поля. Новый совет отправляем без id, поэтому NewAdvice выбирает source и text. `Omit` буквально убирает поле. Компонент текста не получает id, поэтому AdviceTextProps убирает его из SavedAdvice. В текущем проекте оба результата похожи по форме, но используются в разных местах: запрос добавления и props компонента.

`Record<AdviceSource, string>` - словарь: для каждого допустимого источника есть строковое название. Это полезнее, чем два несвязанных условия в разных страницах. Если добавить новый источник в AdviceSource, компилятор потребует добавить его и в словарь. При этом конкретные строки «Сова» и «Канье» существуют в рабочем JavaScript: константа sourceNames не исчезает после сборки.

### Почему в одном файле и type, и interface

Для обычных объектов выбраны interface. Для объединения строк, объединения состояний и преобразований Pick/Omit выбран type. Это понятное правило для нашего кода, а не утверждение, что только такой стиль допустим. Оба механизма способны описывать многие одинаковые вещи.

extends расширяет interface SavedAdvice. Амперсанд в AdviceResultData соединяет общие поля карточки с состоянием. Вертикальная черта у AdviceState означает выбор одного варианта. Запомни: `|` - «или», `&` - «вместе». Знаки используются в типах и не превращаются в операции над объектами при выполнении.

## 7. unknown: не знаем, значит сначала проверим

Представь посылку без описи. До открытия мы не знаем, лежит там совет, ошибка или строка HTML. `unknown` выражает именно это. Он разрешает сохранить значение, но не разрешает сразу обращаться к его свойствам.

Наши проверки не используют утверждение через `as`. Утверждение типа заставило бы компилятор поверить нам, но не изменило бы серверный ответ. Для задания это принципиальная разница.

Полный код `src/api/validation.ts`:

```ts
import type { AdviceSource, SavedAdvice } from '@/types/advice'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isAdviceSource(value: unknown): value is AdviceSource {
  return value === 'owl' || value === 'kanye'
}

export function readSavedAdvice(value: unknown): SavedAdvice {
  if (!isRecord(value) || typeof value.id !== 'string'
    || !isAdviceSource(value.source) || typeof value.text !== 'string') {
    throw new Error('Копилка прислала непонятный ответ.')
  }
  return { id: value.id, source: value.source, text: value.text }
}
```

Первый блок проверяет сам контейнер. `typeof value === 'object'` не исключает null, поэтому проверка null написана отдельно. Массив технически тоже объект, поэтому отдельно исключаем и массив. После успешного isRecord компилятор разрешает читать именованные поля, но их значения всё ещё unknown.

Второй блок проверяет источник. Это маленькая guard-функция: она возвращает обычное true или false, а запись `value is AdviceSource` дополнительно объясняет TypeScript смысл true. Такая подпись полезна только вместе с правильным телом функции. Если написать ложную проверку, типовая система не сможет волшебно исправить нашу логику.

Третий блок проверяет запись целиком. Условия соединены через `||`: достаточно любой проблемы, чтобы выбросить Error. Проверка выполняется слева направо. Если значение вообще не объект, дальнейшие обращения к полям не выполняются. После проверок возвращаем новый объект из проверенных полей.

| Внешнее значение | Результат проверки |
| --- | --- |
| `null` | Ошибка формата записи |
| `[]` | Ошибка формата записи |
| `{}` | Нет обязательных полей |
| `{ id: 1, source: 'owl', text: 'Совет' }` | id имеет неправильный тип |
| `{ id: '1', source: 'cat', text: 'Совет' }` | Неизвестный источник |
| `{ id: '1', source: 'owl', text: 'Совет' }` | Проверенный SavedAdvice |

Это проверка нужных для интерфейса полей и их типов. Она не доказывает авторство текста, не проверяет права пользователя и не заменяет проверку серверного POST. Такие задачи относятся к другим механизмам.

## 8. Promise: результат придёт позже

Асинхронная функция возвращает не сам массив немедленно, а Promise. После успешного await у вызывающего кода будет массив. Если сеть упала или проверка JSON выбросила Error, Promise отклоняется. Запись Promise<Advice[]> описывает только тип успешного результата.

Полный код `src/api/advice.ts`:

```ts
import { http, apiUrls } from '@/api/client'
import { isRecord } from '@/api/validation'
import { toArray } from '@/utils/toArray'
import type { Advice } from '@/types/advice'

export async function getOwl(signal?: AbortSignal, question = ''): Promise<Advice[]> {
  const { data } = await http.post<unknown>('/api/owl', { question }, { signal })
  if (data === null || (Array.isArray(data) && data.length === 0)) return []
  if (!isRecord(data) || typeof data.advice !== 'string') {
    throw new Error('Сова прислала непонятный ответ.')
  }
  if (!data.advice.trim()) return []
  return toArray<Advice>({ id: 'owl', text: data.advice })
}

export async function getKanye(signal?: AbortSignal): Promise<Advice[]> {
  const { data } = await http.get<unknown>('/', { baseURL: apiUrls.kanye, signal })
  if (data === null || (Array.isArray(data) && data.length === 0)) return []
  if (!isRecord(data) || typeof data.quote !== 'string') {
    throw new Error('Источник прислал непонятную цитату.')
  }
  if (!data.quote.trim()) return []
  return toArray<Advice>({ id: 'kanye', text: data.quote })
}
```

Первая функция получает ответ совы. В `http.post<unknown>` неизвестные данные остаются неизвестными. Сначала проверяем явную пустоту, затем объект и строку advice, затем непустой текст. Только после этого строим общий объект с id и text.

Вторая функция делает то же для цитаты, но читает поле quote из другого API. Снаружи обе функции дают один и тот же Promise<Advice[]>, поэтому карточке не нужно разбираться в двух внешних форматах. Это простое приведение данных к одному виду, которое было в прошлой работе и теперь проверяется типами.

Вопрос передаётся на собственный сервер. Секрет OpenRouter не попадает в React. Смена ключа, истечение его срока и лимит бесплатного сервиса по-прежнему являются серверными настройками и сетевыми состояниями, а не частью TypeScript.

### Что сказать о signal

AbortSignal сообщает запросу об отмене. Query передаёт его в queryFn, а queryFn в Axios. В параметре `signal?: AbortSignal` вопросительный знак означает, что функцию можно вызвать и без сигнала. Это не сигнал ошибки, а необязательный входной параметр.

## 9. Свой generic без сложной математики

Полный код `src/utils/toArray.ts`:

```ts
export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
```

Можно было вручную возвращать квадратные скобки в двух API-функциях. В задании на 5 нужен собственный полезный generic. Здесь он решает уже существующую задачу: карточки ожидают список, а внешний сервис отдаёт одну запись.

Функция читает вход как «один T или много T». Если это массив, возвращает его; иначе делает массив из одного элемента. Для Advice буква T означает Advice, для строки означала бы string. Одна реализация не теряет сведения о типе элемента.

В нашем коде есть реальное применение `toArray<Advice>({ id: 'owl', text: data.advice })`. Утилита не лежит мёртвым примером. И она не выполняет валидацию JSON: строка data.advice к этому моменту уже проверена. Слово generic не означает «принимает неизвестные данные без проверки».

## 10. Копилка: тип запроса и тип ответа различаются

Полный код `src/api/saved.ts`:

```ts
import { http } from '@/api/client'
import { readSavedAdvice } from '@/api/validation'
import type { NewAdvice, SavedAdvice } from '@/types/advice'

export async function getSaved({ signal }: { signal: AbortSignal }): Promise<SavedAdvice[]> {
  const { data } = await http.get<unknown>('/api/saved', { signal })
  if (!Array.isArray(data)) throw new Error('Копилка прислала непонятный список.')
  return data.map((item: unknown) => readSavedAdvice(item))
}

export async function saveAdvice(advice: NewAdvice): Promise<SavedAdvice> {
  const { data } = await http.post<unknown>('/api/saved', advice)
  return readSavedAdvice(data)
}
```

GET принимает объект с signal, потому что такой объект передаёт Query в функцию запроса. Нас интересует только это поле, остальные поля контекста нам не нужны. После GET проверяем внешний массив, потом каждую запись. В callback map написан unknown, поэтому нельзя незаметно довериться полям элемента массива.

POST принимает NewAdvice, то есть source и text. После сохранения сервер возвращает запись с id. Мы проверяем её той же readSavedAdvice. Если сервер вернёт только `{ ok: true }`, проверка выбросит Error: нельзя считать, что полноценная запись уже получена.

Объяснение для защиты: «Я описываю вход и выход отдельно. Вход нового совета уже известен из props кнопки. Выход сервера всё равно unknown, и я проверяю его, даже если сервер мой».

## 11. Ошибку тоже нужно типизировать

Полный код `src/utils/errors.ts`:

```ts
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Произошла неизвестная ошибка.'
}
```

В JavaScript можно выполнить throw с произвольным значением. Поэтому unknown относится не только к данным API, но и к ошибкам. У Error есть message, а у null или числа такого безопасного чтения нет. instanceof сужает тип и разрешает чтение поля.

У Axios есть собственная проверка isAxiosError. В общем клиенте она сначала определяет ошибку библиотеки, а isRecord затем проверяет неизвестное тело HTTP-ответа. Таким образом, информация об ошибке не превращается в непроверенное значение только ради красивого сообщения.

Полный код `src/api/client.ts`:

```ts
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
```

Первые настройки baseURL, timeout и Accept остались прежними. Новое в обработчике ответа - тип unknown, проверка isAxiosError и безопасное получение data.error. Отмена запроса не получает сообщение «источник недоступен». Тайм-аут, HTTP-ошибка и отсутствие ответа различаются.

В конце остаётся Promise.reject(error). Он нужен, чтобы Query получил ошибку. Возвращать строку вместо отклонения нельзя: тогда следующий код мог бы воспринять ошибку как успешный результат.

## 12. Четыре состояния вместо одного мешка полей

Представь четыре карточки-заготовки: «ждём», «ошибка с сообщением», «пусто», «успех со списком». Это и есть наш AdviceState. В каждой заготовке лежат только подходящие ей данные. Нам не нужен объект, в котором одновременно хранятся success, error и случайный старый массив.

Поле status является меткой. По нему можно выбрать вариант и получить правильные поля. Название discriminated union звучит сложно, но идея простая: союз вариантов с отличительным признаком.

Полный код `src/hooks/useAdvice.ts`:

```ts
import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'
import { getOwl, getKanye } from '@/api/advice'
import type { Advice, AdviceSource, AdviceState, AdviceResultData } from '@/types/advice'
import { getErrorMessage } from '@/utils/errors'

function getState(query: UseQueryResult<Advice[], Error>): AdviceState {
  if (query.isFetching || query.isPending) return { status: 'loading' }
  if (query.isError) return { status: 'error', error: getErrorMessage(query.error) }
  if (!query.data || query.data.length === 0) return { status: 'empty' }
  return { status: 'success', data: query.data }
}

export function useAdvice(question: string) {
  const owl = useQuery<Advice[], Error>({
    queryKey: ['advice', 'owl', question],
    queryFn: ({ signal }) => getOwl(signal, question),
  })
  const kanye = useQuery<Advice[], Error>({
    queryKey: ['advice', 'kanye'],
    queryFn: ({ signal }) => getKanye(signal),
  })
  const results: AdviceResultData[] = [
    { id: 'owl', title: 'Ответ совы', method: 'Мудрость на высоте одного прыжка.', ...getState(owl) },
    { id: 'kanye', title: 'Канье на связи', method: 'Высказался. К вопросу не присматривался.', ...getState(kanye) },
  ]

  function reload(sourceId?: AdviceSource): void {
    if (!sourceId || sourceId === 'owl') void owl.refetch()
    if (!sourceId || sourceId === 'kanye') void kanye.refetch()
  }

  return { results, loading: results.some(result => result.status === 'loading'), reload }
}
```

getState переводит состояние библиотеки в наш маленький договор. Сначала проверяется активная загрузка. Потом ошибка. Потом отсутствие данных или пустой массив. Если ни одна из этих ситуаций не подошла, возвращается success с массивом.

Два useQuery типизированы как Advice[] и Error. Это состояние серверных данных. Оно уже используется в проекте и не должно дублироваться в Zustand. У Zustand другая обязанность: общий выбранный фильтр. У локального useState другая обязанность: черновик формы и число для показа списка.

`...getState(owl)` раскрывает объект состояния в общую карточку с id, title и method. Три точки здесь обычный JavaScript, они копируют свойства объекта. Сам тип AdviceResultData объединяет этот набор полей с одним из допустимых состояний.

У reload необязательный параметр источника. Без него обновляются оба запроса. С источником owl обновляется только сова. `: void` после параметров описывает результат функции. А `void owl.refetch()` в теле является выражением JavaScript: оно явно отбрасывает Promise, который обрабатывает Query. Это два связанных по названию, но разных употребления слова void.

## 13. Карточка проверяет метку перед чтением данных

Полный код `src/components/AdviceResult.tsx`:

```tsx
import { Button } from '@/shared/Button'
import { SaveButton } from '@/components/SaveButton'
import type { ReactNode } from 'react'
import type { AdviceResultData, AdviceTextProps } from '@/types/advice'

function AdviceText({ source, text }: AdviceTextProps) {
  return <div><blockquote>{text}</blockquote><SaveButton source={source} text={text} /></div>
}

interface AdviceResultProps {
  result: AdviceResultData
  onRetry: () => void
}

export function AdviceResult({ result, onRetry }: AdviceResultProps) {
  let content: ReactNode = null

  switch (result.status) {
    case 'loading':
      content = <p role="status">Сова ещё прыгает. Мысль на подходе...</p>
      break
    case 'error':
      content = <div role="alert"><p>{result.error}</p><Button onClick={onRetry}>Повторить</Button></div>
      break
    case 'empty':
      content = <p>Ответ пришёл, но советов нет. Даже сове нечего добавить.</p>
      break
    case 'success':
      content = result.data.map(item => <AdviceText key={`${item.id}:${item.text}`} source={result.id} text={item.text} />)
      break
  }

  return (
    <section className="result" aria-live="polite" aria-busy={result.status === 'loading'}>
      <h2>{result.title}</h2>
      <p className="source-method">{result.method}</p>
      {content}
      {result.status === 'success' && <p className="source-method">{result.id === 'owl' ? 'Сказала и поскакала.' : 'Оригинал на английском'}</p>}
    </section>
  )
}
```

Сначала создаём content с типом ReactNode. В него можно положить JSX, список JSX или null. Потом switch смотрит на status.

В loading рисуется ожидание. В error появляется result.error. В empty отдельный текст о пустоте. В success появляется result.data.map. Обрати внимание: data читается внутри ветки success. Если вынести чтение наружу, компилятор напомнит, что у loading и error такого поля нет.

Это не просто проверка строк для интерфейса. Компилятор использует её для сужения типа. Внутри success он уже знает нужный вариант объекта. Поэтому не нужны утверждения через as и не приходится ставить вопросительный знак после каждого обращения к data.

AdviceText принимает тип, полученный через Omit. Он получает source для сохранения и text для blockquote. Серверный id используется снаружи для key, а внутреннему компоненту не нужен. Key включает ещё текст, чтобы смена цитаты создавала новое состояние кнопки сохранения.

## 14. ReactNode и ComponentProps на обычной кнопке

Полный код `src/shared/Button.tsx`:

```tsx
import type { ComponentProps, ReactNode } from 'react'

type ButtonProps = ComponentProps<'button'> & { children: ReactNode }

export function Button({ children, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className="retro-button" {...props}>{children}</button>
}
```

ComponentProps<'button'> берёт описание стандартной HTML-кнопки у React. Это включает обработчик onClick, disabled, допустимые type и другие свойства. Мы не переписываем библиотечные определения вручную. Пересечение добавляет обязательное содержимое children.

ReactNode подходит для того, что React может отрисовать. Обычный string был бы слишком узким: в кнопке может появиться текст вместе с элементом. Сам children передаётся между тегами Button, а остальные props раскрываются в button через три точки.

Значение type по умолчанию равно button. Так общая кнопка внутри формы не отправит её случайно. Для отправки формы явно передаётся type="submit". Это прежнее поведение кнопки, теперь проверяемое типами.

## 15. Props формы и функция обратного вызова

Полный код `src/components/AdviceForm.tsx`:

```tsx
import { Button } from '@/shared/Button'
import type { FormEvent } from 'react'

interface AdviceFormProps {
  question: string
  onQuestionChange: (question: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  error: string
  loading: boolean
}

export function AdviceForm({ question, onQuestionChange, onSubmit, error, loading }: AdviceFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="question">Твой вопрос к сове:</label>
      <textarea
        id="question"
        value={question}
        onChange={event => onQuestionChange(event.target.value)}
        placeholder="Купить ещё одну клавиатуру?"
        maxLength={300}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'error question-help' : 'question-help'}
      />
      <p id="question-help" className="form-note">Расскажи, что случилось. Сова посоветует, Канье выскажется.</p>
      {error && <p id="error" role="alert">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'СОВА НА ПОДХОДЕ...' : '★ ПОЛУЧИТЬ СОВЕТЫ ★'}</Button>
    </form>
  )
}
```

Props - входные значения компонента. Форма получает question, error, loading и две функции. Она не хранит вторую копию вопроса и не выполняет запрос сама.

`(question: string) => void` читается так: функция принимает новый текст, полезного результата у неё нет. `(event: FormEvent<HTMLFormElement>) => void` принимает событие формы. Эти функции нельзя путать: первая ждёт строку, вторая событие с методом preventDefault.

У textarea обработчик написан прямо внутри JSX. TypeScript выводит тип event из свойства onChange этого элемента. В отдельном handleSubmit тип события указан явно, потому что снаружи JSX такого контекста нет.

## 16. Форма-родитель: типы не требуют переписывать логику

Полный код `src/pages/AdvicePage.tsx`:

```tsx
import { useState } from 'react'
import { useAdvice } from '@/hooks/useAdvice'
import { useFilter } from '@/store/useFilter'
import { AdviceForm } from '@/components/AdviceForm'
import { AdviceResult } from '@/components/AdviceResult'
import { Owl } from '@/components/Owl'
import type { FormEvent } from 'react'

export function AdvicePage() {
  const [question, setQuestion] = useState('')
  const [error, setError] = useState('')
  const [submittedQuestion, setSubmittedQuestion] = useState('')
  const source = useFilter(state => state.source)
  const { results, loading, reload } = useAdvice(submittedQuestion)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (loading) return
    const text = question.trim()
    if (!text) {
      setError('Сначала напиши вопрос!')
      return
    }
    setError('')
    if (text === submittedQuestion) reload()
    else {
      setSubmittedQuestion(text)
      reload('kanye')
    }
  }

  return (
    <>
      <Owl loading={loading} />
      <h2>Не знаешь, что делать? Сова тоже.</h2>
      <p>Но совет всё равно даст.</p>
      <AdviceForm question={question} onQuestionChange={setQuestion} onSubmit={handleSubmit} error={error} loading={loading} />
      {results.filter(result => source === 'all' || result.id === source).map(result => (
        <AdviceResult key={result.id} result={result} onRetry={() => reload(result.id)} />
      ))}
    </>
  )
}
```

Строковые useState записаны без <string>, потому что начальное '' уже однозначно задаёт строку. TypeScript проверяет эти состояния и без лишней записи. Явные generic добавляем там, где начальное значение не показывает все будущие варианты.

handleSubmit получил FormEvent<HTMLFormElement>. Он отменяет обычную отправку страницы, проверяет загрузку и непустой текст. Для нового вопроса меняется submittedQuestion, значит меняется ключ Query совы. Для прежнего вопроса вызывается refetch. Повтор не читает случайно изменённый черновик, пока форма не отправлена.

После этого карточки фильтруются по общему source. Тип source ограничен словарём допустимых значений, поэтому опечатка в передаче источника становится ошибкой разработки.

## 17. Zustand: храним один правильный фильтр

Полный код `src/store/useFilter.ts`:

```ts
import { create } from 'zustand'
import type { SourceFilter } from '@/types/advice'

interface FilterState {
  source: SourceFilter
  setSource: (source: SourceFilter) => void
}

export const useFilter = create<FilterState>(set => ({
  source: 'all',
  setSource: source => set({ source }),
}))
```

FilterState описывает весь объект store: значение source и действие setSource. create<FilterState> проверяет начальные данные и тип аргумента действия. Внутри setSource тип source уже выводится из описания, повторять его там не нужно.

Это не новое серверное хранилище и не замена Query. Результаты запросов остаются в Query. После перезагрузки общий фильтр создаётся заново, как и в предыдущей работе. Лабораторная 7 не добавляет сохранение фильтра в localStorage.

Полный код `src/components/SourceFilter.tsx`:

```tsx
import { useFilter } from '@/store/useFilter'
import { isAdviceSource } from '@/api/validation'
import type { ChangeEvent } from 'react'

export function SourceFilter() {
  const source = useFilter(state => state.source)
  const setSource = useFilter(state => state.setSource)

  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    const value = event.target.value
    if (value === 'all' || isAdviceSource(value)) setSource(value)
  }

  return (
    <div className="source-filter">
      <label htmlFor="source">Кого слушаем:</label>
      <select id="source" value={source} onChange={handleChange}>
        <option value="all">Всех</option>
        <option value="owl">Только сову</option>
        <option value="kanye">Только Канье</option>
      </select>
    </div>
  )
}
```

В select значение target.value является string. Даже если мы видим в HTML три option, TypeScript не превращает их автоматически в union. handleChange сравнивает строку с all или проверяет источник через isAdviceSource. Только после этого вызывает setSource.

Вопрос преподавателя: «Разве нельзя привести строку к SourceFilter?» Ответ: «Можно убедить компилятор через утверждение, но это не проверит значение. По заданию я делаю настоящую проверку и использую её результат для сужения типа».

## 18. Числовое поле: самый понятный пример зачем нужны проверки

Полный код `src/pages/SavedPage.tsx`:

```tsx
import { useQuery } from '@tanstack/react-query'
import { getSaved } from '@/api/saved'
import { useFilter } from '@/store/useFilter'
import { Button } from '@/shared/Button'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { sourceNames } from '@/types/advice'

export function SavedPage() {
  const [limitInput, setLimitInput] = useState('10')
  const [limit, setLimit] = useState<number | null>(10)
  const source = useFilter(state => state.source)
  const saved = useQuery({ queryKey: ['saved'], queryFn: getSaved })
  const items = (saved.data || []).filter(item => source === 'all' || item.source === source).slice(0, limit ?? 0)

  function handleLimitChange(event: ChangeEvent<HTMLInputElement>): void {
    const text = event.target.value
    setLimitInput(text)
    const number = Number(text)
    if (!text.trim() || !Number.isInteger(number) || number < 1 || number > 50) {
      setLimit(null)
      return
    }
    setLimit(number)
  }

  return (
    <section className="saved-page" aria-live="polite" aria-busy={saved.isFetching}>
      <h2>Копилка советов</h2>
      <p>Общая для всех посетителей. Сова складывает, мы перечитываем.</p>
      <label htmlFor="saved-limit">Сколько советов показать (1-50):</label>
      <input id="saved-limit" type="number" min="1" max="50" step="1" value={limitInput} onChange={handleLimitChange} aria-invalid={limit === null} aria-describedby={limit === null ? 'limit-error' : undefined} />
      {limit === null && <p id="limit-error" role="alert">Введи целое число от 1 до 50.</p>}
      {saved.isPending && <p role="status">Сова роется в копилке...</p>}
      {saved.isFetching && !saved.isPending && <p role="status">Обновляем копилку...</p>}
      {saved.isError && <div role="alert"><p>{saved.error.message}</p><Button disabled={saved.isFetching} onClick={() => saved.refetch()}>Повторить</Button></div>}
      {saved.isSuccess && limit !== null && items.length === 0 && <p>{saved.data.length ? 'По этому фильтру советов пока нет.' : 'Копилка пустая. Сохрани первый совет на главной.'}</p>}
      {items.map(item => (
        <article className="result" key={item.id}>
          <h2>{sourceNames[item.source]}</h2>
          <blockquote>{item.text}</blockquote>
        </article>
      ))}
    </section>
  )
}
```

Сначала храним две разные вещи. limitInput - исходная строка, которую видит пользователь. limit - уже проверенное число или null. Строку нельзя заменить числом полностью, потому что пользователь может очистить поле. Пустое поле тоже должно нормально показываться в управляемом input.

`useState<number | null>(10)` написан явно. Если оставить только useState(10), компилятор выведет number и запретит setLimit(null). Здесь нужно сразу описать оба будущих состояния, потому что первое значение показывает только одно из них.

Обработчик принимает ChangeEvent<HTMLInputElement>. Сначала берёт value, сохраняет строку, потом вызывает Number. Затем проверяет пустоту, целочисленность и границы. При неверном вводе пишет null и заканчивает обработчик. При правильном сохраняет число.

| Ввод | Что делает проверка |
| --- | --- |
| `10` | Принимает число 10 |
| Пустое поле | Ставит null и сообщение об ошибке |
| `0` | Отклоняет: меньше 1 |
| `51` | Отклоняет: больше 50 |
| `2.5` | Отклоняет: число не целое |
| `abc` | Number не даёт подходящего целого; браузер числового input обычно не принимает такие символы |

min, max и step полезны, но они не заменяют проверку обработчика. Это отдельные HTML-подсказки браузеру. Значение из DOM всё равно приходит строкой. Проверка typeof text === 'number' никогда не решила бы эту задачу.

items сначала фильтруются по источнику, а потом slice берёт первые записи. Поскольку сервер возвращает новые советы первыми, ограничение показывает последние сохранённые. Это не пагинация базы и не ограничение GET на сервере: весь текущий список уже загружен. База не удаляется и не изменяется, когда пользователь пишет другое число.

При limit === null мы не показываем сообщение «копилка пустая», потому что реальная причина отсутствия списка сейчас неправильное число. Ошибка ввода и пустые серверные данные являются разными ситуациями.

## 19. Две небольшие проверки null и undefined

В main.tsx написано:

```tsx
const root = document.getElementById('root')
if (root === null) throw new Error('Не найден элемент root.')
```

Браузерный поиск возвращает элемент или null. После if с throw TypeScript понимает, что исполнение дошло дальше только с настоящим элементом. Это реальная проверка, а не обещание программиста, что элемент существует.

В Owl.tsx написано:

```tsx
const idle: OwlMoment = { x: -1045, y: -410, text: 'Сова попалась. Теперь послушаем, что скажет.' }
const moment = loading ? moments[step] ?? idle : idle
```

Здесь noUncheckedIndexedAccess напоминает, что любой числовой индекс потенциально может оказаться за пределами массива. Запасная поза через ?? решает проблему и при проверке типов, и при выполнении. Само вычисление индекса по кругу осталось прежним.

width в OwlMoment описан как необязательный number. Отсутствующее поле не является ошибкой: для таких поз уже предусмотрена стандартная ширина. Это пример необязательного поля, который действительно связан с данными проекта.

## 20. Как показать намеренную ошибку компилятора

Не оставляй неправильный код в сдаваемом проекте. Временно создай `src/lab7-error-demo.ts` с таким полным содержимым:

```ts
import type { AdviceSource } from './types/advice'
const source: AdviceSource = 'cat'
console.log(source)
```

Запусти `npm run typecheck`. При проверке этой версии получено:

```text
src/lab7-error-demo.ts(2,7): error TS2322: Type '"cat"' is not assignable to type 'AdviceSource'.
```

Расшифровка: файл указан в начале, затем строка 2 и столбец 7. TS2322 означает несовместимость присваивания. Справа строка cat, слева обещаны только owl или kanye. Компилятор не запрещает кошек вообще: он запрещает значение, которого нет в нашем договоре источника.

Замени cat на owl и снова запусти typecheck. Ошибка исчезнет. После демонстрации удали учебный файл, потому что он не является частью приложения. В окончательной версии его нет. Намеренная ошибка уже действительно проверялась, а не только придумана для текста.

Второй пример можно показать устно: если написать result.data до проверки status, компилятор сообщит, что поля data нет у части вариантов. Исправление состоит в правильной ветке switch, а не в отключении проверки.

## 21. Что проверялось автоматически

Обязательные `npm ci`, `npm run typecheck` и сборка прошли. Есть два файла тестов: прежние 15 сценариев серверного маршрута и 4 сценария для новой типизации границы API. При запуске среды node --test общий отчёт может считать два файла, а при прямом запуске видны отдельные сценарии.

Новые проверки подают неправильные значения в readSavedAdvice, проверяют generic на одной записи и готовом массиве, безопасное сообщение неизвестной ошибки, разбор правильного и неправильного ответа совы, цитаты, GET копилки и результата POST. В них ответы управляемые, настоящая нейросеть не вызывается. Эти тесты не доказывают доступность внешнего провайдера.

Отдельно проверена намеренная ошибка TS2322, затем файл удалён. После удаления typecheck должен снова проходить. Лог успешной проверки нужен из чистого проекта, а не из момента демонстрации ошибки.

## 22. Сценарий защиты на 5-7 минут

1. Открыть главную и копилку. Сказать, что это продолжение шестой работы: интерфейс, данные и библиотеки сохранены.
2. Показать package.json и выполнить npm run typecheck. Объяснить, почему это отдельная команда и что означает noEmit.
3. Открыть types/advice.ts. Показать interface, extends, union строк, Pick, Omit, Record и пересечение &.
4. Проследить getOwl: unknown, проверки, формирование Advice, toArray и Promise<Advice[]>.
5. Открыть validation.ts. Показать, почему проверяется null и почему недостаточно просто написать тип ответа Axios.
6. Открыть useAdvice и AdviceResult. Объяснить четыре статуса и чтение data только внутри success.
7. Открыть копилку. Очистить число, ввести 0, 2.5 и 10. Показать сообщение ошибки и его исчезновение после правильного числа.
8. Показать useState<number | null>, ChangeEvent<HTMLInputElement> и Number. Сказать, что input.value является строкой.
9. Показать Button: стандартные props через ComponentProps, содержимое через ReactNode.
10. Временно внести cat, прочитать TS2322, исправить и вернуть чистую проверку.

Если внешняя сова недоступна, не утверждай, что она ответила. Покажи состояние ошибки и повтор, затем продолжай объяснение типов на копилке и коде. Для проверки типов не требуется успешная генерация в момент защиты.

## 23. Соответствие каждому пункту задания

| Критерий | Реализация |
| --- | --- |
| `.tsx`, tsconfig, typecheck | Все React-файлы в src, tsconfig.json и скрипт package.json |
| Основная сущность в данных и props | Advice, SavedAdvice, типизированное состояние Query, props карточки |
| Типизированные callbacks | AdviceFormProps, FilterState, reload |
| useState при неоднозначном выводе | number или null в SavedPage |
| Число из формы и ChangeEvent | handleLimitChange, строковый limitInput, Number и проверки |
| Нет обхода проверки | В исходниках src нет any, as и @ts-ignore |
| Pick, Omit, Record | NewAdvice, AdviceTextProps, sourceNames |
| Union загрузки | AdviceState с четырьмя вариантами |
| type/interface, extends и & | Общие типы советов и карточки |
| strict и null | tsconfig, root, isRecord |
| API unknown с проверкой | Axios-запросы и validation.ts |
| Свой generic | toArray<T>, используется в обоих источниках |
| Promise и тип ошибки | Promise<Advice[]>, Promise<SavedAdvice>, unknown и Error |
| ReactNode и ComponentProps | Button и содержимое карточки |
| Discriminated union | switch по result.status |
| noUncheckedIndexedAccess | Включён; моменты анимации имеют запасную позу |
| noUnusedLocals и npm ci | Включён; проверка после чистой установки пройдена |
| Намеренная ошибка | Проверенный сценарий TS2322 выше |

Окончательную оценку выставляет преподаватель. Эта таблица показывает конкретные места реализации вместо обещания оценки без проверки требований.

## 24. Частые вопросы и короткие ответы

### Почему не описать все поля как необязательные?

Тогда у любого состояния могло бы не оказаться нужного поля. Пришлось бы везде проверять data и error отдельно. Union связывает поля со статусом: data обязателен при success, error обязателен при error.

### Почему нет отдельных строковых типов у каждого useState?

TypeScript выводит string из начальной строки. Явный тип нужен для number | null, потому что первое число не показывает возможность null. Типизация означает правильные договоры, а не максимальное количество двоеточий.

### Почему Promise не содержит тип ошибки вторым параметром?

Стандартный Promise описывает тип успешного результата. Ошибку проверяем отдельно как unknown, а библиотека Query получает Error после нашей обработки. Запись Promise<Данные, Ошибка> не является стандартным описанием Promise в TypeScript.

### Если Query типизирован Error, зачем unknown в interceptor?

Interceptor находится на внешней границе библиотеки и проверяет то, что действительно произошло. После его обработки собственный код работает с Error. Нельзя начинать с доверия неизвестному объекту только потому, что дальше удобно показать message.

### Почему toArray не лежит внутри компонента?

Это обычная утилита без состояния React. Она подходит двум API-функциям и не должна зависеть от перерисовки компонента. Поэтому находится в utils и принимает значение как аргумент.

### Может ли interface проверить пользователя, который отправляет запрос вручную?

Нет. Типы клиента удалены в сборке. Сервер обязан независимо проверять данные. Наш сервер уже делал это в прошлой работе. В этой лабораторной мы дополнительно проверяем ответы, которые клиент получает извне.

### Зачем noUncheckedIndexedAccess, если массив всегда из восьми поз?

Количество элементов не делает любое значение step безопасным автоматически для компилятора. По числовому индексу может оказаться undefined. Запасной объект делает вывод устойчивым и объясняет пользу флага на собственном коде.

### Что остаётся после компиляции типов?

Остаются функции, условия, запросы, строки и JSX, преобразованный в JavaScript. Описания interface, Pick, Omit и параметры типов удаляются. Проверка typeof остаётся, потому что это рабочая инструкция JavaScript.

### Есть ли новый backend в седьмой работе?

Нет. Копилка и сервер были в предыдущей работе. Седьмая добавляет типизированный клиент и числовое ограничение вывода. В отчёте нужно различать новое и унаследованное.

## 25. Короткая записка для сдачи

Можно адаптировать следующий текст под свой отчёт:

> В лабораторной 7 я перевёл React-клиент предыдущего проекта на TypeScript. Описал советы Advice и SavedAdvice, типы props, callbacks и общий фильтр. Ответы API принимаю как unknown и проверяю реальными условиями. Использовал Pick для тела добавления совета, Omit для props текста и Record для названий источников. Состояние карточки описал discriminated union и разобрал через switch. Свой generic toArray используется при получении ответов. Для кнопки взял ComponentProps и ReactNode. В копилке добавил числовое поле с ChangeEvent<HTMLInputElement>, строковым вводом, проверкой Number и состоянием number | null. Включены strict, noUncheckedIndexedAccess и noUnusedLocals. После npm ci проверка typecheck проходит. Намеренная ошибка источника показала TS2322; после исправления проверка снова успешна.

К сдаче приложить ссылку на репозиторий и свежий вывод `npm run typecheck`. Изменения в GitHub студент отправляет самостоятельно. Секрет API не включать в исходники, отчёт или скриншоты.

## 26. Словарь без сложных определений

| Термин | Что означает здесь |
| --- | --- |
| Тип | Описание допустимого значения |
| Interface | Описание полей объекта |
| Type alias | Имя для типа или сочетания типов |
| Union | Выбор одного допустимого варианта |
| Intersection | Требование совместить части описания |
| Literal type | Конкретное значение вроде строки owl |
| Generic | Функция или тип с подставляемым параметром типа |
| Narrowing | Уточнение типа после проверки |
| Type guard | Функция проверки, результат которой уточняет тип |
| unknown | Данные есть, но их форме ещё не доверяем |
| Promise | Обещание будущего результата асинхронной операции |
| Props | Входные значения компонента |
| Callback | Функция, которую передают для будущего вызова |
| ReactNode | Содержимое, которое React умеет показать |
| ComponentProps | Готовые свойства выбранного элемента или компонента |
| Nullable state | Состояние, в котором разрешён null |
| Runtime | Момент фактического выполнения программы |
| Typecheck | Проверка исходников компилятором |
| Lock-файл | Файл конкретных версий зависимостей |

## 27. Как готовиться по этим двум файлам

В первый проход прочитай этот файл до сценария защиты и запусти проект. Во второй открой рядом `01-line-by-line.md` и исходники. Возьми один вопрос сове и проговори путь данных от http.post<unknown> до ветки success. Затем разберись с числовым полем, потому что там в одном месте видны строка, событие, преобразование, проверка и union состояния.

В третий проход закрой объяснения и ответь на вопросы из раздела 24. Если не получается назвать термин, объясни действие своими словами и только затем добавь название. Например: «После проверки status компилятор понимает, что данные существуют. Это сужение типа».

Для преподавателя важнее связать тип с реальным действием проекта, чем перечислить десять терминов подряд. Каждый использованный приём в этой реализации можно показать на конкретной строке.

## Официальные материалы

- [React: TypeScript в компонентах, props и событиях](https://react.dev/learn/typescript).
- [TypeScript: сужение типов и discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
- [TypeScript: generic](https://www.typescriptlang.org/docs/handbook/2/generics.html).
- [TypeScript: Pick, Omit и Record](https://www.typescriptlang.org/docs/handbook/utility-types.html).
- [TypeScript: настройки tsconfig](https://www.typescriptlang.org/tsconfig/).

