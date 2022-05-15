import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Fa from '../components/fontawesome'

export default function Home() {
    const pageTitle = siteTitle
    return (
        <Layout footer={false}>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <section className="">
                <h2 className="">
                    <Fa iconPrefix="fas" iconName="exclamation-triangle" /> Oops! You are in offline.
                </h2>
            </section>
        </Layout>
    )
}
