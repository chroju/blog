import Head from 'next/head'
import Layout from '../../../components/layout'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../../styles/utils.module.c... Remove this comment to see the full error message
import utilsStyles from '../../../styles/utils.module.css'
import Link from 'next/link'
import Fa from '../../../components/fontawesome'

// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getAllTags } from '../../../lib/posts'

export async function getStaticProps() {
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
                    content={`https://og-image.chroju.dev/tags.png?theme=dark&md=0&fontSize=75px`}
                />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta name="og:title" content={pageTitle} />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta name="og:url" content="https://chroju.dev/blog/tags" />
            </Head>
            // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'section'. Did you mean 'Selectio... Remove this comment to see the full error message
            <section className={`${utilsStyles.headingMd} ${utilsStyles.padding1px}`}>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ul'.
                <ul className={utilsStyles.list}>
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'allTags'.
                    {Object.keys(allTags).map((tag: any) => <li className={utilsStyles.listItem} key={tag}>
                        // @ts-expect-error ts-migrate(2749) FIXME: 'Fa' refers to a value, but is being used as a typ... Remove this comment to see the full error message
                        <Fa iconPrefix="fas" iconName="tags" /><span className={utilsStyles.faText}>tag</span>
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
                        <Link href={`/blog/tags/${tag}`}>
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                            <a>{decodeURI(tag: any)} ({allTags[tag]})</a>
                        </Link>
                    </li>)}
                </ul>
            </section>
        </Layout>
    );
}
