import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface Post {
  id: string
  title: string
  date: string
  tags: string[]
  draft: boolean
  content: string
  /** 一覧表示で年の見出しを出す場合、その年（例 "2026"）。他は null */
  firstOfYear: string | null
}

const postsDirectory = path.join(process.cwd(), 'posts')

let allPosts: Post[] | null = null

/** devサーバの再ビルド時にメモリキャッシュを破棄する */
export function clearPostsCache(): void {
  allPosts = null
}

/** 全記事（draft含む）を日付降順で返す */
export function loadAllPosts(): Post[] {
  if (allPosts) return allPosts
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))
  const posts = fileNames.map((fileName): Post => {
    const id = fileName.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(postsDirectory, fileName), 'utf8')
    const { data, content } = matter(raw)
    const tags = Array.isArray(data.tags)
      ? data.tags.filter((t: unknown) => typeof t === 'string' && t !== '')
      : []
    return {
      id,
      title: String(data.title ?? id),
      date: String(data.date ?? ''),
      tags,
      draft: data.draft === true,
      content,
      firstOfYear: null,
    }
  })
  // ISO8601文字列は辞書順=時系列なのでそのまま比較する
  posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  allPosts = posts
  return posts
}

/** 一覧・タグ・RSSに載せる記事（draft除外）。firstOfYear を付与済み */
export function loadPublishedPosts(): Post[] {
  const posts = loadAllPosts().filter((p) => !p.draft)
  let previous = ''
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    post.firstOfYear = year !== previous ? year : null
    previous = year
  }
  return posts
}

/** タグ（lowercase + encodeURI 済み）→ 記事数 */
export function getAllTags(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const post of loadPublishedPosts()) {
    for (const tag of post.tags) {
      const key = encodeURI(tag.toLowerCase())
      counts[key] = (counts[key] || 0) + 1
    }
  }
  return counts
}

/** encodeURI済みタグに対応する記事一覧 */
export function getPostsWithTag(encodedTag: string): Post[] {
  const decoded = decodeURI(encodedTag)
  return loadPublishedPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === decoded)
  )
}
