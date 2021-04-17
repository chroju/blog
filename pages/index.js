import Head from 'next/head'
import Menu from '../components/menu'
import Layout from '../components/layout'
import utilsStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    <Layout home footer={false}>
      <Head>
        <title>chroju</title>
        <meta
          property="og:image"
          content={`https://og-image.chroju.dev/chroju.png?theme=dark&md=0&fontSize=75px`}
        />
        <meta name="og:title" content="chroju" />
        <meta name="og:url" content="https://chroju.dev" />
      </Head>
      <Menu />
      <section className={utilsStyles.headingMd}>
        <h2 className={utilsStyles.headingLg}>Who?</h2>
        <dl>
          <dt>Job</dt>
          <dd>Site Reliability Engineer</dd>
          <dt>Location</dt>
          <dd>Tokyo, Japan</dd>
          <dt>Favorite</dt>
          <dd>Terraform / Kubernetes / Go / AWS</dd>
        </dl>
        <h2 className={utilsStyles.headingLg}>Experience</h2>
        <dl>
          <dt>GLOBIS Corporation</dt>
          <dd>Site Reliability Engineer</dd>
          <dd>Apr 2020 - current</dd>
          <dt>Freelancer</dt>
          <dd>Site Reliability Engineer</dd>
          <dd>Jun 2019 - Mar 2020</dd>
          <dt>Quants Research Inc.</dt>
          <dd>Web Operation Engineer</dd>
          <dd>Jun 2015 - May 2019</dd>
          <dt>TIS Inc.</dt>
          <dd>System Engineer</dd>
          <dd>Apr 2011 - May 2015</dd>
        </dl>
        <h2 className={utilsStyles.headingLg}>Education</h2>
        <dl>
          <dt>Teikyo University (Distance Learning)</dt>
          <dd>Bachelor of Science in Information Technology</dd>
          <dd>Apr 2019 - current</dd>
          <dt>Hitotsubashi University</dt>
          <dd>Bachelor of Social Science</dd>
          <dd>Apr 2007 - Mar 2011</dd>
        </dl>
        <h2 className={utilsStyles.headingLg}>Blog</h2>
        <ul>
          <li><a href="./blog">the world as code</a> (about tech)</li>
          <li><a href="https://chroju.hatenablog.jp">the world was not enough</a> (about culture)</li>
        </ul>
      </section>
    </Layout>
  )
}
