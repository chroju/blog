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
                <ul>
                    <p>このサイトで公開している文書は、著者 chroju 個人の調査、研究、考察に基づくものであり、著者が所属する各団体、企業の意見を代表するものではありません。</p>
                </ul>
            </section>
            <section>
                <h2>Privacy policy</h2>
                <ul>
                    <p>このサイトでは <Link href="https://www.google.com/analytics"><a>Google Analytics</a></Link> を使用しています。 Google Analytics は、本サイト利用者のブラウザに cookie を付与することにより、利用者の訪問履歴を収集、分析します。収集する情報には、利用者個人を識別する情報は含まれません。利用者はブラウザの cookie 設定により、データの収集を拒否することができます。詳細は <Link href="https://marketingplatform.google.com/about/analytics/terms/jp/"><a>Google Analytics 利用規約</a></Link> を参照してください。</p>
                </ul>
            </section>
            <section>
                <h2>LICENSE</h2>
                <ul>
                    <p><Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><a rel="license"><img className="shadow-none" alt="クリエイティブ・コモンズ・ライセンス" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a></Link></p>
                    <p>このサイトは <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><a rel="license">Creative Commons 表示 - 非営利 - 継承 4.0 国際 ライセンス</a></Link>の下に提供されています。</p>
                    <p>またサイト内のソースコードは断りがない限り <Link href="https://github.com/chroju/blog/blob/main/LICENSE"><a>MIT License</a></Link> で公開しています。</p>
                </ul>
            </section>
        </Layout>
    )
}
