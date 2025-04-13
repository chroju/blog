import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/layout'


export default function Home() {
  const siteTitle = "chroju.dev/bio"
  return (
    <Layout siteTitle={siteTitle}>
      <Head>
        <title>{siteTitle}</title>
        <meta
          property="og:image"
          content={`https://og-image.chroju.dev/bio.png?theme=dark&md=0&fontSize=75px`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="og:url" content="https://chroju.dev/bio" />
      </Head>
      <h2>chroju</h2>
      <Image
        src="/images/profile.webp"
        className='my-10 w-20 rounded-full'
        width={"80px"}
        height={"80px"}
        alt="chroju"
      />
      <article className="bio">
        <dl>
          <dt>Job</dt>
          <dd>Site Reliability Engineer</dd>
          <dt>Location</dt>
          <dd>Kanagawa, Japan</dd>
          <dt>Favorite</dt>
          <dd>Terraform / Kubernetes / Go / AWS</dd>
        </dl>
        <h2 className="">Experience</h2>
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
        <h2 className="">Education</h2>
        <dl>
          <dt>Bachelor of Engineering</dt>
          <dd>Teikyo University (Distance Learning)</dd>
          <dd>Apr 2019 - Mar 2025</dd>

          <dt>Bachelor of Social Science</dt>
          <dd>Hitotsubashi University</dd>
          <dd>Apr 2007 - Mar 2011</dd>
        </dl>
        <h2 className="">Blog</h2>
        <ul>
          <li><a href="./blog">the world as code</a> (about tech)</li>
          <li><a href="https://chroju.hatenablog.jp">the world was not enough</a> (about culture)</li>
        </ul>
      </article>
    </Layout>
  )
}
