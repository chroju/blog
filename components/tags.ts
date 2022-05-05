import Link from 'next/link'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../styles/utils.module.css' or... Remove this comment to see the full error message
import utilStyles from '../styles/utils.module.css'

export default function Tags({
    tags
}: any) {
    return tags === undefined
        ? null
        : tags.map((tag: any) => {
            // @ts-expect-error ts-migrate(2749) FIXME: 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
            return <Link href={`tags/${tag}`}><a className={utilStyles.tag}>#{tag}</a></Link>
        });
}
