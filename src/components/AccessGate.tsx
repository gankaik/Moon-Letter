import { FormEvent, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { access } from '../config/access'
import { MoonCanvas } from './MoonCanvas'

export function AccessGate({ onComplete, onVerified }: { onComplete: () => void; onVerified: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [count, setCount] = useState<number | null>(null)
  const verified = count !== null
  useEffect(() => {
    if (count === null) return
    if (count === 1) { const timer = setTimeout(onComplete, 850); return () => clearTimeout(timer) }
    const timer = setTimeout(() => setCount(value => value === null ? null : value - 1), 780)
    return () => clearTimeout(timer)
  }, [count, onComplete])
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (username.trim() === access.username && password === access.password) { setError(''); onVerified(); setCount(3); return }
    setError('月亮还没有认出你，再想想。')
  }
  return <main className="access-gate"><MoonCanvas />
    {!verified ? <motion.form className="access-card" onSubmit={submit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <p className="eyebrow">MOON LETTER · PRIVATE ACCESS</p><h1>月笺</h1><p>今晚这封信，只交给一个人。</p>
      <label>你的名字<input value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" placeholder="输入名字" /></label>
      <label>验证密码<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" placeholder="输入那一天" /></label>
      <small>{access.passwordHint}</small>{error && <em className="access-error">{error}</em>}
      <button className="moon-button" type="submit">让月亮确认</button>
    </motion.form> : <motion.section className="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p>{username.trim()}，你准备好了吗？</p><motion.b key={count} initial={{ opacity: 0, scale: .65 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .45 }}>{count}</motion.b><span>月光正在为你展开。</span>
    </motion.section>}
  </main>
}
