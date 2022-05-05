import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Fa from '../components/fontawesome'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../styles/utils.module.css' or... Remove this comment to see the full error message
import utilsStyles from '../styles/utils.module.css'

export default function Home() {
    const pageTitle = siteTitle
    return (
        // @ts-expect-error ts-migrate(2749) FIXME: 'Layout' refers to a value, but is being used as a... Remove this comment to see the full error message
        <Layout footer={false}>
            // @ts-expect-error ts-migrate(2749) FIXME: 'Head' refers to a value, but is being used as a t... Remove this comment to see the full error message
            <Head>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'title'.
                <title>{pageTitle}</title>
            </Head>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'section'.
            <section className={utilsStyles.headingMd}>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
                <h2 className={utilsStyles.headingLg}>
                    // @ts-expect-error ts-migrate(2749) FIXME: 'Fa' refers to a value, but is being used as a typ... Remove this comment to see the full error message
                    <Fa iconPrefix="fas" iconName="exclamation-triangle" /> Oops! You are in offline.
                </h2>
            </section>
        </Layout>
    )
}
