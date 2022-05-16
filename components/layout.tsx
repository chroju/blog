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
    blogArticleId = '',
    footer = true
}: any): JSX.Element {
    const headerLink = "/" + siteTitle.split('/')[1]
    const editURL = "https://github.com/chroju/blog/blob/main/posts/" + blogArticleId + ".md"
    const historyURL = "https://github.com/chroju/blog/commits/main/posts/" + blogArticleId + ".md"
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
                    <footer className="mt-20 pt-3 border-t-2">
                        {
                            blogArticleId != '' && (
                                <div>
                                    <section className=""><Fa iconName="github" /><Link href={editURL}><a className="pl-3 text-sm no-underline hover:underline">Edit this article</a></Link></section>
                                    <section className=""><Fa iconPrefix="fa-solid" iconName="clock-rotate-left" /><span className="hidden">show history</span><Link href={historyURL}><a className="pl-3 text-sm no-underline hover:underline">Show history</a></Link></section>
                                    <section className="mt-5 mb-10"><Link href="/blog"><a>Read more articles</a></Link></section>
                                </div>
                            )
                        }
                        <section className="my-5 flex space-x-8 items-center">
                            <img
                                src="/images/profile.webp"
                                className='w-10 rounded-full'
                                alt={name}
                            />
                            <div><Link href="/"><a className="font-extralight no-underline hover:underline">chroju.dev</a></Link></div>
                            <div><Link href="/blog"><a className="font-extralight no-underline hover:underline">/blog</a></Link></div>
                            <div><Link href="/bio"><a className="font-extralight no-underline hover:underline">/bio</a></Link></div>
                            <div><Link href="/policy"><a className="font-extralight no-underline hover:underline">/policy</a></Link></div>
                        </section>
                    </footer>
                )
            }
        </div >
    )
}
