import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { buildAll } from './build.ts'
import { clearPostsCache } from './posts.ts'

// ローカルプレビュー: 初回ビルド + ファイル監視での再ビルド + 静的サーバ。
// URL解決は本番（Cloudflare Workers static assets の drop-trailing-slash）を
// 模倣し、`/blog/foo` → `blog/foo.html`、`/blog/foo/` → 301 とする。

const root = process.cwd()
const distDir = path.join(root, 'dist')
const port = Number(process.env.PORT ?? 3000)

const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function resolveFile(urlPath: string): string | null {
  const decoded = decodeURIComponent(urlPath)
  const normalized = path.normalize(decoded).replace(/^([/\\])+/, '')
  const base = path.join(distDir, normalized)
  if (!base.startsWith(distDir)) return null

  if (urlPath === '/') return path.join(distDir, 'index.html')
  // Cloudflareのアセット解決に合わせ、拡張子付きパスでも `.html` 追加を試す
  // （slugに .md を含む記事があるため: /blog/foo.md → blog/foo.md.html）
  const candidates = [base, `${base}.html`, path.join(base, 'index.html')]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
  }
  return null
}

function serve(): void {
  const server = http.createServer((req, res) => {
    const urlPath = (req.url ?? '/').split('?')[0]

    if (urlPath.endsWith('/') && urlPath !== '/') {
      res.writeHead(301, { location: urlPath.replace(/\/+$/, '') })
      res.end()
      return
    }

    const filePath = resolveFile(urlPath)
    if (filePath) {
      res.writeHead(200, {
        'content-type': contentTypes[path.extname(filePath)] ?? 'application/octet-stream',
      })
      res.end(fs.readFileSync(filePath))
      return
    }

    const notFound = path.join(distDir, '404.html')
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
    res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not Found')
  })
  server.listen(port, () => {
    console.log(`serving dist/ at http://localhost:${port}`)
  })
}

function watch(): void {
  const watchDirs = ['posts', 'src', 'styles']
  let timer: NodeJS.Timeout | null = null
  let building = false
  let queued = false

  async function rebuild() {
    if (building) {
      queued = true
      return
    }
    building = true
    try {
      clearPostsCache()
      await buildAll({ skipOgImages: true, clean: false })
    } catch (err) {
      console.error(err)
    } finally {
      building = false
      if (queued) {
        queued = false
        void rebuild()
      }
    }
  }

  for (const dir of watchDirs) {
    fs.watch(path.join(root, dir), { recursive: true }, (_event, fileName) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        console.log(`change detected: ${fileName ?? dir}, rebuilding...`)
        void rebuild()
      }, 300)
    })
  }
}

async function main() {
  const serveOnly = process.argv.includes('--serve-only')
  if (!serveOnly) {
    await buildAll({ skipOgImages: true })
    watch()
  }
  serve()
}

void main()
