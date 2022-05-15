import { GetStaticProps } from 'next'
import Head from 'next/head'
import Layout, { blogTitle } from '../../components/layout'
import PostList from '../../components/postList'

import { getSortedPostsData } from '../../lib/posts'

export const getStaticProps: GetStaticProps = async () => {
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
    <Layout>
      <Head>
        <title>{blogTitle}</title>
        <meta
          property="og:image"
          content={`https://og-image.chroju.dev/${encodeURI(
            blogTitle
          )}.png?theme=dark&md=0&fontSize=75px`}
        />
        <meta name="og:title" content={blogTitle} />
        <meta name="og:url" content="https://chroju.dev/blog" />
      </Head>
      <h2>Articles</h2>
      <PostList posts={allPostsData} />
    </Layout >
  );
}
