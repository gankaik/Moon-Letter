import { useEffect, useRef, useState } from 'react'
import { game } from '../config/game'

type Props = { onComplete: () => void }
type Item = { x:number;y:number;vy:number;type:keyof typeof game.itemScores;spin:number }
const tones: Record<keyof typeof game.itemScores, string> = { mooncake:'#e6c17a', eggYolk:'#f0b94f', redBean:'#a96854', golden:'#ffd879', osmanthus:'#e9a934', starlight:'#eaf3ff', lucky:'#f0c46d', cloud:'#8092a0', fiveKernel:'#b99865' }
const labels: Record<keyof typeof game.itemScores, string> = { mooncake:'月', eggYolk:'蛋黄', redBean:'豆沙', golden:'金', osmanthus:'桂', starlight:'✦', lucky:'福', cloud:'☁', fiveKernel:'五仁' }

export function RabbitGame({ onComplete }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null); const [score,setScore]=useState(0); const [seconds,setSeconds]=useState(game.gameDuration); const [toast,setToast]=useState(''); const done=useRef(false)
  useEffect(() => {
    const el=canvas.current!; const ctx=el.getContext('2d')!; let w=0,h=0,raf=0,last=performance.now(),spawn=0; let bunny=.5; const keys=new Set<string>(); const items:Item[]=[]
    const resize=()=>{const d=Math.min(devicePixelRatio,1.5);w=el.clientWidth;h=el.clientHeight;el.width=w*d;el.height=h*d;ctx.setTransform(d,0,0,d,0,0)}; resize(); addEventListener('resize',resize)
    const add=()=>{const r=Math.random();const type: keyof typeof game.itemScores = r<.34?'mooncake':r<.46?'eggYolk':r<.56?'redBean':r<.67?'osmanthus':r<.76?'golden':r<.83?'starlight':r<.89?'lucky':r<.96?'cloud':'fiveKernel'; items.push({x:.08+Math.random()*.84,y:-24,vy:1.7+Math.random()*1.8,type,spin:Math.random()*6})}
    const finish=()=>{if(done.current)return;done.current=true;cancelAnimationFrame(raf);setScore(s=>{ if(s<game.targetScore) setTimeout(onComplete,400); else onComplete(); return Math.max(s,game.targetScore)})}
    const draw=(now:number)=>{const dt=Math.min(32,now-last);last=now; const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#101f35');grad.addColorStop(1,'#5c7081');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h)
      // palace clouds
      ctx.fillStyle='rgba(235,243,237,.13)';for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse((i/5)*w,h*.7+Math.sin(now/1100+i)*8,w*.2,28,0,0,Math.PI*2);ctx.fill()}
      spawn+=dt;if(spawn>470){add();spawn=0} if(keys.has('ArrowLeft')||keys.has('a')) bunny-=dt*.00045;if(keys.has('ArrowRight')||keys.has('d')) bunny+=dt*.00045;bunny=Math.max(.08,Math.min(.92,bunny))
      for(let i=items.length-1;i>=0;i--){const it=items[i];it.y+=it.vy*dt*.045;const x=it.x*w;ctx.save();ctx.translate(x,it.y);ctx.rotate(Math.sin(now/500+it.spin)*.14);ctx.fillStyle=tones[it.type];ctx.shadowColor=tones[it.type];ctx.shadowBlur=it.type==='starlight'?13:4;ctx.beginPath();ctx.arc(0,0,it.type==='cloud'?17:14,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=it.type==='cloud'?'#dce8ef':'#3c3024';ctx.font=['fiveKernel','eggYolk','redBean'].includes(it.type)?'9px serif':'16px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(labels[it.type],0,1);ctx.restore();if(it.y>h*.78&&Math.abs(x-bunny*w)<42){items.splice(i,1);const val=game.itemScores[it.type];setScore(s=>{const n=s+val;if(n>=game.targetScore)setTimeout(finish,300);return n});if(it.type==='eggYolk'||it.type==='redBean'){setToast((it.type==='eggYolk'?'蛋黄莲蓉':'豆沙')+'月饼 +'+val);setTimeout(()=>setToast(''),900)}}else if(it.y>h+25)items.splice(i,1)}
      const bx=bunny*w,by=h*.83;ctx.save();ctx.translate(bx,by);ctx.fillStyle='#f4f3ea';ctx.beginPath();ctx.ellipse(-13,-27,7,22,-.16,0,Math.PI*2);ctx.ellipse(13,-27,7,22,.16,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(0,0,25,28,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#28313a';ctx.beginPath();ctx.arc(-8,-4,2,0,7);ctx.arc(8,-4,2,0,7);ctx.fill();ctx.strokeStyle='#b9a37b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,6,6,0,Math.PI);ctx.stroke();ctx.restore()
      if(!done.current)raf=requestAnimationFrame(draw)}
    const tick=setInterval(()=>setSeconds(s=>{if(s<=1){finish();return 0}return s-1}),1000); const down=(e:KeyboardEvent)=>keys.add(e.key),up=(e:KeyboardEvent)=>keys.delete(e.key);let startX=0;const touch=(e:TouchEvent)=>{startX=e.touches[0].clientX},move=(e:TouchEvent)=>{bunny+=(e.touches[0].clientX-startX)/w;startX=e.touches[0].clientX;bunny=Math.max(.08,Math.min(.92,bunny))}
    addEventListener('keydown',down);addEventListener('keyup',up);el.addEventListener('touchstart',touch,{passive:true});el.addEventListener('touchmove',move,{passive:true});raf=requestAnimationFrame(draw)
    return()=>{cancelAnimationFrame(raf);clearInterval(tick);removeEventListener('resize',resize);removeEventListener('keydown',down);removeEventListener('keyup',up);el.removeEventListener('touchstart',touch);el.removeEventListener('touchmove',move)}
  },[onComplete])
  return <div className="game-shell"><div className="game-hud"><span>MOON ENERGY</span><b>{Math.min(score,game.targetScore)} / {game.targetScore}</b><span>{seconds}s</span></div><canvas ref={canvas} className="game-canvas"/><p className="game-help">电脑使用 A / D 或方向键 · 手机左右滑动</p>{toast&&<div className="game-toast">{toast}</div>}</div>
}
