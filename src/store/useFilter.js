import { create } from 'zustand'

export const useFilter = create(set => ({
  source: 'all',
  setSource: source => set({ source }),
}))
