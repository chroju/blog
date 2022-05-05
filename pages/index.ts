import Head from 'next/head'
import Menu from '../components/menu'
import Layout from '../components/layout'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../styles/utils.module.css' or... Remove this comment to see the full error message
import utilsStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    // @ts-expect-error ts-migrate(2749) FIXME: 'Layout' refers to a value, but is being used as a... Remove this comment to see the full error message
    <Layout home footer={false}>
      // @ts-expect-error ts-migrate(2749) FIXME: 'Head' refers to a value, but is being used as a t... Remove this comment to see the full error message
      <Head>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'title'.
        <title>chroju</title>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
        <meta
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'property'.
          property="og:image"
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'content'.
          content={`https://og-image.chroju.dev/chroju.png?theme=dark&md=0&fontSize=75px`}
        />
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
        <meta name="og:title" content="chroju" />
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
        <meta name="og:url" content="https://chroju.dev" />
      </Head>
      // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
      <Menu />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'section'.
      <section className={utilsStyles.headingMd}>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
        <h2 className={utilsStyles.headingLg}>Who?</h2>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dl'.
        <dl>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dt'.
          <dt>Job</dt>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Site Reliability Engineer</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dt'.
          <dt>Location</dt>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Kanagawa, Japan</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dt'.
          <dt>Favorite</dt>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Terraform / Kubernetes / Go / AWS</dd>
        </dl>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
        <h2 className={utilsStyles.headingLg}>Experience</h2>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dl'.
        <dl>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dt'.
          <dt>GLOBIS Corporation</dt>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Site Reliability Engineer</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Apr 2020 - current</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dt'.
          <dt>Freelancer</dt>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Site Reliability Engineer</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Jun 2019 - Mar 2020</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dt'.
          <dt>Quants Research Inc.</dt>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Web Operation Engineer</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Jun 2015 - May 2019</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dt'.
          <dt>TIS Inc.</dt>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>System Engineer</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Apr 2011 - May 2015</dd>
        </dl>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
        <h2 className={utilsStyles.headingLg}>Education</h2>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dl'.
        <dl>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dt'.
          <dt>Bachelor of Science in Information Technology</dt>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Teikyo University (Distance Learning)</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Apr 2019 - current</dd>

          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dt'.
          <dt>Bachelor of Social Science</dt>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Hitotsubashi University</dd>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dd'.
          <dd>Apr 2007 - Mar 2011</dd>
        </dl>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
        <h2 className={utilsStyles.headingLg}>Blog</h2>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ul'.
        <ul>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'li'.
          <li><a href="./blog">the world as code</a> (about tech)</li>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'li'.
          <li><a href="https://chroju.hatenablog.jp">the world was not enough</a> (about culture)</li>
        </ul>
      </section>
    </Layout>
  )
}
