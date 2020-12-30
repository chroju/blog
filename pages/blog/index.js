import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import utilsStyles from '../../styles/utils.module.css'
import Link from 'next/link'
import Date from '../../components/date'

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
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <h1 className={utilsStyles.headingLg}>the world as code</h1>
      <section className={`${utilsStyles.headingMd} ${utilsStyles.padding1px}`}>
        <h2 className={utilsStyles.headingLg}>Entries</h2>
        <ul className={utilsStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
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
