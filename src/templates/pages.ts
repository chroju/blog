import { site } from '../config.ts'
import type { Post } from '../posts.ts'
import type { Heading } from '../markdown.ts'
import { blogPostingJsonLd, postDescription } from '../seo.ts'
import { html, raw, layout, formatDate } from './html.ts'

function ogImageURL(name: string): string {
  return `${site.url}/og/${encodeURIComponent(name)}.png`
}

function postList(posts: Post[], showYear = true): string {
  return html`
    <section>
      <ul class="post-list">
        ${raw(
          posts
            .map(
              (post) => html`
                <li>
                  ${showYear && post.firstOfYear
                    ? raw(html`<h3 class="post-year">${post.firstOfYear}</h3>`)
                    : ''}
                  <div class="post-row">
                    <a class="post-list-title" href="/blog/${raw(encodeURI(post.id))}">${post.title}</a>
                    <time datetime="${post.date}">${post.date.slice(0, 10)}</time>
                  </div>
                </li>
              `
            )
            .join('')
        )}
      </ul>
    </section>
  `
}

export function homePage(recentPosts: Post[]): string {
  const branch = raw('<span class="tree-branch" aria-hidden="true">├── </span>')
  const branchLast = raw('<span class="tree-branch" aria-hidden="true">└── </span>')
  const body = html`
    <article>
      <nav class="home-tree" aria-label="サイト内ページ">
        <h1 class="tree-root">chroju.dev</h1>
        <ul class="tree">
          <li>${branch}<a href="/blog">blog/</a></li>
          <li>${branch}<a href="/bio">bio</a></li>
          <li>${branchLast}<a href="/policy">policy</a></li>
        </ul>
      </nav>
      <section class="home-recent">
        <h2>Recent posts</h2>
        ${raw(postList(recentPosts, false))}
        <p class="home-more"><a href="/blog">All articles →</a></p>
      </section>
    </article>
  `
  return layout(
    {
      title: site.name,
      siteTitle: site.name,
      url: site.url,
      ogImage: ogImageURL('site'),
      isBlog: false,
      footer: false,
    },
    body
  )
}

export function blogIndexPage(posts: Post[]): string {
  const body = html`<h1 class="page-title">Articles</h1>${raw(postList(posts))}`
  return layout(
    {
      title: site.blogTitle,
      url: `${site.url}/blog`,
      ogImage: ogImageURL('blog'),
    },
    body
  )
}

