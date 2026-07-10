import RSS from 'rss'
import { site } from './config.ts'
import type { Post } from './posts.ts'
import type { RenderedMarkdown } from './markdown.ts'

/** 見出しの「##」アンカーリンクはフィードリーダーではノイズなので除去する */
function stripHeadingAnchors(html: string): string {
  return html.replace(/<a class="heading-anchor"[^>]*>#+<\/a>/g, '')
}

export function generateRSS(posts: Post[], renderedById: Map<string, RenderedMarkdown>): string {
  const feed = new RSS({
    title: site.subTitle,
    site_url: site.url,
    feed_url: `${site.url}/feed.xml`,
  })

  for (const post of posts) {
    feed.item({
      title: post.title,
      guid: post.id,
      url: `${site.url}/blog/${post.id}`,
      date: post.date,
      description: stripHeadingAnchors(renderedById.get(post.id)?.html ?? ''),
      author: site.author,
    })
  }

  return feed.xml({ indent: true })
}
