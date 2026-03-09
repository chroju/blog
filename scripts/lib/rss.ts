import { SITE_URL, SITE_TITLE, SITE_SUBTITLE } from './config.ts'
import { write } from './utils.ts'
import type { PostMeta } from './types.ts'

export function buildRss(posts: PostMeta[]): void {
  const items = posts.slice(0, 20).map(post => `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${SITE_URL}/blog/${post.id}</link>
    <guid>${SITE_URL}/blog/${post.id}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  </item>`).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}/blog</link>
    <description>${SITE_SUBTITLE}</description>
    <language>ja</language>
    ${items}
  </channel>
</rss>`
  write('feed.xml', rss)
}
