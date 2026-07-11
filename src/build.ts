import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { site } from './config.ts'
import { loadPublishedPosts, getAllTags, getPostsWithTag, type Post } from './posts.ts'
import { renderMarkdown, type RenderedMarkdown } from './markdown.ts'
import { generateSitemap, generateLlmsTxt } from './seo.ts'
import { saveLinkCardCache } from './linkcard.ts'
import { generateRSS } from './rss.ts'
import { generateOgImage } from './ogimage.ts'
import {
  homePage,
  blogIndexPage,
  postPage,
  tagsIndexPage,
  tagPage,
  bioPage,
  policyPage,
  notFoundPage,
} from './templates/pages.ts'

const root = process.cwd()
const distDir = path.join(root, 'dist')

export interface BuildOptions {
  skipOgImages?: boolean
  clean?: boolean
}

function write(relPath: string, content: string): void {
  const outPath = path.join(distDir, relPath)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, content)
}

function copyStatic(): void {
  fs.cpSync(path.join(root, 'public'), distDir, { recursive: true })
  fs.mkdirSync(path.join(distDir, 'css'), { recursive: true })
  fs.copyFileSync(path.join(root, 'styles', 'site.css'), path.join(distDir, 'css', 'site.css'))
  fs.mkdirSync(path.join(distDir, 'js'), { recursive: true })
  for (const file of fs.readdirSync(path.join(root, 'src', 'assets'))) {
    if (file.endsWith('.js')) {
      fs.copyFileSync(path.join(root, 'src', 'assets', file), path.join(distDir, 'js', file))
    }
  }
}

/** 並列数を制限しつつ全要素にfnを適用する */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let index = 0
  async function worker() {
    while (index < items.length) {
      const i = index++
      results[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

// devサーバでの再ビルド時、本文が変わっていない記事のHTMLを使い回す
const renderCache = new Map<string, { source: string; rendered: RenderedMarkdown }>()

export async function renderAllPosts(posts: Post[]): Promise<Map<string, RenderedMarkdown>> {
  const renderedById = new Map<string, RenderedMarkdown>()
  await mapLimit(posts, 8, async (post) => {
    const cached = renderCache.get(post.id)
    if (cached && cached.source === post.content) {
      renderedById.set(post.id, cached.rendered)
      return
    }
    const rendered = await renderMarkdown(post.content)
    renderCache.set(post.id, { source: post.content, rendered })
    renderedById.set(post.id, rendered)
  })
  return renderedById
}

export async function buildAll(options: BuildOptions = {}): Promise<void> {
  const started = Date.now()

  if (options.clean !== false && fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true })
  }
  fs.mkdirSync(distDir, { recursive: true })
  copyStatic()

  // draft: true の記事はビルド対象外（ページ・.mdソース・OGP画像とも生成しない）
  const publishedPosts = loadPublishedPosts()
  const tagCounts = getAllTags()

  const renderedById = await renderAllPosts(publishedPosts)

  // 記事ページ + Markdownソース（/blog/{slug}.md）
  const mdSlugPosts: string[] = []
  for (const post of publishedPosts) {
    const rendered = renderedById.get(post.id)!
    write(`blog/${post.id}.html`, postPage(post, rendered.html, rendered.headings, publishedPosts))
    fs.copyFileSync(
      path.join(root, 'posts', `${post.id}.md`),
      path.join(distDir, 'blog', `${post.id}.md`)
    )
    if (post.id.endsWith('.md')) mdSlugPosts.push(post.id)
  }

  // .md はブラウザでインライン表示できるよう text/plain で配信する。
  // slug自体が .md で終わる記事のHTMLページはグロブに巻き込まれるため個別に戻す
  const headerRules = ['/blog/*.md', '  Content-Type: text/plain; charset=utf-8']
  for (const id of mdSlugPosts) {
    headerRules.push('', `/blog/${encodeURI(id)}`, '  ! Content-Type', '  Content-Type: text/html; charset=utf-8')
  }
  write('_headers', headerRules.join('\n') + '\n')

  // 固定ページ・一覧
  write('index.html', homePage(publishedPosts.slice(0, 5)))
  write('bio.html', bioPage())
  write('policy.html', policyPage())
  write('blog.html', blogIndexPage(publishedPosts))
  write('blog/tags.html', tagsIndexPage(tagCounts))
  for (const encodedTag of Object.keys(tagCounts)) {
    // URLはencodeURI形式だが、ファイル名はデコード済み文字列で書く
    // （静的ホスティングはリクエストパスをデコードしてからファイル解決するため）
    write(`blog/tags/${decodeURI(encodedTag)}.html`, tagPage(encodedTag, getPostsWithTag(encodedTag)))
  }
  write('404.html', notFoundPage())

  // RSS（draft除外・全文）・sitemap・llms.txt
  write('feed.xml', generateRSS(publishedPosts, renderedById))
  write('sitemap.xml', generateSitemap(publishedPosts, Object.keys(tagCounts)))
  write('llms.txt', generateLlmsTxt(publishedPosts))

  // OGP画像
  if (!options.skipOgImages) {
    await mapLimit(publishedPosts, 4, (post) =>
      generateOgImage(post.title, path.join(distDir, 'og', `${post.id}.png`))
    )
    const fixedPages: [string, string][] = [
      ['site', site.name],
      ['blog', site.blogTitle],
      ['bio', 'chroju.dev/bio'],
      ['policy', 'chroju.dev/policy'],
      ['tags', `Tags - ${site.blogTitle}`],
    ]
    for (const [name, title] of fixedPages) {
      await generateOgImage(title, path.join(distDir, 'og', `${name}.png`))
    }
  }

  saveLinkCardCache()

  const pages = publishedPosts.length + Object.keys(tagCounts).length + 6
  console.log(`built ${pages} pages in ${((Date.now() - started) / 1000).toFixed(1)}s`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildAll({ skipOgImages: process.argv.includes('--skip-og') }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
