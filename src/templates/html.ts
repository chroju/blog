import { site } from '../config.ts'
import { siGithub, siActivitypub, siBluesky, siX } from 'simple-icons'

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export class Raw {
  readonly value: string
  constructor(value: string) {
    this.value = value
  }
}

/** エスケープせずに埋め込む値をマークする */
export function raw(value: string): Raw {
  return new Raw(value)
}

/**
 * 補間値を自動エスケープするテンプレートタグ。
 * Raw はそのまま、配列は連結、null/undefined は空文字になる。
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let out = ''
  strings.forEach((str, i) => {
    out += str
    if (i < values.length) out += render(values[i])
  })
  return out
}

function render(value: unknown): string {
  if (value === null || value === undefined || value === false) return ''
  if (value instanceof Raw) return value.value
  if (Array.isArray(value)) return value.map(render).join('')
  return escapeHtml(String(value))
}

/** "2026-06-27T15:43:00+0900" → "2026-06-27 15:43" */
export function formatDate(dateString: string): string {
  const d = dateString.slice(0, 10)
  const t = dateString.length >= 16 ? dateString.slice(11, 16) : ''
  return t ? `${d} ${t}` : d
}

function simpleIcon(icon: { title: string; path: string }, className = 'sns-icon'): Raw {
  return raw(
    `<svg class="${className}" role="img" viewBox="0 0 24 24" aria-label="${escapeHtml(
      icon.title
    )}" xmlns="http://www.w3.org/2000/svg"><path d="${icon.path}"/></svg>`
  )
}

const icons = {
  rss: raw(
    '<svg class="icon" viewBox="0 0 24 24" aria-label="RSS" role="img" xmlns="http://www.w3.org/2000/svg"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20 5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93z"/></svg>'
  ),
  tag: raw(
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>'
  ),
  history: raw(
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 1 1 7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.96 8.96 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>'
  ),
  github: simpleIcon(siGithub, 'icon'),
  sun: raw(
    '<svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm10-8a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zM6 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm12.07 7.07a1 1 0 0 1-1.41 0l-1.42-1.41a1 1 0 0 1 1.42-1.42l1.41 1.42a1 1 0 0 1 0 1.41zM8.76 8.76a1 1 0 0 1-1.42 0L5.93 7.34a1 1 0 0 1 1.41-1.41l1.42 1.41a1 1 0 0 1 0 1.42zm9.31-2.83a1 1 0 0 1 0 1.41L16.66 8.76a1 1 0 1 1-1.42-1.42l1.42-1.41a1 1 0 0 1 1.41 0zM8.76 15.24a1 1 0 0 1 0 1.42l-1.42 1.41a1 1 0 0 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 0z"/></svg>'
  ),
  moon: raw(
    '<svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M20.74 14.34a8.5 8.5 0 0 1-11.08-11.1A9 9 0 1 0 20.74 14.34zM12 21a7 7 0 0 1-4.53-12.33 10.5 10.5 0 0 0 12.86 7.86A7 7 0 0 1 12 21z"/></svg>'
  ),
}

export interface PageMeta {
  /** <title> タグの中身 */
  title: string
  /** ヘッダーに表示するサイトタイトル（例 "chroju.dev/blog"） */
  siteTitle?: string
  /** 正規URL（絶対URL） */
  url: string
  /** og:image の絶対URL */
  ogImage: string
  /** ブログ系ページか（RSS alternateとサブタイトルの表示） */
  isBlog?: boolean
  /** 記事ページの場合の記事ID（フッターのEdit/Historyリンクに使用） */
  articleId?: string
  tags?: string[]
  footer?: boolean
  /** 追加で読み込むスクリプト（記事ページのlightbox等） */
  scripts?: string[]
  /** <head> 末尾に挿入する追加HTML（JSON-LD等） */
  extraHead?: string
}

function gaSnippet(): string {
  return (
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaTrackingId}"></script>` +
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
    `gtag('js',new Date());gtag('config','${site.gaTrackingId}');</script>`
  )
}

function tagLinks(tags: string[] | undefined): Raw {
  if (!tags || tags.length === 0) return raw('')
  return raw(
    tags
      .map(
        (tag) =>
          html`<a class="post-tag" href="/blog/tags/${raw(
            encodeURI(tag.toLowerCase())
          )}">#${tag}</a>`
      )
      .join(' ')
  )
}

export function layout(meta: PageMeta, body: string): string {
  const siteTitle = meta.siteTitle ?? site.blogTitle
  const segment = siteTitle.split('/')[1]
  const headerLink = segment ? `/${segment}` : '/'
  const isBlog = meta.isBlog ?? siteTitle === site.blogTitle
  const showFooter = meta.footer ?? true
  const articleFooter =
    meta.articleId !== undefined && meta.articleId !== ''
      ? html`
          <div class="article-footer">
            <section class="article-tags">${icons.tag}${tagLinks(meta.tags)}</section>
            <nav class="article-meta-links">
              <a href="${site.repoURL}/edit/main/posts/${meta.articleId}.md"
                >${icons.github} Edit this article</a
              >
              <a href="${site.repoURL}/commits/main/posts/${meta.articleId}.md"
                >${icons.history} Show history</a
              >
            </nav>
            <div class="read-more"><a href="/blog">Read more articles →</a></div>
          </div>
        `
      : ''

  return html`<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
${raw(
  // FOUC回避: CSS適用前に保存済みテーマをhtml要素へ反映する
  `<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>`
)}
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
<meta name="description" content="${site.description}">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${siteTitle}">
<meta property="og:url" content="${meta.url}">
<meta property="og:image" content="${meta.ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${meta.url}">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#faf9f7">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#15171a">
${isBlog ? raw(`<link rel="alternate" type="application/rss+xml" href="${site.url}/feed.xml" title="RSS2.0">`) : ''}
<link rel="stylesheet" href="/css/site.css">
${raw(gaSnippet())}
${raw(meta.extraHead ?? '')}
</head>
<body>
<a class="skip-link" href="#main">本文へスキップ</a>
<div class="container">
<header class="site-header">
<div class="site-header-row">
<p class="site-title"><a href="${raw(headerLink)}">${siteTitle}</a></p>
<button class="theme-toggle" type="button" aria-label="ライト/ダークテーマを切り替える">${icons.sun}${icons.moon}</button>
</div>
${
  isBlog
    ? raw(
        html`<div class="site-subtitle"><small>${site.subTitle}</small><a class="rss-link" href="/feed.xml">${icons.rss}</a></div>`
      )
    : ''
}
</header>
<main id="main">${raw(body)}</main>
${
  showFooter
    ? raw(html`
<footer class="site-footer">
${raw(articleFooter)}
<div class="footer-profile">
<img src="/images/profile.webp" width="40" height="40" alt="${site.author}">
<a class="footer-site" href="/">${site.name}</a>
<nav class="footer-nav">
<a href="/blog">/blog</a>
<a href="/bio">/bio</a>
<a href="/policy">/policy</a>
</nav>
<nav class="footer-sns">
<a href="https://github.com/chroju">${simpleIcon(siGithub)}</a>
<a href="https://pleroma.chroju.dev/users/chroju">${simpleIcon(siActivitypub)}</a>
<a href="https://bsky.app/profile/chroju.dev">${simpleIcon(siBluesky)}</a>
<a href="https://x.com/chroju">${simpleIcon(siX)}</a>
</nav>
</div>
</footer>`)
    : ''
}
</div>
${raw(['/js/theme.js', ...(meta.scripts ?? [])].map((s) => `<script src="${s}" defer></script>`).join(''))}
</body>
</html>
`
}
