import { SITE_URL, SITE_TITLE } from '../lib/config.ts'
import { baseLayout } from '../lib/template.ts'
import { escHtml, formatDate, write } from '../lib/utils.ts'
import { getPost } from '../lib/posts.ts'
import type { Post, PostMeta } from '../lib/types.ts'

export function buildBlogIndex(posts: PostMeta[]): void {
  const items = posts.map(post => `
    <li class="list-none">
      ${post.firstOfYear ? `<p class="text-slate-400 font-bold text-lg mt-8 mb-2">${post.firstOfYear}</p>` : ''}
      <a href="/blog/${post.id}" class="font-semibold text-lg no-underline hover:underline">${escHtml(post.title)}</a><br />
      <small class="text-sm">${formatDate(post.date)}</small>
    </li>`).join('\n')

  const out = baseLayout({
    title: SITE_TITLE,
    rss: true,
    ogImage: `https://og-image.chroju.dev/${encodeURIComponent(SITE_TITLE)}.png?theme=dark&md=0&fontSize=75px`,
    ogUrl: `${SITE_URL}/blog`,
    body: `<h2>Articles</h2><ul class="space-y-5 px-0">${items}</ul>`,
  })
  write('blog/index.html', out)
}

export async function buildPost(post: Post): Promise<void> {
  const out = baseLayout({
    title: `${post.title} - chroju.dev`,
    rss: true,
    ogImage: `https://og-image.chroju.dev/${encodeURIComponent(post.title)}.png?theme=dark&md=0&fontSize=96px`,
    ogUrl: `${SITE_URL}/blog/${post.id}`,
    blogArticleId: post.id,
    tags: post.tags,
    body: `
<article>
  <h1 class="text-3xl font-bold mb-2">${escHtml(post.title)}</h1>
  <div class="mb-10"><section>${formatDate(post.date)}</section></div>
  ${post.contentHtml}
</article>`,
  })
  write(`blog/${post.id}/index.html`, out)
}

export function buildTagPages(posts: PostMeta[]): void {
  const tagMap: Record<string, PostMeta[]> = {}
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const key = tag.toLowerCase()
      if (!tagMap[key]) tagMap[key] = []
      tagMap[key].push(post)
    }
  }

  for (const [tag, tagPosts] of Object.entries(tagMap)) {
    const items = tagPosts.map(post => `
    <li class="list-none">
      <a href="/blog/${post.id}" class="font-semibold text-lg no-underline hover:underline">${escHtml(post.title)}</a><br />
      <small class="text-sm">${formatDate(post.date)}</small>
    </li>`).join('\n')

    const out = baseLayout({
      title: `${tag} - ${SITE_TITLE}`,
      rss: true,
      ogUrl: `${SITE_URL}/blog/tags/${encodeURIComponent(tag)}`,
      body: `<h2>${escHtml(tag)}</h2><ul class="space-y-5 px-0">${items}</ul>`,
    })
    write(`blog/tags/${encodeURIComponent(tag)}/index.html`, out)
  }
}

export async function buildAllPosts(posts: PostMeta[]): Promise<void> {
  await Promise.all(posts.map(async meta => {
    const post = await getPost(meta.id)
    post.firstOfYear = meta.firstOfYear
    await buildPost(post)
  }))
}
