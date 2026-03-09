import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import gfm from 'remark-gfm'
import rlc from 'remark-link-card'
import remarkRehype from 'remark-rehype'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import { POSTS_DIR } from './config.ts'
import type { Post, PostMeta } from './types.ts'

export function getSortedPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
  const posts = files.map(file => {
    const id = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
    const { data } = matter(raw)
    return {
      id,
      title: data.title ?? id,
      date: data.date ?? '',
      tags: data.tags ?? [],
      draft: data.draft ?? false,
      firstOfYear: null,
    } satisfies PostMeta
  })

  const sorted = posts
    .filter(p => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  let prev = ''
  return sorted.map(post => {
    const year = post.date.slice(0, 4)
    post.firstOfYear = year !== prev ? year : null
    prev = year
    return post
  })
}

export async function getPost(id: string): Promise<Post> {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${id}.md`), 'utf8')
  const { data, content } = matter(raw)
  const processed = await remark()
    .use(gfm)
    .use(rlc)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, { theme: 'dark-plus', ignoreMissing: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)
  return {
    id,
    title: data.title ?? id,
    date: data.date ?? '',
    tags: data.tags ?? [],
    draft: data.draft ?? false,
    firstOfYear: null,
    contentHtml: processed.toString(),
  }
}
