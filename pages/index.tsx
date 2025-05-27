import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'


export default function Home() {
  const siteTitle = "chroju.dev"
  return (
    <Layout siteTitle={siteTitle} footer={false}>
      <Head>
        <title>{siteTitle}</title>
        <meta
          property="og:image"
          content={`https://og-image.chroju.dev/chroju.dev.png?theme=dark&md=0&fontSize=75px`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="og:url" content="https://chroju.dev" />
      </Head>
      <article>
        <ul>
          <li className='list-none my-2'><Link href="/blog" className="text-2xl font-extrabold">/blog</Link></li>
          <li className='list-none my-2'><Link href="/bio" className="text-2xl font-extrabold">/bio</Link></li>
          <li className='list-none my-2'><Link href="/policy" className="text-2xl font-extrabold">/policy</Link></li>
        </ul>
      </article>
    </Layout>
  )
}
