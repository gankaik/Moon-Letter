import { appendFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function wishLogPlugin(): Plugin {
  return {
    name: 'moon-letter-wish-log',
    configureServer(server) {
      server.middlewares.use('/api/wishes', (request, response) => {
        if (request.method !== 'POST') { response.statusCode = 405; response.end(); return }
        let body = ''
        request.on('data', chunk => { body += chunk })
        request.on('end', async () => {
          try {
            const wish = JSON.parse(body) as { content?: string; submittedAt?: string }
            if (!wish.content || !wish.submittedAt || wish.content.length > 80) throw new Error('Invalid wish')
            const record = JSON.stringify({ content: wish.content, submittedAt: wish.submittedAt, receivedAt: new Date().toISOString() })
            const logDir = resolve(process.cwd(), 'data')
            await mkdir(logDir, { recursive: true })
            await appendFile(resolve(logDir, 'wishes.log'), `${record}\n`, 'utf8')
            response.setHeader('Content-Type', 'application/json'); response.end('{"ok":true}')
          } catch { response.statusCode = 400; response.end('{"ok":false}') }
        })
      })
    },
  }
}

export default defineConfig({ plugins: [react(), wishLogPlugin()] })
