import { site } from './config.ts'
import type { Post } from './posts.ts'
import { escapeHtml } from './templates/html.ts'

/** sitemap.xml（draft記事はページ自体はあるが載せない） */
export function generateSitemap(posts: Post[], encodedTags: string[]): string {
  const urls: { loc: string; lastmod?: string }[] = [
    { loc: `${site.url}/` },
    { loc: `${site.url}/blog`, lastmod: posts[0]?.date.slice(0, 10) },
    { loc: `${site.url}/bio` },
    { loc: `${site.url}/policy` },
    { loc: `${site.url}/blog/tags` },
    ...posts.map((p) => ({
      loc: `${site.url}/blog/${encodeURI(p.id)}`,
      lastmod: p.date.slice(0, 10),
    })),
    ...encodedTags.map((t) => ({ loc: `${site.url}/blog/tags/${t}` })),
  ]
  const body = urls
    .map(
      (u) =>
        `<url><loc>${escapeHtml(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

/** llms.txt: LLM向けのサイト概要と記事一覧 */
export function generateLlmsTxt(posts: Post[]): string {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.subTitle} — ${site.author} のブログ。SRE・インフラ・ソフトウェアエンジニアリングを中心とした技術記事。`,
    '',
    '## Pages',
    '',
    `- [Blog](${site.url}/blog): 記事一覧`,
    `- [Bio](${site.url}/bio): 著者プロフィール`,
    `- [Policy](${site.url}/policy): サイトポリシー`,
    `- [RSS](${site.url}/feed.xml): RSS 2.0 フィード（全文）`,
    '',
    '## Posts',
    '',
    // LLMが直接読めるようMarkdownソース（.md）のURLを載せる
    ...posts.map(
      (p) => `- [${p.title}](${site.url}/blog/${encodeURI(p.id)}.md): ${p.date.slice(0, 10)}`
    ),
    '',
  ]
  return lines.join('\n')
}

/** 記事ページ用の JSON-LD (BlogPosting) */
export function blogPostingJsonLd(post: Post): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: site.author, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${encodeURI(post.id)}`,
    image: `${site.url}/og/${encodeURIComponent(post.id)}.png`,
    keywords: post.tags.join(','),
  }
  // script終端タグの混入を防ぐ
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}
