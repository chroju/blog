import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Link from 'next/link'
import utilsStyles from '../styles/utils.module.css'

export default function Home() {
    const pageTitle = "Our policy - " + siteTitle
    return (
        <Layout footer={false}>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/privacy%20policy.png?theme=dark&md=0&fontSize=75px`}
                />
                <meta name="og:title" content="{pageTitle}" />
                <meta name="og:url" content="https://chroju.dev/policy" />
            </Head>
            <section className={utilsStyles.headingMd}>
                <h2 className={utilsStyles.headingLg}>Notice</h2>
                <ul>
                    <p><small>このサイトで公開している文書は、著者 chroju 個人の調査、研究、考察に基づくものであり、著者が所属する各団体、企業の意見を代表するものではありません。</small></p>
                </ul>
            </section>
            <section className={utilsStyles.headingMd}>
                <h2 className={utilsStyles.headingLg}>Privacy policy</h2>
                <ul>
                    <p><small>このサイトでは <Link href="https://www.google.com/analytics"><a>Google Analytics</a></Link> を使用しています。 Google Analytics は、本サイト利用者のブラウザに cookie を付与することにより、利用者の訪問履歴を収集、分析します。収集する情報には、利用者個人を識別する情報は含まれません。利用者はブラウザの cookie 設定により、データの収集を拒否することができます。詳細は <Link href="https://marketingplatform.google.com/about/analytics/terms/jp/"><a>Google Analytics 利用規約</a></Link> を参照してください。</small></p>
                </ul>
            </section>
            <section className={utilsStyles.headingMd}>
                <h2 className={utilsStyles.headingLg}>LICENSE</h2>
                <ul>
                    <p><small>このサイト内の文章、ソースコードは断りがない限り <Link href="https://github.com/chroju/blog/blob/main/LICENSE"><a>MIT License</a></Link> で公開しています。</small></p>
                </ul>
            </section>
        </Layout>
    )
}
