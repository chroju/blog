import Head from 'next/head'
import Layout from '../components/layout'
import utilsStyles from '../styles/utils.module.css'
import Fa from '../components/fontawesome'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>chroju</title>
      </Head>
      <section className={utilsStyles.menu}>
        <a href="https://github.com/chroju"><Fa iconName="github" /></a>
        <a href="https://twitter.com/chroju"><Fa iconName="twitter" /></a>
        <a href="https://www.instagrafa-instagramm.com/chroju"><Fa iconName="instagram" /></a>
        <a href="https://speakerdeck.com/chroju"><Fa iconName="speaker-deck" /></a>
      </section>
      <section className={utilsStyles.headingMd}>
        <h2 className={utilsStyles.headingLg}>Who?</h2>
        <dl>
          <dt>Job</dt>
          <dd>Site Reliability Engineer</dd>
          <dt>Location</dt>
          <dd>Tokyo, Japan</dd>
          <dt>Favorite</dt>
          <dd>Terraform / Kubernetes / Go / Simplicity</dd>
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
          <li><a href="./blog">the world was not enough</a> (about culture)</li>
        </ul>
      </section>
    </Layout>
  )
}
