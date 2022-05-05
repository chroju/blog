import Link from 'next/link'
import Fa from './fontawesome'
import utilsStyles from '../styles/utils.module.css'

export default function Menu() {
    return (
        <section className={utilsStyles.menu}>
            <Link href="https://github.com/chroju">
                <a><Fa iconName="github" title="GitHub" /></a>
            </Link>
            <Link href="https://keybase.io/chroju">
                <a><Fa iconName="keybase" title="keybase" /></a>
            </Link>
            <Link href="https://speakerdeck.com/chroju">
                <a><Fa iconName="speaker-deck" title="Speaker Deck" /></a>
            </Link>
            <Link href="https://twitter.com/chroju">
                <a><Fa iconName="twitter" title="Twitter" /></a>
            </Link>
            <Link href="https://instagram.com/chroju">
                <a><Fa iconName="instagram" title="Instagram" /></a>
            </Link>
        </section>
    )
}
