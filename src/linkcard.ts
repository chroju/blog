import fs from 'node:fs'
import path from 'node:path'
import { visit } from 'unist-util-visit'
import type { Root, Paragraph } from 'mdast'

// 段落が「テキストとURLが同一の単独リンク」だけで構成される場合にリンクカードへ変換する。
// OGPメタは .cache/linkcards.json に永続キャッシュし（gitにコミット）、
// ビルド毎の再フェッチをなくす。

const cachePath = path.join(process.cwd(), '.cache', 'linkcards.json')

interface CardData {
  title?: string
  description?: string
  image?: string
  error?: boolean
  fetchedAt: string
}

let cache: Record<string, CardData> | null = null

function loadCache(): Record<string, CardData> {
  if (cache) return cache
  try {
    cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'))
  } catch {
    cache = {}
  }
  return cache!
}

export function saveLinkCardCache(): void {
  if (!cache) return
  fs.mkdirSync(path.dirname(cachePath), { recursive: true })
  const sorted = Object.fromEntries(
    Object.entries(cache).sort(([a], [b]) => (a < b ? -1 : 1))
  )
  fs.writeFileSync(cachePath, JSON.stringify(sorted, null, 2) + '\n')
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function extractMeta(html: string): { title?: string; description?: string; image?: string } {
  const metas: Record<string, string> = {}
  for (const m of html.matchAll(/<meta\s+[^>]*?>/gi)) {
    const tag = m[0]
    const key =
      tag.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
    const content = tag.match(/content\s*=\s*["']([^"']*)["']/i)?.[1]
    if (key && content !== undefined && !(key in metas)) {
      metas[key] = decodeEntities(content)
    }
  }
  const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]
  return {
    title: metas['og:title'] ?? (titleTag ? decodeEntities(titleTag.trim()) : undefined),
    description: metas['og:description'] ?? metas['description'],
    image: metas['og:image'],
  }
}

async function fetchCardData(url: string): Promise<CardData> {
  const fetchedAt = new Date().toISOString()
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (compatible; chroju.dev-build; +https://github.com/chroju/blog)',
        accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('html')) {
      return { error: true, fetchedAt }
    }
    const html = (await res.text()).slice(0, 500_000)
    return { ...extractMeta(html), fetchedAt }
  } catch {
    return { error: true, fetchedAt }
  }
}

async function getCardData(url: string): Promise<CardData> {
  const store = loadCache()
  const refresh = process.env.REFRESH_LINKCARDS === '1'
  const hit = store[url]
  if (hit && !(refresh && hit.error)) return hit
  const data = await fetchCardData(url)
  store[url] = data
  return data
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderCard(url: string, data: CardData): string {
  const u = new URL(url)
  const title = data.title?.trim() || url
  const favicon = `https://www.google.com/s2/favicons?domain=${u.hostname}`
  const image = data.image
    ? `<div class="rlc-image-container"><img class="rlc-image" src="${escapeHtml(
        data.image
      )}" alt="" loading="lazy"></div>`
    : ''
  return (
    `<a class="rlc-container" href="${escapeHtml(url)}">` +
    `<div class="rlc-info">` +
    `<div class="rlc-title">${escapeHtml(title)}</div>` +
    `<div class="rlc-url-container"><img class="rlc-favicon" src="${escapeHtml(
      favicon
    )}" alt="" width="16" height="16" loading="lazy"><span class="rlc-url">${escapeHtml(
      url
    )}</span></div>` +
    `</div>` +
    image +
    `</a>`
  )
}

export default function remarkLinkCard() {
  return async (tree: Root) => {
    const targets: { node: Paragraph; url: string }[] = []
    visit(tree, 'paragraph', (node: Paragraph) => {
      if (node.children.length !== 1) return
      const link = node.children[0]
      if (link.type !== 'link') return
      if (link.children.length !== 1) return
      const text = link.children[0]
      if (text.type !== 'text' || text.value !== link.url) return
      if (!/^https?:\/\//.test(link.url)) return
      targets.push({ node, url: link.url })
    })

    await Promise.all(
      targets.map(async ({ node, url }) => {
        const data = await getCardData(url)
        const card = node as unknown as { type: string; value: string; children?: unknown }
        card.type = 'html'
        card.value = data.error ? plainLink(url) : renderCard(url, data)
        delete card.children
      })
    )
  }
}

function plainLink(url: string): string {
  return `<p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>`
}
