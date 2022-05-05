import Head from 'next/head'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './layout.module.css' or its co... Remove this comment to see the full error message
import styles from './layout.module.css'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../styles/utils.module.css' or... Remove this comment to see the full error message
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Menu from '../components/menu'
import Fa from './fontawesome'

const name = 'chroju'
export const siteTitle = 'chroju.dev/blog'
export const siteSubTitle = 'the world as code'

export default function Layout({
    children,
    home,
    footer = true
}: any) {
    return (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
        <div className={styles.container}>
            // @ts-expect-error ts-migrate(2749) FIXME: 'Head' refers to a value, but is being used as a t... Remove this comment to see the full error message
            <Head>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta name="msapplication-TileColor" content="#da532c" />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta name="theme-color" content="#ffffff" />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
                <link rel="alternate" type="application/rss+xml" href="https://chroju.dev/feed.xml" title="RSS2.0" />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta
                    name="description"
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'content'.
                    content="chroju's blog"
                />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta name="og:description" content={siteTitle} />
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            {home ? (
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'header'.
                <header className={styles.header}>
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'img'.
                    <img
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'src'.
                        src="/images/profile.webp"
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
                        className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'alt'.
                        alt={name}
                    />
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h1'.
                    <h1 className={utilStyles.heading2Xl}>{name}</h1>
                </header>
            ) : (
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'header'.
                <header className={styles.headerBlog}>
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h1'.
                    <h1 className={utilStyles.headingMd}>
                        // @ts-expect-error ts-migrate(2749) FIXME: 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
                        <Link href="/blog">
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                            <a className={utilStyles.colorInherit}>{siteTitle}</a>
                        </Link>
                    </h1>
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'section'.
                    <section>
                      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'small'.
                      <small>{siteSubTitle}</small>
                    </section>
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
                    <Link href="/feed.xml">
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                        <a><Fa iconPrefix="fas" iconName="rss-square" title="rss" /></a>
                    </Link>
                </header>
            )}
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'main'.
            <main>{children}</main>
            {
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'footer'.
                footer && (
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
                    <div className={styles.backToHome}>
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'section'.
                        <section className={styles.footerSection}>
                            // @ts-expect-error ts-migrate(2749) FIXME: 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
                            <Link href="/blog"><a>Articles</a></Link>
                        </section>
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'section'.
                        <section className={styles.footerSection}>
                            // @ts-expect-error ts-migrate(2749) FIXME: 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
                            <Link href="/">
                                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                                <a>
                                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'img'.
                                    <img
                                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'src'.
                                        src="/images/profile.webp"
                                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
                                        className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'alt'.
                                        alt={name}
                                    />
                                </a>
                            </Link>
                            // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
                            <Menu />
                        </section>
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'section'.
                        <section className={styles.footerSection}>
                            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'small'.
                            <small className={utilStyles.lightText}>This site created by <Link href="/"><a>chroju</a></Link>. See <Link href="/policy"><a>our policy</a></Link>. </small>
                        </section>
                    </div>
                )
            }
        </div >
    )
}
