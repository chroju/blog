import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import utilsStyles from '../../styles/utils.module.css'
import Link from 'next/link'
import Date from '../../components/date'
import Year from '../../components/year'

import { getSortedPostsData } from '../../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({ allPostsData }) {
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
        <meta name="og:url" content="https://chroju.dev/blog" />
      </Head>
      <h2>Articles</h2>
      <section className={`${utilsStyles.headingMd} ${utilsStyles.padding1px}`}>
        <ul className={utilsStyles.list}>
          {allPostsData.map(({ id, date, title, firstOfYear }) => (
            <li className={utilsStyles.listItem} key={id}>
              <Year year={firstOfYear} />
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
