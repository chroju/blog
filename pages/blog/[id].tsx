import Head from 'next/head'
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Helmet from 'react-helmet'
import Layout, { siteTitle } from '../../components/layout'
import Date from '../../components/date'
import Tags from '../../components/tags'
import Fa from '../../components/fontawesome'
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getAllPostIds, getPostData } from '../../lib/posts'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../styles/utils.module.css'... Remove this comment to see the full error message
import utilsStyles from '../../styles/utils.module.css'
import { useEffect } from 'react'
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'pris... Remove this comment to see the full error message
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

export async function getStaticPaths() {
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

    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Layout>
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <Head>
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <title>{pageTitle}</title>
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/${encodeURIComponent(postData.title)}.png?theme=dark&md=0&fontSize=96px`}
                />
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <meta name="og:title" content={pageTitle} />
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <meta name="og:url" content={pageURL} />
            </Head>
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <Helmet>
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>
            </Helmet>
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <article>
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <h1 className={utilsStyles.headingXl}>{postData.title}</h1>
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className={utilsStyles.lightText}>
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <section><Date dateString={postData.date} /></section>
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <section className={utilsStyles.tagSection}><Fa iconPrefix="fas" iconName="tags" /><span className={utilsStyles.faText}>tag</span><Tags tags={postData.tags} /></section>
                </div>
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}
