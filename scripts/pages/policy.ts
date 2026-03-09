import { SITE_URL } from '../lib/config.ts'
import { baseLayout } from '../lib/template.ts'
import { write } from '../lib/utils.ts'

export function buildPolicy(): void {
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
