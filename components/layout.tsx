import Head from 'next/head'
import Link from 'next/link'
import Menu from './menu'
import Fa from './fontawesome'

const name = 'chroju'
export const blogTitle = "chroju.dev/blog"
export const blogSubTitle = 'the world as code'

export default function Layout({
    children,
    siteTitle = blogTitle,
    footer = true
}: any): JSX.Element {
    const headerLink = "/" + siteTitle.split('/')[1]
    return (
        <div className="md:container md:mx-auto px-10 my-10">
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <link rel="alternate" type="application/rss+xml" href="https://chroju.dev/feed.xml" title="RSS2.0" />
                <meta
                    name="description"
                    content="chroju's blog"
                />
                <meta name="og:description" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <header className="mb-10">
                <h1>
                    <Link href={headerLink}>
                        <a className="font-extrabold text-lg">{siteTitle}</a>
                    </Link>
                </h1>
                {siteTitle == "chroju.dev/blog" && (
                    <section>
                        <small className="block">{blogSubTitle}</small>
                        <Link href="/feed.xml">
                            <a><Fa iconPrefix="fas" iconName="rss-square" title="rss" size="lg" /></a>
                        </Link>
                    </section>
                )}
            </header>
            <main>{children}</main>
            {
                footer && (
                    <div className="">
                        <section className="">
                            <Link href="/blog"><a>Articles</a></Link>
                        </section>
                        <section className="">
                            <Link href="/">
                                <a>
                                    <img
                                        src="/images/profile.webp"
                                        className=""
                                        alt={name}
                                    />
                                </a>
                            </Link>
                            <Menu />
                        </section>
                        <section className="">
                            <small className="">This site created by <Link href="/"><a>chroju</a></Link>. See <Link href="/policy"><a>our policy</a></Link>. </small>
                        </section>
                    </div>
                )
            }
        </div >
    )
}
