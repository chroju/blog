import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Head from 'next/head'
import Layout, { siteTitle } from '../../../components/layout'
import utilsStyles from '../../../styles/utils.module.css'
import Link from 'next/link'
import Date from '../../../components/date'
import Fa from '../../../components/fontawesome'

import { getAllTags, getPostsWithTag } from '../../../lib/posts'

export async function getStaticProps({
    params
}: any) {
    const tag = params.tag
    const tagPostsData = getPostsWithTag(tag)
    return {
        props: {
            tagPostsData,
            tag
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const allTags = getAllTags()
    const paths = Object.keys(allTags).map(tag => {
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

export default function TagHome({
    tagPostsData,
    tag
}: any) {
    const pageURL = "https://chroju.dev/blog/tags/" + tag
    const pageTitle = "tag: " + tag + " - " + siteTitle
    return (
        <Layout>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    property="og:image"
                    content={`https://og-image.chroju.dev/${encodeURI(
                        pageTitle
                    )}.png?theme=dark&md=0&fontSize=75px`}
                />
                <meta name="og:title" content={pageTitle} />
                <meta name="og:url" content={pageURL} />
            </Head>
            <h2><Fa iconPrefix="fas" iconName="tags" /><span className={utilsStyles.faText}>tag</span> {tag}</h2>
            <section className={`${utilsStyles.headingMd} ${utilsStyles.padding1px}`}>
                <ul className={utilsStyles.list}>
                    {tagPostsData.map(({
                        id,
                        date,
                        title
                    }: any) => (
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
    );
}
