import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Fa from '../components/fontawesome'
import utilsStyles from '../styles/utils.module.css'

export default function Home() {
    const pageTitle = siteTitle
    return (
        <Layout footer={false}>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <section className={utilsStyles.headingMd}>
                <h2 className={utilsStyles.headingLg}>
                    <Fa iconPrefix="fas" iconName="exclamation-triangle" /> Oops! You are in offline.
                </h2>
            </section>
        </Layout>
    )
}
