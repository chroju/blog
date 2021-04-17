import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Menu from '../components/menu'
import Fa from './fontawesome'

const name = 'chroju'
export const siteTitle = 'the world as code'

export default function Layout({ children, home }) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <link rel="alternate" type="application/xml" href="https://chroju.dev/feed.xml" title="RSS 2.0" />
                <meta
                    name="description"
                    content="chroju's blog"
                />
                <meta name="og:description" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            {home ? (
                <header className={styles.header}>
                    <img
                        src="/images/profile.jpg"
                        className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
                        alt={name}
                    />
                    <h1 className={utilStyles.heading2Xl}>{name}</h1>
                </header>
            ) : (
                    <header className={styles.headerBlog}>
                        <h1 className={utilStyles.headingMd}>
                            <Link href="/blog">
                                <a className={utilStyles.colorInherit}>{siteTitle}</a>
                            </Link>
                        </h1>
                        <Link href="/feed.xml">
                            <a><Fa iconPrefix="fas" iconName="rss-square" title="rss" /></a>
                        </Link>
                    </header>
                )}
            <main>{children}</main>
            {
                !home && (
                    <div className={styles.backToHome}>
                        <section className={styles.footerSection}>
                            <Link href="/blog"><a>Blog top</a></Link>
                        </section>
                        <section className={styles.footerSection}>
                            <Link href="/">
                                <a>
                                    <img
                                        src="/images/profile.jpg"
                                        className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                                        alt={name}
                                    />
                                </a>
                            </Link>
                            <Menu />
                        </section>
                    </div>
                )
            }
        </div >
    )
}
