import { site } from '../config.ts'
import type { Post } from '../posts.ts'
import type { Heading } from '../markdown.ts'
import { blogPostingJsonLd } from '../seo.ts'
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
  const body = html`
    <article>
      <ul class="home-nav">
        <li><a href="/blog">/blog</a></li>
        <li><a href="/bio">/bio</a></li>
        <li><a href="/policy">/policy</a></li>
      </ul>
      <section class="home-recent">
        <h2>Recent posts</h2>
        ${raw(postList(recentPosts, false))}
        <p class="home-more"><a href="/blog">すべての記事 →</a></p>
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
  const body = html`<h2>Articles</h2>${raw(postList(posts))}`
  return layout(
    {
      title: site.blogTitle,
      url: `${site.url}/blog`,
      ogImage: ogImageURL('blog'),
    },
    body
  )
}

function tocBlock(headings: Heading[]): string {
  if (headings.length < 3) return ''
  return html`
    <details class="toc">
      <summary>目次</summary>
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
function frontmatterBlock(post: Post): string {
  const tags = post.tags
    .map(
      (tag) =>
        html`<a href="/blog/tags/${raw(encodeURI(tag.toLowerCase()))}">${tag}</a>`
    )
    .join('<span class="fm-punct">, </span>')
  return html`
    <div class="post-frontmatter">
      <span class="fm-delim">---</span>
      <span class="fm-line"><span class="fm-key">date:</span> <time datetime="${post.date}">${formatDate(post.date)}</time></span>
      ${post.tags.length > 0
        ? raw(
            html`<span class="fm-line"><span class="fm-key">tags:</span> <span class="fm-punct">[</span>${raw(tags)}<span class="fm-punct">]</span></span>`
          )
        : ''}
      <span class="fm-delim">---</span>
    </div>
  `
}

export function postPage(post: Post, contentHtml: string, headings: Heading[] = []): string {
  const pageTitle = `${post.title} - ${site.name}`
  const body = html`
    <article>
      <h1 class="post-title">${post.title}</h1>
      ${raw(frontmatterBlock(post))}
      ${raw(tocBlock(headings))}
      <div class="post-body">${raw(contentHtml)}</div>
    </article>
  `
  return layout(
    {
      title: pageTitle,
      url: `${site.url}/blog/${encodeURI(post.id)}`,
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
    <h2>Tags</h2>
    <section>
      <ul class="tag-list">
        ${raw(
          tags
            .map(
              (tag) =>
                html`<li><a href="/blog/tags/${raw(tag)}">${decodeURI(tag)} (${tagCounts[tag]})</a></li>`
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
  const body = html`<h2 class="tag-page-title">#${tag}</h2>${raw(postList(posts))}`
  return layout(
    {
      title: pageTitle,
      url: `${site.url}/blog/tags/${encodedTag}`,
      ogImage: ogImageURL('tags'),
    },
    body
  )
}

export function bioPage(): string {
  const body = html`
    <h2>chroju</h2>
    <img class="bio-profile" src="/images/profile.webp" width="80" height="80" alt="chroju">
    <article class="bio">
      <dl>
        <dt>Job</dt>
        <dd>Site Reliability Engineer</dd>
        <dt>Location</dt>
        <dd>Kanagawa, Japan</dd>
        <dt>Favorite</dt>
        <dd>Terraform / Kubernetes / Go / AWS</dd>
      </dl>
      <h2>Experience</h2>
      <dl>
        <dt>GLOBIS Corporation</dt>
        <dd>Site Reliability Engineer</dd>
        <dd>Apr 2020 - current</dd>
        <dt>Freelancer</dt>
        <dd>Site Reliability Engineer</dd>
        <dd>Jun 2019 - Mar 2020</dd>
        <dt>Quants Research Inc.</dt>
        <dd>Web Operation Engineer</dd>
        <dd>Jun 2015 - May 2019</dd>
        <dt>TIS Inc.</dt>
        <dd>System Engineer</dd>
        <dd>Apr 2011 - May 2015</dd>
      </dl>
      <h2>Education</h2>
      <dl>
        <dt>Bachelor of Engineering</dt>
        <dd>Teikyo University (Distance Learning)</dd>
        <dd>Apr 2019 - Mar 2025</dd>
        <dt>Bachelor of Social Science</dt>
        <dd>Hitotsubashi University</dd>
        <dd>Apr 2007 - Mar 2011</dd>
      </dl>
      <h2>Blog</h2>
      <ul>
        <li><a href="/blog">the world as code</a> (about tech)</li>
        <li><a href="https://chroju.hatenablog.jp">the world was not enough</a> (about culture)</li>
      </ul>
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
    <h2>404 Not Found</h2>
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
