import { useEffect, useRef } from 'react'

type Props = { close?: boolean; calm?: boolean }
export function MoonCanvas({ close = false, calm = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!; const ctx = canvas.getContext('2d')!; let frame = 0; let pointer = { x: 0, y: 0 }
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 1.5); canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    const stars = Array.from({ length: innerWidth < 700 ? 52 : 105 }, () => ({ x: Math.random(), y: Math.random() * .75, r: Math.random() * 1.25 + .22, p: Math.random() * 6 }))
    const draw = (time: number) => {
      const w = innerWidth, h = innerHeight; frame = requestAnimationFrame(draw)
      const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#050d1a'); g.addColorStop(.58, '#0a1b31'); g.addColorStop(1, '#101e2d'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
      stars.forEach(s => { const a = .22 + Math.sin(time / 1400 + s.p) * .15; ctx.fillStyle = `rgba(229,239,255,${a})`; ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2); ctx.fill() })
      const mx = w * (.5 + pointer.x * .012), my = close ? h * .45 : h * .34; const r = close ? Math.max(w, h) * .46 : Math.min(w, h) * .255
      const halo = ctx.createRadialGradient(mx, my, r * .62, mx, my, r * 1.72); halo.addColorStop(0, 'rgba(243,234,204,.16)'); halo.addColorStop(1, 'rgba(243,234,204,0)'); ctx.fillStyle = halo; ctx.fillRect(0, 0, w, h)
      const moon = ctx.createRadialGradient(mx - r * .27, my - r * .3, r*.06, mx, my, r); moon.addColorStop(0, '#fffdf2'); moon.addColorStop(.48, '#eee7cb'); moon.addColorStop(1, '#bcb38f'); ctx.fillStyle = moon; ctx.beginPath(); ctx.arc(mx, my + Math.sin(time / 2800) * 3, r, 0, Math.PI * 2); ctx.fill()
      ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(131,123,100,.2)'; [[-.28,-.12,.16],[.2,.15,.19],[.08,-.28,.1],[-.18,.28,.1]].forEach(([x,y,rr]) => { ctx.beginPath(); ctx.arc(mx + x*r, my + y*r, rr*r, 0, Math.PI*2); ctx.fill() }); ctx.globalCompositeOperation = 'source-over'
      // misty cloud bands
      ctx.fillStyle = 'rgba(161,188,200,.055)'; for (let i=0;i<3;i++) { ctx.beginPath(); ctx.ellipse(w*(.2+i*.35), h*(.69+i*.05), w*.28, 28, -.1, 0, Math.PI*2); ctx.fill() }
      ctx.fillStyle = '#06101c'; ctx.beginPath(); ctx.moveTo(0,h); for(let x=0;x<=w;x+=18){const y=h*.83 - Math.abs(Math.sin(x*.012))*18 - Math.sin(x*.031)*9;ctx.lineTo(x,y)} ctx.lineTo(w,h);ctx.fill()
      if (!calm && Math.sin(time/5000)>.88) { const sx=w*.15+(time%5000)/5000*w*.55, sy=h*.16; const l=42; const sg=ctx.createLinearGradient(sx,sy,sx-l,sy+l); sg.addColorStop(0,'rgba(255,250,225,.9)');sg.addColorStop(1,'rgba(255,250,225,0)');ctx.strokeStyle=sg;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-l,sy+l);ctx.stroke() }
    }
    const move = (e: PointerEvent) => { pointer = { x: (e.clientX / innerWidth - .5) * 2, y: (e.clientY / innerHeight - .5) * 2 } }
    resize(); addEventListener('resize', resize); addEventListener('pointermove', move); frame=requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); removeEventListener('pointermove', move) }
  }, [close, calm])
  return <canvas ref={ref} className="moon-canvas" aria-hidden="true" />
}
