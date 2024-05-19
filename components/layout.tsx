import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Fa from './fontawesome'
import Tags from './tags'

const name = 'chroju'
export const blogTitle = "chroju.dev/blog"
export const blogSubTitle = 'the world as code'

export default function Layout({
    children,
    siteTitle = blogTitle,
    blogArticleId = '',
    PostTags,
    footer = true
}: any): JSX.Element {
    const headerLink = "/" + siteTitle.split('/')[1]
    const isBlog = siteTitle == "chroju.dev/blog"
    const editURL = "https://github.com/chroju/blog/edit/main/posts/" + blogArticleId + ".md"
    const historyURL = "https://github.com/chroju/blog/commits/main/posts/" + blogArticleId + ".md"
    return (
        <div className="md:container md:mx-auto md:w-1/2 px-5 my-10">
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <meta
                    name="description"
                    content="chroju's blog"
                />
                <meta name="og:description" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
                {isBlog && (
                    <link rel="alternate" type="application/rss+xml" href="https://chroju.dev/feed.xml" title="RSS2.0" />
                )}
            </Head>
            <header className="mb-10">
                <h1>
                    <Link href={headerLink}>
                        <a className="font-extrabold text-lg">{siteTitle}</a>
                    </Link>
                </h1>
                {isBlog && (
                    <div>
                        <small className="block">{blogSubTitle}</small>
                        <Link href="/feed.xml" className='hidden md:block'>
                            <a><Fa className="hidden md:block" iconPrefix="fas" iconName="rss-square" title="rss" size="xl" /></a>
                        </Link>
                    </div>
                )}
            </header>
            <main>{children}</main>
            {
                footer && (
                    <footer className="mt-20 border-t-2">
                        {
                            blogArticleId != '' && (
                                <div className="mb-10">


                                    <div className="container mx-auto flex items-center mb-5">
                                        <section className="space-x-2 text-slate-500 items-center flex"><Fa iconPrefix="fas" iconName="tags" /><span className="hidden">tag</span><Tags tags={PostTags} /></section>
                                        <nav className="lg:flex flex-wrap justify-center hidden lg:ml-auto space-x-8 text-slate-500">
                                            <li className="list-none flex items-center"><Fa iconName="github" /><Link href={editURL}><a className="text-slate-500 pl-2 text-sm no-underline hover:underline">Edit this article</a></Link></li>
                                            <li className="list-none flex items-center"><Fa iconPrefix="fa-solid" iconName="clock-rotate-left" /><span className="hidden">show history</span><Link href={historyURL}><a className="text-slate-500 pl-2 text-sm no-underline hover:underline">Show history</a></Link></li>
                                        </nav>
                                    </div>
                                    <div className='my-12 flex justify-center md:justify-start'>
                                        <Link href="/blog"><a className="no-underline py-2 px-8 bg-blue-500 hover:bg-blue-700 transition text-white rounded">Read more articles →</a></Link>
                                    </div>


                                </div>
                            )
                        }
                        <div className="my-5 flex flex-col md:flex-row items-center">
                            <Image
                                src="/images/profile.webp"
                                className='w-10 rounded-full'
                                width={"40px"}
                                height={"40px"}
                                alt={name}
                            />
                            <div className="my-4"><Link href="/"><a className="md:text-sm font-semibold no-underline hover:underline md:ml-4">chroju.dev</a></Link></div>
                            <nav className="md:ml-8 md:pl-8 md:border-l-2 border-gray-200 flex md:space-x-8 space-x-4">
                                <li className="list-none"><Link href="/blog"><a className="md:text-sm no-underline hover:underline">/blog</a></Link></li>
                                <li className="list-none"><Link href="/bio"><a className="md:text-sm no-underline hover:underline">/bio</a></Link></li>
                                <li className="list-none"><Link href="/policy"><a className="md:text-sm no-underline hover:underline">/policy</a></Link></li>
                            </nav>
                        </div>
                    </footer>
                )
            }
        </div >
    )
}
