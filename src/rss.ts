import RSS from 'rss'
import { site } from './config.ts'
import type { Post } from './posts.ts'
import type { RenderedMarkdown } from './markdown.ts'

/** 見出しの「##」アンカーリンクはフィードリーダーではノイズなので除去する */
function stripHeadingAnchors(html: string): string {
  return html.replace(/<a class="heading-anchor"[^>]*>#+<\/a>/g, '')
}

/** XML 1.0で不正な制御文字（TAB/LF/CR以外）を除去する。CDATA内でも不正なため */
function stripInvalidXmlChars(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

export function generateRSS(posts: Post[], renderedById: Map<string, RenderedMarkdown>): string {
  const feed = new RSS({
    title: site.subTitle,
    site_url: site.url,
    feed_url: `${site.url}/feed.xml`,
  })

  for (const post of posts) {
    feed.item({
      title: stripInvalidXmlChars(post.title),
      guid: post.id,
      url: `${site.url}/blog/${post.id}`,
      date: post.date,
      description: stripInvalidXmlChars(
        stripHeadingAnchors(renderedById.get(post.id)?.html ?? '')
      ),
      author: site.author,
    })
  }

  return feed.xml({ indent: true })
}
