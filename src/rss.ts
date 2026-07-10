import RSS from 'rss'
import { site } from './config.ts'
import type { Post } from './posts.ts'

export function generateRSS(posts: Post[], contentHtmlById: Map<string, string>): string {
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
      description: contentHtmlById.get(post.id) ?? '',
      author: site.author,
    })
  }

  return feed.xml({ indent: true })
}
