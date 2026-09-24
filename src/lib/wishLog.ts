import type { SavedWish } from './storage'

export async function logWishToServer(wish: SavedWish) {
  const response = await fetch('/api/wishes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wish),
  })
  if (!response.ok) throw new Error('Wish log request failed')
}
