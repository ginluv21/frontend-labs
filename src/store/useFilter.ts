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
