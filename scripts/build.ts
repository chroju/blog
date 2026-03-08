import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import matter from 'gray-matter'
import { remark } from 'remark'
import gfm from 'remark-gfm'
import rlc from 'remark-link-card'
import remarkRehype from 'remark-rehype'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import { format, parseISO } from 'date-fns'

const SITE_URL = 'https://chroju.dev'
const SITE_TITLE = 'chroju.dev/blog'
const SITE_SUBTITLE = 'the world as code'
const POSTS_DIR = path.join(process.cwd(), 'posts')
const OUT_DIR = path.join(process.cwd(), 'dist')
const GA_ID = 'G-4J6JXM71YV'

// ---- types ----

interface PostMeta {
  id: string
  title: string
  date: string
  tags: string[]
  draft: boolean
  firstOfYear: string | null
}

interface Post extends PostMeta {
  contentHtml: string
}

// ---- posts ----

function getSortedPosts(): PostMeta[] {
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

async function getPost(id: string): Promise<Post> {
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

// ---- SVG icons (inline) ----

const iconGithub = `<svg class="sns-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`
const iconActivitypub = `<svg class="sns-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>ActivityPub</title><path d="M10.91 4.442L0 10.74v2.52L8.727 8.22v10.077l2.182 1.26zM6.545 12l-4.364 2.52 4.364 2.518zm6.545-2.52L17.455 12l-4.364 2.52zm0-5.038L24 10.74v2.52l-10.91 6.298v-2.52L21.819 12 13.091 6.96z"/></svg>`
const iconBluesky = `<svg class="sns-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Bluesky</title><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/></svg>`
const iconX = `<svg class="sns-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>`
const iconTags = `<svg class="inline fill-slate-500 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.37.86.58 1.41.58s1.05-.21 1.41-.58l7-7c.37-.36.59-.86.59-1.42s-.22-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>`
const iconEdit = `<svg class="inline fill-slate-500 size-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"/></svg>`
const iconHistory = `<svg class="inline fill-slate-500 size-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 1 1 2.05 4.95L6.63 18.37A9 9 0 1 0 13 3zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8z"/></svg>`

// ---- HTML templates ----

function gaScript(): string {
  return `
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>`
}

function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

function tagsHtml(tags: string[]): string {
  if (!tags || tags.length === 0) return ''
  return tags.map(t =>
    `<a href="/blog/tags/${encodeURIComponent(t.toLowerCase())}" class="text-slate-500 text-sm hover:underline">${t}</a>`
  ).join(' ')
}

function baseLayout({ title, description = "chroju's blog", ogImage, ogUrl, rss = false, body, siteTitle = SITE_TITLE, blogArticleId = '', tags = [] as string[], footer = true }: {
  title: string
  description?: string
  ogImage?: string
  ogUrl?: string
  rss?: boolean
  body: string
  siteTitle?: string
  blogArticleId?: string
  tags?: string[]
  footer?: boolean
}): string {
  const isBlog = siteTitle === SITE_TITLE
  const parts = siteTitle.split('/')
  const headerHref = parts.length > 1 ? '/' + parts[1] : '/'
  const editUrl = `https://github.com/chroju/blog/edit/main/posts/${blogArticleId}.md`
  const historyUrl = `https://github.com/chroju/blog/commits/main/posts/${blogArticleId}.md`

  const footerHtml = footer ? `
  <footer class="mt-20 border-t-2">
    ${blogArticleId ? `
    <div class="mb-10">
      <div class="container mx-auto flex items-center mb-5">
        <section class="space-x-2 text-slate-500 items-center flex">
          ${iconTags}
          ${tagsHtml(tags)}
        </section>
        <nav class="lg:flex flex-wrap justify-center hidden lg:ml-auto space-x-8 text-slate-500">
          <li class="list-none flex items-center text-sm">
            ${iconEdit}<a href="${editUrl}" class="text-slate-500 text-sm no-underline hover:underline">Edit this article</a>
          </li>
          <li class="list-none flex items-center text-sm">
            ${iconHistory}<a href="${historyUrl}" class="text-slate-500 text-sm no-underline hover:underline">Show history</a>
          </li>
        </nav>
      </div>
      <div class="my-12 flex justify-center md:justify-start">
        <a href="/blog" class="no-underline py-2 px-8 bg-blue-500 hover:bg-blue-700 transition text-white rounded">Read more articles →</a>
      </div>
    </div>` : ''}
    <div class="my-5 flex flex-col md:flex-row items-center">
      <img src="/images/profile.webp" class="w-10 rounded-full" width="40" height="40" alt="chroju" />
      <div class="my-4"><a href="/" class="md:text-sm font-semibold no-underline hover:underline md:ml-4">chroju.dev</a></div>
      <nav class="md:ml-8 md:pl-8 md:border-l-2 border-gray-200 flex md:space-x-8 space-x-4">
        <li class="list-none"><a href="/blog" class="md:text-sm no-underline hover:underline">/blog</a></li>
        <li class="list-none"><a href="/bio" class="md:text-sm no-underline hover:underline">/bio</a></li>
        <li class="list-none"><a href="/policy" class="md:text-sm no-underline hover:underline">/policy</a></li>
      </nav>
      <nav class="md:ml-8 md:pl-8 md:border-l-2 border-gray-200 flex md:space-x-4 space-x-4">
        <li class="list-none"><a href="https://github.com/chroju">${iconGithub}</a></li>
        <li class="list-none"><a href="https://pleroma.chroju.dev/users/chroju">${iconActivitypub}</a></li>
        <li class="list-none"><a href="https://bsky.app/profile/chroju.dev">${iconBluesky}</a></li>
        <li class="list-none"><a href="https://x.com/chroju">${iconX}</a></li>
      </nav>
    </div>
  </footer>` : ''

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="og:description" content="${siteTitle}" />
  <meta name="twitter:card" content="summary_large_image" />
  ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
  ${ogUrl ? `<meta name="og:url" content="${ogUrl}" />` : ''}
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <meta name="theme-color" content="#ffffff" />
  ${rss ? `<link rel="alternate" type="application/rss+xml" href="${SITE_URL}/feed.xml" title="RSS2.0" />` : ''}
  <link rel="stylesheet" href="/styles.css" />
  ${gaScript()}
</head>
<body>
<div class="md:container md:mx-auto md:w-1/2 px-5 my-10">
  <header class="mb-10">
    <h1><a href="${headerHref}" class="font-extrabold text-lg">${siteTitle}</a></h1>
    ${isBlog ? `<div>
      <small class="block">${SITE_SUBTITLE}</small>
      <a href="/feed.xml" class="hidden md:block">
        <svg class="inline fill-slate-500 size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>
      </a>
    </div>` : ''}
  </header>
  <main>${body}</main>
  ${footerHtml}
</div>
</body>
</html>`
}

// ---- page generators ----

function buildIndex(): void {
  const out = baseLayout({
    title: 'chroju.dev',
    siteTitle: 'chroju.dev',
    ogImage: 'https://og-image.chroju.dev/chroju.dev.png?theme=dark&md=0&fontSize=75px',
    ogUrl: SITE_URL,
    footer: false,
    body: `
<article>
  <ul>
    <li class="list-none my-2"><a href="/blog" class="text-2xl font-extrabold">/blog</a></li>
    <li class="list-none my-2"><a href="/bio" class="text-2xl font-extrabold">/bio</a></li>
    <li class="list-none my-2"><a href="/policy" class="text-2xl font-extrabold">/policy</a></li>
  </ul>
</article>`,
  })
  write('index.html', out)
}

function buildBlogIndex(posts: PostMeta[]): void {
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

async function buildPost(post: Post): Promise<void> {
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

function buildTagPages(posts: PostMeta[]): void {
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

function buildBio(): void {
  const out = baseLayout({
    title: 'chroju.dev/bio',
    siteTitle: 'chroju.dev/bio',
    ogImage: 'https://og-image.chroju.dev/bio.png?theme=dark&md=0&fontSize=75px',
    ogUrl: `${SITE_URL}/bio`,
    body: `
<h2>chroju</h2>
<img src="/images/profile.webp" class="my-10 w-20 rounded-full" width="80" height="80" alt="chroju" />
<article class="bio">
  <dl>
    <dt>Job</dt><dd>Site Reliability Engineer</dd>
    <dt>Location</dt><dd>Kanagawa, Japan</dd>
    <dt>Favorite</dt><dd>Terraform / Kubernetes / Go / AWS</dd>
  </dl>
  <h2>Experience</h2>
  <dl>
    <dt>GLOBIS Corporation</dt><dd>Site Reliability Engineer</dd><dd>Apr 2020 - current</dd>
    <dt>Freelancer</dt><dd>Site Reliability Engineer</dd><dd>Jun 2019 - Mar 2020</dd>
    <dt>Quants Research Inc.</dt><dd>Web Operation Engineer</dd><dd>Jun 2015 - May 2019</dd>
    <dt>TIS Inc.</dt><dd>System Engineer</dd><dd>Apr 2011 - May 2015</dd>
  </dl>
  <h2>Education</h2>
  <dl>
    <dt>Bachelor of Engineering</dt><dd>Teikyo University (Distance Learning)</dd><dd>Apr 2019 - Mar 2025</dd>
    <dt>Bachelor of Social Science</dt><dd>Hitotsubashi University</dd><dd>Apr 2007 - Mar 2011</dd>
  </dl>
  <h2>Blog</h2>
  <ul>
    <li><a href="/blog">the world as code</a> (about tech)</li>
    <li><a href="https://chroju.hatenablog.jp">the world was not enough</a> (about culture)</li>
  </ul>
</article>`,
  })
  write('bio/index.html', out)
}

function buildPolicy(): void {
  const out = baseLayout({
    title: 'chroju.dev/policy',
    siteTitle: 'chroju.dev/policy',
    ogImage: 'https://og-image.chroju.dev/privacy%20policy.png?theme=dark&md=0&fontSize=75px',
    ogUrl: `${SITE_URL}/policy`,
    body: `
<section>
  <h2>Notice</h2>
  <p>このサイトで公開している文書は、著者 chroju 個人の調査、研究、考察に基づくものであり、著者が所属する各団体、企業の意見を代表するものではありません。</p>
</section>
<section>
  <h2>Privacy policy</h2>
  <p>このサイトでは <a href="https://www.google.com/analytics">Google Analytics</a> を使用しています。 Google Analytics は、本サイト利用者のブラウザに cookie を付与することにより、利用者の訪問履歴を収集、分析します。収集する情報には、利用者個人を識別する情報は含まれません。利用者はブラウザの cookie 設定により、データの収集を拒否することができます。詳細は <a href="https://marketingplatform.google.com/about/analytics/terms/jp/">Google Analytics 利用規約</a> を参照してください。</p>
</section>
<section>
  <h2>LICENSE</h2>
  <p><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license"><img class="shadow-none" alt="クリエイティブ・コモンズ・ライセンス" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a></p>
  <p>このサイトは <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license">Creative Commons 表示 - 非営利 - 継承 4.0 国際 ライセンス</a>の下に提供されています。</p>
  <p>またサイト内のソースコード、ならびにサイトを構成しているコードは断りがない限り <a href="https://github.com/chroju/blog/blob/main/LICENSE">MIT License</a> で公開しています。</p>
</section>
<section>
  <h2>Contact</h2>
  <p>このサイトに関するご意見、ご質問等は、ソースコードをホストしている GitHub レポジトリ <a href="https://github.com/chroju/blog/issues">chroju/blog の Issue</a> で受け付けています。また、ブログ内の記事の修正依頼については、記事下部に記載されている「Edit this article」のリンクから Pull Request を作成いただくことができます。</p>
  <p>chroju へ直接連絡を取りたい場合は、 X の <a href="https://x.com/chroju">@chroju</a> までメンションもしくは DM にてご連絡ください。</p>
</section>`,
  })
  write('policy/index.html', out)
}

function buildRss(posts: PostMeta[]): void {
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

// ---- utils ----

function escHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function copyDir(src: string, dest: string): void {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function write(relPath: string, content: string): void {
  const fullPath = path.join(OUT_DIR, relPath)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, content, 'utf8')
}

// ---- main ----

async function main(): Promise<void> {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // copy static assets

  // copy public directory contents (images, favicons, etc.)
  copyDir(path.join(process.cwd(), 'public'), OUT_DIR)

  const posts = getSortedPosts()

  buildIndex()
  buildBlogIndex(posts)
  buildTagPages(posts)
  buildBio()
  buildPolicy()
  buildRss(posts)

  await Promise.all(posts.map(async meta => {
    const post = await getPost(meta.id)
    post.firstOfYear = meta.firstOfYear
    await buildPost(post)
  }))

  // build CSS
  execSync('npx tailwindcss -i ./styles/global.css -o ./dist/styles.css', { stdio: 'inherit' })

  console.log(`Built ${posts.length} posts → dist/`)
}

main().catch(err => { console.error(err); process.exit(1) })
