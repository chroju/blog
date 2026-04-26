import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Head from 'next/head'
import Layout from '../../components/layout'
import Date from '../../components/date'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { useEffect, useRef, useState } from 'react'
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

export const getStaticPaths: GetStaticPaths = async () => {
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

    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const article = document.querySelector('article')
        if (!article) return
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.tagName === 'IMG' && !target.classList.contains('rlc-image')) {
                const img = target as HTMLImageElement
                setLightbox({ src: img.src, alt: img.alt })
            }
        }
        article.addEventListener('click', handleClick)
        return () => article.removeEventListener('click', handleClick)
    }, [])

    useEffect(() => {
        if (!lightbox) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(null)
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [lightbox])

    useEffect(() => {
        document.body.style.overflow = lightbox ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [lightbox])

    useEffect(() => {
        if (lightbox) closeButtonRef.current?.focus()
    }, [lightbox])

    const pageTitle = postData.title + " - " + "chroju.dev"
    const pageURL = "https://chroju.dev/blog/" + postData.title

    return (
        <Layout blogArticleId={postData.id} PostTags={postData.tags}>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/${encodeURIComponent(postData.title)}.png?theme=dark&md=0&fontSize=96px`}
                />
                <meta name="og:title" content={pageTitle} />
                <meta name="og:url" content={pageURL} />
            </Head>
            <article>
                <h1 className="text-3xl font-bold mb-2">{postData.title}</h1>
                <div className="mb-10">
                    <section><Date dateString={postData.date} /></section>
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 cursor-zoom-out"
                    onClick={() => setLightbox(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="画像の拡大表示"
                >
                    <button
                        ref={closeButtonRef}
                        className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        onClick={() => setLightbox(null)}
                        aria-label="閉じる"
                    >
                        ×
                    </button>
                    <img
                        src={lightbox.src}
                        alt={lightbox.alt}
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl cursor-auto"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </Layout>
    )
}
