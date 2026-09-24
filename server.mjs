import { createReadStream, existsSync } from 'node:fs'
import { appendFile, mkdir, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = join(process.cwd(), 'dist')
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg' }
const sendJson = (response, status, value) => { response.writeHead(status, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(value)) }

createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/api/wishes') {
    let body = ''
    request.on('data', chunk => { body += chunk })
    request.on('end', async () => {
      try {
        const wish = JSON.parse(body)
        if (typeof wish.content !== 'string' || !wish.content.trim() || wish.content.length > 80 || typeof wish.submittedAt !== 'string') throw new Error('Invalid wish')
        await mkdir(join(process.cwd(), 'data'), { recursive: true })
        await appendFile(join(process.cwd(), 'data', 'wishes.log'), `${JSON.stringify({ content: wish.content.trim(), submittedAt: wish.submittedAt, receivedAt: new Date().toISOString() })}\n`, 'utf8')
        sendJson(response, 200, { ok: true })
      } catch { sendJson(response, 400, { ok: false }) }
    })
    return
  }
  const rawPath = request.url?.split('?')[0] || '/'
  const safePath = normalize(rawPath).replace(/^(\.\.([/\\]|$))+/, '')
  let file = join(root, safePath === '/' ? 'index.html' : safePath)
  if (!existsSync(file)) file = join(root, 'index.html')
  stat(file).then(() => { response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' }); createReadStream(file).pipe(response) }).catch(() => response.end('Run npm run build first.'))
}).listen(process.env.PORT || 4173, () => console.log(`Moon Letter server: http://localhost:${process.env.PORT || 4173}`))
