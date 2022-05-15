import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Head from 'next/head'
import Layout, { siteTitle } from '../../../components/layout'
import PostList from '../../../components/postList'
import Fa from '../../../components/fontawesome'

import { getAllTags, getPostsWithTag } from '../../../lib/posts'

export async function getStaticProps({
    params
}: any) {
    const tag = params.tag
    const tagPostsData = getPostsWithTag(tag)
    return {
        props: {
            tagPostsData,
            tag
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const allTags = getAllTags()
    const paths = Object.keys(allTags).map(tag => {
        return {
            params: {
                tag: tag
            }
        }
    })
    return {
        paths,
        fallback: false
    }
}

export default function TagHome({
    tagPostsData,
    tag
}: any) {
    const pageURL = "https://chroju.dev/blog/tags/" + tag
    const pageTitle = "tag: " + tag + " - " + siteTitle
    return (
        <Layout>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/${encodeURI(
                        pageTitle
                    )}.png?theme=dark&md=0&fontSize=75px`}
                />
                <meta name="og:title" content={pageTitle} />
                <meta name="og:url" content={pageURL} />
            </Head>
            <h2><Fa iconPrefix="fas" iconName="tags" /><span className="fa-text">tag</span> {tag}</h2>
            <PostList posts={tagPostsData} />
        </Layout>
    );
}
