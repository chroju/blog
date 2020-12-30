import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Menu from '../components/menu'
import Fa from './fontawesome'

const name = 'chroju'
export const siteTitle = 'the world as code (WIP)'

export default function Layout({ children, home }) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="alternate" type="application/atom+xml" href="https://chroju.dev/blog/feed.xml" title="Atom" />
                <meta
                    name="description"
                    content="Learn how to build a personal website using Next.js"
                />
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
                            <a><Fa iconPrefix="fas" iconName="rss-square" /></a>
                        </Link>
                    </header>
                )}
            <main>{children}</main>
            {
                !home && (
                    <div className={styles.backToHome}>
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
                    </div>
                )
            }
        </div >
    )
}
