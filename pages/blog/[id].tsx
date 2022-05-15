import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Head from 'next/head'
import Helmet from 'react-helmet'
import Layout, { siteTitle } from '../../components/layout'
import Date from '../../components/date'
import Tags from '../../components/tags'
import Fa from '../../components/fontawesome'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { useEffect } from 'react'
import Prism from 'prismjs'
import Link from 'next/link'

export async function getStaticProps({
    params
}: any) {
    const postData = await getPostData(params.id)
    return {
        props: {
            postData
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}

export default function Post({
    postData
}: any) {
    useEffect(() => {
        Prism.highlightAll()
    }, [])
    const pageTitle = postData.title + " - " + siteTitle
    const pageURL = "https://chroju.dev/blog/" + postData.title
    const editURL = "https://github.com/chroju/blog/blob/main/posts/" + postData.id + ".md"
    const historyURL = "https://github.com/chroju/blog/commits/main/posts/" + postData.id + ".md"

    return (
        <Layout>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/${encodeURIComponent(postData.title)}.png?theme=dark&md=0&fontSize=96px`}
                />
                <meta name="og:title" content={pageTitle} />
                <meta name="og:url" content={pageURL} />
            </Head>
            <Helmet>
                <script async src="//cdn.iframe.ly/embed.js" charSet="utf-8"></script>
            </Helmet>
            <article>
                <h1 className="text-2xl font-black mb-2">{postData.title}</h1>
                <div className="mb-5">
                    <section><Date dateString={postData.date} /></section>
                    <section className="space-x-2"><Fa iconPrefix="fas" iconName="tags" /><span className="fa-text">tag</span><Tags tags={postData.tags} /></section>
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
            <hr />
            <footer className="">
                <section className=""><Fa iconName="github" /><Link href={editURL}>Edit this article</Link></section>
                <section className=""><Fa iconPrefix="fa-solid" iconName="clock-rotate-left" /><span className="">show history</span><Link href={historyURL}>Show history</Link></section>
            </footer>
            <hr />
        </Layout>
    )
}
