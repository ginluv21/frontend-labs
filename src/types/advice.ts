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
