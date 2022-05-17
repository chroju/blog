import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Head from 'next/head'
import Layout, { blogTitle } from '../../components/layout'
import Date from '../../components/date'
import Tags from '../../components/tags'
import Fa from '../../components/fontawesome'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { useEffect } from 'react'
import Prism from 'prismjs'

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
    const pageTitle = postData.title + " - " + blogTitle
    const pageURL = "https://chroju.dev/blog/" + postData.title

    return (
        <Layout blogArticleId={postData.id}>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/${encodeURIComponent(postData.title)}.png?theme=dark&md=0&fontSize=96px`}
                />
                <meta name="og:title" content={pageTitle} />
                <meta name="og:url" content={pageURL} />
            </Head>
            <article>
                <h1 className="text-2xl font-extrabold mb-2">{postData.title}</h1>
                <div className="mb-10">
                    <section><Date dateString={postData.date} /></section>
                    <section className="space-x-2 text-slate-500"><Fa iconPrefix="fas" iconName="tags" /><span className="hidden">tag</span><Tags tags={postData.tags} /></section>
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}
