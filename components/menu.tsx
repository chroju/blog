import Link from 'next/link'
import Fa from './fontawesome'

export default function Menu() {
    return (
        <section className="">
            <Link href="https://github.com/chroju">
                <Fa iconName="github" title="GitHub" size="2x" />
            </Link>
            <Link href="https://keybase.io/chroju">
                <Fa iconName="keybase" title="keybase" size="2x" />
            </Link>
            <Link href="https://speakerdeck.com/chroju">
                <Fa iconName="speaker-deck" title="Speaker Deck" size="2x" />
            </Link>
            <Link href="https://twitter.com/chroju">
                <Fa iconName="twitter" title="Twitter" size="2x" />
            </Link>
            <Link href="https://instagram.com/chroju">
                <Fa iconName="instagram" title="Instagram" size="2x" />
            </Link>
        </section>
    )
}
