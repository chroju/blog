import Link from 'next/link'

export default function Tags({
    tags
}: any) {
    return tags === undefined
        ? null
        : tags.map((tag: any) => {
            return <Link href={`tags/${tag}`}><a className="no-underline text-sky-700 font-semibold hover:underline">#{tag}</a></Link>
        });
}
