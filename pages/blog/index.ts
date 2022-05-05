import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../styles/utils.module.css'... Remove this comment to see the full error message
import utilsStyles from '../../styles/utils.module.css'
import Link from 'next/link'
import Date from '../../components/date'
import Year from '../../components/year'

// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getSortedPostsData } from '../../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({
  allPostsData
}: any) {
  return (
    // @ts-expect-error ts-migrate(2749) FIXME: 'Layout' refers to a value, but is being used as a... Remove this comment to see the full error message
    <Layout >
      // @ts-expect-error ts-migrate(2749) FIXME: 'Head' refers to a value, but is being used as a t... Remove this comment to see the full error message
      <Head>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'title'.
        <title>{siteTitle}</title>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
        <meta
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'property'.
          property="og:image"
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'content'.
          content={`https://og-image.chroju.dev/${encodeURI(
            siteTitle
          )}.png?theme=dark&md=0&fontSize=75px`}
        />
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
        <meta name="og:title" content={siteTitle} />
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
        <meta name="og:url" content="https://chroju.dev/blog" />
      </Head>
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
      <h2>Articles</h2>
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'section'.
      <section className={`${utilsStyles.headingMd} ${utilsStyles.padding1px}`}>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ul'.
        <ul className={utilsStyles.list}>
          // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
          {allPostsData.map(({
            id,
            date,
            title,
            firstOfYear
          }: any) => (
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'li'.
            <li className={utilsStyles.listItem} key={id}>
              // @ts-expect-error ts-migrate(2749) FIXME: 'Year' refers to a value, but is being used as a t... Remove this comment to see the full error message
              <Year year={firstOfYear} />
              // @ts-expect-error ts-migrate(2749) FIXME: 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
              <Link href={`/blog/${id}`}>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                <a>{title}</a>
              </Link>
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'br'.
              <br />
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'small'.
              <small className={utilsStyles.lightText}>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dateString'.
                <Date dateString={date} />
              </small>
            </li>
          ))}
        // @ts-expect-error ts-migrate(2365) FIXME: Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
        </ul>
      </section>
    </Layout>
  );
}