// 目次はfrontmatterの toc: キーとして畳み込む。展開するとYAMLのリスト記法になる
function fmTocBlock(headings: Heading[]): string {
  if (headings.length < 3) return ''
  return html`
    <details class="fm-toc">
      <summary><span class="fm-key">toc:</span> <span class="fm-toc-hint">[...]</span></summary>
      <ol>
        ${raw(
          headings
            .map(
              (h) =>
                html`<li class="${h.depth === 3 ? 'toc-h3' : 'toc-h2'}"><a href="#${raw(
                  encodeURI(h.id)
                )}">${h.text}</a></li>`
            )
            .join('')
        )}
      </ol>
    </details>
  `
}

// 記事メタを実際のfrontmatter風に表示する（このブログの記事は本当にfrontmatter付きMarkdown）
function frontmatterBlock(post: Post, headings: Heading[] = []): string {
  const tags = post.tags
    .map(
      (tag) =>
        html`<a href="/blog/tags/${raw(encodeURI(tag.toLowerCase()))}">${tag}</a>`
    )
    .join('<span class="fm-punct">, </span>')
  return html`
    <div class="post-frontmatter">
      <span class="fm-delim" aria-hidden="true">---</span>
      <span class="fm-line"><span class="fm-key">date:</span> <time datetime="${post.date}">${formatDate(post.date)}</time></span>
      ${post.tags.length > 0
        ? raw(
            html`<span class="fm-line"><span class="fm-key">tags:</span> <span class="fm-punct">[</span>${raw(tags)}<span class="fm-punct">]</span></span>`
          )
        : ''}
      ${raw(fmTocBlock(headings))}
      <span class="fm-delim" aria-hidden="true">---</span>
    </div>
  `
}

export function postPage(post: Post, contentHtml: string, headings: Heading[] = []): string {
  const pageTitle = `${post.title} - ${site.name}`
  const body = html`
    <article>
      <h1 class="post-title">${post.title}</h1>
      ${raw(frontmatterBlock(post, headings))}
      <div class="post-body">${raw(contentHtml)}</div>
    </article>
  `
  return layout(
    {
      title: pageTitle,
      url: `${site.url}/blog/${encodeURI(post.id)}`,
      description: postDescription(post),
      ogImage: `${site.url}/og/${encodeURIComponent(post.id)}.png`,
      articleId: post.id,
      scripts: ['/js/lightbox.js', '/js/code.js'],
      extraHead: blogPostingJsonLd(post),
    },
    body
  )
}

export function tagsIndexPage(tagCounts: Record<string, number>): string {
  const tags = Object.keys(tagCounts).sort()
  const body = html`
    <h1 class="page-title">Tags</h1>
    <section>
      <ul class="tag-list">
        ${raw(
          tags
            .map(
              (tag) =>
                html`<li><a href="/blog/tags/${raw(tag)}"><span class="tag-hash">#</span>${decodeURI(tag)} <span class="tag-count">(${tagCounts[tag]})</span></a></li>`
            )
            .join('')
        )}
      </ul>
    </section>
  `
  return layout(
    {
      title: `Tags - ${site.blogTitle}`,
      url: `${site.url}/blog/tags`,
      ogImage: ogImageURL('tags'),
    },
    body
  )
}

export function tagPage(encodedTag: string, posts: Post[]): string {
  const tag = decodeURI(encodedTag)
  const pageTitle = `tag: ${tag} - ${site.blogTitle}`
  const body = html`<h1 class="page-title tag-page-title">#${tag}</h1>${raw(postList(posts))}`
  return layout(
    {
      title: pageTitle,
      url: `${site.url}/blog/tags/${encodedTag}`,
      ogImage: ogImageURL('tags'),
    },
    body
  )
}

// bio用のfrontmatter風メタブロック（location / expertise / social）
function bioFrontmatterBlock(): string {
  const expertise = ['Infrastructure as Code', 'Security', 'Cloud Architecture', 'Engineering Management']
  const socialLinks: [string, string, string][] = [
    ['github', 'chroju', 'https://github.com/chroju'],
    ['activitypub', '@chroju@pleroma.chroju.dev', 'https://pleroma.chroju.dev/users/chroju'],
    ['bluesky', '@chroju.dev', 'https://bsky.app/profile/chroju.dev'],
    ['x', '@chroju', 'https://x.com/chroju'],
  ]
  return html`
    <div class="post-frontmatter bio-frontmatter">
      <span class="fm-delim" aria-hidden="true">---</span>
      <span class="fm-line"><span class="fm-key">location:</span> Kanagawa, Japan</span>
      <span class="fm-line"><span class="fm-key">expertise:</span></span>
      ${raw(
        expertise
          .map((item) => html`<span class="fm-line fm-nested fm-list-item">${item}</span>`)
          .join('')
      )}
      <span class="fm-line"><span class="fm-key">social:</span></span>
      ${raw(
        socialLinks
          .map(
            ([key, label, href]) =>
              html`<span class="fm-line fm-nested"><span class="fm-key">${key}:</span> <a href="${href}">${label}</a></span>`
          )
          .join('')
      )}
      <span class="fm-delim" aria-hidden="true">---</span>
    </div>
  `
}

