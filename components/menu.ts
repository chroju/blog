import Link from 'next/link'
import Fa from '../components/fontawesome'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../styles/utils.module.css' or... Remove this comment to see the full error message
import utilsStyles from '../styles/utils.module.css'

export default function Menu() {
    return (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'section'.
        <section className={utilsStyles.menu}>
            // @ts-expect-error ts-migrate(2749) FIXME: 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
            <Link href="https://github.com/chroju">
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                <a><Fa iconName="github" title="GitHub" /></a>
            </Link>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
            <Link href="https://keybase.io/chroju">
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                <a><Fa iconName="keybase" title="keybase" /></a>
            </Link>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
            <Link href="https://speakerdeck.com/chroju">
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                <a><Fa iconName="speaker-deck" title="Speaker Deck" /></a>
            </Link>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
            <Link href="https://twitter.com/chroju">
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                <a><Fa iconName="twitter" title="Twitter" /></a>
            </Link>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
            <Link href="https://instagram.com/chroju">
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                <a><Fa iconName="instagram" title="Instagram" /></a>
            </Link>
        </section>
    )
}
