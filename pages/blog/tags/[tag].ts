import Head from 'next/head'
import Layout, { siteTitle } from '../../../components/layout'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../../styles/utils.module.c... Remove this comment to see the full error message
import utilsStyles from '../../../styles/utils.module.css'
import Link from 'next/link'
import Date from '../../../components/date'
import Fa from '../../../components/fontawesome'

// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
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

export async function getStaticPaths() {
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
        // @ts-expect-error ts-migrate(2749) FIXME: 'Layout' refers to a value, but is being used as a... Remove this comment to see the full error message
        <Layout >
            // @ts-expect-error ts-migrate(2749) FIXME: 'Head' refers to a value, but is being used as a t... Remove this comment to see the full error message
            <Head>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'title'.
                <title>{pageTitle}</title>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'property'.
                    property="og:image"
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'content'.
                    content={`https://og-image.chroju.dev/${encodeURI(
                        pageTitle
                    )}.png?theme=dark&md=0&fontSize=75px`}
                />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta name="og:title" content={pageTitle} />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta name="og:url" content={pageURL} />
            </Head>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
            <h2><Fa iconPrefix="fas" iconName="tags" /><span className={utilsStyles.faText}>tag</span> {tag}</h2>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'section'.
            <section className={`${utilsStyles.headingMd} ${utilsStyles.padding1px}`}>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ul'.
                <ul className={utilsStyles.list}>
                    // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
                    {tagPostsData.map(({
                        id,
                        date,
                        title
                    }: any) => (
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'li'.
                        <li className={utilsStyles.listItem} key={id}>
                            // @ts-expect-error ts-migrate(2749) FIXME: 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
                            <Link href={`/blog/${id}`}>
                                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                                <a>{title}</a>
                            </Link>
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'br'.
                            <br />
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'small'.
                            <small className={utilsStyles.lightText}>
                                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dateString'.
                                <Date dateString={date} />
                            </small>
                        </li>
                    ))}
                // @ts-expect-error ts-migrate(2365) FIXME: Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
                </ul>
            </section>
        </Layout>
    );
}
