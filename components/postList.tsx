import Link from 'next/link'
import Year from './year'
import Date from './date'

export default function PostList({
    posts
}: any) {
    return <section>
        <ul className="space-y-5 px-0">
            {posts.map((post: any) => (
                <li className="list-none" key={post.id}>
                    <Year year={post.firstOfYear} />
                    <Link href={`/blog/${post.id}`}>
                        <a className="font-semibold text-lg no-underline hover:underline">{post.title}</a>
                    </Link>
                    <br />
                    <small className="text-sm">
                        <Date dateString={post.date} />
                    </small>
                </li>
            ))}
        </ul>
    </section>
}