export function bioPage(): string {
  const body = html`
    <article class="bio">
      <div class="bio-header">
        <img class="bio-profile" src="/images/profile.webp" width="80" height="80" alt="chroju">
        <div>
          <h1 class="bio-name">chroju</h1>
          <p class="bio-role">Site Reliability Engineer</p>
        </div>
      </div>
      ${raw(bioFrontmatterBlock())}
      <section>
        <h2>Experience</h2>
        <ol class="timeline">
          <li>
            <span class="timeline-period">Apr 2020 — current</span>
            <span class="timeline-body"><strong>GLOBIS Corporation</strong><br>Site Reliability Engineer</span>
          </li>
          <li>
            <span class="timeline-period">Jun 2019 — Mar 2020</span>
            <span class="timeline-body"><strong>Freelancer</strong><br>Site Reliability Engineer</span>
          </li>
          <li>
            <span class="timeline-period">Jun 2015 — May 2019</span>
            <span class="timeline-body"><strong>Quants Research Inc.</strong><br>Web Operation Engineer</span>
          </li>
          <li>
            <span class="timeline-period">Apr 2011 — May 2015</span>
            <span class="timeline-body"><strong>TIS Inc.</strong><br>System Engineer</span>
          </li>
        </ol>
      </section>
      <section>
        <h2>Education</h2>
        <ol class="timeline">
          <li>
            <span class="timeline-period">Apr 2019 — Mar 2025</span>
            <span class="timeline-body"><strong>Teikyo University (Distance Learning)</strong><br>Bachelor of Engineering</span>
          </li>
          <li>
            <span class="timeline-period">Apr 2007 — Mar 2011</span>
            <span class="timeline-body"><strong>Hitotsubashi University</strong><br>Bachelor of Social Science</span>
          </li>
        </ol>
      </section>
      <section>
        <h2>Blog</h2>
        <ul>
          <li><a href="/blog">the world as code</a> (about tech)</li>
          <li><a href="https://chroju.hatenablog.jp">the world was not enough</a> (about culture)</li>
        </ul>
      </section>
    </article>
  `
  return layout(
    {
      title: 'chroju.dev/bio',
      siteTitle: 'chroju.dev/bio',
      url: `${site.url}/bio`,
      ogImage: ogImageURL('bio'),
      isBlog: false,
    },
    body
  )
}

export function policyPage(): string {
  const body = html`
    <h1 class="visually-hidden">chroju.dev/policy</h1>
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
      <p><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license"><img class="license-img" alt="クリエイティブ・コモンズ・ライセンス" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"></a></p>
      <p>このサイトは <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license">Creative Commons 表示 - 非営利 - 継承 4.0 国際 ライセンス</a>の下に提供されています。</p>
      <p>またサイト内のソースコード、ならびにサイトを構成しているコードは断りがない限り <a href="https://github.com/chroju/blog/blob/main/LICENSE">MIT License</a> で公開しています。</p>
    </section>
    <section>
      <h2>Contact</h2>
      <p>このサイトに関するご意見、ご質問等は、ソースコードをホストしている GitHub レポジトリ <a href="https://github.com/chroju/blog/issues">chroju/blog の Issue</a> で受け付けています。また、ブログ内の記事の修正依頼については、記事下部に記載されている「Edit this article」のリンクから Pull Request を作成いただくことができます。</p>
      <p>chroju へ直接連絡を取りたい場合は、 Twitter の <a href="https://twitter.com/chroju">@chroju</a> までメンションもしくは DM にてご連絡ください。</p>
    </section>
  `
  return layout(
    {
      title: 'chroju.dev/policy',
      siteTitle: 'chroju.dev/policy',
      url: `${site.url}/policy`,
      ogImage: ogImageURL('policy'),
      isBlog: false,
    },
    body
  )
}

export function notFoundPage(): string {
  const body = html`
    <p class="error-code" aria-hidden="true">404</p>
    <h1 class="error-title">Not Found</h1>
    <p>お探しのページは見つかりませんでした。</p>
    <p><a href="/blog">記事一覧へ →</a></p>
  `
  return layout(
    {
      title: `404 Not Found - ${site.name}`,
      siteTitle: site.name,
      url: site.url,
      ogImage: ogImageURL('site'),
      isBlog: false,
    },
    body
  )
}
