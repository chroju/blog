import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Home() {
    const siteTitle = "chroju.dev/policy"
    return (
        <Layout siteTitle={siteTitle}>
            <Head>
                <title>{siteTitle}</title>
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/privacy%20policy.png?theme=dark&md=0&fontSize=75px`}
                />
                <meta name="og:title" content="{pageTitle}" />
                <meta name="og:url" content="https://chroju.dev/policy" />
            </Head>
            <section>
                <h2>Notice</h2>
                <p>このサイトで公開している文書は、著者 chroju 個人の調査、研究、考察に基づくものであり、著者が所属する各団体、企業の意見を代表するものではありません。</p>
            </section>
            <section>
                <h2>Privacy policy</h2>
                <p>このサイトでは <Link href="https://www.google.com/analytics">Google Analytics</Link> を使用しています。 Google Analytics は、本サイト利用者のブラウザに cookie を付与することにより、利用者の訪問履歴を収集、分析します。収集する情報には、利用者個人を識別する情報は含まれません。利用者はブラウザの cookie 設定により、データの収集を拒否することができます。詳細は <Link href="https://marketingplatform.google.com/about/analytics/terms/jp/">Google Analytics 利用規約</Link> を参照してください。</p>
            </section>
            <section>
                <h2>LICENSE</h2>
                <p><Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license"><img className="shadow-none" alt="クリエイティブ・コモンズ・ライセンス" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></Link></p>
                <p>このサイトは <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license">Creative Commons 表示 - 非営利 - 継承 4.0 国際 ライセンス</Link>の下に提供されています。</p>
                <p>またサイト内のソースコード、ならびにサイトを構成している Next.js のコードは断りがない限り <Link href="https://github.com/chroju/blog/blob/main/LICENSE">MIT License</Link> で公開しています。</p>
            </section>
            <section>
                <h2>Contact</h2>
                <p>このサイトに関するご意見、ご質問等は、ソースコードをホストしている GitHub レポジトリ <Link href="https://github.com/chroju/blog/issues">chroju/blog の Issue</Link> で受け付けています。また、ブログ内の記事の修正依頼については、記事下部に記載されている「Edit this article」のリンクから Pull Request を作成いただくことができます。</p>
                <p>chroju へ直接連絡を取りたい場合は、 Twitter の <Link href="https://twitter.com/chroju">@chroju</Link> までメンションもしくは DM にてご連絡ください。</p>
            </section>
        </Layout>
    )
}
