import Head from 'next/head'
import Layout, { siteTitle } from '../../../components/layout'
import utilsStyles from '../../../styles/utils.module.css'
import Link from 'next/link'
import Date from '../../../components/date'
import Fa from '../../../components/fontawesome'

import { getAllTags, getPostsWithTag } from '../../../lib/posts'

export async function getStaticProps({ params }) {
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
    const paths = allTags.map(tag => {
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

export default function TagHome({ tagPostsData, tag }) {
    const pageURL = "https://chroju.dev/blog/tags/" + tag
    return (
        <Layout >
            <Head>
                <title>{siteTitle}</title>
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/${encodeURI(
                        siteTitle
                    )}.png?theme=dark&md=0&fontSize=75px`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="og:url" content={pageURL} />
            </Head>
            <h2><Fa iconPrefix="fas" iconName="tags" /><span className={utilsStyles.faText}>tag</span> {tag}</h2>
            <section className={`${utilsStyles.headingMd} ${utilsStyles.padding1px}`}>
                <ul className={utilsStyles.list}>
                    {tagPostsData.map(({ id, date, title }) => (
                        <li className={utilsStyles.listItem} key={id}>
                            <Link href={`/blog/${id}`}>
                                <a>{title}</a>
                            </Link>
                            <br />
                            <small className={utilsStyles.lightText}>
                                <Date dateString={date} />
                            </small>
                        </li>
                    ))}
                </ul>
            </section>
        </Layout>
    )
}
