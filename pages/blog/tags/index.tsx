import { GetStaticProps } from 'next'
import Head from 'next/head'
import Layout from '../../../components/layout'
import Link from 'next/link'
import Fa from '../../../components/fontawesome'

import { getAllTags } from '../../../lib/posts'

export const getStaticProps: GetStaticProps = async () => {
    const allTags = getAllTags()
    return {
        props: {
            allTags,
        }
    }
}

export default function TagIndex({
    allTags
}: any) {
    const pageTitle = "Tags - {siteTitle}"
    return (
        <Layout >
            <Head>
                <title>{pageTitle}</title>
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/tags.png?theme=dark&md=0&fontSize=75px`}
                />
                <meta name="og:title" content={pageTitle} />
                <meta name="og:url" content="https://chroju.dev/blog/tags" />
            </Head>
            <section className="">
                <ul className="">
                    {Object.keys(allTags).map((tag: any) => <li className="" key={tag}>
                        <Fa iconPrefix="fas" iconName="tags" /><span className="">tag</span>
                        <Link href={`/blog/tags/${tag}`}>
                            <a>{decodeURI(tag)} ({allTags[tag]})</a>
                        </Link>
                    </li>)}
                </ul>
            </section>
        </Layout>
    );
}
