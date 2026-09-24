export type Progress = { gameCompleted: boolean; wishSubmitted: boolean; letterOpened: boolean; visitedMemories: boolean; chapter: number }
const key = 'moon-letter-progress'
const wishKey = 'moon-letter-wish'
const initial: Progress = { gameCompleted: false, wishSubmitted: false, letterOpened: false, visitedMemories: false, chapter: 1 }
export const readProgress = (): Progress => { try { return { ...initial, ...JSON.parse(localStorage.getItem(key) || '{}') } } catch { return initial } }
export const saveProgress = (progress: Progress) => localStorage.setItem(key, JSON.stringify(progress))
export const clearProgress = () => localStorage.removeItem(key)

export type SavedWish = { content: string; submittedAt: string }
export const readWish = (): SavedWish | null => { try { return JSON.parse(localStorage.getItem(wishKey) || 'null') } catch { return null } }
export const saveWish = (wish: SavedWish) => {
  localStorage.setItem(wishKey, JSON.stringify(wish))
  void fetch('/api/wishes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wish),
  }).catch(() => undefined)
}
export const clearWish = () => localStorage.removeItem(wishKey)
