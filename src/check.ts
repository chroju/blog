import fs from 'node:fs'
import path from 'node:path'
import { XMLValidator } from 'fast-xml-parser'
import { loadAllPosts, loadPublishedPosts, getAllTags } from './posts.ts'

// ビルド出力（dist/）の整合性検証。CIとデプロイ前に実行する。

const distDir = path.join(process.cwd(), 'dist')
const errors: string[] = []

function check(condition: boolean, message: string): void {
  if (!condition) errors.push(message)
}

function exists(relPath: string): boolean {
  return fs.existsSync(path.join(distDir, relPath))
}

const allPosts = loadAllPosts()
const publishedPosts = loadPublishedPosts()
const tags = Object.keys(getAllTags())

// 1. 全記事のHTMLページとMarkdownソースが存在するか
for (const post of allPosts) {
  check(exists(`blog/${post.id}.html`), `missing page: blog/${post.id}.html`)
  check(exists(`blog/${post.id}.md`), `missing markdown: blog/${post.id}.md`)
}

// 2. 固定ページ・主要ファイル
for (const p of [
  'index.html',
  'bio.html',
  'policy.html',
  'blog.html',
  'blog/tags.html',
  '404.html',
  'feed.xml',
  'sitemap.xml',
  'llms.txt',
  '_headers',
  'css/site.css',
  'js/lightbox.js',
  'js/theme.js',
  'js/code.js',
  'sw.js',
]) {
  check(exists(p), `missing file: ${p}`)
}

// 3. タグページ
for (const tag of tags) {
  check(exists(`blog/tags/${decodeURI(tag)}.html`), `missing tag page: ${decodeURI(tag)}`)
}

// 4. XMLの整形式チェック（feed.xml / sitemap.xml）
for (const xmlFile of ['feed.xml', 'sitemap.xml']) {
  const xml = fs.readFileSync(path.join(distDir, xmlFile), 'utf8')
  const result = XMLValidator.validate(xml)
  check(result === true, `${xmlFile} is not well-formed: ${JSON.stringify(result)}`)
  // XML 1.0で不正な制御文字（TAB/LF/CR以外）
  const controlChars = xml.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g)
  check(!controlChars, `${xmlFile} contains ${controlChars?.length} invalid control chars`)
}

// 5. フィードのアイテム数 = 公開記事数（draft除外）
const feed = fs.readFileSync(path.join(distDir, 'feed.xml'), 'utf8')
const itemCount = (feed.match(/<item>/g) ?? []).length
check(
  itemCount === publishedPosts.length,
  `feed items (${itemCount}) != published posts (${publishedPosts.length})`
)

// 6. HTMLの欠損チェック（生成が途切れていないか）
for (const post of allPosts) {
  const html = fs.readFileSync(path.join(distDir, 'blog', `${post.id}.html`), 'utf8')
  check(html.includes('</html>'), `truncated html: blog/${post.id}.html`)
}

if (errors.length > 0) {
  console.error(`check failed with ${errors.length} error(s):`)
  for (const e of errors.slice(0, 30)) console.error(`  - ${e}`)
  if (errors.length > 30) console.error(`  ... and ${errors.length - 30} more`)
  process.exit(1)
}

console.log(
  `check OK: ${allPosts.length} posts, ${tags.length} tags, ${itemCount} feed items`
)
