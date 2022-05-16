import Link from 'next/link'
import Fa from './fontawesome'

export default function Menu() {
    return (
        <section className="">
            <Link href="https://github.com/chroju">
                <a><Fa iconName="github" title="GitHub" size="2x" /></a>
            </Link>
            <Link href="https://keybase.io/chroju">
                <a><Fa iconName="keybase" title="keybase" size="2x" /></a>
            </Link>
            <Link href="https://speakerdeck.com/chroju">
                <a><Fa iconName="speaker-deck" title="Speaker Deck" size="2x" /></a>
            </Link>
            <Link href="https://twitter.com/chroju">
                <a><Fa iconName="twitter" title="Twitter" size="2x" /></a>
            </Link>
            <Link href="https://instagram.com/chroju">
                <a><Fa iconName="instagram" title="Instagram" size="2x" /></a>
            </Link>
        </section>
    )
}
