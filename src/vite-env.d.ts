/// <reference types="vite/client" />

declare module 'canvas-confetti' {
  type Options = { particleCount?: number; spread?: number; colors?: string[]; origin?: { x?: number; y?: number }; gravity?: number }
  const confetti: (options?: Options) => void
  export default confetti
}
