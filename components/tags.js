import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'

export default function Tags({ tags }) {
    return tags === undefined
        ? null
        : tags.map(tag => {
            return <Link href={`tags/${tag}`}><a className={utilStyles.tag}>#{tag}</a></Link>
        })
}
